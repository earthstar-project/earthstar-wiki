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
import { WikiLayer, WikiPageDetail } from './layerWiki';
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
import { WikiView, WikiPageView } from './wikiView';
import { OldAppView } from './oldAppView';
import { cCARD_TEXT } from './config';

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
            <Route path='/storybook/'>
                <Storybook {...props}/>
            </Route>
            <Route path='*'>
                <FourOhFour />
            </Route>
        </Switch>
    </Router>

//  /login
//  /ws/:workspace/about
//  /ws/:workspace/about/:author
//  /ws/:workspace/wiki
//  /ws/:workspace/wiki/recent
//  /ws/:workspace/wiki/page/:title

let logStorybook = (...args : any[]) => console.log('Storybook |', ...args);
const Storybook : React.FunctionComponent<RouterProps> = (props) => {
    let pages = props.wikiLayer.listPages();
    let pageInfo = pages[0];
    let pageDetail = props.wikiLayer.getPageDetails(pageInfo.key);
    logStorybook('page key', pageInfo.key);
    logStorybook('pageInfo', pageInfo);
    logStorybook('pageDetail', pageDetail);
    return <Router>
        <Card>
            <Stack>
                <div><NavLink exact to="/">(Back to app)</NavLink></div>
                <div><NavLink exact to="/storybook/wikiPageView">WikiPageView</NavLink></div>
            </Stack>
        </Card>
        <hr />

        <Switch>
            <Route exact path='/storybook/'/>
            <Route exact path='/storybook/wikiPageView'>
                <StoryFrame width={350}>
                    <WikiPageView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} pageDetail={null} />
                </StoryFrame>
                <br />
                <StoryFrame width={350}>
                    <WikiPageView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} pageDetail={pageDetail} />
                </StoryFrame>
                <StoryFrame width={350} height={350}>
                    <WikiPageView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} pageDetail={pageDetail} />
                </StoryFrame>
                <StoryFrame width={'calc(min(70ch, 100% - 20px))'}>
                    <WikiPageView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} pageDetail={pageDetail} />
                </StoryFrame>
                <StoryFrame width={'calc(100% - 20px'}>
                    <WikiPageView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} pageDetail={pageDetail} />
                </StoryFrame>
            </Route>
            <Route path='*'>
                <FourOhFour />
            </Route>
        </Switch>
    </Router>
};

interface StoryFrameProps {
    width?: string | number,
    maxWidth?: string | number,
    height?: string | number,
}
const StoryFrame : React.FunctionComponent<StoryFrameProps> = (props) =>
    <div style={{
        width: props.width,
        maxWidth: props.maxWidth,
        height: props.height,
        //border: '1px dashed blue',
        margin: 10,
        display: 'inline-block',
        verticalAlign: 'top',
        background: 'white',
        boxShadow: 'rgba(0,0,0,0.3) 0px 5px 10px 0px',
    }}>
        {props.children}
    </div>

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

