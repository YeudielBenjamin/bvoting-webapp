import BVoting from "../contracts/BVoting.json";
import Web3 from "./web3";


var BVotingContract = new Web3.eth.Contract(BVoting.abi, process.env.REACT_APP_BVOTING_CONTRACT_ADDRESS);

export default BVotingContract;