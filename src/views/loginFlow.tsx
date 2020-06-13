import * as React from 'react';
import {
    Card,
    Stack,
} from './layouts';

let logLogin = (...args : any[]) => console.log('Login |', ...args);

type LoginPage =
      'LANDING'
    | 'START_WORKSPACE'
    | 'JOIN_WORKSPACE'
    | 'CREATE_OR_LOGIN_USER'
    | 'CREATE_USER';

interface LoginFlowProps {
}
interface LoginFlowState {
    page : LoginPage;
    history : LoginPage[];  // from oldest to newest, not counting current page
}
export class LoginFlow extends React.Component<LoginFlowProps, LoginFlowState> {
    constructor(props : LoginFlowProps) {
        super(props);
        this.state = {
            page: 'LANDING',
            history: [],
        };
    }
    goto(page : LoginPage) {
        logLogin('goto ' + page);
        if (this.state.page === page) { return; }
        this.setState({
            page: page,
            history: [...this.state.history, this.state.page],
        });
    }
    back() {
        if (this.state.history.length === 0) { return; }
        logLogin('back to ' + this.state.history[this.state.history.length-1]);
        this.setState({
            page: this.state.history[this.state.history.length-1],
            history: this.state.history.slice(0, -1),
        });
    }
    render() {
        if (this.state.page === 'LANDING') {
            return <LoginLandingView api={this} />
        } else if (this.state.page === 'START_WORKSPACE') {
            return <LoginStartWorkspace api={this} />
        } else if (this.state.page === 'JOIN_WORKSPACE') {
            return <LoginJoinWorkspace api={this} />
        } else if (this.state.page === 'CREATE_OR_LOGIN_USER') {
            return <LoginCreateOrLoginUser api={this} />
        } else if (this.state.page === 'CREATE_USER') {
            return <LoginCreateUser api={this} />
        } else {
            return <div>
                <h3>ERROR</h3>
                <p>unknown login page: <code>{this.state.page}</code></p>
                <p><a href="#" onClick={() => this.back()}>go back</a></p>
            </div>
        }
    }
}

export const LoginLandingView : React.FunctionComponent<{ api : LoginFlow }> = (props) =>
    <Stack>
        <div>
            <img src="/static/img/earthstar-pal-transparent.png" style={{width: 100}} />
        </div>
        <h2>Earthstar Wiki</h2>
        <div>
            <button type="button"
                onClick={() => props.api.goto('START_WORKSPACE')}
                >
                Start a new workspace
            </button>
        </div>
        <div>
            <button type="button"
                onClick={() => props.api.goto('JOIN_WORKSPACE')}
                >
                Join a workspace
            </button>
        </div>
        <p>A <b>workspace</b> is a collection of documents.  It can be accessed by anyone who knows the workspace name.</p>
    </Stack>

export const LoginStartWorkspace : React.FunctionComponent<{ api : LoginFlow }> = (props) =>
    <Stack>
        <div><a href="#" onClick={() => props.api.back()}>&larr;</a></div>
        <h2>Start a new workspace</h2>
        <h3>Workspace name</h3>
        <p>Choose a name up to 15 characters long.  Only letters, numbers, and dashes.</p>
        <input type="text" defaultValue="garden-club"/>
        <p>
            A random number is added to the end to make it harder to guess.
            Now's your chance to <a href="">change the random number</a> if you don't like it.
        </p>
        <p>
            The full workspace name will be:
        </p>
        <pre>
            //garden-club.xxxxxxxxxxxxxxxxxxxx
        </pre>
        <div>
            <button type="button"
                onClick={() => props.api.goto('CREATE_USER')}
                >
                Create workspace
            </button>
        </div>
    </Stack>

export const LoginJoinWorkspace : React.FunctionComponent<{ api : LoginFlow }> = (props) =>
    <Stack>
        <div><a href="#" onClick={() => props.api.back()}>&larr;</a></div>
        <h2>Join a workspace</h2>
        <h3>Workspace name</h3>
        <p>Paste the full workspace name here including the random number.</p>
        <input type="text" defaultValue="//garden-club.xxxxxxxxxxxxxxxxxxxx"/>
        <div>
            <button type="button"
                onClick={() => props.api.goto('CREATE_OR_LOGIN_USER')}
                >
                Join
            </button>
        </div>
    </Stack>

export const LoginCreateOrLoginUser : React.FunctionComponent<{ api : LoginFlow }> = (props) =>
    <Stack>
        <div><a href="#" onClick={() => props.api.back()}>&larr;</a></div>
        <p>Welcome to</p>
        <h2>//garden-club.xxxxxxxxxxxxxxxxxxxx</h2>
        <div>
            <button type="button"
                onClick={() => props.api.goto('CREATE_USER')}
                >
                Create a new user account
            </button>
        </div>
        <div>
            <button type="button"
                disabled
                >
                Log into user account
            </button>
        </div>
    </Stack>

export const LoginCreateUser : React.FunctionComponent<{ api : LoginFlow }> = (props) =>
    <Stack>
        <div><a href="#" onClick={() => props.api.back()}>&larr;</a></div>
        <h2>Create a new user account</h2>

        <h3>Display Name</h3>
        <p>Can include spaces, emojis, anything you want.  You can change this later.</p>
        <input type="text" defaultValue="Squirrel Friend"/>

        <h3>Username</h3>
        <p>Exactly four letters.  This can never be changed.</p>
        <input type="text" defaultValue="sqrl"/>

        <p>
            Your full username will include a random number.
            Now's your chance to <a href="">change the random number</a> if you don't like it.
        </p>
        <p>Your full username will be:</p>
        <pre>
            @sqrl.FHqQxk3J7Ls5fBbQpvk71DALYFGnoeNDGtiJqhLnUpJr
        </pre>
        <div>
            <button type="button"
                disabled
                >
                Create user
            </button>
        </div>
    </Stack>
