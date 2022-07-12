import React, { Component } from 'react';

class Buttons extends Component {

    render() {

        var walletButton;
        if(this.props.nftsLoaded === true) {
            if(this.props.nftBalance > 0) {
                walletButton =
                    <button
                        className="btn btn-primary"
                        onClick={this.props.showNFTSelectorHandler}
                    >
                        Select NFT ({this.props.nftBalance})
                    </button>;
            } else {
                walletButton =
                    <button
                        className="btn btn-primary disabled"
                        disabled="true"
                    >
                        You dont have this NFT
                    </button>;
            }

        } else {
            walletButton =
                <button
                    className="btn btn-primary"
                    disabled={true}
                >
                    Loading your NFTs
                </button>;
        }

        return (
            <div className="section-buttons">

                {this.props.isWalletEnabled === true ? walletButton : null}
                {this.props.isWalletEnabled === true ? <br /> : null}

                <button
                    className="btn btn-primary"
                    onClick={this.props.createRandomMemeHandler}
                >
                    Create random
                </button>
                <br />
                <button
                    className="btn btn-primary"
                    onClick={this.props.copyImageHandler}
                >
                    Copy image
                </button>
                <br />
                <button
                    className="btn btn-primary"
                    onClick={this.props.saveMemeHandler}
                >
                    Save Meme
                </button>

            </div>
        );
    }
}

export default Buttons;