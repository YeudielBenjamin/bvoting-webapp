import Web3 from 'web3';



var Provider = new Web3.providers.HttpProvider(process.env.REACT_APP_WEB3_HTTP_PROVIDER);
//var Provider = new Web3.providers.WebsocketProvider(process.env.REACT_APP_WEB3_WEBSOCKET_PROVIDER);
var web3 = new Web3(Provider);
var Wallet = web3.eth.accounts.wallet;
var Accounts = web3.eth.accounts;



Wallet.save = function(password, keyName, callback) {
    if (callback){
        callback(this.encrypt(password));
    } else {
        if(localStorage){
            localStorage.setItem(keyName || this.defaultKeyName, JSON.stringify(this.encrypt(password)));
        }
    }
}


Wallet.load = function (password, keyName, callback) {
    var keystore;
    if (callback){
        keystore = callback();
    } else {
        keystore = localStorage.getItem(keyName || this.defaultKeyName);
    }
    if (keystore) {
        try {
            keystore = JSON.parse(keystore);
        } catch(e) {

        }
    }

    return this.decrypt(keystore || [], password);
};

export default web3

export {
    Accounts,
    Provider,
    Wallet
}
