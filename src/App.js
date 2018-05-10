import React, { Component } from 'react';
import { Navbar } from "./components/navbar/Navbar";
import { UnlockUser } from "./components/secured/user/UnlockUser";
import { CreateElection } from "./components/secured/election/CreateElection";
import { ElectionList } from "./components/election/ElectionList";
import Web3, { Wallet } from './utils/web3';
import BVotingContract from "./utils/BVotingContract";
//import instantiateContract from "./utils/instantiateContract";
//import BVotingArtifact from "./contracts/BVoting.json";
import './App.css';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      user: {
        isAdmin: false,
        permission: 0
      },
      users: [],
      elections: []
    };

    this.userChanged = this.userChanged.bind(this);
    this.userUnlocked = this.userUnlocked.bind(this);
    this.electionCreated = this.electionCreated.bind(this);
    this.voted = this.voted.bind(this);
  }

  userChanged(user){
    console.log(user);
    this.setState({
      user
    });
  }
  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    if (process.env.NODE_ENV === "development"){
      window.w3 = Web3;
    }
    
    if (process.env.NODE_ENV !== "production"){
      let host = Web3.currentProvider.host || Web3.currentProvider.connection.url;
      console.log(`Using Web3 v${Web3.version} over ${host}`);
    }

    BVotingContract.getPastEvents("allEvents", {
      fromBlock: 2216307
    }, (err, response) => {
      if(err){
        console.error(err);
      } else {
        response.forEach((value, index) => {
          switch(value.event){
            case "userUnlocked":    this.userUnlocked(value.returnValues);    break;
            case "electionCreated": this.electionCreated(value.returnValues); break;
            case "voted":           this.voted(value.returnValues);           break;
            default: break;
          }
        });
      }
    });

    let savedWallets = Wallet.load("12345678");
    console.log(savedWallets);
  }

  userUnlocked(event){
    let userPublicKey = event.user;
    let users = this.state.users;
    users.push({ 
      key: userPublicKey, 
      value: userPublicKey, 
      text: userPublicKey });
    this.setState({users});
    
  }

  electionCreated(event){
    let elections = this.state.elections;
    let election = {
      candidates: event.candidates,
      address: event.electionContract,
      title: event.title
    };
    elections.push(election);
    this.setState({elections});
  }

  voted(event){
    console.log(event.from + " voted for " + event.votedFor + " at " + event.electionTo);

  }

  render() {
    
    return (
      <div className="App">
        <Navbar
          wallets={[]}
          user={this.state.user} 
          onUserChange={this.userChanged}/>
        <UnlockUser 
          hidden={!this.state.user.isAdmin} />
        <CreateElection 
          users={this.state.users}
          hidden={!this.state.user.isAdmin}/>
        <ElectionList
          hidden={this.state.user.permission !== 1}
          elections={this.state.elections}/>
      </div>
    );
  }
}

export default App;
