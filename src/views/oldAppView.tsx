import * as React from 'react';
import {
    IStore,
    Keypair,
} from 'earthstar';
import {
    Card,
    Center,
    Stack,
    FlexRow,
    FlexItem,
} from './layouts';
import { AboutLayer } from '../earthstar/layerAbout';
import { WikiLayer } from '../earthstar/layerWiki';
import { Syncer } from '../earthstar/sync';
import { SyncButton } from './syncButton';
import { EsDebugView } from './esDebugView';
import { WikiView } from './wikiView';

let logApp = (...args : any[]) => console.log('OldAppView | ', ...args);

export interface OldAppViewProps {
    es : IStore,
    keypair : Keypair,
    wikiLayer : WikiLayer,
    aboutLayer : AboutLayer,
    syncer : Syncer,
}
export interface OldAppViewState {
}
export class OldAppView extends React.Component<OldAppViewProps, OldAppViewState> {
    constructor(props : OldAppViewProps) {
        super(props);
        this.state = { };
    }
    render() {
        logApp('render()');
        return <Center>
            <Stack>
                <FlexRow style={{alignItems: 'center'}}>
                    <FlexItem grow={1} shrink={1}>
                        <h2>
                            <img src="/static/img/earthstar-pal-transparent.png"
                                style={{width: 50, verticalAlign: 'middle'}}
                            />
                            Earthstar Wiki
                        </h2>
                    </FlexItem>
                    <FlexItem grow={0} shrink={0}>
                        <SyncButton syncer={this.props.syncer} />
                    </FlexItem>
                </FlexRow>
                <Card>
                    <WikiView aboutLayer={this.props.aboutLayer} wikiLayer={this.props.wikiLayer} />
                </Card>
                <div style={{height: 60}} />
                <details>
                    <summary>
                        <h3 style={{opacity: 1.0}}>Debug View</h3>
                    </summary>
                    <Card style={{opacity: 1.0}}>
                        <EsDebugView
                            es={this.props.es}
                            keypair={this.props.keypair}
                            syncer={this.props.syncer}
                            />
                    </Card>
                </details>
            </Stack>
        </Center>
    }
}