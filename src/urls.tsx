import {
    AuthorAddress,
    WorkspaceAddress,
} from 'earthstar';

export let Urls = class {
    static loginTemplate = '/login';
    static login() { return Urls.loginTemplate; }

    static authorListTemplate = '/:workspace/authors';
    static authorList(workspace : WorkspaceAddress) {
        return `/${workspace}/authors`;
    }

    static authorTemplate = '/:workspace/@:author';
    static authorProfile(workspace : WorkspaceAddress, author : AuthorAddress) {
        return `/${workspace}/${author}`;
    }

    // a wiki path is like "/wiki/shared/Dogs"
    static wikiTemplate = '/:workspace/wiki/:owner/:title';
    static wiki(workspace : WorkspaceAddress, path : string) {
        if (!path.startsWith('/wiki/')) { throw "bad wiki path should start with '/wiki/': " + path; }
        return `/${workspace}/${path.slice(1)}`;
    }

    static allPagesTemplate = '/:workspace/pages';
    static allPages(workspace : WorkspaceAddress) {
        return `/${workspace}/pages`;
    }

    static searchTemplate = '/:workspace/search';
    static search(workspace : WorkspaceAddress, text? : string) {
        let result = `/${workspace}/search`;
        if (text) { result += '?q=' + encodeURIComponent(text); }
        return result;
    }
}
