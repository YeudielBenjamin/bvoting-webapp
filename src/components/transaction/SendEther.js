import React, { Component } from 'react';
import { Form, Message } from "semantic-ui-react";

import Web3, { Wallet } from "../../utils/web3";

export class SendEther extends Component {

    constructor(props){
        super(props);
        this.state = {
            to: process.env.REACT_APP_BVOTING_CONTRACT_ADDRESS + "",
            value: 0,
            txHashSent: "",
            ethSent: false,
            txError: false,
            errorMsg: ""
        }
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.sendEther = this.sendEther.bind(this);
    }

    sendEther(event){
        Web3.eth.sendTransaction({
            from: Wallet[this.props.user.wallet],
            to: this.state.to,
            value: this.state.value * 1e18,
            gas: 4000000,
            gasPrice: 5000000000
        }, (err, response) => {
            if (err){
                console.error(err);
                this.setState({
                    txError: true,
                    errorMsg: err
                });
            } else {
                this.setState({
                    txHashSent: response
                });
                setTimeout(()=>{
                    this.setState({
                        txHashSent: ""
                    });
                }, 3000);
            }
        }).then(
            response => {
                console.log(response);
                this.setState({
                    ethSent: true
                });
                
            },
             error => {
                 console.error(error);
                 this.setState({
                    txError: true,
                    errorMsg: error
                });
             }
        );
        event.preventDefault();
    }

    handleInputChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    
    render() {
        return (
            <Form error={this.state.txError} success={this.state.ethSent} onSubmit={this.sendEther}>
                <Form.Input 
                    type="text"
                    name="to"
                    placeholder="Address to send"
                    onChange={this.handleInputChange}
                />
                <Form.Input 
                    type="number"
                    min="0"
                    name="value"
                    placeholder="Ether to send"
                    onChange={this.handleInputChange}
                />
                <Form.Button 
                    primary
                    type="submit"
                    content="SEND"
                />
                <Message 
                    hidden={this.state.txHashSent === ""}
                    info
                    header='Transaction sent!'
                    content={`Transaction hash: ${this.state.txHashSent}`}/>
                <Message 
                    error
                    header='ERROR!'
                    content={`There was an error trying to send your transactions.\n${this.state.errorMsg}`}/>
                <Message 
                    success
                    header='SUCCESS!'
                    content="Your transactions has been received"/>
            </Form>
        )
    }
};

export default SendEther;
