import React, { Component } from "react";
import { Menu, Button, Popup, Tab, Dropdown, Modal, Header, Search } from "semantic-ui-react";
import _ from 'lodash';
import { AdminModule } from "../secured/AdminModule";
import { ImportWallet } from "../wallet/ImportWallet";
import { CreateWallet } from "../wallet/CreateWallet";
import * as Fuse from "fuse.js";

import "./Navbar.css";


export class Navbar extends Component{

    constructor(props){
        super(props);
        this.state = {
            search: "",
            isOpen: false,
            isLoading: false,
            results: [],
            value: '',
            selectedElection: ""
        }
        this.walletPanes = this.walletPanes.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.userChanged = this.userChanged.bind(this);
        this.resetComponent = this.resetComponent.bind(this);

        this.resetComponent();
    }

    resetComponent(){
        this.setState({ isLoading: false, results: [], value: '' });
    } 

    handleResultSelect = (e, { result }) => {
        this.props.onElectionSelected(result);
        this.setState({ value: result.title});
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })


        var options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
              "title"
          ]
          };
          console.log(this.props.elections);
          
          var fuse = new Fuse(this.props.elections, options); // "list" is the item array
          var result = fuse.search(value);
          console.log("search results:", result);

          //if (this.state.value.length < 1) return this.resetComponent()
            

            this.setState({
                isLoading: false,
                results: result,
            })
    }

    

    handleInput(event){
        console.log(event.target.name);
        console.log(event.target.value);
        
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    userChanged(e){
        this.setState({isOpen: false});
        this.props.onUserChange(e);
    }

    walletPanes(){
        return [
            { 
                menuItem: 'Import', 
                render: () => 
                    <Tab.Pane attached={false} className="pane-borderless">
                        <ImportWallet user={this.props.user} onUserChange={this.userChanged}/>
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
        const { isLoading, value, results } = this.state

        return (
            <Menu className="navbar" secondary>
                <Menu.Item 
                    name='bvoting'
                    content="BVoting"/>
                <Menu.Menu>
                <Search
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                    results={results}
                    value={value}
                    
                    {...this.props}
                />
                </Menu.Menu>
                <Menu.Item 
                    name="explorer"
                    content="Explorer"
                    position="right"
                    link={true}
                    href="https://rinkeby.etherscan.io/address/0x1748eb1c64c2f2754c7d0e3ec903ca1466ce2742/"
                    target="_blank"/>

                 {
                    this.props.user.isAdmin? 
                        <Modal trigger={
                            <Menu.Item 
                                name="admin"
                                content="Admin"/>
                        } closeIcon>
                        <Header content='Admin features' />
                        <Modal.Content>
                        <AdminModule
                            onUserUnlocked={this.props.userUnlocked}
                            user={this.props.user}
                            users={this.props.users}/>
                        </Modal.Content>
                        <Modal.Actions>
                        <Button color='green'>
                            CLOSE
                        </Button>
                        </Modal.Actions>
                    </Modal> : null
                }

                <Menu.Item>
                    <Popup
                        hoverable
                        open={this.state.isOpen}
                        onClose={() => {this.setState({isOpen: false})}}
                        onOpen={() => {this.setState({isOpen: true})}}
                        trigger={<Button primary content='Wallet' />}
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
