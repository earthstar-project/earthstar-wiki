import * as React from 'react';
import {
    Link,
    useParams,
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
    constructor(props : BasicProps) {
        super(props);
    }
    componentDidMount() {
        logDisplayPageList('subscribing to storage onChange');
        this.props.storage.onChange.subscribe(() => {
            logDisplayPageList('onChange =============');
            this.forceUpdate()
        });
    }
    render() {
        // do all the data loading here.  WikiPageList is just a display component. 
        logDisplayPageList('render()');
        // HACK: for now, limit to shared pages
        let pageInfos = this.props.wikiLayer.listPageInfos('shared');
        return <WikiPageList workspace={this.props.storage.workspace} pageInfos={pageInfos} />;
    }
}

interface WikiPageListProps {
    workspace : WorkspaceAddress,
    pageInfos : WikiPageInfo[],
}
export const WikiPageList : React.FunctionComponent<WikiPageListProps> = (props) =>
    <Stack>
        <h3>All shared pages</h3>
        {props.pageInfos.map((pageInfo : WikiPageInfo) =>
            <p key={pageInfo.path}><Link to={Urls.wiki(props.workspace, pageInfo.path)}>{pageInfo.title}</Link></p>
        )}
    </Stack>