import React, { Component } from "react";
import { Card } from 'semantic-ui-react';
import BVotingContract from "../../utils/BVotingContract";
import { Wallet } from "../../utils/web3";

export class ElectionDetail extends Component{

    constructor(props){
        super(props);

        this.voteFor = this.voteFor.bind(this);
        this.selectedElection = this.selectedElection.bind(this);
    }

    voteFor(address){
        BVotingContract.methods.voteFor(this.props.contractAddress, address).send({
            from: Wallet[0].address,
            gas: 4000000,
            gasPrice: 5000000000
        }).then(response => {
            console.log("Voted");
            console.log(response);
        })
    }

    selectedElection(){
        console.log(":v");
        this.props.onSelectedElection({"address": this.props.contractAddress})
    }

    render(){
        return (
            <Card
                header={this.props.title}
                onClick={this.selectedElection}
            />
        )
    }
}