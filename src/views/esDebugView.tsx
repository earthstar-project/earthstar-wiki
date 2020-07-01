import * as React from 'react';
import {
    Stack,
} from './layouts';
import {
    SyncButton
} from './syncButton';
import { Workspace } from '../helpers/workspace';


interface EsDebugProps {
    workspace : Workspace
}
interface EsDebugState {
    newPath : string,
    newValue : string,
}
let log = (...args : any[]) => console.log('EsDebugView |', ...args);
export class EsDebugView extends React.Component<EsDebugProps, EsDebugState> {
    unsubStorage : () => void;
    unsubSyncer : () => void;
    constructor(props : EsDebugProps) {
        super(props);
        this.state = {
            newPath: '',
            newValue: '',
        };
        this.unsubStorage = () => {};
        this.unsubSyncer = () => {};
    }
    componentDidMount() {
        // update on changes to the earthstar contents...
        log('subscribing to storage onChange');
        this.unsubStorage = this.props.workspace.storage.onChange.subscribe(() => {
            log('onChange =============');
            this.forceUpdate()
        });
        // and the syncer details
        log('subscribing to syncer onChange');
        this.unsubSyncer = this.props.workspace.syncer.onChange.subscribe(() => {
            log('onChange (syncer) >>>>>>>>');
            this.forceUpdate()
        });
    }
    componentWillUnmount() {
        this.unsubStorage();
        this.unsubSyncer();
    }
    _setPath() {
        if (this.state.newPath === '') { return; }
        let ok = this.props.workspace.storage.set(this.props.workspace.authorKeypair, {
            format: 'es.3',
            path: this.state.newPath,
            value: this.state.newValue,
        });
        if (!ok) {
            log('set failed');
            return;
        }
        this.setState({ newPath: '', newValue: '' });
    }
    render() {
        log('render()');
        let ws = this.props.workspace;
        return <Stack>
            <div><b>Workspace:</b> <code className='cWorkspace'>{ws.address}</code></div>
            <hr/>
            <div><b>Demo author:</b> <code className='cAuthor'>{ws.authorKeypair.address.slice(0,10)+'...'}</code></div>
            <hr/>
            <div><b>Networking: Pubs</b></div>
            {ws.syncer.state.pubs.map(pub => {
                let lastSynced : string = pub.lastSync === 0
                    ? 'never'
                    : new Date(pub.lastSync)
                        .toString()
                        .split(' ').slice(0, 5).join(' ');
                return <div key={pub.domain}>
                    <div>🗃 <b><a href={pub.domain}>{pub.domain}</a></b></div>
                    <div style={{paddingLeft: 50}}>last synced: {lastSynced}</div>
                    <div style={{paddingLeft: 50}}>state: <b>{pub.syncState}</b></div>
                </div>
            })}
            <SyncButton syncer={ws.syncer} />
            <hr/>
            <div id="es-editor"><b>Editor:</b></div>
            <div>
                <div>
                    <input type="text"
                        style={{width: '100%'}}
                        value={this.state.newPath}
                        placeholder="new or existing path"
                        onChange={e => this.setState({newPath: e.target.value})}
                        />
                </div>
                <div style={{paddingLeft: 50}}>
                    <textarea
                        rows={4}
                        style={{width: '100%'}}
                        value={this.state.newValue}
                        placeholder="value"
                        onChange={e => this.setState({newValue: e.target.value})}
                        />
                    <button type="button"
                        onClick={() => this._setPath()}
                        >
                        Save
                    </button>
                    (Delete documents by saving an empty value)
                </div>
            </div>
            <hr/>
            <div><b>Paths and document values:</b> (Click to load into the edit box)</div>
            {ws.storage.documents().map(doc =>
                <div key={doc.path}
                    onClick={() => {
                        // load this doc into the editor
                        this.setState({newPath: doc.path, newValue: doc.value})
                        document.getElementById('es-editor')?.scrollIntoView({behavior: 'smooth', block: 'nearest'});
                    }}
                    >
                    <div><code className='cPath'>{doc.path}</code></div>
                    <div style={{paddingLeft: 50}}>= <pre className='cValue'>{doc.value}</pre></div>
                    <div style={{paddingLeft: 50}}>by <code className='cAuthor'>{doc.author.slice(0,10)+'...'}</code></div>
                </div>
            )}
        </Stack>
    }
}