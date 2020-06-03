import * as React from 'react';
import { Syncer } from './sync';

let log = (...args : any[]) => console.log('SyncButton |', ...args);

interface SyncButtonProps {
    syncer : Syncer,
}
interface SyncButtonState {
}
export class SyncButton extends React.Component<SyncButtonProps, SyncButtonState> {
    constructor(props : SyncButtonProps) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.props.syncer.atom.subscribeSync(() => this.forceUpdate());
    }
    render() {
        log('render()');
        return <button type="button"
            onClick={() => this.props.syncer.sync()}
            disabled={this.props.syncer.state.syncState === 'syncing'}
            >
            {this.props.syncer.state.syncState === 'idle'
                ? "Sync now"
                : "Syncing..."}
        </button>
    }
}