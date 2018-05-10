import React, { Component } from "react";
import { Menu, Input, Button, Popup, Tab, Dropdown } from "semantic-ui-react";
import { ImportWallet } from "../wallet/ImportWallet";
import { CreateWallet } from "../wallet/CreateWallet";

import "./Navbar.css";

export class Navbar extends Component{

    constructor(props){
        super(props);

        this.walletPanes = this.walletPanes.bind(this);
    }

    walletPanes(){
        return [
            { 
                menuItem: 'Import', 
                render: () => 
                    <Tab.Pane attached={false} className="pane-borderless">
                        <ImportWallet user={this.props.user} onUserChange={this.props.onUserChange}/>
                    </Tab.Pane> 
            },
            {
                menuItem: 'Create', 
                render: () => 
                    <Tab.Pane attached={false} className="pane-borderless">
                        <CreateWallet user={this.props.user} onUserChange={this.props.onUserChange}/>
                    </Tab.Pane> 
            }
        ]
    }

    render(){
        return (
            <Menu borderless secondary>
                <Menu.Item 
                    name='hello'
                    content="Hello"/>
                <Menu.Menu>
                    <Input
                        icon={{ name: 'search', link: true }}
                        placeholder='Search...'
                    />
                </Menu.Menu>
                <Menu.Item 
                    name="results"
                    position="right"
                    content="Results"/>
                <Menu.Item 
                    name="explorer"
                    content="Explorer"/>
                <Menu.Item>
                    <Popup
                        trigger={<Button content='Wallet' />}
                        content={
                            <div>
                                <Tab 
                                    menu={{ secondary: true, pointing: true }} 
                                    panes={this.walletPanes()}/>
                                <Dropdown 
                                    placeholder='Select' 
                                    search
                                    fluid
                                    selection
                                    options={this.props.wallets} />
                            </div>
                        }
                        on='click'
                        position='bottom right'/>
                </Menu.Item>
            </Menu>
        )
    }
}
