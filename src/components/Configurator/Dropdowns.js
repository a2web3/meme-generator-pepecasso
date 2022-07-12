import React, { Component } from 'react';
import Select, { components } from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

class Dropdowns extends Component {

    render() {
        return (
            <div className="section-dropdowns">
                <h2>Choose Attributes:</h2>
                <form>
                    {Object.keys(this.props.memeLayers).map(this.renderDropdown, this)}
                </form>
            </div>
        );
    }

    renderDropdown(key) {

        var options = [];
        for (var i = 0; i < this.props.memeLayers[key]['items'].length; i++) {
            options.push({value: i, label: this.props.memeLayers[key]['items'][i]['name'], group: key})
        }

        const selectedValue = {value:this.props.memeConfig[key],label:options[this.props.memeConfig[key]]['label']};

        const id = "select-" + key;
        const containerKey = "container-select-" + key;

        library.add(faCaretDown);

        const CaretDownIcon = () => {
            return <FontAwesomeIcon icon="fa-solid fa-caret-down" />;
        };

        const DropdownIndicator = props => {
            return (
                <components.DropdownIndicator {...props}>
                    <CaretDownIcon />
                </components.DropdownIndicator>
            );
        };

        const customStyles = {
            control: (provided, state) => ({
                ...provided,
                background: 'transparent',
                border: 'none',
                //minHeight: '130px',
                //height: '130px',
                boxShadow: state.isFocused ? null : null,
            }),

            valueContainer: (provided, state) => ({
                ...provided,
                //height: '130px',
                textAlign: 'right',
                padding: '6px 10px 0 0'
            }),

            input: (provided, state) => ({
                ...provided,
                margin: '0px',
            }),
            indicatorSeparator: state => ({
                display: 'none',
            }),
            indicatorsContainer: (provided, state) => ({
                ...provided,
                //height: '30px',
            }),
            dropdownIndicator: state => ({
                color: '#000000',
                //padding: '0 8px 8px 8px'
            }),
            option: (provided, state) => ({
                ...provided,
                cursor: 'pointer',
                textAlign: 'right',
                padding: '15px 30px 5px 5px',
                margin:'0',
                backgroundColor: state.isSelected ? '#000' : '#fff',
                lineHeight: '48px',
                "&:hover": {
                    backgroundColor: "#000",
                    color: "#FFF"
                }
            }),
            menu: (provided, state) => ({
                ...provided,
                border: '3px solid #000',
                padding:'0',
                margin:'0'
            }),
            menuList: (provided, state) => ({
                ...provided,
                border: '3px solid #000',
                padding:'0',
                margin:'0',
                maxHeight: '350px'
            }),
        };

        return (

            <div className="row mb-3" key={containerKey}>
                <label htmlFor={id} className="col-sm-4 col-form-label">{key}</label>
                <div className="col-sm-8">
                    <Select
                        classNamePrefix='filter'
                        className="attributes-dropdown"
                        options={options}
                        onChange={this.props.onChangeHandler}
                        value={selectedValue}
                        components={{ DropdownIndicator }}
                        isSearchable={false}
                        styles={customStyles}
                        >
                    </Select>
                </div>
            </div>
        );
    }
}

export default Dropdowns;