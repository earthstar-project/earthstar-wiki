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

import {
    Card,
    Center,
    Stack,
} from './layouts';

import {
    EsDebugView
} from './esDebugView';


let logMain = (...args : any[]) => console.log('main | ', ...args);
let main = async () => {
    logMain('hello world');
    let workspace = 'demo';
    let es = new StoreMemory([ValidatorEs1], workspace);
    logMain('workspace:', es.workspace);
    let demoKeypair = Crypto.generateKeypair();
    let demoAuthor = demoKeypair.public;
    logMain('author:', demoAuthor);
    let ok = es.set(demoKeypair, {
        format: 'es.1',
        key: 'wiki/bumblebee',
        value: 'Buzz buzz buzz',
    });
    logMain('ok:', ok);
    logMain('keys:', es.keys());
    let item = es.items()[0];
    logMain('item:', item);
    logMain('hash:', ValidatorEs1.hashItem(item));
    logMain('-------------------------------');
    logMain('syncing:');
    await syncLocalAndHttp(es, 'http://localhost:3333/earthstar/');
    logMain('-------------------------------');
    logMain('keys:', es.keys());
};
//main();

//================================================================================
// APP VIEW

let logApp = (...args : any[]) => console.log('AppView | ', ...args);
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
    componentDidMount() {
        // poll for updates until earthstar supports watching for changes
        setInterval(() => this.forceUpdate(), 1500);
    }
    render() {
        logApp('render()');
        return <Center>
            <Stack>
                <Card>hello</Card>
                <Card><EsDebugView es={this.props.es} /></Card>
            </Stack>
        </Center>
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
