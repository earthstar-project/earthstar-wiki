import deepEqual = require('fast-deep-equal');

import { Keypair } from 'earthstar';
import { Emitter } from '../helpers/emitter';

export interface Account {
    workspace : string;
    user : Keypair;
}

export class AccountStore {
    accounts : Account[] = [];
    currentAccount : Account | null = null;
    onChange : Emitter<undefined> = new Emitter<undefined>();
    setCurrentAccount(account : Account | null) {
        this.currentAccount = account;
        this.onChange.send(undefined);
    }
    addAccount(account : Account) {
        for (let acc of this.accounts) {
            if (deepEqual(acc, account)) { return; }
        }
        this.accounts.push(account);
        this.accounts.sort((a : Account, b : Account) => {
            if (a.workspace < b.workspace) { return -1; }
            if (a.workspace > b.workspace) { return 1; }
            if (a.user.public < b.user.public) { return -1; }
            if (a.user.public > b.user.public) { return 1; }
            if (a.user.secret < b.user.secret) { return -1; }
            if (a.user.secret > b.user.secret) { return 1; }
            return 0;
        });
        this.onChange.send(undefined);
    }
    deleteAccount(account : Account) {
        this.accounts = this.accounts.filter(acc => acc !== account);
        this.onChange.send(undefined);
    }
}
