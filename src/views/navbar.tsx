import * as React from 'react';
import {
    parseAuthorAddress,
    parseWorkspaceAddress,
} from 'earthstar';
import {
    Workspace
} from '../helpers/workspace';
import {
    Link,
} from "react-router-dom";
import {
    Box,
    Cluster,
} from './layouts';
import { Urls } from '../urls';
import { SyncButton } from './syncButton';

let log = (...args : any[]) => console.log('WikiNavbar |', ...args);

interface WorkspaceProps {
    workspace : Workspace,
}
let sNavbarLink : React.CSSProperties = {
    textDecoration: 'none',
    color: 'var(--cWhite)',
}
export class WikiNavbar extends React.Component<WorkspaceProps, any> {
    constructor(props : WorkspaceProps) {
        super(props);
    }
    render() {
        log('render()');
        let ws = this.props.workspace;
        let { authorParsed, err: err1 } = parseAuthorAddress(ws.authorKeypair.address);
        let { workspaceParsed, err: err2 } = parseWorkspaceAddress(ws.address);
        let authorText = authorParsed === null ? '@?' : '@' + authorParsed.shortname;
        let workspaceText = workspaceParsed === null ? '+?' : '+' + workspaceParsed.name;
        return <Box style={{background: 'var(--cAccentDark)'}}>
            <Cluster>
                <Link to={Urls.allPages(ws.address)} style={sNavbarLink}><b>📂 {workspaceText}</b></Link>
                <Link to={Urls.authorProfile(ws.address, ws.authorKeypair.address)} style={sNavbarLink}>🐱 {authorText}</Link>
                <Link to={Urls.allPages(ws.address)} style={sNavbarLink}>📄 Pages</Link>
                <Link to={Urls.authorList(ws.address)} style={sNavbarLink}>👭 People</Link>
                <Link to={Urls.search(ws.address)} style={sNavbarLink}>🔍 Search</Link>
                <SyncButton syncer={ws.syncer} style={{border: '2px solid var(--cGrayShadow)'}} />
            </Cluster>
        </Box>;
    }
}