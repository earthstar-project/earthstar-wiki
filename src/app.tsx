import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
    StoreMemory,
    IStore,
    ValidatorEs1,
    Crypto,
} from 'earthstar';
import {
    syncLocalAndHttp,
} from './sync';

import * as config from './config';
import * as layouts from './layouts';

import {
    EsDebugView
} from './esDebugView';

let log = (...args : any[]) => console.log('main', ...args);

let main = async () => {
    log('hello world');
    let workspace = 'demo';
    let es = new StoreMemory([ValidatorEs1], workspace);
    log('workspace:', es.workspace);
    let demoKeypair = Crypto.generateKeypair();
    let demoAuthor = demoKeypair.public;
    log('author:', demoAuthor);
    let ok = es.set(demoKeypair, {
        format: 'es.1',
        key: 'wiki/bumblebee',
        value: 'Buzz buzz buzz',
    });
    log('ok:', ok);
    log('keys:', es.keys());
    let item = es.items()[0];
    log('item:', item);
    log('hash:', ValidatorEs1.hashItem(item));
    log('-------------------------------');
    log('syncing:');
    await syncLocalAndHttp(es, 'http://localhost:3333/earthstar/');
    log('-------------------------------');
    log('keys:', es.keys());
};
//main();

//================================================================================
// APP VIEW

interface AppViewProps {
    es : IStore,
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
        return <EsDebugView es={this.props.es} />
    }
}

//================================================================================
// MAIN

let workspace = 'demo';
let es = new StoreMemory([ValidatorEs1], workspace);
let demoKeypair = Crypto.generateKeypair();
let demoAuthor = demoKeypair.public;
es.set(demoKeypair, {
    format: 'es.1',
    key: 'wiki/bumblebee',
    value: 'Buzz buzz buzz',
});

ReactDOM.render(
    <AppView es={es} />,
    document.getElementById('react-slot')
);
