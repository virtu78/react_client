import React, { Component, PropTypes } from 'react';
import * as Ons from 'onsenui';
import * as ons from 'react-onsenui';
import Formsy from 'formsy-react';
import { ValidationInput, PhoneInput } from './validationInput';
import { setAddress } from '../Actions/order';

export default class FastOrderModal extends Component {
	submitHandler(model) {
		this.props.sendOrder(model);
		this.props.close();
	}
	setAddress(address) {
		setAddress(address);
	}
	render() {
		return (
			<ons.Modal isOpen={true} style={{display: 'block'}}>
				<Form
					close={this.props.close}
					name={this.props.name}
					email={this.props.email}
					phone={this.props.phone}
					addresses={this.props.addresses}
					additionalFields={this.props.additionalFields}
					setAddress={::this.setAddress}
				    onSubmit={::this.submitHandler} />
			</ons.Modal>
		)
	}
}

FastOrderModal.propTypes = {
	additionalFields: PropTypes.array.isRequired,
	close: PropTypes.func.isRequired,
	name: PropTypes.string,
	phone: PropTypes.string,
	email: PropTypes.string,
	addresses: PropTypes.array,
	sendOrder: PropTypes.func.isRequired,
    setAddress: PropTypes.func.isRequired
};

class Form extends Component {
	state = {
		canSubmit: false
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
		this.props.onSubmit(model);
	}
	renderMainFields() {
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
					name="address"
					inititalValue={this.props.address}
					placeholder="Адрес"
					type="text"
					required />

				{
                    this.props.addresses !== undefined && this.props.addresses.length !== 0
                    ?    <ons.List
                    renderHeader={() => <ons.ListHeader>Выберите адрес</ons.ListHeader>}
                    renderRow={(a, i) => {
                    	var self = this;
                    return (
						<ons.ListItem key={`address-${i}`} tappable
									  onClick={() => {
                                          self.props.setAddress(a);
                                          this.addressInput.setValue(`г. ${a.city}, ул. ${a.street}, д. ${a.house}, под. ${a.entrance}, этаж: ${a.floor}, кв.: ${a.flat}`)
                                      }}>
							<div className='center'>
                                {a.description}
							</div>
						</ons.ListItem>
                    )
                }}
                    dataSource={this.props.addresses} />
				: 	''
				}
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
					<ValidationInput key={`add-field-${i}`}
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
	render() {
		return (
			<Formsy.Form onValidSubmit={::this.submit} onValid={::this.enableButton} onInvalid={::this.disableButton}>
				<div className="alert-dialog alert-dialog--android">
					<div className="alert-dialog-title alert-dialog-title--android">
						<p>Быстрый заказ</p>
					</div>

					<div className="alert-dialog-content alert-dialog-content--android">
						{::this.renderMainFields()}
						{::this.renderAdditionalFields()}
					</div>

					<div className="alert-dialog-footer alert-dialog-footer--one">
						<button	className="alert-dialog-button alert-dialog-button--one"
							disabled={!this.state.canSubmit}>
							<span>Оформить</span>
						</button>
						<input type="button"
							className="alert-dialog-button alert-dialog-button--one"
							onClick={this.props.close}
							value="Отмена" />
					</div>
				</div>
			</Formsy.Form>
		);
	}
}