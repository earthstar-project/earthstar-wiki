import * as React from 'react';
import {
    Link,
    useParams,
} from "react-router-dom";
import {
    AuthorProfile,
    Path,
    WikiPageDetail,
} from 'earthstar';
import { Urls } from '../urls';
import { Workspace } from '../helpers/workspace';

let logRoutedPage = (...args : any[]) => console.log('RoutedWikiPageView |', ...args);
let logFetchPage = (...args : any[]) => console.log('FetchWikiPageView |', ...args);
let logDisplayPage = (...args : any[]) => console.log('WikiPageView |', ...args);

type WorkspaceProps = {
    workspace : Workspace
}

interface ExtraProps extends WorkspaceProps {
    path : Path,
}

// url params:
// :workspace
// :rest_of_path

export const RoutedWikiPageView : React.FunctionComponent<WorkspaceProps> = (props) => {
    let { workspace, owner, title } = useParams();
    // reactRouter removes percent-encoding for us,
    // but we actually want to keep it, so we have to do it again
    let path = `/wiki/${owner}/${encodeURIComponent(title)}`;
    logRoutedPage('render', workspace, path);
    return <FetchWikiPageView
        workspace={props.workspace}
        path={path}
        />;
}
export class FetchWikiPageView extends React.Component<ExtraProps> {
    unsub : () => void;
    constructor(props : ExtraProps) {
        super(props);
        this.unsub = () => {};
    }
    componentDidMount() {
        logDisplayPage('subscribing to storage onChange');
        this.unsub = this.props.workspace.storage.onChange.subscribe(() => {
            logDisplayPage('onChange =============');
            this.forceUpdate()
        });
    }
    componentWillUnmount() {
        this.unsub();
    }
    render() {
        // do all the data loading here.  WikiPageView is just a display component. 
        logDisplayPage('render()');
        let ws = this.props.workspace;
        let pageDetail = ws.layerWiki.getPageDetails(this.props.path);
        let lastAuthorProfile = pageDetail === null ? null : ws.layerAbout.getAuthorProfile(pageDetail.lastAuthor);
        return <WikiPageView
            workspace={ws}
            pageDetail={pageDetail}
            lastAuthorProfile={lastAuthorProfile}
            />;
    }
}

interface WikiPageViewProps {
    workspace : Workspace,
    pageDetail : WikiPageDetail | null,
    lastAuthorProfile : AuthorProfile | null,
}
interface WikiPageViewState {
    isEditing : boolean;
    editedText : string;
}
export class WikiPageView extends React.Component<WikiPageViewProps, WikiPageViewState> {
    constructor(props : WikiPageViewProps) {
        super(props);
        this.state = {
            isEditing: false,
            editedText: '',
        };
    }
    _startEditing() {
        if (this.props.pageDetail === null) { return; }
        this.setState({
            isEditing: true,
            editedText: this.props.pageDetail.text,
        });
    }
    _save() {
        if (this.props.pageDetail === null) { return; }
        let ok = this.props.workspace.layerWiki.setPageText(
            this.props.workspace.authorKeypair,
            this.props.pageDetail.path,
            this.state.editedText
        );
        logDisplayPage('saving success:', ok);
        if (ok) {
            this.setState({
                isEditing: false,
                editedText: '',
            });
        }
    }
    _cancelEditing() {
        this.setState({
            isEditing: false,
            editedText: '',
        });
    }
    render() {
        logDisplayPage('render()');
        if (this.props.pageDetail === null) {
            return <i>No such page.</i>;
        }
        let ws = this.props.workspace;
        let page = this.props.pageDetail;
        let isEditing = this.state.isEditing;
        let editedTime : string = new Date(page.timestamp/1000).toString().split(' ').slice(0, 5).join(' ');
        let lastAuthorName : string = this.props.lastAuthorProfile?.longname || (this.props.lastAuthorProfile?.address.slice(0, 10) + '...');
        return <div>
            {isEditing
                ? <div>
                    <button type="button" style={{float: 'right', marginLeft: 10}} onClick={() => this._save()}>Save</button>
                    <button type="button" className="secondary" style={{float: 'right'}} onClick={() => this._cancelEditing()}>Cancel</button>
                </div>
                : <button type="button" style={{float: 'right'}} onClick={() => this._startEditing()}>Edit</button>
            }
            <p className="small"><i>
                {page.owner === 'shared'
                    ? <Link to={Urls.allPages(ws.address)}>shared wiki</Link>
                    : `${page.owner}'s wiki`
                }
            </i></p>
            <h2 style={{marginTop: 0, fontFamily: '"Georgia", "Times", serif'}}>
                {page.title}
            </h2>
            <p className="small"><i>
                updated {editedTime}<br/>
                by <Link to={Urls.authorProfile(ws.address, this.props.lastAuthorProfile?.address || '?')}>{lastAuthorName}</Link>
            </i></p>
            {isEditing
                ? <textarea rows={7}
                    value={this.state.editedText}
                    style={{width: '100%'}}
                    onChange={(e) => this.setState({editedText: e.target.value})}
                    />
                : <p style={{whiteSpace: 'pre-wrap'}}>{page.text}</p>
            }
        </div>;
    }
}