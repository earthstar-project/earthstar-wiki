import * as React from 'react';
import {
    Link,
    useParams,
    Redirect,
} from "react-router-dom";
import {
    AboutLayer,
    AuthorKeypair,
    IStorage,
    Syncer,
    WikiLayer,
    WikiPageInfo,
    WorkspaceAddress,
} from 'earthstar';
import {
    Stack,
} from './layouts';
import { Urls } from '../urls';

let logRoutedPageList = (...args : any[]) => console.log('RoutedWikiPageList |', ...args);
let logFetchPageList = (...args : any[]) => console.log('FetchWikiPageList |', ...args);
let logDisplayPageList = (...args : any[]) => console.log('WikiPageList |', ...args);

interface BasicProps {
    storage : IStorage,
    keypair : AuthorKeypair,
    wikiLayer : WikiLayer,
    aboutLayer : AboutLayer,
    syncer : Syncer,
}

// url params:
// :workspace
export const RoutedWikiPageList : React.FunctionComponent<BasicProps> = (props) => {
    let { workspace } = useParams();
    workspace = '//' + workspace;
    logRoutedPageList('render', workspace);
    return <FetchWikiPageList {...props} />;
}
export class FetchWikiPageList extends React.Component<BasicProps> {
    unsub : () => void;
    constructor(props : BasicProps) {
        super(props);
        this.unsub = () => {};
    }
    componentDidMount() {
        logDisplayPageList('subscribing to storage onChange');
        this.unsub = this.props.storage.onChange.subscribe(() => {
            logDisplayPageList('onChange =============');
            this.forceUpdate()
        });
    }
    componentWillUnmount() {
        this.unsub();
    }
    render() {
        // do all the data loading here.  WikiPageList is just a display component. 
        logDisplayPageList('render()');
        // HACK: for now, limit to shared pages
        let pageInfos = this.props.wikiLayer.listPageInfos({ owner: 'shared' });
        return <WikiPageList
            workspace={this.props.storage.workspace}
            pageInfos={pageInfos}
            wikiLayer={this.props.wikiLayer}
            />;
    }
}


interface WikiPageListProps {
    workspace : WorkspaceAddress,
    pageInfos : WikiPageInfo[],
    wikiLayer : WikiLayer,
}
interface WikiPageListState {
    redirectTo : string | null;
}
export class WikiPageList extends React.Component<WikiPageListProps, WikiPageListState> {
    constructor(props : WikiPageListProps) {
        super(props);
        this.state = { redirectTo: null }
    }
    _newPage() {
        logDisplayPageList('makeNewPage');
        let title = window.prompt('Page title');
        if (!title) { return; }
        let path = WikiLayer.makePagePath('shared', title);  // TODO: allow making personal pages too, not just shared
        let ok = this.props.wikiLayer.setPageText(path, '...');
        if (ok) {
            let newUrl = Urls.wiki(this.props.wikiLayer.storage.workspace, path);
            this.setState({ redirectTo: newUrl });
        }
    }
    render() {
        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo}/>
        }
        return <Stack>
            {logDisplayPageList('render')}
            <button type="button"
                style={{float: 'right', marginLeft: 10}}
                onClick={() => this._newPage()}
                >
                New Page
            </button>
            <h3>All shared pages</h3>
            {this.props.pageInfos.map((pageInfo : WikiPageInfo) =>
                <p key={pageInfo.path}><Link to={Urls.wiki(this.props.workspace, pageInfo.path)}>{pageInfo.title}</Link></p>
            )}
        </Stack>
    }
}
