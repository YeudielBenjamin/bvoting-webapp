import React, { Component } from 'react';
import { Navbar } from "./components/navbar/Navbar";
import { ElectionList } from "./components/election/ElectionList";
import { Election } from "./components/election/Election";
import Web3 from './utils/web3';
import BVotingContract from "./utils/BVotingContract";
import './App.css';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      user: {
        isAdmin: false,
        permission: 0,
        wallet: undefined
      },
      users: [],
      elections: [],
      wallets: [],
      selectedElection: undefined
    };

    this.userChanged = this.userChanged.bind(this);
    this.userUnlocked = this.userUnlocked.bind(this);
    this.electionCreated = this.electionCreated.bind(this);
    this.voted = this.voted.bind(this);
    this.showElection = this.showElection.bind(this);
  }

  userChanged(user){
    console.log("Logged in new user");
    console.log(user);
    this.setState({
      user
    });
  }
  componentWillMount() {
    if (process.env.NODE_ENV === "development"){
      window.w3 = Web3;
    }
    
    if (process.env.NODE_ENV !== "production"){
      let host = Web3.currentProvider.host || Web3.currentProvider.connection.url;
      console.log(`Using Web3 v${Web3.version} over ${host}`);
    }

    BVotingContract.getPastEvents("allEvents", {
      fromBlock: 0
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
  }

  userUnlocked(event){
    console.log(event.user);
    let userPublicKey = event.user;
    BVotingContract.methods.users(userPublicKey).call((err, user) => {
      if(err){
        console.error(err);
      } else {
        console.log("User", user);
        let users = this.state.users;
        users.push({ 
          key: userPublicKey, 
          value: userPublicKey, 
          description: userPublicKey.substr(0, 10) + "..." + userPublicKey.substr(36),
          text: user.name,
          bio: user.surname,
          image: user.electorCode });
        this.setState({users});
      }
    });
  }

  electionCreated(event){
    let elections = this.state.elections;
    let election = {
      candidates: event.candidates,
      address: event.electionContract,
      title: event.title
    };
    console.log("New election:");
    console.log(election);
    elections.push(election);
    this.setState({elections});
  }

  voted(event){
    console.log(event.from + " voted for " + event.votedFor + " at " + event.electionTo);
  }

  showElection(election){
    console.log(this.state.elections);
    
    for (let i = 0; i < this.state.elections.length; i++) {
      let temp = this.state.elections[i];
      if (temp.address === election.address){
        console.log(temp);
        
        this.setState({selectedElection: temp});
      }
      
    }
  }

  render() {
    
    return (
      <div className="App">
        <Navbar
          wallets={[]}
          elections={this.state.elections}
          user={this.state.user} 
          users={this.state.users}
          userUnlocked={this.userUnlocked}
          onUserChange={this.userChanged}
          onElectionSelected={this.showElection}
          />
        <div className="main-content">
          <div>
            <h1>¡Bienvenido al sistema de voto en línea!</h1>
            <p>
              Basado en la tecnología <em>blockchain</em> ahora <br />
              podrás realizar seguramente tus votos desde <br />
              la comodidad de tu ordenador.
            </p>
          </div>
        </div>
        <div className="myContainer">
          <ElectionList
            elections={this.state.elections}
            onSelectedElection={this.showElection}/>
          <Election
            hidden={this.state.selectedElection === undefined}
            users={this.state.users}
            election={this.state.selectedElection}
          />
        </div>
      </div>
    );
  }
}

export default App;
