import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as config from './config';
let log = (...args : any[]) => console.log(...args);

//================================================================================
// APP VIEW

interface AppViewProps {
}
interface AppViewState {
}
class AppView extends React.Component<AppViewProps, AppViewState> {
    constructor(props : AppViewProps) {
        super(props);
        this.state = { };
    }
    render() {
        log('AppView.render()');
        return <b>hello from react</b>;
    }
}

//================================================================================
// MAIN

ReactDOM.render(
    <AppView />,
    document.getElementById('react-slot')
);
