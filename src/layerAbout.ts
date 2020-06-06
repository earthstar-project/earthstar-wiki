
import {
    IStore, Keypair, ItemToSet,
} from 'earthstar';

interface AuthorInfo {
    author : string,
    name : string,
}

/*
    keys are like

    about/~@aaa/name
    about/~@aaa/description    // coming soon
    about/~@aaa/icon           // coming soon
*/
export class AboutLayer {
    es : IStore;
    keypair : Keypair
    constructor(es : IStore, keypair : Keypair) {
        this.es = es;
        this.keypair = keypair;
    }
    listAuthors() : AuthorInfo[] {
        return this.es.items({prefix: 'about/'})
            .filter(item => item.key.endsWith('/name'))
            .map(item => ({
                author: item.author,
                name: item.value,
            }));
    }
    getAuthorInfo(author : string) : AuthorInfo {
        let item = this.es.getItem(`about/~${author}/name`);
        if (!item) {
            return {
                author : author,
                name : author.slice(0, 10) + '...',
            };
        }
        return {
            author : author,
            name : item.value,
        };
    }
    setMyAuthorName(name : string, timestamp?: number) : boolean {
        // we can only set our own name so we don't need an author input parameter
        return this.es.set(this.keypair, {
            format: 'es.1',
            key: `about/~${this.keypair.public}/name`,
            value: name,
            timestamp: timestamp,
        });
    }

}
