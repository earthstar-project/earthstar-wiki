import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

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
    Cluster,
    Stack,
    FlexRow,
    FlexItem,
} from './layouts';
import { Syncer } from './sync';
import { SyncButton } from './syncButton';
import { EsDebugView } from './esDebugView';
import { WikiView } from './wikiView';

//================================================================================
// REACT ROUTER EXAMPLE

class ReactRouterExample extends React.Component<any, any> {
    render() {
        return <Router>
            <Card>
                <Stack>
                    <div><Link to="/">Home</Link></div>
                    <div><Link to="/foo">Foo</Link></div>
                    <div><Link to="/bar">Bar</Link></div>
                </Stack>
            </Card>

            <hr />

            <Switch>
                <Route path="/">
                    <CardExample text={'home'} />
                </Route>
                <Route path="/foo">
                    <CardExample text={'foo'} />
                </Route>
                <Route path="/bar">
                    <CardExample text={'bar'} />
                </Route>
            </Switch>
        </Router>;
    }
}

interface CardExampleProps {
    text : string;
};
const CardExample : React.FunctionComponent<CardExampleProps> = (props) =>
    <Card>{props.text}</Card>;

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
                <FlexRow style={{alignItems: 'center'}}>
                    <FlexItem grow={1} shrink={1}>
                        <h2>
                            <img src="/static/img/earthstar-pal-transparent.png"
                                style={{width: 50, verticalAlign: 'middle'}}
                            />
                            Earthstar Wiki
                        </h2>
                    </FlexItem>
                    <FlexItem grow={0} shrink={0}>
                        <SyncButton syncer={this.props.syncer} />
                    </FlexItem>
                </FlexRow>
                <Card>
                    <WikiView es={this.props.es} keypair={this.props.keypair} />
                </Card>
                <div style={{height: 60}} />
                <details>
                    <summary>
                        <h3 style={{opacity: 1.0}}>Debug View</h3>
                    </summary>
                    <Card style={{opacity: 1.0}}>
                        <EsDebugView
                            es={this.props.es}
                            keypair={this.props.keypair}
                            syncer={this.props.syncer}
                            />
                    </Card>
                </details>
            </Stack>
        </Center>
    }
}

//================================================================================
// SET UP DEMO CONTENT

let workspace = 'demo';
let es = new StoreMemory([ValidatorEs1], workspace);
// use an old time so we don't keep overwriting stuff with our demo content
// one year ago
let now = (Date.now() - 1000 * 60 * 60 * 24 * 7 * 52) * 1000;
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
    timestamp: now,
});
es.set(demoKeypair, {
    format: 'es.1',
    key: 'wiki/Bumblebee',
    value: 'Buzz buzz buzz',
    timestamp: now,
});
es.set(demoKeypair, {
    format: 'es.1',
    key: 'wiki/Duck',
    value: 'Quack quack quack 🦆',
    timestamp: now,
});
es.set(demoKeypair, {
    format: 'es.1',
    key: 'wiki/' + encodeURIComponent('Fish Of The Deep Sea'),
    value: '🐟🐠\n           🐙\n    🐡',
    timestamp: now,
});

let syncer = new Syncer(es);
syncer.addPub('http://localhost:3333/earthstar/');
syncer.addPub('http://167.71.153.73:3333/earthstar/');

//================================================================================
// MAIN

ReactDOM.render(
    <AppView es={es} keypair={demoKeypair} syncer={syncer} />,
    //<ReactRouterExample />,
    document.getElementById('react-slot')
);
