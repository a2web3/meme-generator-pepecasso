import React, { Component } from 'react';

class NFTSelect extends Component {

    onSelectNFT = (id) => {
        this.props.onSelectNFTHandler(this.props.nfts[id])
    }

    render() {

        return (
            <div className="section--nft-select">
                <div className="row">
                    {this.props.nfts.map(function(nft, index){
                        return (
                            <div className="col-md-3 nft-selector-item" data-value={index} onClick={e => this.onSelectNFT(e.target.dataset.value)} key={index}>
                                <img src={nft.image_src} className="img-fluid" data-value={index} alt="" />
                                <div className="nft-name" data-value={index}>{nft.name}</div>
                            </div>
                        );
                    }, this)}
                </div>
            </div>
        );
    }
}

export default NFTSelect;