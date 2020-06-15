import {
    AuthorAddress,
    WorkspaceAddress,
} from 'earthstar';

export let Urls = class {
    static loginTemplate = '/login';
    static login() { return Urls.loginTemplate; }

    static authorListTemplate = '/ws/:workspace/authors';
    static authorList(workspace : WorkspaceAddress) {
        return `/ws/${workspace.slice(2)}/authors`;
    }

    static authorTemplate = '/ws/:workspace/author/:author';
    static author(workspace : WorkspaceAddress, author : AuthorAddress) {
        return `/ws/${workspace.slice(2)}/author/${author}`;
    }

    // a wiki path is like "/wiki/shared/Dogs"
    static wikiTemplate = '/ws/:workspace/wiki/:owner/:title';
    static wiki(workspace : WorkspaceAddress, path : string) {
        if (!path.startsWith('/wiki/')) { throw "bad wiki path should start with '/wiki/': " + path; }
        return `/ws/${workspace.slice(2)}/${path.slice(1)}`;
    }

    static recentFeedTemplate = '/ws/:workspace/recent';
    static recentFeed(workspace : WorkspaceAddress) {
        return `/ws/${workspace.slice(2)}/recent`;
    }

    static searchTemplate = '/ws/:workspace/search';
    static search(workspace : WorkspaceAddress, text? : string) {
        let result = `/ws/${workspace.slice(2)}/search`;
        if (text) { result += '?q=' + encodeURIComponent(text); }
        return result;
    }
}
