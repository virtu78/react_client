import React, { Component, PropTypes } from 'react';

export default class Infobar extends Component {
	renderDeliveryTime(time) {
		if(time === 0)
			return;

		return (
			<li className="infobar__item" style={{borderRightColor: this.props.fontColor}}>
				<i className="icon ion-ios-clock-outline infobar__icon"></i>
				<span className="infobar__value">{time} мин.</span>
				<span className="infobar__desc">время доставки</span>
			</li>
		)
	}
	renderDeliverySum(sum) {
		return (
			<li className="infobar__item" style={{borderRightColor: this.props.fontColor}}>
				<i className="icon ion-android-car infobar__icon"></i>
				<span className="infobar__value">{sum} р.</span>
				<span className="infobar__desc">стоимость дост.</span>
			</li>
		)
	}
	renderMinOrderSum(sum) {
		if(sum === 0)
			return;

			return (
				<li className="infobar__item" style={{borderRightColor: this.props.fontColor}}>
					<i className="icon ion-cash infobar__icon"></i>
					<span className="infobar__value">{sum} руб.</span>
					<span className="infobar__desc">мин. сумма</span>
				</li>
			)
	}
	renderDeliveryFreeSum(sum) {
		if(sum === 0)
			return;

			return (
				<li className="infobar__item" style={{borderRightColor: this.props.fontColor}}>
					<i className="icon ion-alert infobar__icon"></i>
					<span className="infobar__value">{sum} р.</span>
					<span className="infobar__desc">бесплатная от</span>
				</li>
			)
	}
	render() {
		return (
			<ul className="infobar" style={{color: this.props.fontColor}}>
				{this.renderDeliveryTime(this.props.minDeliveryTime)}
				{this.renderMinOrderSum(this.props.minOrderSum)}
				{this.renderDeliverySum(this.props.minDeliverySum)}
				{this.renderDeliveryFreeSum(this.props.deliveryFreeSum)}
			</ul>
		)
	}
}

Infobar.propTypes = {
	minDeliveryTime: PropTypes.number.isRequired,
	minOrderSum: PropTypes.number.isRequired,
	minDeliverySum: PropTypes.number.isRequired,
	deliveryFreeSum: PropTypes.number.isRequired,
	fontColor: PropTypes.string
}
