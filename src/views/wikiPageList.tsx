import * as React from 'react';
import {
    Link,
    Redirect,
    useParams,
} from "react-router-dom";
import {
    LayerWiki,
    WikiPageInfo,
} from 'earthstar';
import {
    Stack,
} from './layouts';
import { Urls } from '../urls';
import { Workspace } from '../helpers/workspace';

let logRoutedPageList = (...args : any[]) => console.log('RoutedWikiPageList |', ...args);
let logFetchPageList = (...args : any[]) => console.log('FetchWikiPageList |', ...args);
let logDisplayPageList = (...args : any[]) => console.log('WikiPageList |', ...args);

type WorkspaceProps = {
    workspace : Workspace
}
export const RoutedWikiPageList : React.FunctionComponent<WorkspaceProps> = (props) => {
    let { workspace } = useParams();
    logRoutedPageList('render', workspace);
    return <FetchWikiPageList workspace={props.workspace} />;
}
export class FetchWikiPageList extends React.Component<WorkspaceProps> {
    unsub : () => void;
    constructor(props : WorkspaceProps) {
        super(props);
        this.unsub = () => {};
    }
    componentDidMount() {
        logDisplayPageList('subscribing to storage onChange');
        this.unsub = this.props.workspace.storage.onChange.subscribe(() => {
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
        let ws = this.props.workspace;
        let pageInfos = ws.layerWiki.listPageInfos({ owner: 'shared' });
        return <WikiPageList
            workspace={ws}
            pageInfos={pageInfos}
            />;
    }
}


interface WikiPageListProps {
    workspace : Workspace,
    pageInfos : WikiPageInfo[],
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
        let ws = this.props.workspace;
        let path = LayerWiki.makePagePath('shared', title);  // TODO: allow making personal pages too, not just shared
        let ok = ws.layerWiki.setPageText(ws.authorKeypair, path, '...');
        if (ok) {
            let newUrl = Urls.wiki(ws.address, path);
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
                <p key={pageInfo.path}><Link to={Urls.wiki(this.props.workspace.address, pageInfo.path)}>{pageInfo.title}</Link></p>
            )}
        </Stack>
    }
}
