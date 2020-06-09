import * as React from 'react';
import {
    Card,
    Stack,
} from './layouts';


type LoginPage =
      'LANDING'
    | 'START_WORKSPACE'
    | 'CREATE_USER';

interface LoginFlowProps {
}
interface LoginFlowState {
    page : LoginPage;
}
export class LoginFlow extends React.Component<LoginFlowProps, LoginFlowState> {
    constructor(props : LoginFlowProps) {
        super(props);
        this.state = {
            page: 'LANDING',
        };
    }
    goto(page : LoginPage) {
        this.setState({ page : page });
    }
    render() {
        if (this.state.page === 'LANDING') {
            return <LoginLandingView api={this} />
        } else if (this.state.page === 'START_WORKSPACE') {
            return <LoginStartWorkspace api={this} />
        } else if (this.state.page === 'CREATE_USER') {
            return <LoginCreateUser api={this} />
        } else {
            throw 'unknown login page: ' + this.state.page;
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
                disabled
                >
                Join a workspace
            </button>
        </div>
        <p>A <b>workspace</b> is a collection of documents and people.</p>
    </Stack>

export const LoginStartWorkspace : React.FunctionComponent<{ api : LoginFlow }> = (props) =>
    <Stack>
        <div><a href="#" onClick={() => props.api.goto('LANDING')}>&larr;</a></div>
        <h2>Start a new workspace</h2>
        <h3>Choose a workspace name</h3>
        <p>Up to 15 characters long.  Only letters, numbers, and dashes.</p>
        <input type="text" value="garden-club"/>
        <p>
            A random number is added to the end to make it harder to guess.
            The full workspace name will be:
        </p>
        <pre>
            //garden-club.qp49fjq04f9qj04f9jq04f9jq0f9fj
        </pre>
        <div>
            <a href="#">
                Change the random number
            </a>
        </div>
        <div>
            <button type="button"
                onClick={() => props.api.goto('CREATE_USER')}
                >
                Create workspace
            </button>
        </div>
    </Stack>

export const LoginCreateUser : React.FunctionComponent<{ api : LoginFlow }> = (props) =>
    <Stack>
        <div><a href="#" onClick={() => props.api.goto('START_WORKSPACE')}>&larr;</a></div>
        <h2>Create a new user</h2>

        <h3>Display name</h3>
        <p>Spaces, emojis, anything you want</p>
        <input type="text" value="Squirrel Friend"/>

        <h3>Abbreviation</h3>
        <p>Four letters or numbers</p>
        <input type="text" value="sqrl"/>

        <p>Your full username will be:</p>
        <pre>
            @sqrl.FHqQxk3J7Ls5fBbQpvk71DALYFGnoeNDGtiJqhLnUpJr
        </pre>
        <div>
            <a href="#">
                Change the random number
            </a>
        </div>
        <div>
            <button type="button"
                disabled
                >
                Create user
            </button>
        </div>
    </Stack>
