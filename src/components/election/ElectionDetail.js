import React, { Component } from "react";
import { Icon, Item, Modal, Button } from 'semantic-ui-react';
import BVotingContract from "../../utils/BVotingContract";
import { Wallet } from "../../utils/web3";

export class ElectionDetail extends Component{

    constructor(props){
        super(props);

        this.voteFor = this.voteFor.bind(this);
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

    render(){
        if (this.props.hidden) return null;
        return (
            <Item>
                <Item.Image size='small' src='https://react.semantic-ui.com/assets/images/wireframe/image.png' />

                <Item.Content>
                    <Item.Header>{this.props.title}</Item.Header>
                    {
                        this.props.candidates.map( c => {
                            return (
                                <Item.Extra key={c}>
                                    <Icon color='green' name='check' />{c}
                                    <Modal trigger={<Button>Vote</Button>} basic size='small'>
                                        <Modal.Content>
                                        <p>Your going to vote for {c}, are you sure?</p>
                                        </Modal.Content>
                                        <Modal.Actions>
                                        <Button basic color='red' inverted>
                                            <Icon name='remove' /> No
                                        </Button>
                                        <Button color='green' inverted onClick={this.voteFor(c)}>
                                            <Icon name='checkmark' /> Yes
                                        </Button>
                                        </Modal.Actions>
                                    </Modal>
                                </Item.Extra>
                            )
                        })
                    }
                </Item.Content>
            </Item>
        )
    }
}