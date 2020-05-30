import * as React from 'react';
import {
    IStore,
} from 'earthstar';
import {
    Card,
    Stack,
} from './layouts';

let log = (...args : any[]) => console.log('EsDebugView |', ...args);

interface EsDebugProps {
    es : IStore,
}
interface EsDebugState {
}
export class EsDebugView extends React.Component<EsDebugProps, EsDebugState> {
    constructor(props : EsDebugProps) {
        super(props);
        this.state = { };
    }
    render() {
        log('render()');
        let es = this.props.es;
        return <Stack>
            <h3>Earthstar debug view</h3>
            <div><b>Workspace:</b> <code className='cWorkspace'>{es.workspace}</code></div>
            <div><b>Keys and values:</b></div>
            {es.items().map(item =>
                <div key={'key-'+item.key}>
                    <div><code className='cKey'>{item.key}</code></div>
                    <div><code className='cValue' style={{marginLeft: 50}}>{item.value}</code></div>
                </div>
            )}
            <button type="button">Sync</button>
        </Stack>
    }
}