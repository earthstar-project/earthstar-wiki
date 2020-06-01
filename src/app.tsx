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
    Card,
    Center,
    Stack,
} from './layouts';
import { Syncer } from './sync';
import { EsDebugView } from './esDebugView';
import { WikiView } from './wikiView';

/*
import {
    syncLocalAndHttp,
} from './sync';
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
*/

//================================================================================
// APP VIEW

let logApp = (...args : any[]) => console.log('AppView | ', ...args);
interface AppViewProps {
    es : IStore,
    keypair : Keypair,
    syncer : Syncer,
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
                <h3 style={{opacity: 1.0}}>Debug View</h3>
                <Card style={{opacity: 1.0}}>
                    <EsDebugView
                        es={this.props.es}
                        keypair={this.props.keypair}
                        syncer={this.props.syncer}
                        />
                </Card>
            </Stack>
        </Center>
    }
}

//================================================================================
// MAIN

let workspace = 'demo';
let es = new StoreMemory([ValidatorEs1], workspace);
// let demoKeypair = Crypto.generateKeypair();
let demoKeypair = {
    public: "@mVkCjHbAcjEBddaZwxFVSiQdVFuvXSiH3B5K5bH7Hcx",
    secret: "6DxjAHzdJHgMvJBqgD4iUNhmuwQbuMzPuDkntLi1sjjz"
}
let demoAuthor = demoKeypair.public;
es.set(demoKeypair, {
    format: 'es.1',
    key: `~${demoAuthor}/about/name`,
    value: 'Example Wiki Author',
});
es.set(demoKeypair, {
    format: 'es.1',
    key: 'wiki/Bumblebee',
    value: 'Buzz buzz buzz',
});
es.set(demoKeypair, {
    format: 'es.1',
    key: 'wiki/Puppy',
    value: 'Bark bark\nbark',
});
es.set(demoKeypair, {
    format: 'es.1',
    key: 'wiki/Duck',
    value: 'Quack quack quack 🦆',
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

let syncer = new Syncer(es);
syncer.addPub('http://localhost:3333/earthstar/');
syncer.addPub('http://167.71.153.73:3333/earthstar/');

ReactDOM.render(
    <AppView es={es} keypair={demoKeypair} syncer={syncer} />,
    document.getElementById('react-slot')
);
