import * as React from 'react';
import {
    Syncer
} from 'earthstar';

let log = (...args : any[]) => console.log('SyncButton |', ...args);

interface SyncButtonProps {
    syncer : Syncer,
}
interface SyncButtonState {
}
export class SyncButton extends React.Component<SyncButtonProps, SyncButtonState> {
    unsub : () => void;
    constructor(props : SyncButtonProps) {
        super(props);
        this.state = {};
        this.unsub = () => {};
    }
    componentDidMount() {
        this.unsub = this.props.syncer.onChange.subscribe(() => this.forceUpdate());
    }
    componentWillUnmount() {
        this.unsub();
    }
    render() {
        log('render()');
        let isSyncing = this.props.syncer.state.syncState === 'syncing';
        return <button type="button"
            onClick={() => this.props.syncer.sync()}
            disabled={isSyncing}
            >
            {isSyncing ? "Syncing..." : "Sync now"}
        </button>
    }
}