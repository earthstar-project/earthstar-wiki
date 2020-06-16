import * as React from 'react';
import {
    useParams,
} from "react-router-dom";
import {
    AboutLayer,
    AuthorKeypair,
    AuthorProfile,
    IStorage,
    Path,
    Syncer,
    WikiLayer,
    WikiPageDetail,
    WorkspaceAddress,
} from 'earthstar';

let logRoutedPage = (...args : any[]) => console.log('RoutedWikiPageView |', ...args);
let logFetchPage = (...args : any[]) => console.log('FetchWikiPageView |', ...args);
let logDisplayPage = (...args : any[]) => console.log('WikiPageView |', ...args);

interface BasicProps {
    storage : IStorage,
    keypair : AuthorKeypair,
    wikiLayer : WikiLayer,
    aboutLayer : AboutLayer,
    syncer : Syncer,
}

interface ExtraProps extends BasicProps {
    workspace : WorkspaceAddress,
    path : Path,
}

// url params:
// :workspace
// :rest_of_path

export const RoutedWikiPageView : React.FunctionComponent<BasicProps> = (props) => {
    let { workspace, owner, title } = useParams();
    workspace = '//' + workspace;
    // reactRouter removes percent-encoding for us,
    // but we actually want to keep it, so we have to do it again
    let path = `/wiki/${owner}/${encodeURIComponent(title)}`;
    logRoutedPage('render', workspace, path);
    return <FetchWikiPageView
        workspace={workspace}
        path={path}
        {...props}
        />;
}
export class FetchWikiPageView extends React.Component<ExtraProps> {
    constructor(props : ExtraProps) {
        super(props);
    }
    componentDidMount() {
        logDisplayPage('subscribing to storage onChange');
        this.props.storage.onChange.subscribe(() => {
            logDisplayPage('onChange =============');
            this.forceUpdate()
        });
    }
    render() {
        // do all the data loading here.  WikiPageView is just a display component. 
        logDisplayPage('render()');
        let pageDetail = this.props.wikiLayer.getPageDetails(this.props.path);
        let lastAuthorProfile = pageDetail === null ? null : this.props.aboutLayer.getAuthorProfile(pageDetail.lastAuthor);
        return <WikiPageView
            aboutLayer={this.props.aboutLayer}
            wikiLayer={this.props.wikiLayer}
            pageDetail={pageDetail}
            lastAuthorProfile={lastAuthorProfile}
            />;
    }
}

interface WikiPageViewProps {
    aboutLayer : AboutLayer,
    wikiLayer : WikiLayer,
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
        let ok = this.props.wikiLayer.setPageText(
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
    _renameAuthor(oldName : string) {
        let newName = window.prompt('Rename author', oldName);
        if (!newName) { return; }
        this.props.aboutLayer.setMyAuthorLongname(newName);
    }
    render() {
        logDisplayPage('render()');
        if (this.props.pageDetail === null) {
            return <i>No such page.</i>;
        }
        let wiki = this.props.wikiLayer;
        let page = this.props.pageDetail;
        let isEditing = this.state.isEditing;
        let editedTime : string = new Date(page.timestamp/1000).toString().split(' ').slice(0, 5).join(' ');
        let wasLastEditedByMe = wiki.keypair.address === page.lastAuthor;
        let lastAuthorName : string = this.props.lastAuthorProfile?.longname || (this.props.lastAuthorProfile?.address.slice(0, 10) + '...');
        return <div>
            {isEditing
                ? <div>
                    <button type="button" style={{float: 'right', marginLeft: 10}} onClick={() => this._save()}>Save</button>
                    <button type="button" className="secondary" style={{float: 'right'}} onClick={() => this._cancelEditing()}>Cancel</button>
                </div>
                : <button type="button" style={{float: 'right'}} onClick={() => this._startEditing()}>Edit</button>
            }
            <p className="small">
                {page.owner === 'shared'
                    ? 'shared wiki'
                    : `${page.owner}'s wiki`
                }
            </p>
            <h2 style={{marginTop: 0, fontFamily: '"Georgia", "Times", serif'}}>
                {page.title}
            </h2>
            <p className="small"><i>
                updated {editedTime}<br/>
                {wasLastEditedByMe
                    ? <span>by <a href="#" onClick={() => this._renameAuthor(lastAuthorName)}>{lastAuthorName}</a></span>
                    : <span>by {lastAuthorName}</span>
                }
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