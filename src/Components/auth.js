import React, { Component, PropTypes } from 'react';
import * as ons from 'react-onsenui';
import * as Ons from 'onsenui';
import Formsy from 'formsy-react';
import { ValidationInput } from './validationInput'

export default class Auth extends Component {
	submitHandler(action, model) {
		if(action === 'SignIn')
			this.props.onSignIn(model.email, model.password);
		else if(action === 'SignUp')
			this.props.onSignUp(model.email, model.password);
	}
	render() {
		return (
            <ons.Modal isOpen={true}>
            	<Form 
            		onSubmit={::this.submitHandler} 
            		onCancel={this.props.onCancel} 
            		onResetPassword={this.props.onResetPassword}
            		message={this.props.message} />
            </ons.Modal>
    	)
	}
} 

Auth.propTypes = {
	onSignIn: PropTypes.func.isRequired,
	onSignUp: PropTypes.func.isRequired,
	onCancel: PropTypes.func,
	onResetPassword: PropTypes.func.isRequired,
	message: PropTypes.string
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
      	this.props.onSubmit(this.state.action, model);
    }
    renderCancel() {
        if(!this.props.onCancel)
        	return;

		return (
			<button className="alert-dialog-button alert-dialog-button--primal"
					onClick={this.props.onCancel}>
				<span>Отмена</span>
			</button>
		)
	}
    render() {
    	return (
        	<Formsy.Form onValidSubmit={::this.submit} onValid={::this.enableButton} onInvalid={::this.disableButton}>
          		
          		<div className="alert-dialog alert-dialog--android">
					<div className="alert-dialog-title alert-dialog-title--android">
						<p>{this.props.message || 'Авторизация'}</p>
					</div>

					<div className="alert-dialog-content alert-dialog-content--android">
						<ValidationInput 
							name="email"
							placeholder="Email"
							type="text"
							validations="isEmail" 
							validationError="Некорректный email"
							ref={(e) => this.emailInput = e}
							required />

						<ValidationInput 
							name="password"
							placeholder="Пароль"
							type="password"
							required />
						<small>Введите любой пароль. он может не совпадать с паролем от вашей почты.</small>
					</div>

					<div className="alert-dialog-footer alert-dialog-footer--one">
						<button className="alert-dialog-button alert-dialog-button--half" 
								disabled={!this.state.canSubmit}
								onClick={() => this.setState({ action: 'SignIn' })}>
							<span>Войти</span>
						</button>
						<button className="alert-dialog-button alert-dialog-button--half" 
								disabled={!this.state.canSubmit}
								onClick={() => this.setState({ action: 'SignUp' })}>
							<span>Регистрация</span>
						</button>
						<button className="alert-dialog-button alert-dialog-button--primal"
								onClick={() => {
									if(this.emailInput.isValid())
										Ons.notification.confirm({
											title: 'Сброс пароля',
											message: 'Вы уверены?',
											buttonLabels: ["Нет", "Да"],
											callback: (i) => {
												if(i === 1)
													this.props.onResetPassword(this.emailInput.getValue());
											}
										})
									else
										Ons.notification.alert({
											message: 'Некорректный электронный адрес',
											title: ''
										});
								}}>
							<span>Забыл пароль</span>
						</button>
						{::this.renderCancel()}
					</div>
				</div>
        	</Formsy.Form>
      	);
    }
 }