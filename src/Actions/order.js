import axios from 'axios';

import { HOST } from '../utils/constants';
import {getHeader} from "../utils/common";

export function fetchAdditionalFieldsReceived(fields) {
	return {
		type: 'FETCH_ADDITIONAL_FIELDS_RECEIVED',
		payload: fields
	}
}

export function getMaxBonusSum(sum) {
	return (dispatch, getState) => {

		axios.post(`${HOST}/api/ShopOrder/GetMaxWriteOffBonusSum`, {
            shopOrderSum: sum
        }, {
			headers: {
                'AuthToken': getState().profile.authToken
			}
		}).then(res => dispatch(getMaxBonusSumReceived(res.data)));
	}
}

export function getMaxBonusSumReceived(sum) {
	return {
		type: 'GET_MAX_BONUS_SUM_RECEIVED',
		payload: sum
	}
}

export function getCouponDiscountSum(code) {
	return (dispatch, getState) => {
        const productIds = getState().cart.reduce((r, p) =>  {
            if(r.indexOf(p.productId) === -1)
                r.push(p.productId);
            return r;
        }, []);

        axios.post(`${HOST}/api/ShopOrder/GetCouponDiscountSum`, {
            code: code,
            productIds: productIds
        }).then(res => dispatch(getCouponDiscountSumReceived(res.data)));
	};
}

export function getCouponDiscountSumReceived(sales) {
	return {
		type: 'GET_COUPON_DISCOUNT_SUM_RECEIVED',
		payload: sales
	}
}

export function clearDiscounts() {
	return {
		type: 'CLEAR_DISCOUNTS'
	}
}

export function setCoupon(code) {
	return {
		type: 'SET_COUPON',
		payload: code
	}
}

export function setComment(comment) {
    return {
        type: 'SET_COMMENT',
        payload: comment
    }
}

export function setPayType(isCash) {
    return {
        type: 'SET_PAY_TYPE',
        payload: isCash
    }
}

export function setAddress(address) {
    return {
        type: 'SET_ADDRESS',
        payload: address
    }
}

export function sendOrder(name, phone, email, address, addressId, isDelivery, deliveryTime, priceId, addFields, bonusSum, useCash, comment) {
	return (dispatch, getState) => {
        const state = getState();

        const lines = [];
        if(priceId !== undefined) {
            const price = state.cart.find(p => p.id === priceId);
            lines.push( new shopOrderLineDto(price.productId, price.id, price.count) );
        }
        else
            state.cart.map(p => lines.push( new shopOrderLineDto(p.productId, p.id, p.count) ));

        state.order.additionalFields.map(field =>
            field.value = addFields[field.fieldTypeDescription]);

        const order = new shopOrderDto(name, phone, email, address, !isDelivery, deliveryTime, lines, state.order.additionalFields, bonusSum, useCash, comment);

        console.log(order);
        if(state.profile.id !== undefined)
            order.customerId = state.profile.id;

        sendOrderToServer(order, state.order.coupon, addressId, state.filial, state.settings.onlyCity)
            .then(() => {
                dispatch(clearDiscounts());
            });
	}
}

export function resendOrder(name, phone, email, address, addressId, lines, addFields, useCash, comment) {
	return (dispatch, getState) => {
        const state = getState();

        state.order.additionalFields.map(field =>
			field.value = addFields[field.fieldTypeDescription]);

        const order = new shopOrderDto(name, phone, email, address, false, undefined, lines, state.order.additionalFields, 0, useCash, comment);

        console.log(order);
        if(state.profile.id !== undefined)
            order.customerId = state.profile.id;

        sendOrderToServer(order, null, addressId, state.filial, state.settings.onlyCity);
	}
}

function sendOrderToServer(order, couponCode, addressId, filial, onlyCity) {
    const headers = getHeader(filial, onlyCity);
    const filialId = filial.filialId;

    return axios.post(`${HOST}/api/ShopOrder/Add`, {
        order,
        couponCode,
        addressId,
        filialId
    }, { headers })
}

class shopOrderDto {
    constructor(name, phone, mail, address, isPickup, deliveryTime, lines, fields, bonusSum, useCash, comment) {
        this.customerName = name;
        this.customerPhone = phone;
        this.customerMail = mail;
        this.isPickup = isPickup;
        this.deliveryTime = deliveryTime;
        this.customerAddress = address;
        this.lines = lines;
        this.fields = fields;
        this.writeOffBonusSum = bonusSum;
        this.useCash = useCash;
        this.comment = comment;
    }
}

class shopOrderLineDto {
    constructor(productId, priceId, count) {
        this.productId = productId;
        this.productPriceId = priceId;
        this.productAmount = count;
    }
}