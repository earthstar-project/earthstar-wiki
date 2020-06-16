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
    AuthorProfile,
    AuthorParsed,
    AuthorAddress,
    parseAuthorAddress,
} from 'earthstar';
import {
    Stack,
} from './layouts';
import { Urls } from '../urls';

let logRouted = (...args : any[]) => console.log('RoutedProfileView |', ...args);
let logFetch = (...args : any[]) => console.log('FetchProfileView |', ...args);
let logDisplay = (...args : any[]) => console.log('ProfileView |', ...args);

interface BasicProps {
    storage : IStorage,
    keypair : AuthorKeypair,
    wikiLayer : WikiLayer,
    aboutLayer : AboutLayer,
    syncer : Syncer,
}

interface ExtraProps extends BasicProps {
    workspace : WorkspaceAddress,
    author : AuthorAddress,
}

// url params:
// :workspace
// :author
export const RoutedProfileView : React.FunctionComponent<BasicProps> = (props) => {
    let { workspace, author } = useParams();
    workspace = '//' + workspace;
    logRouted('render', workspace, author);
    return <FetchProfileView
        {...props}
        workspace={workspace}
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
        this.unsub = this.props.storage.onChange.subscribe(() => {
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
        let profile = this.props.aboutLayer.getAuthorProfile(this.props.author);
        return <ProfileView
            workspace={this.props.workspace}
            keypair={this.props.keypair}
            authorProfile={profile}
            aboutLayer={this.props.aboutLayer}
            />;
    }
}


interface ProfileViewProps {
    workspace : WorkspaceAddress,
    keypair : AuthorKeypair,
    authorProfile : AuthorProfile | null,
    aboutLayer : AboutLayer,
}
export class ProfileView extends React.Component<ProfileViewProps> {
    constructor(props : ProfileViewProps) {
        super(props);
    }
    _renameAuthor(oldName : string) {
        let newName = window.prompt('Rename author', oldName);
        if (!newName) { return; }
        this.props.aboutLayer.setMyAuthorLongname(newName);
    }
    render() {
        if (this.props.authorProfile === null) {
            return <h3>Unknown author</h3>;
        }
        let profile : AuthorProfile = this.props.authorProfile;
        let isMe = this.props.keypair.address === profile.address;
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
        </Stack>;
    }
}