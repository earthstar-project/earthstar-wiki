import * as React from 'react';
import {
    IStore,
    Keypair,
    Item,
} from 'earthstar';
import {
    Box,
    Card,
    Cluster,
    FlexItem,
    FlexRow,
    Stack,
} from './layouts';

let log = (...args : any[]) => console.log('WikiView |', ...args);

interface WikiPageProps {
    es : IStore,
    keypair : Keypair,
    currentPageKey : string | null,
}
interface WikiPageState {
    isEditing : boolean;
    editedText : string;
}
export class WikiPageView extends React.Component<WikiPageProps, WikiPageState> {
    constructor(props : WikiPageProps) {
        super(props);
        this.state = {
            isEditing: false,
            editedText: '',
        };
    }
    _startEditing() {
        this.setState({
            isEditing: true,
            editedText: this.props.es.getItem(this.props.currentPageKey || '')?.value || '',
        });
    }
    _save() {
        if (this.props.currentPageKey === null) { return; }
        let ok = this.props.es.set(this.props.keypair, {
            format: 'es.1',
            key: this.props.currentPageKey,
            value: this.state.editedText,
        });
        log('saving success:', ok);
        if (ok) {
            this.setState({
                isEditing: false,
                editedText: '',
            });
        }
    }
    _cancelEditing() {
        this.setState({
            isEditing: false,
            editedText: '',
        });
    }
    render() {
        let es = this.props.es;
        let currentItem : Item | null = this.props.currentPageKey === null
            ? null
            : es.getItem(this.props.currentPageKey) || null;
        if (currentItem === null) {
            return <div className="small"><i>Pick a page to read.</i></div>;
        }
        let currentAuthorName : string = es.getValue('~' + currentItem.author + '/about/name') || (currentItem.author.slice(0, 10) + '...');
        let currentItemTime : string = new Date(currentItem.timestamp/1000).toString().split(' ').slice(0, 5).join(' ');
        let isEditing = this.state.isEditing;
        return <div>
            {isEditing
                ? <div>
                    <button type="button" style={{float: 'right', marginLeft: 10}} onClick={() => this._save()}>Save</button>
                    <button type="button" className="secondary" style={{float: 'right'}} onClick={() => this._cancelEditing()}>Cancel</button>
                </div>
                : <button type="button" style={{float: 'right'}} onClick={() => this._startEditing()}>Edit</button>
            }
            <h2 style={{marginTop: 0, fontFamily: '"Georgia", "Times", serif'}}>
                {decodeURIComponent(currentItem.key.slice(5))}
            </h2>
            <p className="small"><i>
                updated {currentItemTime}<br/>
                by {currentAuthorName}
            </i></p>
            {isEditing
                ? <textarea rows={7}
                    value={this.state.editedText}
                    style={{width: '100%'}}
                    onChange={(e) => this.setState({editedText: e.target.value})}
                    />
                : <p style={{whiteSpace: 'pre-wrap'}}>{currentItem.value}</p>
            }
        </div>;
    }
}

interface WikiProps {
    es : IStore,
    keypair : Keypair,
}
interface WikiState {
    currentPageKey : string | null,
}
export class WikiView extends React.Component<WikiProps, WikiState> {
    constructor(props : WikiProps) {
        super(props);
        this.state = { currentPageKey : null };
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
            currentPageKey: key,
        });
    }
    _newPage() {
        let title = window.prompt('Page title');
        if (title === null) { return; }
        log('_newPage:', title);
        title = encodeURIComponent(title);
        log('_newPage:', title);
        let key = 'wiki/' + title;
        let ok = this.props.es.set(this.props.keypair, {
            format: 'es.1',
            key: key,
            value: '...',
        });
        log('_newPage creation success:', ok);
        this.setState({
            currentPageKey: key,
        });
    }
    render() {
        log('render()');
        let es = this.props.es;
        let wikiItems = es.items({ prefix:'wiki/' }).filter(item => item.value);
        return <FlexRow>
            <FlexItem basis="150px" shrink={0}>
                <Box style={{borderRight: '2px solid #aaa'}}>
                    {wikiItems.map(item =>
                        <div key={item.key}>
                            📄 <a href="#"
                                onClick={() => this._viewPage(item.key)}
                                style={{fontWeight: item.key == this.state.currentPageKey ? 'bold' : 'normal'}}
                                >
                                {decodeURIComponent(item.key.slice(5)) /* remove "wiki/" from title */}
                            </a>
                        </div>
                    )}
                    <p></p>
                    <button type="button" onClick={() => this._newPage()}>New page</button>
                </Box>
            </FlexItem>
            <FlexItem grow={1}>
                <Box>
                    <WikiPageView
                        es={this.props.es}
                        keypair={this.props.keypair}
                        currentPageKey={this.state.currentPageKey}
                        />
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