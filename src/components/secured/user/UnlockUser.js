import React, { Component } from "react";
import { Form, Message, TextArea } from "semantic-ui-react";
import { Wallet } from "../../../utils/web3";
import BVotingContract from "../../../utils/BVotingContract";

import "./UnlockUser.css";

export class UnlockUser extends Component{

    constructor(props){
        super(props);
        this.state = {
            address: "",
            name: "",
            bio: "",
            image: "",
            error: false,
            success: false,
            errorMsg: "",
            txHash: ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.unlockUser = this.unlockUser.bind(this);
    }

    unlockUser(event){
        // Address, name, surname, electorCode
        BVotingContract.methods.unlockUser(this.state.address, this.state.name, this.state.bio, this.state.image).send({
            from: Wallet[0].address,
            gas: 4000000,
            gasPrice: 5000000000
        }, (err, res)=>{
            if (err){
                this.setState({
                    error: true,
                    errorMsg: err
                });
            } else {
                this.setState({
                    txHash: res
                });
            }
            console.log("RESPONSE", res);
            
            setTimeout(()=>{
                this.setState({
                    txHash: "",
                    error: false,
                    errorMsg: ""
                });
            }, 3000);
            
        }).then(response => {
            console.log("Mined <=>");
            console.log(response);
            this.props.onUserUnlocked({user: response.events.userUnlocked.returnValues[0]});
            this.setState({
                success: true
            });
            setTimeout(()=>{
                this.setState({
                    success: false
                });
            },3000);
        }).catch( error => {
            console.log("Not mined");
            console.error(error);
            this.setState({
                error: true,
                errorMsg: error
            });
            setTimeout(()=>{
                this.setState({
                    error: false,
                    errorMsg: ""
                });
            }, 3000);
        });
        event.preventDefault();
    }

    handleInputChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render(){
        return (
            <Form error={this.state.error} success={this.state.success} onSubmit={this.unlockUser}>
                <Form.Input 
                    type="text"
                    name="address"
                    placeholder="User Address"
                    onChange={this.handleInputChange}
                />
                <Form.Input 
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={this.handleInputChange}/>
                <Form.Input
                    name="image"
                    type="text"
                    placeholder="Image"
                    onChange={this.handleInputChange}/>
                <TextArea 
                    name="bio"
                    autoHeight
                    placeholder="Bio"
                    onChange={this.handleInputChange}/>
                <Form.Button
                    className="unlockUserBtn"
                    primary
                    type="submit"
                    content="UNLOCK"
                    disabled={this.state.address === "" || this.state.name === "" || this.state.bio === "" || this.state.image === ""}/>
                <Message
                    hidden={this.state.txHash === ""}
                    info
                    header='Transaction sent!'
                    content={`Transaction hash: ${this.state.txHash}`} />
                <Message 
                    success
                    header="Success!"
                    content="User unlocked"/>
                <Message
                    error
                    header='ERROR!'
                    content={this.state.errorMsg} />
            </Form>
        )
    }
}