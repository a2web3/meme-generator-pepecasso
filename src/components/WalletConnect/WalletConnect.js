import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";

import ButtonConnect from "./ButtonConnect";

class WalletConnect extends Component {

    render() {

        var isModalVisible = true
        var isButtonVisible = true
        var text = "connect your wallet to be able to use the meme generator. if you dont own one yet pls visit: opensea.";
        if(this.props.wallet.address !== false) {
            if(this.props.wallet.balance > 0) {
                isModalVisible = false
            } else if(this.props.isNFTRequired === true) {
                text = "You have no nfts from this series, get some on OpenSea"
                isButtonVisible = false
            } else {
                isModalVisible = false
            }
        }

        return (
            <Modal
                show={isModalVisible}
                dialogClassName="modal-90w modal--wallet-connect"
                centered
            >
                <Modal.Body>
                    <div className="section--wallet-connect">
                        <p className="text-center">{text}</p>
                        {isButtonVisible
                            ?
                                <>
                                    <ButtonConnect
                                        onClickHandler={this.props.onClickHandler}
                                    />
                                    <br />
                                </>
                            : null
                        }
                        <a
                            className="btn btn-primary"
                            href="https://opensea.io"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Go to opensea
                        </a>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}

export default WalletConnect;