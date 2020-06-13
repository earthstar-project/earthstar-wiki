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
    StorageMemory,
    IStorage,
    ValidatorEs2,
    AuthorKeypair,
    AboutLayer,
    WikiLayer,
    Syncer,
} from 'earthstar';

import {
    Card,
    Center,
    Stack,
} from './views/layouts';
import {
    StoryFrame,
    StoryFrameDivider,
} from './views/storybook';

import { WikiView, WikiPageView } from './views/wikiView';
import { OldAppView } from './views/oldAppView';
import {
    LoginFlow,
    LoginLandingView,
    LoginStartWorkspace,
    LoginCreateUser,
} from './views/loginFlow';

//================================================================================
// SET UP DEMO CONTENT

let prepareEarthstar = () => {
    let workspace = '//demo.xxxxxxxxxxxxxxxxxxxx';
    let es = new StorageMemory([ValidatorEs2], workspace);
    // let demoKeypair = Crypto.generateKeypair();
    let demoKeypair = {
        address: "@demo.E4JHZTPXfc939fnLrpPDzRwjDEiTBFJHadFH32CN97yc",
        secret: "5DokVzbQ8f6DHBJQvGXvN96uSYj7V152McYruLhBXR2a"
    }

    let wikiLayer = new WikiLayer(es, demoKeypair);
    let aboutLayer = new AboutLayer(es, demoKeypair);

    // use an old time so we don't keep overwriting stuff with our demo content
    // one year ago
    let now = (Date.now() - 1000 * 60 * 60 * 24 * 7 * 52) * 1000;
    aboutLayer.setMyAuthorLongname('Example Wiki Author', now);
    wikiLayer.setPageText(WikiLayer.makePagePath('shared', 'Bumblebee'), 'Buzz buzz buzz', now);
    wikiLayer.setPageText(WikiLayer.makePagePath('shared', 'Duck'), 'Quack quack quack', now);
    wikiLayer.setPageText(WikiLayer.makePagePath('shared', 'Fish Of The Deep Sea'), '🐟🐠\n           🐙\n    🐡', now);

    let syncer = new Syncer(es);
    syncer.addPub('http://localhost:3333');
    //syncer.addPub('http://167.71.153.73:3333');  // this only works when the wiki page is http, not https
    //syncer.addPub('https://cinnamon-bun-earthstar-pub3.glitch.me');
    return {es, demoKeypair, syncer, wikiLayer, aboutLayer};
}

//================================================================================
// REACT ROUTER EXAMPLE

interface RouterProps {
    storage : IStorage,
    keypair : AuthorKeypair,
    wikiLayer : WikiLayer,
    aboutLayer : AboutLayer,
    syncer : Syncer,
}
const ReactRouterExample : React.FunctionComponent<RouterProps> = (props : RouterProps) =>
    <Router>
        <Switch>
            <Route exact path='/'>
                <OldAppView storage={props.storage} keypair={props.keypair} syncer={props.syncer} wikiLayer={props.wikiLayer} aboutLayer={props.aboutLayer} />
            </Route>
            <Route path='/storybook/'>
                <Storybook {...props}/>
            </Route>
            <Route path='*'>
                <h3>404</h3>
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
    let pageInfos = props.wikiLayer.listPageInfos();
    let pageInfo = pageInfos[0];
    let pageDetail = props.wikiLayer.getPageDetails(pageInfo.path);
    logStorybook('page key', pageInfo.path);
    logStorybook('pageInfo', pageInfo);
    logStorybook('pageDetail', pageDetail);
    return <Router>
        <Center>
            <Card>
                <Stack>
                    <div><a href="/">(Back to app)</a></div>
                    <div><NavLink exact to="/storybook/wikiPageView">WikiPageView</NavLink></div>
                    <div><NavLink exact to="/storybook/wikiView">WikiView</NavLink></div>
                    <div><NavLink exact to="/storybook/loginFlow">LoginFlow</NavLink></div>
                    <div><NavLink exact to="/storybook/loginLandingView">LoginLandingView</NavLink></div>
                </Stack>
            </Card>
        </Center>
        <hr />
        <Switch>
            <Route exact path='/storybook/'/>
            <Route exact path='/storybook/wikiPageView'>
                <StoryFrameDivider title="no page chosen" />
                <StoryFrame width={350}>
                    <WikiPageView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} pageDetail={null} />
                </StoryFrame>
                <StoryFrameDivider title="regular page" />
                <StoryFrame width={'calc(min(70ch, 100% - 20px))'}>
                    <WikiPageView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} pageDetail={pageDetail} />
                </StoryFrame>
                <StoryFrame width={'calc(100% - 20px'}>
                    <WikiPageView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} pageDetail={pageDetail} />
                </StoryFrame>
                <StoryFrame width={250}>
                    <WikiPageView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} pageDetail={pageDetail} />
                </StoryFrame>
                <StoryFrame width={350} minHeight={350}>
                    <WikiPageView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} pageDetail={pageDetail} />
                </StoryFrame>
            </Route>
            <Route exact path='/storybook/wikiView'>
                <StoryFrame width={'calc(min(70ch, 100% - 20px))'}>
                    <WikiView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} />
                </StoryFrame>
                <StoryFrame width={'calc(100% - 20px'}>
                    <WikiView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} />
                </StoryFrame>
                <StoryFrame width={250}>
                    <WikiView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} />
                </StoryFrame>
                <StoryFrame width={350} minHeight={350}>
                    <WikiView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} />
                </StoryFrame>
            </Route>
            <Route exact path='/storybook/loginFlow'>
                <StoryFrameDivider title="centered" />
                <Center>
                    <Card>
                        <LoginFlow />
                    </Card>
                </Center>
                <StoryFrameDivider title="small" />
                <StoryFrame width={400} minHeight={600}>
                    <LoginFlow />
                </StoryFrame>
            </Route>
            <Route exact path='/storybook/loginLandingView'>
                <StoryFrame title="landing" width={400} minHeight={600}>
                    <LoginLandingView api={null as any} />
                </StoryFrame>
                <StoryFrame title="start workspace" width={400} minHeight={600}>
                    <LoginStartWorkspace api={null as any} />
                </StoryFrame>
                <StoryFrame title="create user" width={400} minHeight={600}>
                    <LoginCreateUser api={null as any} />
                </StoryFrame>
            </Route>
            <Route path='*'>
                <h3>404</h3>
            </Route>
        </Switch>
    </Router>
};


//================================================================================
// MAIN

let {es, demoKeypair, syncer, wikiLayer, aboutLayer} = prepareEarthstar();
ReactDOM.render(
    <ReactRouterExample 
        storage={es} keypair={demoKeypair} syncer={syncer} wikiLayer={wikiLayer} aboutLayer={aboutLayer}
        />,
    document.getElementById('react-slot')
);

