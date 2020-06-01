import fetch from 'isomorphic-fetch';
import {
    IStore,
} from 'earthstar';
import { Atom } from './atom';
import { sleep } from './util';

interface Pub {
    url : string;
    syncState : 'idle' | 'syncing';
    lastSync : number;
}
interface SyncState {
    pubs : Pub[];
    syncState : 'idle' | 'syncing';
    lastSync : number;
}

let normalizePubUrl = (url : string) : string =>  {
    if (!url.endsWith('/')) { url += '/'; }
    if (!url.endsWith('/earthstar/')) {
        console.error('WARNING: pub url is expected to end with "/earthstar/"')
    }
    return url;
}

let logSyncer = (...args : any[]) => console.log('💚 syncer | ', ...args);
export class Syncer {
    store : IStore;
    state : SyncState;
    atom : Atom<SyncState>;
    constructor(store : IStore) {
        this.store = store;
        this.state = {
            pubs: [],
            syncState: 'idle',
            lastSync: 0,
        }
        this.atom = new Atom<SyncState>(this.state);
    }
    removePub(url : string) {
        this.state.pubs = this.state.pubs.filter(pub => pub.url !== url);
        this.atom.setAndNotify(this.state);
    }
    addPub(url : string) {
        url = normalizePubUrl(url);

        // don't allow adding the same pub twice
        if (this.state.pubs.filter(pub => pub.url === url).length > 0) { return; }

        this.state.pubs.push({
            url: url,
            syncState: 'idle',
            lastSync: 0,
        });
        this.atom.setAndNotify(this.state);
    }
    async sync() {
        logSyncer('starting');
        this.state.syncState = 'syncing';
        this.atom.setAndNotify(this.state);

        for (let pub of this.state.pubs) {
            logSyncer('starting pub:', pub.url);
            pub.syncState = 'syncing';
            this.atom.setAndNotify(this.state);

            let resultStats = await syncLocalAndHttp(this.store, pub.url);

            logSyncer('finished pub');
            logSyncer(JSON.stringify(resultStats, null, 2));
            pub.lastSync = Date.now();
            pub.syncState = 'idle';
            this.atom.setAndNotify(this.state);
        }

        // wait a moment so the user can keep track of what's happening
        await sleep(500);

        logSyncer('finished');
        this.state.lastSync = Date.now();
        this.state.syncState = 'idle';
        this.atom.setAndNotify(this.state);
    }
}


let logSyncAlg = (...args : any[]) => console.log('sync algorithm | ', ...args);
export let syncLocalAndHttp = async (store : IStore, url : string) => {
    logSyncAlg('existing database workspace:', store.workspace);
    let resultStats : any = {
        pull: null,
        push: null,
    }
    url = normalizePubUrl(url);
    let urlWithWorkspace = url + store.workspace;

    // pull from server
    // this can 404 the first time, because the server only creates workspaces
    // when we push them
    logSyncAlg('pulling from ' + urlWithWorkspace);
    let resp : any;
    try {
        resp = await fetch(urlWithWorkspace + '/items');
    } catch (e) {
        console.error('ERROR: could not connect to server');
        console.error(e.toString());
        return resultStats;
    }
    resultStats.pull = {
        numIngested: 0,
        numIgnored: 0,
        numTotal: 0,
    };
    if (resp.status === 404) {
        logSyncAlg('    server 404: server does not know about this workspace yet');
    } else {
        let items = await resp.json();
        resultStats.pull.numTotal = items.length;
        for (let item of items) {
            if (store.ingestItem(item)) { resultStats.pull.numIngested += 1; }
            else { resultStats.pull.numIgnored += 1; }
        }
        logSyncAlg(JSON.stringify(resultStats.pull, null, 2));
    }

    // push to server
    logSyncAlg('pushing to ' + urlWithWorkspace);
    let resp2 : any;
    try {
        resp2 = await fetch(urlWithWorkspace + '/items', {
            method: 'post',
            body:    JSON.stringify(store.items({ includeHistory: true })),
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        console.error('ERROR: could not connect to server');
        console.error(e.toString());
        return resultStats;
    }
    if (resp2.status === 404) {
        logSyncAlg('    server 404: server is not accepting new workspaces');
    } else if (resp2.status === 403) {
        logSyncAlg('    server 403: server is in readonly mode');
    } else {
        resultStats.pushStats = await resp2.json();
        logSyncAlg(JSON.stringify(resultStats.pushStats, null, 2));
    }

    return resultStats;
};
