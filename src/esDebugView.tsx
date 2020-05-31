import * as React from 'react';
import {
    IStore,
    Keypair,
} from 'earthstar';
import {
    Stack,
} from './layouts';

let log = (...args : any[]) => console.log('EsDebugView |', ...args);

interface EsDebugProps {
    es : IStore,
    keypair : Keypair,
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
            <div><b>Demo author:</b> <code className='cAuthor'>{this.props.keypair.public.slice(0,10)+'...'}</code></div>
            <div><b>Keys and values:</b> (click to edit)</div>
            {es.items().map(item =>
                <div key={item.key}
                    onClick={() => this.setState({newKey: item.key, newValue: item.value})}
                    >
                    <div><code className='cKey'>{item.key}</code></div>
                    <div style={{paddingLeft: 50}}>= <pre className='cValue'>{item.value}</pre></div>
                    <div style={{paddingLeft: 50}}>by <code className='cAuthor'>{item.author.slice(0,10)+'...'}</code></div>
                </div>
            )}
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
                        style={{width: '100%'}}
                        value={this.state.newValue}
                        placeholder="value"
                        onChange={e => this.setState({newValue: e.target.value})}
                        />
                    <button type="button"
                        onClick={() => this._setKeyValue()}
                        >
                        Set or overwrite
                        </button>
                </div>
            </div>
            <div><b>Networking: Pubs</b></div>
            <div>(pub sync works but is not hooked up in the UI yet)</div>
        </Stack>
    }
}