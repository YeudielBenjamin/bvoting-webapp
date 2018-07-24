import React, { Component } from "react";
import { ElectionDetail } from "./ElectionDetail";

export class ElectionList extends Component{

    render(){
        if (this.props.hidden) return null;

        return (
            this.props.elections.map(e => {
                return (<ElectionDetail 
                  title={e.title}
                  candidates={e.candidates}
                  contractAddress={e.address}
                  key={e.address}
                  onSelectedElection={this.props.onSelectedElection}/>)
              })
        )
    }
}