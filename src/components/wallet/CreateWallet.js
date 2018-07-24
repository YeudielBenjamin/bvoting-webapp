import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import Web3, { Wallet } from "../../utils/web3";

export class CreateWallet extends Component{

    constructor(props){
        super(props);

        this.state = {
            password: "",
            creatingWallet: false
        }
        this.createWallet = this.createWallet.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }


    createWallet(){
        Promise.resolve().then(()=> {
            let address = Web3.eth.accounts.create(Web3.utils.randomHex(32));
            Wallet.add(address);
            
        });
    }

    handleInput(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render(){
        return (
            <Form onSubmit={this.createWallet} loading={this.state.creatingWallet} >
                <Form.Input
                    name="password"
                    placeholder="Password"
                    type="password"
                    autoComplete="off"
                    onChange={this.handleInput}/>
                <Form.Button
                    primary
                    fluid
                    content="Create"
                    type="submit"
                    disabled={this.state.password.length <= 0}/>
            </Form>
        )
    }
}

export default CreateWallet