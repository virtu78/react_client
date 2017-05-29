import React, { Component, PropTypes } from 'react';
import * as ons from 'react-onsenui';
import * as Ons from 'onsenui';

export default class couponForm extends Component {
	state = {
		couponCode: undefined,
		useCoupon: false
	}
	_getProductIdsFromPrices() {
		return this.props.prices.reduce((r, p) =>  {
	        if(r.indexOf(p.productId) === -1)
	            r.push(p.productId);
	        return r;
	    }, []);
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.prices.length === 0)
			this.setState({ useCoupon: false });
	}
	renderCodeInput() {
		return (
			<p>
				<ons.Input 
	        		className='input--half'
					onChange={(e) => {  this.setState({ couponCode: e.target.value }) }}
					type='text'
					placeholder='Код купона'
					modifier='underbar'
					disabled={this.state.useCoupon} />

				<ons.Button 
					style={{ float: 'right' }}
					disabled={this.state.useCoupon} 
					onClick={ () => this.props.getCouponDiscountSum(this.state.couponCode) }>
					<span>Проверить купон</span>
				</ons.Button>
			</p>
		)
	}
	renderSwitcher() {
		if(this.props.discounts === undefined)
			return;

    	let message = '';
    	let showSwitcher = false;
    	if(this.props.discounts === null) {
    		message = 'Неверный код купона';
    	}
    	else {
    		const productIds = ::this._getProductIdsFromPrices();

			let isEmpty = productIds.reduce((r, p) => {
				if(this.props.discounts[p] !== undefined)
					return false;
				return r;
			}, true);

			if(isEmpty) {
				message = 'Купон не действует на данные товары';
			}
    		else { 
    			message = 'Отметьте для применения купона';
    			showSwitcher = true;
    		}
    	}

		return (
			<p>
				<span style={{color: this.props.fontColor}}>{message}</span>
				{
					showSwitcher
					?
						<label className="switch" style={{ float: 'right' }}>
							<input 
								type="checkbox" 
								className="switch__input"
								onChange={(e) => {
									this.setState({ useCoupon: e.target.checked });
									this.props.onChange(e.target.checked ? this.state.couponCode : undefined) 
								}} />

						  	<span className="switch__toggle"></span>
						</label>
					: ''
				}
			</p>
		)
	}
	renderDiscounts() {
		if(this.props.discounts === undefined)
			return;

		if(this.props.discounts === null)
			return;

		const source = this.props.prices.reduce((r, p) => {
			if(r.indexOf(p.productId) === -1)
				r.push(p);
			return r;
		}, []);

		return(
			<ons.List
				dataSource={source}
				renderRow={(p, i) => {
						const discount = this.props.discounts[p.productId];
						if(discount === undefined)
							return;

						return (
							<ons.ListItem key={`discount-${i}`} style={{color: this.props.fontColor}}>
				                <div className='center'>
				                    <div>{p.productName}</div>
				                </div>
				                <div className='right'>
				                    <span>{discount}%</span>
				                </div>
							</ons.ListItem>
						)
					}
				} />
		)
	}
	render() {
		return (
			<div>
				{::this.renderCodeInput()}
				{::this.renderSwitcher()}
				{::this.renderDiscounts()}
			</div>
		)
	}
}

couponForm.propTypes = {
	getCouponDiscountSum: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	discounts: PropTypes.object,
	prices: PropTypes.array.isRequired,
	fontColor: PropTypes.string
}