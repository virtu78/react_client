import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import * as ons from 'react-onsenui';
import * as Ons from 'onsenui';
import { loadProfile, setName, setPhone, setEmail, sendProfile, signIn, signUp, deleteAddress, addAddress, fetchOrderDetails, setOrderDetailsId, resetPassword, changePassword } from '../Actions/profile';
import { resendOrder } from '../Actions/order';
import TopToolbar from '../Components/topToolbar';
import BottomToolbar from '../Components/bottomToolbar';
import Auth from '../Components/auth';
import Formsy from 'formsy-react';
import { ValidationInput, PhoneInput } from '../Components/validationInput';
import FastOrderModal from '../Components/fastOrderModal';
import OrderList from '../Components/orderList';
import AddressList from '../Components/addressList';
import AddressForm from '../Components/addressForm';
import FavoritesPage from './favoritesPage';
import { getImageUrl } from '../utils/product';
import BackgroundStyle from '../Components/backgroundStyle';
import { openSideMenu } from '../Actions/sideMenu';

class ProfilePage extends Component {
	state = {
		showFastOrder: false,
		resendableOrder: undefined,
		showAddressesForm: false
	};
	componentWillMount() {
		this.props.loadProfile();
	}
	submitHandler(model) {
		this.props.setName(model.name);
		this.props.setPhone(model.phone);
		this.props.setEmail(model.email);
		this.props.sendProfile();
	}
	renderBackgroundStyle() {
		return <BackgroundStyle color={this.props.settings.backGroundColor} />
    }
    renderToolbar() {
		const props = {
            name: 'Мои данные',
            address: '',
            onBack: this.props.back !== undefined ? ::this.props.back : undefined,
			bgc: this.props.settings.headerFooterColor,
			fontColor: this.props.settings.hfFontColor,
			logo: this.props.settings.logoImagePath || '',
			needBackButton: true
		};

        if(this.props.settings.onePageCatalog) {
            props.needButterBread = true;
            props.onButterClick = () => this.props.openSideMenu();
        }

        return <TopToolbar {...props} />
    }
    renderModal() {
    	if(this.props.profile.authToken === undefined)
    		return ( 
    			<Auth 
    				onSignIn={this.props.signIn} 
    				onSignUp={this.props.signUp} 
    				onCancel={this.props.back !== undefined ? ::this.props.back : undefined}
    				onResetPassword={::this.props.resetPassword}
    				message={this.props.profile.message} />
    	);

    	if(this.state.showFastOrder)
    		return (
    			<FastOrderModal
    				close={() => this.setState({ showFastOrder: false, resendableOrder: undefined })}
        			additionalFields={this.props.order.additionalFields}
    				sendOrder={(model) => {
    					const {name, phone, email, address, useCash, comment, ...addFields} =  model;
    					const lines = this.state.resendableOrder.lines.map(l => { 
    						return { 
    							productId: l.productId,
						     	productPriceId: l.productPriceId,
						    	productAmount: l.productAmount
    						}
    					});

    					this.props.resendOrder(
    						name, 
    						phone, 
    						email,
    						address,
    						lines, 
    						addFields, 0, useCash, comment);

    					Ons.notification.alert({
							message: 'Заказ отправлен',
							title: ''
						});
    				}}
    				name={this.props.profile.name}
    				phone={this.props.profile.phone}
    				email={this.props.profile.email}
    				addresses={this.props.profile.addresses} />
    		)
    }
    renderUserData() {
		if(this.props.profile.authToken === undefined)
			return;

		if(this.props.profile.email === undefined)
			return;

    	return (
			<UserDataForm
				name={this.props.profile.name}
				email={this.props.profile.email}
				phone={this.props.profile.phone}
				avatar={this.props.profile.avatarImagePath || this.props.settings.reviewDefaultImagePath}
				fontColor={this.props.settings.bgFontColor}
				onSubmit={::this.submitHandler} />
    	)
    }
    renderPasswordBlock() {
        if(this.props.profile.authToken === undefined)
			return;
		
        return (
			<ChangePasswordForm
				fontColor={this.props.settings.bgFontColor}
				onSubmit={(model) => {
					this.props.changePassword(model.password1);
				}} />
    	)
    }
    renderAddresses() {
        if(this.props.settings.noOrderMode)
            return;

		if(this.props.profile.authToken === undefined)
			return;

    	return (
    		<section style={{textAlign: 'center'}}>
				<AddressList
					items={this.props.profile.addresses}
					fontColor={this.props.settings.bgFontColor}
					onDelete={(a) =>
						Ons.notification.confirm({
							title: 'Удаление',
							message: 'Вы уверены?',
							buttonLabels: ["Нет", "Да"],
							callback: (i) => {
								if(i === 1)
									this.props.deleteAddress(a.id)
							}
						})
					} />
				<p>
					<ons.Button 
						disabled={this.state.showAddressesForm} 
						onClick={() => this.setState({ showAddressesForm: true })}>
						<span>Добавить адрес</span>
					</ons.Button>
				</p>
			</section>
    	)
    }
    renderAddressesForm() {
        if(this.props.settings.noOrderMode)
            return;

    	if(!this.state.showAddressesForm)
    		return;

    	return (
    		<section style={{textAlign: 'center', marginBottom: 10}}>
    			<AddressForm
					city={this.props.filial.city}
					onAdd={(description, city, street, house, entrance, floor, flat) => {
						this.setState({ showAddressesForm: false });
						this.props.addAddress(description, city, street, house, entrance, floor, flat);
					}}
					onCancel={() => this.setState({ showAddressesForm: false })} />
    		</section>
    	)
    }
    renderBonusSums() {
    	if(this.props.profile.bonusSums === undefined)
    		return;

    	var value = Object.getOwnPropertyNames(this.props.profile.bonusSums)[0];

    	if(this.props.profile.bonusSums[value] === undefined)
    		return;

    	const style = {
    		width: '90%', 
    		display: 'inline-block', 
    		textAlign: 'center', 
    		color: 'rgba(24,103,194,0.81)'
    	}

    	return (
    		<div style={style}>
    			{`Вам начислено бонусов: ${this.props.profile.bonusSums[value]}.`}
    		</div>
    	)
    }
    renderOrders() {
        if(this.props.settings.noOrderMode)
            return;

    	if(this.props.profile.authToken === undefined)
			return;
    	
    	if(this.props.profile.orders.length === 0)
    		return;

    	return (
    		<section style={{textAlign: 'center' }}>
				<OrderList
					items={this.props.profile.orders}
					orderDetailsId={this.props.profile.orderDetailsId}
					orderDetails={this.props.profile.orderDetails}
					onSelectOrder={(o) => {
						::this.props.setOrderDetailsId(o.id);
						::this.props.fetchOrderDetails(o.lines);
					}}
					onResendOrder={(order) => {
						this.setState({ showFastOrder: true, resendableOrder: order })
					}} />
			</section>
    	)
    }
    renderFavoritesPage() {
		if(this.props.profile.authToken === undefined)
			return;

		return (
			<p style={{ textAlign: 'center', marginBottom: 100 }}>
				<ons.Button style={{ width: '50%' }} onClick={() => this.props.changePage(FavoritesPage)}>
					<span>Избранное</span>
					 <i className="ion-chevron-right pull-right" />
				</ons.Button>
			</p>
		)
    }
    renderBottomToolbar() {
    	return (
    		<BottomToolbar 
            	changePage={this.props.changePage} 
            	filial={this.props.filial} 
            	cart={this.props.cart}
            	bgc={this.props.settings.headerFooterColor}
            	fontColor={this.props.settings.hfFontColor}
            	showHome={true}
	            showSearch={true}
	            showCart={true}
	            showReviews={true}
				settings={this.props.settings} />
    	)
    }
    render() {
        return (
            <ons.Page 
            	renderToolbar={::this.renderToolbar} 
            	renderModal={::this.renderModal}
            	renderBottomToolbar={::this.renderBottomToolbar}>
            	
            	{::this.renderBackgroundStyle()}
				{/*todo <ons.ProgressBar indeterminate />*/}
				{::this.renderUserData()}
				{::this.renderPasswordBlock()}
				{::this.renderAddresses()}
				{::this.renderAddressesForm()}
				{::this.renderBonusSums()}
				{::this.renderOrders()}
				{::this.renderFavoritesPage()}
            </ons.Page>
        );
    }
};

function mapStateToProps (state) {
    return state
}

function mapDispathToProps (dispath) {
    return bindActionCreators({ 
    	loadProfile, 
    	setName, 
    	setPhone, 
    	setEmail, 
    	sendProfile, 
    	signIn, 
    	signUp, 
    	deleteAddress, 
    	addAddress,
    	fetchOrderDetails, 
    	setOrderDetailsId, 
    	resendOrder,
    	resetPassword,
    	changePassword,
        openSideMenu
    }, dispath)
}

export default connect(mapStateToProps, mapDispathToProps)(ProfilePage);

class UserDataForm extends Component {
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
	render() {
		const src = this.props.avatar ? `${getImageUrl(this.props.avatar)}` : '';
	    const bcgStyle = {
	    	backgroundImage: `url('${src}')`,
	      	backgroundSize: 'cover',
	      	backgroundRepeat: 'no-repeat',
	      	backgroundPosition: 'center',
	      	width: 160,
		    height: src === '' ? 0 : 160,
		    margin: '20px auto',
		    borderRadius: 80
	    };

		return (
			<section style={{textAlign: 'center'}}>
				<Formsy.Form onValidSubmit={::this.submit} onValid={::this.enableButton} onInvalid={::this.disableButton}>
					<ons.ListHeader style={{color: this.props.fontColor}}>Данные пользователя</ons.ListHeader>

					<div style={bcgStyle}></div>
					<input type="file" id="imgchooser" name="image" />

					<ValidationInput
						name="name"
						inititalValue={this.props.name}
						placeholder="Ф.И.О."
						type="text" />

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
						validationError="Некорректный номер телефона" />

					<p>
						<button className="button" disabled={!this.state.canSubmit}>
							<span>Сохранить</span>
						</button>
					</p>
				</Formsy.Form>
			</section>
		);
	}
}

class ChangePasswordForm extends Component {
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
	render() {
		return (
			<section style={{textAlign: 'center'}}>
				<Formsy.Form onValidSubmit={::this.submit} onValid={::this.enableButton} onInvalid={::this.disableButton}>
					<ons.ListHeader style={{color: this.props.fontColor}}>Изменить пароль</ons.ListHeader>

					<ValidationInput 
						name="password1"
						placeholder="Пароль"
						type="password"  
						required />

					<ValidationInput 
						name="password2"
						placeholder="Подтверждение пароля"
						type="password"
						validations="equalsField:password1"
                        validationErrors={{
                            equalsField: 'Пароли не совпадают.'
                        }}
						required />

					<p>
						<button className="button" disabled={!this.state.canSubmit}>
							<span>Изменить</span>
						</button>
					</p>
				</Formsy.Form>
			</section>
		);
	}
}