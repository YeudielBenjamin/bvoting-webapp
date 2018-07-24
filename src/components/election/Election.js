import React, { Component } from "react";
import { Grid, Image, Header, Card, Statistic, Button, Message } from 'semantic-ui-react';
import BVotingContract from "../../utils/BVotingContract";
import { Ballot } from "../../utils/BallotContract";
import { Wallet } from "../../utils/web3";

export class Election extends Component{

    constructor(props){
        super(props);
        this.state = {
            selectedUser: {
                address: undefined,
                image: undefined,
                name: undefined,
                bio: undefined,
                votes: 0,
                txHash: "",
                success: false,
                error: false,
                errorMsg: ""
            }
        }
        this.voteFor = this.voteFor.bind(this);
        this.selectCandidate = this.selectCandidate.bind(this);
        this.getName = this.getName.bind(this);
    }

    voteFor(address){
        if (Wallet[0]){
            BVotingContract.methods.voteFor(this.props.election.address, address).send({
                from: Wallet[0].address,
                gas: 4000000,
                gasPrice: 5000000000
            }, (err, res) => {
                if (err){
                    console.log("There was an error");
                    console.error(err);
                    this.setState({
                        error: true,
                        errorMsg: err
                    });
                    setTimeout(()=>{
                        this.setState({
                            error: false,
                            errorMsg: ""
                        });
                    }, 3000);
                } else {
                    console.log(res);
                    this.setState({
                        txHash: res
                    });
                    setTimeout(()=>{
                        this.setState({
                            txHash: ""
                        });
                    }, 3000);
                }
            }).then(
                response => {
                    console.log("Voted");
                    console.log(response);
                    this.setState({
                        success: true
                    });
                    setTimeout(()=>{
                        this.setState({
                            success: false
                        });
                    }, 3000);
                },
                error => {
                    console.log("Error trying to vote");
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
                }
            );
        } else {
            this.setState({
                error: true,
                errorMsg: "You must enter a wallet first"
            });
            setTimeout(()=>{
                this.setState({
                    error: false,
                    errorMsg: ""
                });
            }, 3000);
        }
    }

    selectCandidate(address){
        console.log(this.props.election);
        this.getStats(address);
        for (const user of this.props.users) {
            if(user.key === address){
                this.setState({
                    selectedUser: {
                        address: user.key,
                        image: user.image,
                        name: user.text,
                        bio: user.bio
                    }
                })
            }
            
        }
    }

    getName(address){
        let name = address;
        for (const user of this.props.users) {
            if(user.key === address){
                name = user.text;
            }
        }
        return name;
    }

    getStats(address){
        new Ballot(this.props.election.address)
                .methods
                .candidates(address)
                .call((err, response) =>{
                    if(err){
                        console.error(err);
                    } else {
                        let user = this.state.selectedUser;
                        user.votes = parseInt(response.votes, 10);
                        console.log(response);
                        this.setState({
                            selectedUser: user
                        })
                    }
                });
    }

    render() {
        console.log(this.props.election);
        
        if (this.props.hidden) return null;

        return (
            <Grid celled columns={2}>
                <Grid.Row>
                    <Grid.Column>
                        <Image 
                            src={this.state.selectedUser.image || 'https://react.semantic-ui.com/images/wireframe/image.png'}
                            size='medium'
                            centered />
                        <Header content={
                            this.state.selectedUser.name? 
                            `${this.state.selectedUser.name}`:
                            <a href={"https://etherscan.io/address/" + this.props.election.address} target="_blank">{this.props.election.title}</a> } />
                        <p>
                            {this.state.selectedUser.bio || "Selecciona algún candidato de la lista para ver sus detalles"}
                        </p>
                        {
                            this.state.selectedUser.name? 
                                <Statistic
                                    label='Votes'
                                    value={this.state.selectedUser.votes}/>:null
                        }
                        {
                            this.state.selectedUser.name? 
                                <Button
                                    secondary
                                    content="VOTE"
                                    onClick={()=>this.voteFor(this.state.selectedUser.address)}/>:null
                        }
                    </Grid.Column>
                    <Grid.Column>
                        <Grid columns={2}>
                            {this.props.election.candidates.map(e => {
                                return (
                                    <Grid.Column key={e}>
                                        <Card
                                            header={this.getName(e)}
                                            onClick={() => this.selectCandidate(e)}
                                        />
                                    </Grid.Column>)
                            })}
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                    <Message
                        hidden={!this.state.txHash}
                        info
                        header='Transaction sent!'
                        content={`Transaction hash: ${this.state.txHash}`} />
                    <Message 
                        hidden={!this.state.success}
                        success
                        header="Success!"
                        content="Voted successfully"/>
                    <Message
                        hidden={!this.state.error}
                        error
                        header='ERROR!'
                        content={this.state.errorMsg} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    };
}