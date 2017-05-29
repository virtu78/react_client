import React, { Component, PropTypes } from 'react';
import * as ons from 'react-onsenui';
import Formsy from 'formsy-react';
import MaskedInput from 'react-input-mask';

export const ValidationInput = React.createClass({
	mixins: [Formsy.Mixin],
    changeValue(event) {
    	this.setValue(event.currentTarget.value);
    },
    componentDidMount() {
        this.setValue(this.props.inititalValue);
    },
    render() {
    	const className = this.showRequired() ? 'required' : this.showError() ? 'error' : null;
      	const errorMessage = this.getErrorMessage();
      	
        return (
        	<p className={className} style={{ textAlign: 'center' }}>
	        	<ons.Input 
  	        	className={`input--full ${className}`}
              value={this.getValue()}
      				onChange={this.changeValue}
              onFocus={this.props.onFocus}
              onBlur={this.props.onBlur}
      				type={this.props.type}
      				placeholder={this.props.placeholder}
      				modifier='underbar' />

          		<span style={errorStyle}>{errorMessage}</span>
        	</p>
    	);
	}
});

export const PhoneInput = React.createClass({
  mixins: [Formsy.Mixin],
    changeValue(event) {
        this.setValue(event.currentTarget.value);
    },
    componentDidMount() {
        this.setValue(this.props.inititalValue || '');
    },
    validate() {
        const valueWithoutSpaces = this.getValueWithoutSpaces(); 

        if(valueWithoutSpaces.length === 16 || valueWithoutSpaces.length === 0)
            return true;

        return false;
    },
    getValueWithoutSpaces() {
        const value = this.getValue();

        if(!value)
            return '';

        return value.replace(/ /g, '');
    },
    customShowRequired() {
        return this.props.required && this.getValueWithoutSpaces().length === 0;
    },
    render() {
        const className =  this.customShowRequired() ? 'required' : this.showError() ? 'error' : null;
        const errorMessage = this.getErrorMessage();
        
        return (
            <p className={className} style={{ textAlign: 'center' }}>
                
                <MaskedInput
                    className={`input--full input--masked ${className}`}
                    type="text"
                    value={this.getValue()}
                    placeholder={this.props.placeholder}
                    onChange={this.changeValue}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                    mask="+7 (999) 999-99-99"
                    maskChar=" " />

                <span style={errorStyle}>{errorMessage}</span>
            </p>
        );
    }
});

export const TimeInput = React.createClass({
  mixins: [Formsy.Mixin],
    changeValue(event) {
        this.setValue(event.currentTarget.value);
    },
    componentDidMount() {
        this.setValue(this.props.inititalValue || '');
    },
    validate() {
        const valueWithoutSpaces = this.getValueWithoutSpaces(); 

        if(valueWithoutSpaces.length === 5 || valueWithoutSpaces.length === 0)
            return true;

        return false;
    },
    getValueWithoutSpaces() {
        const value = this.getValue();

        if(!value)
            return '';

        return value.replace(/ /g, '');
    },
    customShowRequired() {
        return this.props.required && this.getValueWithoutSpaces().length === 0;
    },
    render() {
        const className =  this.customShowRequired() ? 'required' : this.showError() ? 'error' : null;
        const errorMessage = this.getErrorMessage();
        
        return (
            <p className={className} style={{ textAlign: 'center', height: 59 }}>
                
                <MaskedInput
                    className={`input--full input--masked ${className}`}
                    type="text"
                    value={this.getValue()}
                    placeholder={this.props.placeholder}
                    onChange={this.changeValue}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                    mask="99:99"
                    maskChar=" " />

                <span style={errorStyle}>{errorMessage}</span>
            </p>
        );
    }
});

export const ValidationTextarea = React.createClass({
  mixins: [Formsy.Mixin],
    changeValue(event) {
        this.setValue(event.currentTarget.value);
    },
    componentDidMount() {
        this.setValue(this.props.inititalValue);
    },
    render() {
        const className = this.showRequired() ? 'required' : this.showError() ? 'error' : null;
        const errorMessage = this.getErrorMessage();
        return (
          <p className={className} style={{ textAlign: 'center' }}>
            <textarea 
              className={`reviews-form__text ${className}`}
              value={this.getValue()}
              onChange={this.changeValue}
              placeholder={this.props.placeholder} />         

              <span style={errorStyle}>{errorMessage}</span>
          </p>
      );
  }
});

const errorStyle = {
  color: 'red',
    display: 'inline-block',
    marginTop: '5px'
};