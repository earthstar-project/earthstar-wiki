import fetch from 'isomorphic-fetch';
import {
    ValidatorEs1,
    ValidatorUnsigned1,
    addSigilToKey,
    StoreSqlite,
    generateKeypair,
    IValidator,
    IStore,
} from 'earthstar';

export let syncLocalAndHttp = async (store : IStore, url : string) => {
    console.log('existing database workspace:', store.workspace);

    if (!url.endsWith('/')) { url = url + '/'; }
    if (!url.endsWith('/earthstar/')) {
        console.error('ERROR: url is expected to end with "/earthstar/"')
        return;
    }
    let urlWithWorkspace = url + store.workspace;

    // pull from server
    // this can 404 the first time, because the server only creates workspaces
    // when we push them
    console.log('pulling from ' + urlWithWorkspace);
    let resp : any;
    try {
        resp = await fetch(urlWithWorkspace + '/items');
    } catch (e) {
        console.error('ERROR: could not connect to server');
        console.error(e.toString());
        return;
    }
    if (resp.status === 404) {
        console.log('    server 404: server does not know about this workspace yet');
    } else {
        let items = await resp.json();
        let pullStats = {
            numIngested: 0,
            numIgnored: 0,
            numTotal: items.length,
        };
        for (let item of items) {
            if (store.ingestItem(item)) { pullStats.numIngested += 1; }
            else { pullStats.numIgnored += 1; }
        }
        console.log(JSON.stringify(pullStats, null, 2));
    }

    // push to server
    console.log('pushing to ' + urlWithWorkspace);
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
        return;
    }
    if (resp2.status === 404) {
        console.log('    server 404: server is not accepting new workspaces');
    } else if (resp2.status === 403) {
        console.log('    server 403: server is in readonly mode');
    } else {
        let pushStats = await resp2.json();
        console.log(JSON.stringify(pushStats, null, 2));
    }
};
