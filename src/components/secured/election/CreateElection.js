import React, { Component } from "react";
import { Form, Dropdown } from "semantic-ui-react";
import { Wallet } from "../../../utils/web3"
import BVotingContract  from "../../../utils/BVotingContract";

export class CreateElection extends Component{

    constructor(props){
        super(props);

        this.state = {
            candidates: [],
            title: "",
            value: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.createElection = this.createElection.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
    }

    componentWillMount() {
        /*let wallet = localStorage.getItem("wallet");
        wallet = JSON.parse(wallet);
        console.log(wallet);*/

        //let decrypted = Web3.eth.accounts.decrypt(wallet, "hello");
        //Web3.eth.accounts.wallet.add(decrypted);
        //Web3.eth.personal.importRawKey(decrypted.privateKey, "hello");
        /*Contract.methods.users("0x627306090abab3a6e1400e9345bc60c78a8bef57").call(function(err, result){
            if (err){
                console.log("Error getting users");
                console.error(err);
            } else {
                console.log("User: " + result);
            }
        });*/
        

        //decrypted.signTransaction(tx).then(


        /*BVotingContract.events.electionCreated((err, event) => {
            if (err){
                console.log("Error on event >:v");
                console.error(err);
            } else {
                console.log("The event >:V");
                console.log(event);
            }
        })
        .on('data', data => {
            console.log("An event!");
            console.log(data.returnValues);

            let ballotFromEvent = new Ballot(data.returnValues.electionContract);
            ballotFromEvent.methods.candidatesQty().call((err, response) => {
                if (err){
                    console.log("Error while trying to read candidates");
                    console.error(err);
                } else {
                    console.log("Candidates:");
                    console.log(response);
                }
            })

        })
        .on('changed', function(event){
            console.log("An event changed!");
            console.log(event); 
        })
        .on('error', error => {
            console.log("Error on events :'v");
            console.error(error); 
        });*/

        /*let ballot = new Ballot("0xf42c52aecb08872680ca7684673d2fd15547ec2d");
        ballot.methods.candidatesQty().call((err, response) => {
            if (err){
                console.log("Error while trying to read candidates");
                console.error(err);
            } else {
                console.log("Candidates:");
                console.log(response);
            }
        })

        BVotingContract.getPastEvents("allEvents", {
            fromBlock: 2157227,
            toBlock: "latest"
        }).then(
            pastEvents => {
                console.log("All past events: ");
                pastEvents.forEach(event => {
                    console.log(event.event);
                    console.log(event.returnValues);
                });
                
                
            }
        ).catch(error => {
            console.log("There was an error with events :'v");
            console.error(error);
        });*/
    }

    
    
    createElection(){
        BVotingContract.methods.createElection(this.state.value,1525330765302,this.state.title).send({
            from: Wallet[0].address,
            gas: 4000000,
            gasPrice: 5000000000
        })
        .then(function(receipt){
            console.log("Mined");
            console.log(`\tResponse =>`);
            console.log(receipt);
            console.log("Smart contract address: " + receipt.contractAddress);
            
        })
        .catch(
            error => {
                console.log("Error:");
                console.error(error);
            }
        );

        //tx.to = BVotingContract._address;

        //console.log("Unsigned transaction:");
        //console.log(tx);

        /*Web3.eth.sendTransaction(tx)
            .once('transactionHash', hash => {
                console.log(`Transaction received [TxHash: ${hash}]`)
            })
            .once('receipt', receipt => {
                console.log("Received");
            })
            .on('confirmation', (confNumber, receipt) => {
                console.log(`Confirmed [confirmation: ${confNumber}]`);
            })
            .on('error', error => {
                console.log("ERROR :'v");
                console.error(error);
            })
            .then(function(receipt){
                console.log("Mined");
                console.log(`\tResponse =>`);
                console.log(receipt);
                console.log("Smart contract address: " + receipt.contractAddress);
                
            })
            .catch(
                error => {
                    console.log("Error:");
                    console.error(error);
                }
            );*/
        

        // 0x405aA3a3F22B6C085efEA1e71fA482DFb719bE26 0x4Fe7077c75B97473afF402c9A1e58DC96a628774

        



        /*createdAccount.signTransaction(tx).then(
            transaction => {

                console.log("Signed transaction:");
                console.log(transaction);
                

                Web3.eth.sendSignedTransaction(transaction.rawTransaction)
                    .once('transactionHash', hash => {
                        console.log(`Transaction received [TxHash: ${hash}]`)
                    })
                    .once('receipt', receipt => {
                        console.log("Received");
                    })
                    .on('confirmation', (confNumber, receipt) => {
                        console.log(`Confirmed [confirmation: ${confNumber}]`);
                    })
                    .on('error', error => {
                        console.log("ERROR :'v");
                        console.error(error);
                    })
                    .then(function(receipt){
                        console.log("Mined");
                        console.log(`\tResponse =>`);
                        console.log(receipt);
                        console.log("Smart contract address: " + receipt.contractAddress);
                        
                    }); 
            }
        ).catch(
            error => {
                console.log("Error:");
                console.error(error);
            }
        ); */
    }

    handleChange(event){
        let name = event.target.name;
        let value = event.target.value;
        
        this.setState({
            [name]: value
        });
    }
    
    //handleChange = (e, { value }) => this.setState({ value });
    handleDropdownChange = (e, { value }) => this.setState({ value })

    render(){
        if (this.props.hidden) return null;
        return (
            <Form onSubmit={this.createElection}>
                <Form.Group widths="equal"> 
                    <Form.Field>
                        <label>Candidates</label>
                        <Dropdown 
                            name="candidates"
                            placeholder="Candidates"    
                            multiple
                            search
                            selection
                            value={this.state.value}
                            onChange={this.handleDropdownChange}
                            options={this.props.users}/>
                    </Form.Field>
                    <Form.Input 
                        name="title"
                        fluid 
                        label="Election title" 
                        placeholder='Election title'
                        onChange={this.handleChange}
                        value={this.state.title}/>
                </Form.Group>
                <Form.Button 
                    primary
                    content="Create election"
                    type="submit"/>
            </Form>
        );
    }
}