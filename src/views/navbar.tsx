import * as React from 'react';
import {
    AuthorParsed,
    WorkspaceParsed,
    AuthorAddress,
    WorkspaceAddress,
    parseAuthorAddress,
    parseWorkspaceAddress,
    Syncer,
} from 'earthstar';
import {
    Link,
    NavLink,
    useParams,
} from "react-router-dom";
import {
    Box,
    Cluster,
    FlexItem,
    FlexRow,   
} from './layouts';
import { Urls } from '../urls';
import { SyncButton } from './syncButton';

let log = (...args : any[]) => console.log('WikiNavbar |', ...args);

interface WikiNavbarProps {
    author : AuthorAddress,
    workspace : WorkspaceAddress,
    syncer : Syncer,
}
interface WikiNavbarState {
}
let sNavbarLink : React.CSSProperties = {
    textDecoration: 'none',
    color: 'var(--cWhite)',
}
export class WikiNavbar extends React.Component<WikiNavbarProps, WikiNavbarState> {
    constructor(props : WikiNavbarProps) {
        super(props);
        this.state = {};
    }
    render() {
        log('render()');
        let { authorParsed, err: err1 } = parseAuthorAddress(this.props.author);
        let { workspaceParsed, err: err2 } = parseWorkspaceAddress(this.props.workspace);
        let authorText = authorParsed === null ? '@?' : '@' + authorParsed.shortname;
        let workspaceText = workspaceParsed === null ? '//?' : '//' + workspaceParsed.name;
        return <Box style={{background: 'var(--cAccentDark)'}}>
            <Cluster>
                <Link to={Urls.recentFeed(this.props.workspace)} style={sNavbarLink}><b>{workspaceText}</b></Link>
                <Link to={Urls.author(this.props.workspace, this.props.author)} style={sNavbarLink}>{authorText}</Link>
                <Link to={Urls.recentFeed(this.props.workspace)} style={sNavbarLink}>Pages</Link>
                <Link to={Urls.authorList(this.props.workspace)} style={sNavbarLink}>People</Link>
                <Link to={Urls.search(this.props.workspace)} style={sNavbarLink}>Search</Link>
                <SyncButton syncer={this.props.syncer} />
            </Cluster>
        </Box>;
    }
}