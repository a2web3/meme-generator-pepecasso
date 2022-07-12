import React, { Component } from 'react';

import Modal from "react-bootstrap/Modal";

import TextPanel from "./TextPanel";
import Dropdowns from "./Dropdowns";
import Buttons from "./Buttons";
import NFTSelect from "./NFTSelect";

const { ClipboardItem } = window;

class Configurator extends Component {

    constructor(props) {
        super(props);

        // create empty meme config as default
        let defaultMemeConfig = {}
        for (const key of Object.keys(this.props.memeLayers)) {
            defaultMemeConfig[key] = 0;
        }

        this.state = {
            memeConfig: defaultMemeConfig,
            topText: "",
            bottomText: "",
            nftsLoaded: false,
            showNFTSelector: false,
            userNFTs:[]
        }

        this.canvasDefaults = {
            canvasSize: 1024,
            maxFontSize: 90,
            lineWidth: 10,
            maxTextWidth: 900,
            textMargin: 50
        }

    }

    componentDidMount() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.createRandomMeme()
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.wallet.address === false && this.props.wallet.address !== false) {
            this.loadNFTs()
        }
    }


    // Drawing

    setStateAndDraw(memeConfig) {
        this.setState({memeConfig:memeConfig}, function() {
            this.drawCanvas()
        })
    }

    async drawCanvas() {

        // clear ctx
        this.ctx.clearRect(0, 0, this.canvasDefaults.canvasSize, this.canvasDefaults.canvasSize);

        // load and draw images
        for (const attributeKey of Object.keys(this.props.memeLayers)) {
            const src = this.props.memeLayers[attributeKey]['items'][this.state.memeConfig[attributeKey]]['src'];
            const drawImage = await new Promise(resolve => {
                const image = new Image();
                image.addEventListener('load', () => {
                    resolve(image);
                });
                image.src = src;
            });
            this.ctx.drawImage(drawImage, 0, 0);
        }

        // draw text
        if(this.state.topText !== "") {
            this.drawText('top', this.state.topText)
        }
        if(this.state.bottomText !== "") {
            this.drawText('bottom', this.state.bottomText)
        }
    }

    drawText(position, text) {

        this.ctx.textBaseline = position;

        var textSize = this.getTextSize(text);

        this.ctx.font = textSize + 'px Luckiest Guy';

        var lines = text.split("\n");
        for(var i_lines = 0; i_lines < lines.length; i_lines++) {

            var textWidth = this.ctx.measureText(lines[i_lines]).width;
            var y = this.canvasDefaults.textMargin + (i_lines*(textSize*1.2));
            if(position === "bottom") {
                y = this.canvasDefaults.canvasSize-this.canvasDefaults.textMargin - ((lines.length-i_lines-1)*(textSize*1.2));
            }

            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = this.canvasDefaults.lineWidth;
            this.ctx.strokeText(lines[i_lines], (this.canvasDefaults.canvasSize/2) - (textWidth / 2), y);
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(lines[i_lines], (this.canvasDefaults.canvasSize/2) - (textWidth / 2), y);
        }
    }

    getTextSize(text) {
        var longestLine = "";
        var lines = text.split("\n");
        for(var i_lines = 0; i_lines < lines.length; i_lines++) {
            if(lines[i_lines].length > longestLine.length) {
                longestLine = lines[i_lines];
            }
        }

        var size = this.canvasDefaults.maxFontSize;

        this.ctx.font = size + 'px Luckiest Guy';

        var textWidth = this.ctx.measureText(longestLine).width;
        if(textWidth > this.canvasDefaults.maxTextWidth) {
            while(textWidth > this.canvasDefaults.maxTextWidth) {
                size = size-1;
                this.ctx.font = size + 'px Luckiest Guy';
                textWidth = this.ctx.measureText(longestLine).width;
            }
        }

        return size;
    }

    onChangeTrait = (selectedOption) => {
        var memeConfig = this.state.memeConfig;
        memeConfig[selectedOption.group] = selectedOption.value;
        this.setState({memeConfig:memeConfig})
        this.drawCanvas()
    }

    onChangeTopText = (event) => {
        this.setState({topText:event.target.value})
        this.drawCanvas()
    }

    onChangeBottomText = (event) => {
        this.setState({bottomText:event.target.value})
        this.drawCanvas()
    }


    // Actions

    createRandomMeme = () => {
        var randomConfig = {}
        for (const [group_key, group] of Object.entries(this.props.memeLayers)) {
            randomConfig[group_key] = Math.floor(Math.random() * (group['items'].length))
        }
        this.setStateAndDraw(randomConfig)
    }

    saveMeme = () => {
        var canvas = document.getElementById("canvas");
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = canvas.toDataURL();
        link.click();
        link.remove();
    }

    copyImage = () => {
        var canvas = document.getElementById("canvas");
        canvas.toBlob(function(blob) {
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]);
        });
    }


    // NFT Selector

    loadNFTs = async() => {

        console.log('load nfts')

        var nfts = [];
        for(var i=0; i < this.props.wallet.balance; i++) {
            var tokenId = await this.props.contract.tokenOfOwnerByIndex(this.props.wallet.address, i)
            var metadataURI = await this.props.contract.tokenURI(parseInt(tokenId.toString()))
            metadataURI = metadataURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            console.log(metadataURI)
            const response = await fetch(metadataURI, {
                crossDomain:true,
                mode:'cors'
            });
            var result = await response.json()
            console.log(result)
            result.image = result.image.replace("ipfs://", "https://ipfs.io/ipfs/")
            const res = await fetch(result.image, {
                crossDomain:true,
                mode:'cors'
            });
            const imageBlob = await res.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);
            result.image_src = imageObjectURL
            nfts.push(result)
        }
        this.setState({isBalanceLoaded:true,userNFTs:nfts,nftsLoaded:true})
    }

    showNFTSelector = () => {
        this.setState({showNFTSelector:true})
    }

    hideNFTSelector = () => {
        this.setState({showNFTSelector:false})
    }

    onSelectNFT = (nft) => {
        var nftConfig = {}
        for (const key of Object.keys(this.props.memeLayers)) {
            nftConfig[key] = 0;
            for(var i=0; i < nft.traits.length; i++) {
                if(key === nft.traits[i].trait_type.toLowerCase()) {
                    for(var j=0; j < this.props.memeLayers[key]['items'].length; j++) {
                        if(this.props.memeLayers[key]['items'][j]['name'].toLowerCase() === nft.traits[i].value) {
                            nftConfig[key] = j;
                        }
                    }
                }
            }
        }
        this.setState({showNFTSelector:false})
        this.setStateAndDraw(nftConfig)
    }


    render() {

        return (
            <>
                <div className="row">
                    <div className="col-md-10 offset-md-1 section-configurator">

                        <div className="row">
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="section-canvas">
                                            <canvas id="canvas" width="1024px" height="1024px">
                                                Your browser does not support the HTML5 canvas tag.
                                            </canvas>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <Dropdowns
                                            memeConfig={this.state.memeConfig}
                                            memeLayers={this.props.memeLayers}
                                            onChangeHandler={this.onChangeTrait}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-6">
                                        <TextPanel
                                            changeTopTextHandler={this.onChangeTopText}
                                            changeBottomTextHandler={this.onChangeBottomText}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <Buttons
                                            saveMemeHandler={this.saveMeme}
                                            createRandomMemeHandler={this.createRandomMeme}
                                            copyImageHandler={this.copyImage}
                                            showNFTSelectorHandler={this.showNFTSelector}
                                            nftsLoaded={this.state.nftsLoaded}
                                            nftBalance={this.props.wallet.balance}
                                            isWalletEnabled={this.props.isWalletEnabled}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <Modal show={this.state.showNFTSelector} onHide={this.hideNFTSelector}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select your NFT</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <NFTSelect
                            contratc={this.props.contract}
                            selectedAddress={this.props.wallet.address}
                            provider={this.props.provider}
                            onSelectNFTHandler={this.onSelectNFT}
                            nfts={this.state.userNFTs}
                            />
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default Configurator;