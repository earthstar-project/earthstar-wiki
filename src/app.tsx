import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
} from "react-router-dom";
import debounce = require('lodash.debounce');

import {
    LayerWiki,
    StorageMemory,
    ValidatorEs3,
} from 'earthstar';
import {
    Workspace
} from './helpers/workspace';
import { Urls } from './urls';

import {
    Card,
    Center,
    Stack,
} from './views/layouts';
import {
    StoryFrame,
    StoryFrameDivider,
} from './views/storybook';
import { RoutedWikiPageView, WikiPageView } from './views/wikiPageView';
import { RoutedWikiPageList } from './views/wikiPageList';
import { FetchListOfAuthorsView } from './views/listOfAuthorsView';
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
import { RoutedProfileView } from './views/profileView';

//================================================================================
// SET UP DEMO CONTENT

let prepareWorkspace = () : Workspace => {
    // let demoKeypair = Crypto.generateKeypair();
    let demoKeypair = {
        address: "@suzy.E4JHZTPXfc939fnLrpPDzRwjDEiTBFJHadFH32CN97yc",
        secret: "5DokVzbQ8f6DHBJQvGXvN96uSYj7V152McYruLhBXR2a"
    }
    let validator = ValidatorEs3;
    let workspaceAddress = '+gardening.xxxxxxxxxxxxxxxxxxxx';
    let storage = new StorageMemory([validator], workspaceAddress);

    let workspace = new Workspace(storage, demoKeypair);

    // HACK to persist the memory storage to localStorage
    let localStorageKey = `earthstar-${validator.format}-${workspaceAddress}`;
    let existingData = localStorage.getItem(localStorageKey);
    if (existingData !== null) {
        storage._docs = JSON.parse(existingData);
    }
    // saving will get triggered on every incoming document, so we should debounce it
    let saveToLocalStorage = () => {
        console.log('SAVING=====================================');
        localStorage.setItem(localStorageKey, JSON.stringify(storage._docs));
    };
    let debouncedSave = debounce(saveToLocalStorage, 80, { trailing: true });
    storage.onChange.subscribe(debouncedSave);
    // END HACK

    // add demo content.
    // use an old time so we don't keep overwriting stuff with our demo content
    // one year ago.  But note that earthstar bumps the time forward for us...
    let now = (Date.now() - 1000 * 60 * 60 * 24 * 7 * 52) * 1000;
    let profile = workspace.layerAbout.getAuthorProfile(demoKeypair.address);
    if (profile === null || profile.longname === null || profile.longname === '') {
        workspace.layerAbout.setMyAuthorLongname(demoKeypair, 'Suzy The Example Wiki Author', now);
    }
    let setPageIfNotThere = (owner : string, title : string, content : string, now : number) => {
        if (workspace.layerWiki.getPageDetails(LayerWiki.makePagePath(owner, title)) === null) {
            workspace.layerWiki.setPageText(demoKeypair, LayerWiki.makePagePath(owner, title), content, now);
        }
    }
    setPageIfNotThere('shared', 'Bumblebee', 'Buzz buzz buzz', now);
    setPageIfNotThere('shared', 'Duck', 'Quack quack quack', now);
    setPageIfNotThere('shared', 'Fish Of The Deep Sea', '🐟🐠\n           🐙\n    🐡', now);

    // add pubs.
    workspace.syncer.addPub('http://localhost:3333');
    workspace.syncer.addPub('https://cinnamon-bun-earthstar-pub3.glitch.me');
    workspace.syncer.addPub('https://cinnamon-bun-earthstar-pub4.glitch.me');
    workspace.syncer.addPub('https://earthstar-pub--rabbitface.repl.co/');
    return workspace;
}

//================================================================================

type WorkspaceProps = {
    workspace : Workspace
}

let logMainLayout = (...args : any[]) => console.log('MainLayout |', ...args);
const MainLayout : React.FunctionComponent<WorkspaceProps> = (props) =>
    <Center>
        {logMainLayout('render()')}
        <Stack>
            <WikiNavbar workspace={props.workspace} />
            <Card>
                {props.children}
            </Card>
            <div style={{height: 60}} />
            <details>
                <summary><h3>Debug View</h3></summary>
                <Card>
                    <EsDebugView workspace={props.workspace} />
                </Card>
            </details>
        </Stack>
    </Center>;

//================================================================================

let logRouter = (...args : any[]) => console.log('RouterView |', ...args);
const RouterView : React.FunctionComponent<WorkspaceProps> = (props) =>
    <Router>
        {logRouter('render()')}
        <Switch>
            <Route exact path='/'>
                {/* HACK: for now, start on the page list */}
                <MainLayout {...props}>
                    <RoutedWikiPageList {...props} />
                </MainLayout>
            </Route>

            <Route path='/storybook'>
                <StorybookRouterView {...props}/>
            </Route>

            <Route exact path={Urls.loginTemplate}>
                <LoginFlow />
            </Route>

            <Route exact path={Urls.authorListTemplate}>
                <MainLayout {...props}>
                    <FetchListOfAuthorsView {...props} />
                </MainLayout>
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
                <MainLayout {...props}>
                    <h3>TODO: search</h3>
                </MainLayout>
            </Route>

            <Route path='*'>
                <h3>404</h3>
            </Route>
        </Switch>
    </Router>

//================================================================================

let logStorybook = (...args : any[]) => console.log('Storybook |', ...args);
const StorybookRouterView : React.FunctionComponent<WorkspaceProps> = (props) => {
    let ws = props.workspace;
    let pageInfos = ws.layerWiki.listPageInfos();
    let pageInfo = pageInfos[0];
    let pageDetail = ws.layerWiki.getPageDetails(pageInfo.path);
    let lastAuthorProfile = pageDetail === null ? null : ws.layerAbout.getAuthorProfile(pageDetail.lastAuthor);
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
                    <WikiPageView workspace={ws} pageDetail={null} lastAuthorProfile={null} />
                </StoryFrame>
                <StoryFrameDivider title="regular page" />
                <StoryFrame width={'calc(min(70ch, 100% - 20px))'}>
                    <WikiPageView workspace={ws} pageDetail={pageDetail} lastAuthorProfile={lastAuthorProfile} />
                </StoryFrame>
                <StoryFrame width={'calc(100% - 20px'}>
                    <WikiPageView workspace={ws} pageDetail={pageDetail} lastAuthorProfile={lastAuthorProfile} />
                </StoryFrame>
                <StoryFrame width={250}>
                    <WikiPageView workspace={ws} pageDetail={pageDetail} lastAuthorProfile={lastAuthorProfile} />
                </StoryFrame>
                <StoryFrame width={350} minHeight={350}>
                    <WikiPageView workspace={ws} pageDetail={pageDetail} lastAuthorProfile={lastAuthorProfile} />
                </StoryFrame>
            </Route>
            <Route exact path='/storybook/wikiNavbar'>
                <StoryFrame width={'calc(min(70ch, 100% - 20px))'}>
                    <WikiNavbar workspace={ws} />
                </StoryFrame>
                <StoryFrame width={'calc(100% - 20px'}>
                    <WikiNavbar workspace={ws} />
                </StoryFrame>
                <StoryFrame width={250}>
                    <WikiNavbar workspace={ws} />
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

let workspace = prepareWorkspace();

ReactDOM.render(
    <RouterView workspace={workspace} />,
    document.getElementById('react-slot')
);

