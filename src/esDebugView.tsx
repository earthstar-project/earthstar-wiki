import * as React from 'react';
import {
    IStore,
    Keypair,
} from 'earthstar';
import {
    Stack,
} from './layouts';
import { Syncer } from './sync';

let log = (...args : any[]) => console.log('EsDebugView |', ...args);

interface EsDebugProps {
    es : IStore,
    keypair : Keypair,
    syncer : Syncer,
}
interface EsDebugState {
    newKey : string,
    newValue : string,
}
export class EsDebugView extends React.Component<EsDebugProps, EsDebugState> {
    constructor(props : EsDebugProps) {
        super(props);
        this.state = {
            newKey: '',
            newValue: '',
        };
    }
    componentDidMount() {
        this.props.es.onChange.subscribe(() => this.forceUpdate());
        this.props.syncer.atom.subscribeSync(() => this.forceUpdate());
    }
    _setKeyValue() {
        if (this.state.newKey === '') { return; }
        let ok = this.props.es.set(this.props.keypair, {
            format: 'es.1',
            key: this.state.newKey,
            value: this.state.newValue,
        });
        if (!ok) {
            log('set failed');
            return;
        }
        this.setState({ newKey: '', newValue: '' });
    }
    render() {
        log('render()');
        let es = this.props.es;
        return <Stack>
            <div><b>Workspace:</b> <code className='cWorkspace'>{es.workspace}</code></div>
            <hr/>
            <div><b>Demo author:</b> <code className='cAuthor'>{this.props.keypair.public.slice(0,10)+'...'}</code></div>
            <hr/>
            <div><b>Networking: Pubs</b></div>
            {this.props.syncer.state.pubs.map(pub => {
                let lastSynced : string = pub.lastSync === 0
                    ? 'never'
                    : new Date(pub.lastSync)
                        .toString()
                        .split(' ').slice(0, 5).join(' ');
                return <div key={pub.url}>
                    <div>🗃 <b><a href={pub.url}>{pub.url}</a></b></div>
                    <div style={{paddingLeft: 50}}>last synced: {lastSynced}</div>
                    <div style={{paddingLeft: 50}}>state: <b>{pub.syncState}</b></div>
                </div>
            })}
            <button type="button"
                onClick={() => this.props.syncer.sync()}
                disabled={this.props.syncer.state.syncState === 'syncing'}
                >
                {this.props.syncer.state.syncState === 'idle'
                    ? "Sync now"
                    : "Syncing..."}
            </button>
            <hr/>
            <div id="es-editor"><b>Editor:</b></div>
            <div>
                <div>
                    <input type="text"
                        style={{width: '100%'}}
                        value={this.state.newKey}
                        placeholder="new or existing key"
                        onChange={e => this.setState({newKey: e.target.value})}
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
                        onClick={() => this._setKeyValue()}
                        >
                        Save
                    </button>
                    (Delete items by saving an empty value)
                </div>
            </div>
            <hr/>
            <div><b>Keys and values:</b> (Click to load into the edit box)</div>
            {es.items().map(item =>
                <div key={item.key}
                    onClick={() => {
                        // load this item into the editor
                        this.setState({newKey: item.key, newValue: item.value})
                        document.getElementById('es-editor')?.scrollIntoView({behavior: 'smooth', block: 'nearest'});
                    }}
                    >
                    <div><code className='cKey'>{item.key}</code></div>
                    <div style={{paddingLeft: 50}}>= <pre className='cValue'>{item.value}</pre></div>
                    <div style={{paddingLeft: 50}}>by <code className='cAuthor'>{item.author.slice(0,10)+'...'}</code></div>
                </div>
            )}
        </Stack>
    }
}