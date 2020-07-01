import * as React from 'react';
import {
    Link,
    useParams,
} from "react-router-dom";
import {
    AuthorAddress,
    AuthorProfile,
    WikiPageInfo,
} from 'earthstar';
import {
    Stack,
} from './layouts';
import { Urls } from '../urls';
import { Workspace } from '../helpers/workspace';

let logRouted = (...args : any[]) => console.log('RoutedProfileView |', ...args);
let logFetch = (...args : any[]) => console.log('FetchProfileView |', ...args);
let logDisplay = (...args : any[]) => console.log('ProfileView |', ...args);

type WorkspaceProps = {
    workspace : Workspace
}

interface ExtraProps extends WorkspaceProps {
    author : AuthorAddress,
}

// url params:
// :workspace
// :author
export const RoutedProfileView : React.FunctionComponent<WorkspaceProps> = (props) => {
    let { workspace, author } = useParams();
    author = '@' + author;
    logRouted('render', workspace, author);
    return <FetchProfileView
        {...props}
        workspace={props.workspace}
        author={author}
    />;
}
export class FetchProfileView extends React.Component<ExtraProps> {
    unsub : () => void;
    constructor(props : ExtraProps) {
        super(props);
        this.unsub = () => {};
    }
    componentDidMount() {
        logDisplay('subscribing to storage onChange');
        this.unsub = this.props.workspace.storage.onChange.subscribe(() => {
            logDisplay('onChange =============');
            this.forceUpdate()
        });
    }
    componentWillUnmount() {
        this.unsub();
    }
    render() {
        // do all the data loading here.  WikiPageList is just a display component. 
        logDisplay('render()');
        // HACK: for now, limit to shared pages
        let ws = this.props.workspace;
        let profile = ws.layerAbout.getAuthorProfile(this.props.author);
        // find docs this author has ever contributed to, but only return latest version (maybe not by this author)
        let pageInfos = ws.layerWiki.listPageInfos({ participatingAuthor: this.props.author });
        return <ProfileView
            workspace={ws}
            authorProfile={profile}
            pageInfos={pageInfos}
            />;
    }
}


interface ProfileViewProps {
    workspace : Workspace,
    authorProfile : AuthorProfile | null,
    pageInfos : WikiPageInfo[],
}
export class ProfileView extends React.Component<ProfileViewProps> {
    constructor(props : ProfileViewProps) {
        super(props);
    }
    _renameAuthor(oldName : string) {
        let newName = window.prompt('Rename author', oldName);
        if (!newName) { return; }
        this.props.workspace.layerAbout.setMyAuthorLongname(this.props.workspace.authorKeypair, newName);
    }
    render() {
        if (this.props.authorProfile === null) {
            return <h3>Unknown author</h3>;
        }
        let ws = this.props.workspace;
        let profile : AuthorProfile = this.props.authorProfile;
        let isMe = ws.authorKeypair.address === profile.address;
        return <Stack>
            {isMe
                ? <button type="button"
                    style={{float: 'right', marginLeft: 10}}
                    onClick={() => this._renameAuthor(profile.longname || '')}
                    >
                    Change name
                </button>
                : null
            }
            <h3>🐱 {profile.longname || '@' + profile.shortname}</h3>
            <div>
                <code className="cAuthor"><b>{'@' + profile.shortname}</b></code>
                <code className="small">{profile.address}</code>
            </div>
            <hr />
            <h3>Pages</h3>
            {this.props.pageInfos.map(pageInfo =>
                <p key={pageInfo.path}>
                    <Link to={Urls.wiki(ws.address, pageInfo.path)}>{pageInfo.title}</Link>
                </p>
            )}
        </Stack>;
    }
}