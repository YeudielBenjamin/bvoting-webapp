import Web3 from "./web3";
import ballot from "../contracts/Ballot.json";

export class Ballot{
    constructor(address){
        return new Web3.eth.Contract(ballot.abi, address);
    }
}

export default Ballot;