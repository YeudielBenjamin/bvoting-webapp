import React, { Component } from "react";
import { Tab } from "semantic-ui-react";
import { UnlockUser } from "./user/UnlockUser";
import { CreateElection } from "./election/CreateElection";
import { SendEther } from "../transaction/SendEther";

export class AdminModule extends Component{

    adminPanes(){
        return [
            { 
                menuItem: 'Unlock user', 
                render: () => 
                    <Tab.Pane attached={false} >
                        <UnlockUser onUserUnlocked={this.props.onUserUnlocked}/>
                    </Tab.Pane> 
            },
            {
                menuItem: 'Create election', 
                render: () => 
                    <Tab.Pane attached={false} >
                        <CreateElection
                            users={this.props.users}/>
                    </Tab.Pane> 
            },
            {
                menuItem: 'Send ether', 
                render: () => 
                    <Tab.Pane attached={false} >
                        <SendEther
                            user={this.props.user}/>
                    </Tab.Pane> 
            }
        ]
    }

    render(){
        if (this.props.hidden) return null;
        return (
            <Tab 
                menu={{ secondary: true, pointing: true }} 
                panes={this.adminPanes()}/>
        )
    }
}