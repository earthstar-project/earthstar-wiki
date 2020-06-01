import * as React from 'react';
import {
    IStore,
    Keypair,
    Item,
} from 'earthstar';
import {
    Box,
    Card,
    FlexItem,
    FlexRow,
    Stack,
} from './layouts';

let log = (...args : any[]) => console.log('WikiView |', ...args);

interface WikiProps {
    es : IStore,
    keypair : Keypair,
}
interface WikiState {
    currentPage : string | null,
}
export class WikiView extends React.Component<WikiProps, WikiState> {
    constructor(props : WikiProps) {
        super(props);
        this.state = { currentPage : null };
    }
    componentDidMount() {
        this.props.es.onChange.subscribe(() => this.forceUpdate());
    }
    _viewPage(key : string) {
        log('_viewPage', key);
        if (!key.startsWith('wiki/')) {
            console.error('key must start with wiki/', key);
            return;
        }
        this.setState({
            currentPage: key,
        });
    }
    render() {
        log('render()');
        let es = this.props.es;
        let wikiItems = es.items({ prefix:'wiki/' }).filter(item => item.value);
        let currentItem : Item | null = this.state.currentPage === null
            ? null
            : es.getItem(this.state.currentPage) || null;
        let currentAuthorName : string = currentItem === null
            ? ''
            : es.getValue('~' + currentItem.author + '/about/name') || currentItem.author.slice(0, 10) + '...'
        let currentItemTime : string = currentItem === null
            ? ''
            : new Date(currentItem.timestamp/1000)
                .toString()
                .split(' ').slice(0, 5).join(' ');
        return <FlexRow>
            <FlexItem basis="150px" shrink={0}>
                <Box style={{borderRight: '2px solid #aaa'}}>
                    {wikiItems.map(item =>
                        <div key={item.key}>
                            📄 <a href="#"
                                onClick={() => this._viewPage(item.key)}
                                style={{fontWeight: item.key == currentItem?.key ? 'bold' : 'normal'}}
                                >
                                {item.key.slice(5) /* remove "wiki/" from title */}
                            </a>
                        </div>
                    )}
                </Box>
            </FlexItem>
            <FlexItem grow={1}>
                <Box>
                    {currentItem === null
                        ? <i>Pick a page from the left.</i>
                        : <div>
                            <h2 style={{marginTop: 0, fontFamily: '"Georgia", "Times", serif'}}>
                                {currentItem.key.slice(5)}
                            </h2>
                            <p className="small"><i>
                                updated {currentItemTime}<br/>
                                by {currentAuthorName}
                            </i></p>
                            <p style={{whiteSpace: 'pre-wrap'}}>
                                {currentItem.value}
                            </p>
                        </div>
                    }
                </Box>
            </FlexItem>
        </FlexRow>;
    }
}
/*
            <input list="wikipages" />
            <datalist id="wikipages">
                {wikiItems.map(item =>
                    <option key={item.key} value={item.key} />
                )}
            </datalist>
*/