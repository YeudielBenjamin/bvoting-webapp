import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import { Wallet } from "../../../utils/web3";
import BVotingContract from "../../../utils/BVotingContract";

export class UnlockUser extends Component{

    constructor(props){
        super(props);
        this.state = {
            address: ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.unlockUser = this.unlockUser.bind(this);
    }

    unlockUser(event){
        BVotingContract.methods.unlockUser(this.state.address, "", "", "").send({
            from: Wallet[0].address,
            gas: 4000000,
            gasPrice: 5000000000
        }).then(response => {
            console.log("Mined");
            console.log(response);
        }).catch( error => {
            console.log("Not mined");
            console.error(error);
        });
        event.preventDefault();
    }

    handleInputChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render(){
        if (this.props.hidden) return null;
        return (
            <Form onSubmit={this.unlockUser}>
                <Form.Input 
                    type="text"
                    name="address"
                    placeholder="User Address"
                    onChange={this.handleInputChange}
                />
                <Form.Button 
                    primary
                    type="submit"
                    content="UNLOCK"
                />
            </Form>
        )
    }
}