import React, { Component } from 'react';

class ButtonConnect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isDisabled: false,
            buttonText: "Connect your wallet"
        }
    }

    onButtonConnectClick = () => {
        this.setState({isDisabled:true, buttonText: "connecting ..."})
        this.props.onClickHandler()
    }

    render() {

        return (
            <button
                className="btn btn-primary"
                onClick={this.onButtonConnectClick}
                disabled={this.state.isDisabled}
            >
                {this.state.buttonText}
            </button>
        );
    }
}

export default ButtonConnect;