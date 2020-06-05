import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink,
    useParams,
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

const ReactRouterExample : React.FunctionComponent = (props) =>
    <Router>
        <Card>
            <Stack>
                <div><NavLink exact to="/">Home</NavLink></div>
                <div><NavLink exact to="/login">Login</NavLink></div>
                <div><NavLink exact to="/ws/test/about">List of authors</NavLink></div>
                <div><NavLink exact to="/ws/test/about/@abc">About one author</NavLink></div>
                <div><NavLink exact to="/ws/test/wiki">Wiki frontpage</NavLink></div>
                <div><NavLink exact to="/ws/test/wiki/recent">Wiki recent</NavLink></div>
                <div><NavLink exact to="/ws/test/wiki/page/Dogs">Wiki: Dogs</NavLink></div>
                <div><NavLink exact to="/ws/test/wiki/page/Cats">Wiki: Cats</NavLink></div>
                <div><NavLink exact to="/ws/test/wiki/page/Dogs And Cats">Wiki: Dogs And Cats</NavLink></div>
            </Stack>
        </Card>

        <hr />

        <Switch>
            <Route exact path='/'>
                <CardExample text={'home'} />
            </Route>
            <Route exact path='/login'>
                <CardExample text={'login'} />
            </Route>
            <Route exact path='/ws/:workspace/about'>
                <AboutFrontpage />
            </Route>
            <Route exact path='/ws/:workspace/about/:author'>
                <AboutAuthor />
            </Route>
            <Route exact path='/ws/:workspace/wiki'>
                <WikiFrontpage />
            </Route>
            <Route exact path='/ws/:workspace/wiki/recent'>
                <WikiRecent />
            </Route>
            <Route exact path='/ws/:workspace/wiki/page/:title'>
                <WikiPage />
            </Route>
            <Route path='*'>
                <FourOhFour />
            </Route>
        </Switch>
    </Router>

const FourOhFour : React.FunctionComponent = (props) =>
    <h3>404</h3>

const CardExample : React.FunctionComponent<{ text : string }> = (props) =>
    <Card>{props.text}</Card>;

const AboutFrontpage : React.FunctionComponent = (props) =>
    <Card>
        <h3>List of authors</h3>
    </Card>;

const AboutAuthor : React.FunctionComponent = (props) => {
    let { author } = useParams();
    return <Card>
        <h3>{author}</h3>
    </Card>;
}

const WikiFrontpage : React.FunctionComponent = (props) => {
    let { workspace, title } = useParams();
    let pages = ['Dogs', 'Cats', 'Dogs And Cats'];
    return <Card>
        <p><i>Workspace: <code>{workspace}</code></i></p>
        <h3>List of pages</h3>
        {pages.map(page =>
            <p key={page}><Link to={`/ws/${workspace}/wiki/page/${page}`}>{page}</Link></p>
        )}
    </Card>;
}

const WikiRecent : React.FunctionComponent = (props) =>
    <Card>
        <h3>Recent wiki pages</h3>
    </Card>;

const WikiPage : React.FunctionComponent = (props) => {
    let { workspace, title } = useParams();
    return <Card>
        <p><i>Workspace: <code>{workspace}</code></i></p>
        <h3>{title}</h3>
        <p>blah blah</p>
    </Card>;
}

//================================================================================
// MAIN

ReactDOM.render(
    <ReactRouterExample />,
    document.getElementById('react-slot')
);

/*
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
    document.getElementById('react-slot')
);

*/