import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import * as Ons from 'onsenui';
import * as ons from 'react-onsenui';
import TopToolbar from '../Components/topToolbar';
import TimeStampList from '../Components/timeStampList';
import { sendOrder, setAddress } from '../Actions/order';
import { clearCart } from '../Actions/cart';
import { setCategoryId } from '../Actions/catalog';
import { getMaxBonusSum } from '../Actions/order';
import Formsy from 'formsy-react';
import { ValidationInput, PhoneInput, TimeInput } from '../Components/validationInput';
import CatalogPage from './catalogPage';
import { getCurrentFilial } from '../utils/filial';
import { getSum } from '../utils/cart';
import BackgroundStyle from '../Components/backgroundStyle';

class OrderPage extends Component {
	componentWillMount() {
		const sum = getSum(this.props.cart);
        this.props.getMaxBonusSum(sum);
	}
	submitHandler(model, isDelivery) {
		const { name, phone, email, deliveryTime, bonusSum, address, ...addFields} = model;

        let addressId = undefined;
		if (this.props.order.address !== undefined) {
            addressId = this.props.order.address.id;
        }
        this.props.sendOrder(name, phone, email, address, addressId, isDelivery, deliveryTime, undefined, addFields, bonusSum, this.props.order.useCash, this.props.order.comment);

		Ons.notification.alert({
			message: 'Заказ отправлен',
			title: '',
			callback: () => {
				this.props.clearCart();
				this.props.setCategoryId(null);
				::this.props.changePage(CatalogPage, true);
			}
		});
	}
	renderBackgroundStyle() {
		return <BackgroundStyle color={this.props.settings.backGroundColor} />
    }
    renderToolbar() {
    	return ( 
    		<TopToolbar 
				name='Оформление заказа'
				address=''
				onBack={::this.props.back}
				bgc={this.props.settings.headerFooterColor}
				fontColor={this.props.settings.hfFontColor}
				needBackButton={true} />
    	)
    }
    renderRadioRow(type, index) {//todo тип оплаты, если нужно будет сделать, то он уже есть
	    return (
		    <ons.ListItem key={index} tappable>
			    <label className='left'>
				    <ons.Input
				    	inputId={`paymentType-${index}`}
				    	checked={index === this.props.order.paymentTypeIndex}
					    onChange={() => {this.props.switchPaymentTypeIndex(index)}}
					    type='radio'
				    />
			    </label>
			    <label htmlFor={`paymentType-${index}`} className='center'>{type}</label>
		    </ons.ListItem>
	    )
    }
    render() {
    	return (
	    	<ons.Page renderToolbar={::this.renderToolbar}>

	    		{::this.renderBackgroundStyle()}
				<Form
					name={this.props.profile.name}
					email={this.props.profile.email}
					phone={this.props.profile.phone}
					additionalFields={this.props.order.additionalFields}
					onSubmit={::this.submitHandler}
					setAddress={this.props.setAddress}
					maxBonusSum={this.props.order.maxBonusSum}
					addresses={this.props.profile.addresses}
					endTime={getCurrentFilial(this.props.filial).deliveryEndTime}
					fontColor={this.props.settings.bgFontColor} />		
	    	</ons.Page>
    	)
    }
}

function mapStateToProps (state) {
    return state
}

function mapDispathToProps (dispath) {
    return bindActionCreators({ 
    	setCategoryId, 
    	getMaxBonusSum,
    	sendOrder,
		setAddress,
		clearCart
    }, dispath)
}

export default connect(mapStateToProps, mapDispathToProps)(OrderPage);

class Form extends Component {
	state = {
		canSubmit: false,
		showTimeStamps: false,
		showAddressess: false,
		isDelivery: true
	};
	enableButton() {
		this.setState({
			canSubmit: true
		});
	}
	disableButton() {
		this.setState({
			canSubmit: false
		});
	}
	submit(model) {
		this.props.onSubmit(model, this.state.isDelivery);
	}
	renderAddresses() {
		if(this.props.addresses.length === 0 || !this.state.showAddressess)
			return; 
		let self = this;
		return (
			<ons.List
				renderHeader={() => <ons.ListHeader style={{color: this.props.fontColor}}>Выберите адрес</ons.ListHeader>}
				renderRow={(a, i) => {
					return (
						<ons.ListItem key={`address-${i}`} tappable style={{color: this.props.fontColor}}>
							<div onClick={() => {
                                self.props.setAddress(a);
								this.addressInput.setValue(`г. ${a.city}, ул. ${a.street}, д. ${a.house}, под. ${a.entrance}, этаж  ${a.floor}, кв.  ${a.flat}`, )
							}} className='center'>{a.description}</div>
						</ons.ListItem>
					)
				}}
				dataSource={this.props.addresses} />
		)					
	}
	renderTimeStamps() {
		if(!this.state.showTimeStamps)
			return;

		const props = {
			endTime: this.props.endTime,
			onClick: (t) => this.timeInput.setValue(t)
		};

		return (
			<TimeStampList {...props} />
		)
	}
	renderMainFields() {
		if(this.state.isDelivery)
			return (
				<div>
					<ValidationInput
						name="name"
						inititalValue={this.props.name}
						placeholder="Ф.И.О."
						type="text"
						required />

					<ValidationInput
						name="email"
						inititalValue={this.props.email}
						placeholder="Email"
						type="text"
						validations="isEmail"
						validationError="Некорректный email"
						required />

					<PhoneInput
						name="phone"
						inititalValue={this.props.phone}
						placeholder="Телефон"
						validationError="Некорректный номер телефона"
						required />

					<ValidationInput
						ref={(e) => this.addressInput = e}
						onFocus={() => this.setState({ showAddressess: true })}
						onBlur={() => setTimeout(() => this.setState({ showAddressess: false }), 200)}
						name="address"
						inititalValue={this.props.address}
						placeholder="Адрес"
						type="text"
						required />

					{::this.renderAddresses()}

					<TimeInput
						ref={(e) => this.timeInput = e}
						name="deliveryTime"
						placeholder="Удобное время доставки"
						type="text"
						onFocus={() => this.setState({ showTimeStamps: true })}
						onBlur={() => setTimeout(() => this.setState({ showTimeStamps: false }), 200) }
						validationError="Правильный формат: 10:30" />

					{::this.renderTimeStamps()}

				</div>
			)
		else
			return (
				<div>
					<ValidationInput
						name="name"
						inititalValue={this.props.name}
						placeholder="Ф.И.О."
						type="text"
						required />

					<ValidationInput
						name="email"
						inititalValue={this.props.email}
						placeholder="Email"
						type="text"
						validations="isEmail"
						validationError="Некорректный email"
						required />

					<PhoneInput
						name="phone"
						inititalValue={this.props.phone}
						placeholder="Телефон"
						validationError="Некорректный номер телефона"
						required />

				</div>		
			)
	}
	renderAdditionalFields() {
		if(this.props.additionalFields.length === 0)
			return;

		const getType = (type) => {
			switch(type) {
				case 'String': return 'text';
				case 'Int32': return 'number';
				case 'Decimal': return 'number';
			}
		};

		const getValidations = (type) => {
			switch(type) {
				case 'String': return;
				case 'Int32': return 'isInt';
				case 'Decimal': return 'isFloat';
			}
		};

		const getValidationError = (type) => {
			switch(type) {
				case 'String': return;
				case 'Int32': return 'Значение должно быть целым числом';
				case 'Decimal': return 'Значение должно быть дробным числом';
			}
		};
		
		return (
			<div>
				{this.props.additionalFields.map((f, i) =>
					<ValidationInput 
						key={`add-field-${i}`}
						name={f.fieldTypeDescription}
						placeholder={f.fieldTypeDescription}
						type={getType(f.fieldTypeName)}
						validations={getValidations(f.fieldTypeName)}
						validationError={getValidationError(f.fieldTypeName)}
						required={f.isRequired} />
				)}
			</div>
		)
	}
	renderBonusSum() {
		if(this.props.maxBonusSum === 0)
			return;

		return (
			<div>
				<br />
				<span style={{ width: '90%', display: 'inline-block', textAlign: 'center', color: 'rgba(24,103,194,0.81)'}}>{`Вы можете оплатить заказ бонусами (Максимум ${this.props.maxBonusSum} р.).`}</span>
				<ValidationInput
    				name="bonusSum"
    				inititalValue="0" 
    				className="input--full"
					type="number"
					placeholder="Оплатить бонусами"
					validations={{
						isNumeric: true,
						range: (values, value) => {
							return value >= 0 && value <= this.props.maxBonusSum;
						}
					}}
					validationError={`Вы можете оплатить от 0 до ${this.props.maxBonusSum}`} />
			</div>
		) 
	}
	render() {
		return (
			<Formsy.Form onValidSubmit={::this.submit} onValid={::this.enableButton} onInvalid={::this.disableButton}>
				
				<div className="navigation-bar">
				  <div className="navigation-bar__center">
				    <div className="button-bar" style={{ width:200, margin: '7px auto'}}>
				      <div className="button-bar__item">
				        <input 
				        	type="radio" 
				        	name="navi-segment-a" 
				        	checked={this.state.isDelivery} 
				        	onChange={() => this.setState({ isDelivery: true })} />
				        <div className="button-bar__button">Доставка</div>
				      </div>

				      <div className="button-bar__item">
				        <input 
				        	type="radio" 
				        	name="navi-segment-a" 
				        	checked={!this.state.isDelivery}
				        	onChange={() => this.setState({ isDelivery: false })} />
				        <div className="button-bar__button">Самовывоз</div>
				      </div>
				    </div>
				  </div>
				</div>

				{::this.renderMainFields()}
				{::this.renderAdditionalFields()}
				{::this.renderBonusSum()}

				<p style={{textAlign: 'center'}} className='bottom-buttons'>
					<button className="button"
						disabled={!this.state.canSubmit}>
						<span>Оформить заказ</span>
					</button>
				</p>

			</Formsy.Form>
		);
	}
}