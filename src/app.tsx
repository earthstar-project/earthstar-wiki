import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
    StoreMemory,
    IStore,
    ValidatorEs1,
    Crypto,
    Keypair,
} from 'earthstar';
import {
    syncLocalAndHttp,
} from './sync';

import {
    Card,
    Center,
    Stack,
} from './layouts';

import { EsDebugView } from './esDebugView';
import { WikiView } from './wikiView';


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
    keypair : Keypair,
}
interface AppViewState {
}
class AppView extends React.Component<AppViewProps, AppViewState> {
    constructor(props : AppViewProps) {
        super(props);
        this.state = { };
    }
    render() {
        logApp('render()');
        return <Center>
            <Stack>
                <h2>
                    <img src="static/img/earthstar-pal-transparent.png"
                        style={{width: 100, verticalAlign: 'middle'}}
                    />
                    Earthstar Wiki
                </h2>
                <Card>
                    <WikiView es={this.props.es} keypair={this.props.keypair} />
                </Card>
                <div style={{height: 60}} />
                <h3 style={{opacity: 0.6}}>Debug View</h3>
                <Card style={{opacity: 0.6}}>
                    <EsDebugView es={this.props.es} keypair={this.props.keypair} />
                </Card>
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
    key: 'wiki/Bumblebee',
    value: 'Buzz buzz buzz',
});
es.set(demoKeypair, {
    format: 'es.1',
    key: 'wiki/Puppy',
    value: 'Bark bark bark',
});
es.set(demoKeypair, {
    format: 'es.1',
    key: 'wiki/Bird',
    value: 'Cheep cheep\nCheep\n\nCheep cheep cheep cheep cheep cheep cheep cheep cheep cheep cheep cheep cheep cheep\n🦆',
});
es.set(demoKeypair, {
    format: 'es.1',
    key: 'wiki/Fish Of The Deep Sea',
    value: '🐟🐠\n           🐙\n    🐡',
});
es.set(demoKeypair, {
    format: 'es.1',
    key: 'wiki/Kitten',
    value: 'Meow meow meow',
});

ReactDOM.render(
    <AppView es={es} keypair={demoKeypair} />,
    document.getElementById('react-slot')
);
