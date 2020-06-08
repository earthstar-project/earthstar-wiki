import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    StoreMemory,
    IStore,
    ValidatorEs1,
    Crypto,
    Keypair,
} from 'earthstar';
import {
    Card,
    Center,
    Cluster,
    Stack,
    FlexRow,
    FlexItem,
} from './layouts';
import { AboutLayer } from './layerAbout';
import { WikiLayer } from './layerWiki';
import { Syncer } from './sync';
import { SyncButton } from './syncButton';
import { EsDebugView } from './esDebugView';
import { WikiView } from './wikiView';

//================================================================================
// APP VIEW

let logApp = (...args : any[]) => console.log('AppView | ', ...args);
interface AppViewProps {
    es : IStore,
    keypair : Keypair,
    wikiLayer : WikiLayer,
    aboutLayer : AboutLayer,
    syncer : Syncer,
}
interface AppViewState {
}
class AppView extends React.Component<AppViewProps, AppViewState> {
    constructor(props : AppViewProps) {
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
                            <img src="static/img/earthstar-pal-transparent.png"
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

//================================================================================
// SET UP DEMO CONTENT

let workspace = 'demo';
let es = new StoreMemory([ValidatorEs1], workspace);
// let demoKeypair = Crypto.generateKeypair();
let demoKeypair = {
    public: "@mVkCjHbAcjEBddaZwxFVSiQdVFuvXSiH3B5K5bH7Hcx",
    secret: "6DxjAHzdJHgMvJBqgD4iUNhmuwQbuMzPuDkntLi1sjjz"
}

let wikiLayer = new WikiLayer(es, demoKeypair);
let aboutLayer = new AboutLayer(es, demoKeypair);

// use an old time so we don't keep overwriting stuff with our demo content
// one year ago
let now = (Date.now() - 1000 * 60 * 60 * 24 * 7 * 52) * 1000;
aboutLayer.setMyAuthorName('Example Wiki Author', now);
wikiLayer.setPageText(WikiLayer.makeKey('Bumblebee', 'shared'), 'Buzz buzz buzz', now);
wikiLayer.setPageText(WikiLayer.makeKey('Duck', 'shared'), 'Quack quack quack', now);
wikiLayer.setPageText(WikiLayer.makeKey('Fish Of The Deep Sea', 'shared'), '🐟🐠\n           🐙\n    🐡', now);

let syncer = new Syncer(es);
syncer.addPub('http://localhost:3333/earthstar/');
syncer.addPub('http://167.71.153.73:3333/earthstar/');  // this only works when the wiki page is http, not https
syncer.addPub('https://cinnamon-bun-earthstar-pub3.glitch.me/earthstar/');

//================================================================================
// MAIN

ReactDOM.render(
    <AppView es={es} keypair={demoKeypair} syncer={syncer} wikiLayer={wikiLayer} aboutLayer={aboutLayer} />,
    document.getElementById('react-slot')
);
