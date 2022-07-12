import React, { Component } from 'react';

class TextPanel extends Component {

    render() {
        return (
            <div className="section-text-panel">
                <form>
                    <div className="mb-3">
                        <label
                            htmlFor="topText"
                            className="form-label"
                        >
                            Top Text
                        </label>
                        <br />
                        <textarea
                            className="form-input"
                            id="topText"
                            onChange={this.props.changeTopTextHandler}
                            rows="2"
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="bottomText"
                            className="form-label"
                        >
                            Bottom Text
                        </label>
                        <br />
                        <textarea
                            className="form-input"
                            id="bottomText"
                            onChange={this.props.changeBottomTextHandler}
                            rows="2"
                        ></textarea>
                    </div>
                </form>
            </div>
        );
    }
}

export default TextPanel;