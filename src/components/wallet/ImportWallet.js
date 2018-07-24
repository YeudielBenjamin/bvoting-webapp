import React, { Component } from "react";
import { Form , Message } from "semantic-ui-react";
import { Wallet, Accounts } from "../../utils/web3";
import BVotingContract from "../../utils/BVotingContract";

export class ImportWallet extends Component{

    constructor(props){
        super(props);
        this.state = {
            privateKey: "",
            password: "",
            hasError: false,
            errorMsg: ""
        }
        this.handleInput = this.handleInput.bind(this);
        this.importWallet = this.importWallet.bind(this);
    }

    handleInput(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    saveWallet(account){
        Wallet.add(account);
        if (localStorage){
            let savedWallets = localStorage.getItem("savedWallets");
            if (!savedWallets){
                savedWallets = 0;
            }
        }

    }

    importWallet(event){
        let privateKey = this.state.privateKey; 
        if(/^(0x)?[\da-f]{64}$/i.test(privateKey)){
            if (privateKey.length === 64) privateKey = "0x" + privateKey;
            let account = Accounts.privateKeyToAccount(privateKey);
            this.saveWallet(account);
            BVotingContract.methods.admins(account.address).call((err, isAdmin) => {
                if (err){
                    this.setState({
                        hasError: true,
                        errorMsg: "Couldn't connect to blockchain.\n" + err
                    })
                    console.error(err);
                } else {
                    if (isAdmin){
                        this.props.user.isAdmin = true;
                        this.props.onUserChange({
                            isAdmin: true,
                            permission: 0,
                            wallet: Wallet.length - 1,
                            address: account.address
                        });
                    } else {
                        BVotingContract.methods.users(account.address).call((err, user) => {
                            if (err){
                                this.setState({
                                    hasError: true,
                                    errorMsg: "Couldn't connect to blockchain.\n" + err
                                })
                                console.error(err);
                            } else {
                                console.log(user);
                                this.props.onUserChange({
                                    isAdmin: false,
                                    permission: user.permission,
                                    wallet: Wallet.length - 1,
                                    address: account.address
                                });
                            }
                        });
                    }
                }
            });

            this.setState({
                hasError: false,
                errorMsg: ""
            });
        } else {
            this.setState({
                hasError: true,
                errorMsg: "Please enter a valid private key."
            });
        }

        privateKey = "";
        event.preventDefault();
    }

    render(){
        return (
            <Form error={this.state.hasError} onSubmit={this.importWallet}>
                <Form.Input 
                    name="privateKey"
                    type="text"
                    placeholder="Private Key"
                    autoComplete="off"
                    value={this.state.privateKey}
                    onChange={this.handleInput}/>
                <Form.Input 
                    name="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="off"
                    value={this.state.password}
                    onChange={this.handleInput}/>
                <Form.Button
                    primary
                    fluid
                    type="submit"
                    content="IMPORT"
                    disabled={this.state.password === ""}/>
                <Message 
                    error
                    header='Error'
                    content={this.state.errorMsg}/>
            </Form>
        );
    }
}