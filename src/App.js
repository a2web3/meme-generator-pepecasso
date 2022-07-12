import React from 'react';

import { ethers } from "ethers";

import WalletConnect from "./components/WalletConnect/WalletConnect";
import Configurator from "./components/Configurator/Configurator";

import {contractAbi,contractAddress} from "./config/contract-config";
import memeLayers from "./config/meme-config";

import './App.css';



export class App extends React.Component {

    constructor() {
        super();

        // enable wallet connect to read user nfts
        this.isWalletEnabled = true
        // only usable if user hold at least one nft from specific series
        this.isNFTRequired = true

        this.provider = false
        this.contract = false

        this.state = {
            wallet: {
                address: false,
                balance: false,
            }
        }
    }

    connectWallet = async() => {
        this.provider = new ethers.providers.Web3Provider(window.ethereum)
        this.contract = new ethers.Contract(contractAddress, contractAbi, this.provider)

        const accounts = await this.provider.send("eth_requestAccounts", []);
        const balance = await this.contract.balanceOf(accounts[0])

        this.setState({
            wallet: {
                address: accounts[0],
                balance: parseInt(balance.toString())
            }
        })
    }

    render() {
        return (
            <>
                <div className="container-fluid section-header">
                    <div className="row">
                        <div className="col-md-12 text-center header">
                            <h1>Pepecassos<br />Meme Generator</h1>
                        </div>
                    </div>
                </div>
                <div className="container-fluid section-content">

                    <hr className="second-border" />

                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                {this.isWalletEnabled
                                    ?
                                    <WalletConnect
                                        onClickHandler={this.connectWallet}
                                        wallet={this.state.wallet}
                                        isNFTRequired={this.isNFTRequired}
                                    />
                                    : null
                                }
                                <Configurator
                                    memeLayers={memeLayers}
                                    contract={this.contract}
                                    provider={this.provider}
                                    wallet={this.state.wallet}
                                    isWalletEnabled={this.isWalletEnabled}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default App;
