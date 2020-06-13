import * as React from 'react';
import {
    AboutLayer,
    WikiLayer,
    WikiPageDetail,
    WikiPageInfo,
} from 'earthstar';
import {
    FlexItem,
    FlexRow,
} from './layouts';

let logPage = (...args : any[]) => console.log('WikiPageView |', ...args);
let logWiki = (...args : any[]) => console.log('WikiView |', ...args);

interface WikiPageViewProps {
    aboutLayer : AboutLayer,
    wikiLayer : WikiLayer,
    pageDetail : WikiPageDetail | null,
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
        logPage('saving success:', ok);
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
        logPage('render()');
        if (this.props.pageDetail === null) {
            return <i>Choose a page.</i>;
        }
        let wiki = this.props.wikiLayer;
        let page = this.props.pageDetail;
        let isEditing = this.state.isEditing;
        let editedTime : string = new Date(page.timestamp/1000).toString().split(' ').slice(0, 5).join(' ');
        let wasLastEditedByMe = wiki.keypair.address === page.lastAuthor;
        let lastAuthorProfile = this.props.aboutLayer.getAuthorProfile(page.lastAuthor);
        let lastAuthorName : string = lastAuthorProfile?.longname || (lastAuthorProfile?.address.slice(0, 10) + '...');
        return <div>
            {isEditing
                ? <div>
                    <button type="button" style={{float: 'right', marginLeft: 10}} onClick={() => this._save()}>Save</button>
                    <button type="button" className="secondary" style={{float: 'right'}} onClick={() => this._cancelEditing()}>Cancel</button>
                </div>
                : <button type="button" style={{float: 'right'}} onClick={() => this._startEditing()}>Edit</button>
            }
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

interface WikiViewProps {
    aboutLayer : AboutLayer,
    wikiLayer : WikiLayer,
}
interface WikiViewState {
    currentPagePath : string | null,
}
export class WikiView extends React.Component<WikiViewProps, WikiViewState> {
    constructor(props : WikiViewProps) {
        super(props);
        this.state = { currentPagePath : null };
    }
    componentDidMount() {
        this.props.wikiLayer.storage.onChange.subscribe(() => this.forceUpdate());
    }
    _viewPage(path : string | null) {
        this.setState({ currentPagePath: path });
    }
    _newPage() {
        let title = window.prompt('Page title');
        if (!title) { return; }
        let path = WikiLayer.makePagePath('shared', title);  // TODO: allow making personal pages too, not just shared
        let ok = this.props.wikiLayer.setPageText(path, '...');
        if (ok) {
            this.setState({
                currentPagePath: path,
            });
        }
    }
    render() {
        logWiki('render()');
        let pageInfos : WikiPageInfo[] = this.props.wikiLayer.listPageInfos();
        let pageDetail : WikiPageDetail | null = this.state.currentPagePath ? this.props.wikiLayer.getPageDetails(this.state.currentPagePath) : null;
        return <FlexRow>
            <FlexItem basis="150px" shrink={0} style={{borderRight: '2px solid #888'}}>
                {pageInfos.map(pageInfo =>
                    <div key={pageInfo.path}>
                        📄 <a href="#"
                            onClick={() => this._viewPage(pageInfo.path)}
                            style={{fontWeight: pageInfo.path == this.state.currentPagePath ? 'bold' : 'normal'}}
                            >
                            {pageInfo.title}
                        </a>
                    </div>
                )}
                <p></p>
                <button type="button" onClick={() => this._newPage()}>New page</button>
            </FlexItem>
            <FlexItem grow={1} style={{marginLeft: 'var(--s0)'}}>
                <WikiPageView
                    aboutLayer={this.props.aboutLayer}
                    wikiLayer={this.props.wikiLayer}
                    pageDetail={pageDetail}
                    />
            </FlexItem>
        </FlexRow>;
    }
}
/*
            <input list="wikipages" />
            <datalist id="wikipages">
                {docs.map(doc =>
                    <option key={doc.path} value={doc.value} />
                )}
            </datalist>
*/