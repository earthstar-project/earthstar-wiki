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

import { Urls } from './urls';

import { RoutedWikiPageView, WikiPageView } from './views/wikiPageView';
import { RoutedWikiPageList, WikiPageList } from './views/wikiPageList';
import { WikiNavbar } from './views/navbar';
import {
    LoginFlow,
    LoginLandingView,
    LoginStartWorkspace,
    LoginCreateUser,
    LoginJoinWorkspace,
    LoginCreateOrLoginUser,
} from './views/loginFlow';
import { EsDebugView } from './views/esDebugView';
import { ProfileView, RoutedProfileView } from './views/profileView';

//================================================================================
// SET UP DEMO CONTENT

let prepareEarthstar = () => {
    let workspace = '//gardening.xxxxxxxxxxxxxxxxxxxx';
    let es = new StorageMemory([ValidatorEs2], workspace);
    // let demoKeypair = Crypto.generateKeypair();
    let demoKeypair = {
        address: "@suzy.E4JHZTPXfc939fnLrpPDzRwjDEiTBFJHadFH32CN97yc",
        secret: "5DokVzbQ8f6DHBJQvGXvN96uSYj7V152McYruLhBXR2a"
    }

    let wikiLayer = new WikiLayer(es, demoKeypair);
    let aboutLayer = new AboutLayer(es, demoKeypair);

    // use an old time so we don't keep overwriting stuff with our demo content
    // one year ago
    let now = (Date.now() - 1000 * 60 * 60 * 24 * 7 * 52) * 1000;
    aboutLayer.setMyAuthorLongname('Suzy The Example Wiki Author', now);
    wikiLayer.setPageText(WikiLayer.makePagePath('shared', 'Bumblebee'), 'Buzz buzz buzz', now);
    wikiLayer.setPageText(WikiLayer.makePagePath('shared', 'Duck'), 'Quack quack quack', now);
    wikiLayer.setPageText(WikiLayer.makePagePath('shared', 'Fish Of The Deep Sea'), '🐟🐠\n           🐙\n    🐡', now);

    let syncer = new Syncer(es);
    syncer.addPub('http://localhost:3333');
    //syncer.addPub('http://167.71.153.73:3333');  // this only works when the wiki page is http, not https
    syncer.addPub('https://cinnamon-bun-earthstar-pub3.glitch.me');
    return {es, demoKeypair, syncer, wikiLayer, aboutLayer};
}

//================================================================================

interface BasicProps {
    storage : IStorage,
    keypair : AuthorKeypair,
    wikiLayer : WikiLayer,
    aboutLayer : AboutLayer,
    syncer : Syncer,
}

//================================================================================

let logMainLayout = (...args : any[]) => console.log('MainLayout |', ...args);
const MainLayout : React.FunctionComponent<BasicProps> = (props) =>
    <Center>
        {logMainLayout('render()')}
        <Stack>
            <WikiNavbar author={props.keypair.address} workspace={props.storage.workspace} syncer={props.syncer} />
            <Card>
                {props.children}
            </Card>
            <div style={{height: 60}} />
            <details>
                <summary><h3>Debug View</h3></summary>
                <Card>
                    <EsDebugView storage={props.storage} keypair={props.keypair} syncer={props.syncer} />
                </Card>
            </details>
        </Stack>
    </Center>;

//================================================================================

// <OldAppView storage={props.storage} keypair={props.keypair} syncer={props.syncer} wikiLayer={props.wikiLayer} aboutLayer={props.aboutLayer} />

let logRouter = (...args : any[]) => console.log('RouterView |', ...args);
const RouterView : React.FunctionComponent<BasicProps> = (props) =>
    <Router>
        {logRouter('render()')}
        <Switch>
            <Route exact path='/navbar'>
                {/* hack */}
                <WikiNavbar author={props.keypair.address} workspace={props.storage.workspace} syncer={props.syncer} />
            </Route>
            <Route path='/storybook'>
                <StorybookRouterView {...props}/>
            </Route>

            <Route exact path='/'>
                <LoginFlow />
            </Route>
            <Route exact path={Urls.loginTemplate}>
                <LoginFlow />
            </Route>

            <Route exact path={Urls.authorListTemplate}>
                <WikiNavbar author={props.keypair.address} workspace={props.storage.workspace} syncer={props.syncer} />
                <h3>TODO: author list</h3>
            </Route>
            <Route exact path={Urls.authorTemplate}>
                <MainLayout {...props}>
                    <RoutedProfileView {...props} />
                </MainLayout>
            </Route>
            <Route exact path={Urls.wikiTemplate}>
                <MainLayout {...props}>
                    <RoutedWikiPageView {...props} />
                </MainLayout>
            </Route>
            <Route exact path={Urls.allPagesTemplate}>
                <MainLayout {...props}>
                    <RoutedWikiPageList {...props} />
                </MainLayout>
            </Route>
            <Route exact path={Urls.searchTemplate}>
                <WikiNavbar author={props.keypair.address} workspace={props.storage.workspace} syncer={props.syncer} />
                <h3>TODO: search</h3>
            </Route>

            <Route path='*'>
                <h3>404 from root</h3>
            </Route>
        </Switch>
    </Router>

//================================================================================

let logStorybook = (...args : any[]) => console.log('Storybook |', ...args);
const StorybookRouterView : React.FunctionComponent<BasicProps> = (props) => {
    let pageInfos = props.wikiLayer.listPageInfos();
    let pageInfo = pageInfos[0];
    let pageDetail = props.wikiLayer.getPageDetails(pageInfo.path);
    let lastAuthorProfile = pageDetail === null ? null : props.aboutLayer.getAuthorProfile(pageDetail.lastAuthor);
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
                    <div><NavLink exact to="/storybook/wikiNavbar">WikiNavbar</NavLink></div>
                    <div><NavLink exact to="/storybook/loginFlow">LoginFlow</NavLink></div>
                    <div><NavLink exact to="/storybook/loginComponents">individual login components</NavLink></div>
                </Stack>
            </Card>
        </Center>
        <hr />
        <Switch>
            <Route exact path='/storybook/'/>
            <Route exact path='/storybook/wikiPageView'>
                <StoryFrameDivider title="no page chosen" />
                <StoryFrame width={350}>
                    <WikiPageView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} pageDetail={null} lastAuthorProfile={null} />
                </StoryFrame>
                <StoryFrameDivider title="regular page" />
                <StoryFrame width={'calc(min(70ch, 100% - 20px))'}>
                    <WikiPageView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} pageDetail={pageDetail} lastAuthorProfile={lastAuthorProfile} />
                </StoryFrame>
                <StoryFrame width={'calc(100% - 20px'}>
                    <WikiPageView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} pageDetail={pageDetail} lastAuthorProfile={lastAuthorProfile} />
                </StoryFrame>
                <StoryFrame width={250}>
                    <WikiPageView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} pageDetail={pageDetail} lastAuthorProfile={lastAuthorProfile} />
                </StoryFrame>
                <StoryFrame width={350} minHeight={350}>
                    <WikiPageView aboutLayer={props.aboutLayer} wikiLayer={props.wikiLayer} pageDetail={pageDetail} lastAuthorProfile={lastAuthorProfile} />
                </StoryFrame>
            </Route>
            <Route exact path='/storybook/wikiNavbar'>
                <StoryFrame width={'calc(min(70ch, 100% - 20px))'}>
                    <WikiNavbar author={props.keypair.address} workspace={props.storage.workspace} syncer={props.syncer} />
                </StoryFrame>
                <StoryFrame width={'calc(100% - 20px'}>
                    <WikiNavbar author={props.keypair.address} workspace={props.storage.workspace} syncer={props.syncer} />
                </StoryFrame>
                <StoryFrame width={250}>
                    <WikiNavbar author={props.keypair.address} workspace={props.storage.workspace} syncer={props.syncer} />
                </StoryFrame>
            </Route>
            <Route exact path='/storybook/loginFlow'>
                <StoryFrameDivider title="centered in a card" />
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
            <Route exact path='/storybook/loginComponents'>
                <StoryFrame title="landing" width={400} minHeight={600}>
                    <LoginLandingView api={null as any} />
                </StoryFrame>
                <StoryFrame title="start workspace" width={400} minHeight={600}>
                    <LoginStartWorkspace api={null as any} />
                </StoryFrame>
                <StoryFrame title="join workspace" width={400} minHeight={600}>
                    <LoginJoinWorkspace api={null as any} />
                </StoryFrame>
                <StoryFrame title="create or login user" width={400} minHeight={600}>
                    <LoginCreateOrLoginUser api={null as any} />
                </StoryFrame>
                <StoryFrame title="create user" width={400} minHeight={600}>
                    <LoginCreateUser api={null as any} />
                </StoryFrame>
            </Route>
            <Route path='*'>
                <h3>404 from storybook</h3>
            </Route>
        </Switch>
    </Router>
};


//================================================================================
// MAIN

let {es, demoKeypair, syncer, wikiLayer, aboutLayer} = prepareEarthstar();

ReactDOM.render(
    <RouterView storage={es} keypair={demoKeypair} syncer={syncer} wikiLayer={wikiLayer} aboutLayer={aboutLayer} />,
    document.getElementById('react-slot')
);

