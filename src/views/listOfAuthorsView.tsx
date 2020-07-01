import * as React from 'react';
import {
    Link,
} from "react-router-dom";
import {
    AuthorAddress,
    AuthorProfile,
} from 'earthstar';
import {
    Stack,
} from './layouts';
import { Urls } from '../urls';
import { Workspace } from '../helpers/workspace';

let logDisplay = (...args : any[]) => console.log('ListOfAuthorsView |', ...args);

type WorkspaceProps = {
    workspace : Workspace
}

export class FetchListOfAuthorsView extends React.Component<WorkspaceProps> {
    unsub : () => void;
    constructor(props : WorkspaceProps) {
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
        let authors : AuthorAddress[] = ws.storage.authors();
        let profiles : AuthorProfile[] = authors
            .map(author => ws.layerAbout.getAuthorProfile(author))
            .filter(profile => profile !== null) as any as AuthorProfile[];
        return <ListOfAuthorsView
            workspace={ws}
            profiles={profiles}
            />;
    }
}


interface ListOfAuthorsViewProps {
    workspace : Workspace,
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
                    <Link to={Urls.authorProfile(this.props.workspace.address, profile.address)}>
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