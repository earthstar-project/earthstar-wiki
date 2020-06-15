import * as React from 'react';
import {
    AuthorParsed,
    WorkspaceParsed,
    AuthorAddress,
    WorkspaceAddress,
    parseAuthorAddress,
    parseWorkspaceAddress,
} from 'earthstar';
import {
    Box,
    Cluster,
    FlexItem,
    FlexRow,   
} from './layouts';

let log = (...args : any[]) => console.log('WikiNavbar |', ...args);

interface WikiNavbarProps {
    author : AuthorAddress,
    workspace : WorkspaceAddress,
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
        return <Box style={{background: 'var(--cAccentLight)'}}>
            <Cluster>
                <a href="#" style={sNavbarLink}><b>{workspaceText}</b></a>
                <a href="#" style={sNavbarLink}>{authorText}</a>
                <a href="#" style={sNavbarLink}>Pages</a>
                <a href="#" style={sNavbarLink}>People</a>
                <a href="#" style={sNavbarLink}>Search</a>
            </Cluster>
        </Box>;
    }
}