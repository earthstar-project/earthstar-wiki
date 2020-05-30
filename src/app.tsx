import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
    StoreMemory,
    ValidatorEs1,
    Crypto,
} from 'earthstar';

import * as config from './config';
import * as layouts from './layouts';

import {
    syncLocalAndHttp,
} from './sync';

let log = (...args : any[]) => console.log(...args);

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
main();

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
