import * as React from 'react';
import {
    IStore,
} from 'earthstar';
import {
    Stack
} from './layouts';

let log = (...args : any[]) => console.log('EsDebugView', ...args);

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
            <h3>Workspace: <code className='cWorkspace'>{es.workspace}</code></h3>
            {es.items().map(item =>
                <div>
                    <div><code className='cKey'>{item.key}</code></div>
                    <div><code className='cValue' style={{marginLeft: 20}}>{item.value}</code></div>
                </div>
            )}
        </Stack>
    }
}