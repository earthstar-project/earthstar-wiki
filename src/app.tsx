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
import { AboutLayer } from './layerAbout';
import { WikiLayer } from './layerWiki';
import { Syncer } from './sync';

import {
    Card,
    Center,
    Cluster,
    Stack,
    FlexRow,
    FlexItem,
} from './layouts';
import { SyncButton } from './syncButton';
import { EsDebugView } from './esDebugView';
import { WikiView } from './wikiView';
import { OldAppView } from './oldAppView';

//================================================================================
// SET UP DEMO CONTENT

let prepareEarthstar = () => {
    let workspace = 'demo';
    let es = new StoreMemory([ValidatorEs1], workspace);
    // let demoKeypair = Crypto.generateKeypair();
    let demoKeypair = {
        public: "@mVkCjHbAcjEBddaZwxFVSiQdVFuvXSiH3B5K5bH7Hcx",
        secret: "6DxjAHzdJHgMvJBqgD4iUNhmuwQbuMzPuDkntLi1sjjz"
    }

    let wikiLayer = new WikiLayer(es, demoKeypair);
    let aboutLayer = new AboutLayer(es, demoKeypair);

    // use an old time so we don't keep overwriting stuff with our demo content
    // one year ago
    let now = (Date.now() - 1000 * 60 * 60 * 24 * 7 * 52) * 1000;
    aboutLayer.setMyAuthorName('Example Wiki Author', now);
    wikiLayer.setPageText(WikiLayer.makeKey('Bumblebee', 'shared'), 'Buzz buzz buzz', now);
    wikiLayer.setPageText(WikiLayer.makeKey('Duck', 'shared'), 'Quack quack quack', now);
    wikiLayer.setPageText(WikiLayer.makeKey('Fish Of The Deep Sea', 'shared'), '🐟🐠\n           🐙\n    🐡', now);

    let syncer = new Syncer(es);
    syncer.addPub('http://localhost:3333/earthstar/');
    syncer.addPub('http://167.71.153.73:3333/earthstar/');  // this only works when the wiki page is http, not https
    syncer.addPub('https://cinnamon-bun-earthstar-pub3.glitch.me/earthstar/');
    return {es, demoKeypair, syncer, wikiLayer, aboutLayer};
}

//================================================================================
// REACT ROUTER EXAMPLE

const RouterMenu : React.FunctionComponent = (props) =>
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

interface RouterProps {
    es : IStore,
    keypair : Keypair,
    wikiLayer : WikiLayer,
    aboutLayer : AboutLayer,
    syncer : Syncer,
}
const ReactRouterExample : React.FunctionComponent<RouterProps> = (props : RouterProps) =>
    <Router>
        <Switch>
            <Route exact path='/'>
                <OldAppView es={props.es} keypair={props.keypair} syncer={props.syncer} wikiLayer={props.wikiLayer} aboutLayer={props.aboutLayer} />
            </Route>
            <Route exact path='/login'>
                <RouterMenu /><hr />
                <CardExample text={'login'} />
            </Route>
            <Route exact path='/ws/:workspace/about'>
                <RouterMenu /><hr />
                <AboutFrontpage />
            </Route>
            <Route exact path='/ws/:workspace/about/:author'>
                <RouterMenu /><hr />
                <AboutAuthor />
            </Route>
            <Route exact path='/ws/:workspace/wiki'>
                <RouterMenu /><hr />
                <WikiFrontpage />
            </Route>
            <Route exact path='/ws/:workspace/wiki/recent'>
                <RouterMenu /><hr />
                <WikiRecent />
            </Route>
            <Route exact path='/ws/:workspace/wiki/page/:title'>
                <RouterMenu /><hr />
                <WikiPage />
            </Route>
            <Route path='*'>
                <RouterMenu /><hr />
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

let {es, demoKeypair, syncer, wikiLayer, aboutLayer} = prepareEarthstar();
ReactDOM.render(
    <ReactRouterExample 
        es={es} keypair={demoKeypair} syncer={syncer} wikiLayer={wikiLayer} aboutLayer={aboutLayer}
        />,
    document.getElementById('react-slot')
);

