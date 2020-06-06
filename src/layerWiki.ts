
import {
    IStore, Keypair, ItemToSet,
} from 'earthstar';

export interface WikiPageInfo {
    key : string,
    title : string,
    owner : string,  // an author, or 'shared'
}
export interface WikiPageDetail {
    key : string,
    title : string,
    owner : string,  // an author, or 'shared'
    lastAuthor : string,
    timestamp : number,
    text : string,
}

/*
    keys are like

    wiki/shared/Little%20Snails
    wiki/~@aaa/Little%20Snails
*/

export class WikiLayer {
    es : IStore;
    keypair : Keypair
    constructor(es : IStore, keypair : Keypair) {
        this.es = es;
        this.keypair = keypair;
    }
    static makeKey(title : string, owner : string) : string {
        if (owner.startsWith('@')) { owner = '~' + owner; }
        return `wiki/${owner}/${encodeURIComponent(title)}`;
    }
    static parseKey(key : string) : WikiPageInfo {
        if (!key.startsWith('wiki/')) { throw 'oops'; }
        let ownerTitle = key.slice(5);
        let parts = ownerTitle.split('/');
        if (parts.length !== 2) { throw 'whoa'; }
        let [owner, title] = parts;
        title = decodeURIComponent(title);
        if (owner.startsWith('~')) { owner = owner.slice(1); }
        return { key, owner, title };
    }
    listPages() : WikiPageInfo[] {
        return this.es.keys({prefix: 'wiki/'}).map(key => WikiLayer.parseKey(key));
    }
    getPageDetails(key : string) : WikiPageDetail {
        let item = this.es.getItem(key);
        if (!item) { throw 'dang'; }
        let { owner, title } = WikiLayer.parseKey(key);
        return {
            key : key,
            title : title,
            owner : owner,
            lastAuthor: item.author,
            timestamp: item.timestamp,
            text: item.value,
        }
    }
    setPageText(key : string, text : string, timestamp? : number) : boolean {
        return this.es.set(this.keypair, {
            format: 'es.1',
            key: key,
            value: text,
            timestamp: timestamp,
        });
    }
}