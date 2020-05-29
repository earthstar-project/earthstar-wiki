import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as earthstar from 'earthstar';

import * as config from './config';
import * as layouts from './layouts';

let log = (...args : any[]) => console.log(...args);

log('hello world');
let workspace = 'test';
let es = new earthstar.StoreMemory([earthstar.ValidatorUnsigned1], workspace);
log('workspace:', es.workspace);
let demoKeypair : earthstar.Keypair = {
    public: 'fakeDqWS5O5pQlmrQWv2kT97abIWCC0wqbMrwoqoZq0=',
    secret: 'fakeKDZzl2A4Cm7AW5GGgGWv3MtNKszf7bOcvgW/LRo='
}
//let demoKeypair = earthstar.generateFakeKeypair();
let demoAuthor = earthstar.addSigilToKey(demoKeypair.public);
log('author:', demoAuthor);
let ok = es.set({
    format: 'unsigned.1',
    key: 'wiki/kittens',
    value: 'Kittens are small mammals',
    author: demoAuthor,
    authorSecret: demoKeypair.secret,
});
log('ok:', ok);
log('keys:', es.keys());
let item = es.items()[0];
log('item:', item);
log('hash:', earthstar.ValidatorUnsigned1.hashItem(item));

//================================================================================
// APP VIEW

interface AppViewProps {
}
interface AppViewState {
}
class AppView extends React.Component<AppViewProps, AppViewState> {
    constructor(props : AppViewProps) {
        super(props);
        this.state = { };
    }
    render() {
        log('AppView.render()');
        return <b>hello from react</b>;
    }
}

//================================================================================
// MAIN

ReactDOM.render(
    <AppView />,
    document.getElementById('react-slot')
);