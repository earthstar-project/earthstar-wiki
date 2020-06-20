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
    AuthorAddress,
    WorkspaceAddress,
    AuthorProfile,
} from 'earthstar';
import {
    Stack,
} from './layouts';
import { Urls } from '../urls';

let logDisplay = (...args : any[]) => console.log('ListOfAuthorsView |', ...args);

interface BasicProps {
    storage : IStorage,
    keypair : AuthorKeypair,
    wikiLayer : WikiLayer,
    aboutLayer : AboutLayer,
    syncer : Syncer,
}

export class FetchListOfAuthorsView extends React.Component<BasicProps> {
    unsub : () => void;
    constructor(props : BasicProps) {
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
        let authors : AuthorAddress[] = this.props.storage.authors();
        let profiles : AuthorProfile[] = authors
            .map(author => this.props.aboutLayer.getAuthorProfile(author))
            .filter(profile => profile !== null) as any as AuthorProfile[];
        return <ListOfAuthorsView
            workspace={this.props.storage.workspace}
            profiles={profiles}
            />;
    }
}


interface ListOfAuthorsViewProps {
    workspace : WorkspaceAddress,
    profiles : AuthorProfile[],
}
export class ListOfAuthorsView extends React.Component<ListOfAuthorsViewProps> {
    constructor(props : ListOfAuthorsViewProps) {
        super(props);
    }
    render() {
        return <Stack>
            {this.props.profiles.map(profile =>
                <div key={profile.address}>
                    <Link to={Urls.authorProfile(this.props.workspace, profile.address)}>
                        <h3>🐱 {profile.longname || '@' + profile.shortname}</h3>
                        <div>
                            <code className="cAuthor"><b>{'@' + profile.shortname}</b></code>
                            <code className="small">{profile.address}</code>
                        </div>
                    </Link>
                </div>
            )}
        </Stack>;
    }
}