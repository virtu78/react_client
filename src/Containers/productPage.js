import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import * as ons from 'react-onsenui';
import * as Ons from 'onsenui';
import { addProductPrice, incrementProductPriceCount, decrementProductPriceCount, removeProductPrice } from '../Actions/cart';
import { fetchFeatured } from '../Actions/catalog';
import { fetchReviews, sendReview } from '../Actions/reviews';
import { addFavorite, removeFavorite } from '../Actions/profile';
import { sendOrder } from '../Actions/order';
import TopToolbar from '../Components/topToolbar';
import BottomToolbar from '../Components/bottomToolbar';
import FastOrderModal from '../Components/fastOrderModal';
import ListModal from '../Components/listModal';
import Featured from '../Components/featured';
import Reviews from '../Components/reviews';
import Evaluator from '../Components/evaluator';
import ReviewForm from '../Components/reviewForm';
import FavoriteStar from '../Components/favoriteStar';
import AboutCompany from '../Components/aboutCompany';
import { getCartPriceCount } from '../utils/cart';
import { getProductImageUrl, getImageUrl } from '../utils/product';
import { createTopToolbarProps } from '../utils/common';
import BackgroundStyle from '../Components/backgroundStyle';
import { openSideMenu } from '../Actions/sideMenu';

class ProductPage extends Component {
	state = {
		showPriceList: false,
		showFeaturedPriceList: false,
		showFastOrder: false,
		featuredPriceList: [],
		featuredCallback: () => { },
		backGroundColor: undefined,
		headerFooterColor: undefined,
		fontColor: undefined,
		rate: 5
	};
	componentWillMount() {
		const id = this.props.catalog.currentProductId;
		this.product = this._findProduct(this.props.catalog.products, this.props.profile.favorites, this.props.catalog.foundProducts, id);
		this.price = this.product.prices[0];

		const featured = [];
		for(let f in this.product.featured) 
			featured.push(f);

		this.props.fetchFeatured(featured);			
		this.props.fetchReviews(id);		
	}
	componentDidMount() {
		::this.setColors();
	}
	_findProduct(products, favorites, searchResults, id) {
		const find = (products) => {
			let length = products.length;
			for(let i = 0; i < length; i++)
				if(products[i].id === id)
					return products[i];
		};

		return find(products) || find(favorites) || find(searchResults)
	}
	setColors() {
		if(this.props.settings.categoriesColors) {
			const length = this.props.settings.categoriesColors.length;
			for(let i = 0; i < length; i++) {
				const c = this.props.settings.categoriesColors[i];
				if(c.categoryId === this.props.catalog.currentCategoryId) {
					this.setState({ 
						backGroundColor: c.backGroundColor, 
						headerFooterColor: c.headerFooterColor, 
						fontColor: c.bgFontColor,
						hfFontColor: c.hfFontColor,
						shouldUpdate: true 
					});
					return;
				}
			}
		}

		this.setState({
			backGroundColor: this.props.settings.backGroundColor,
			headerFooterColor: this.props.settings.headerFooterColor,
			fontColor: this.props.settings.bgFontColor,
			hfFontColor: this.props.settings.hfFontColor
		});
	}
    renderToolbar() {
		const props = createTopToolbarProps(this.props.filial, this.props.settings, this.state.headerFooterColor, this.state.hfFontColor);
        props.needBackButton = true;
		props.onBack = ::this.props.back;

        if(this.props.settings.onePageCatalog) {
            props.needButterBread = true;
            props.onButterClick = this.props.openSideMenu;
        }

        return <TopToolbar {...props} />
    }
    renderBackgroundStyle() {
		return <BackgroundStyle color={this.state.backGroundColor} />
	}
    renderModal() {
        if(this.state.showFastOrder)
            return (
        		<FastOrderModal
    				close={() => this.setState({ showFastOrder: false })}
    				additionalFields={this.props.order.additionalFields}
    				sendOrder={(model) => {
    					const {name, phone, email, address, ...addFields} =  model;
    					this.sendOrder(name, phone, email, address, this.props.address.id, false, undefined, this.price.id, addFields, 0, true, undefined);
    					Ons.notification.alert({
							message: 'Заказ отправлен',
							title: ''
						});
    				}}
    				name={this.props.profile.name}
    				phone={this.props.profile.phone}
    				email={this.props.profile.email}
    				addresses={this.props.profile.addresses} />
    		);

        if(this.state.showPriceList)
        	return <ListModal 
        		headerText={'Выберите'}
        		source={this.product.prices.map(p => { return { name: p.description, value: p.id }})} 
        		selectCallback={(id) => {
        			this.price = this.product.prices.find(p => p.id === id);
        			this.setState({ showPriceList: false });
        		}} 
        		closeCallback={() => { this.setState({ showPriceList: false }) }}/>

        if(this.state.showFeaturedPriceList)
        	return <ListModal
        		headerText={'Выберите'}
        		source={this.state.featuredPriceList.map(p => { return { name: p.description, value: p.id }})}
        		selectCallback={(id) => { 
        			this.state.featuredCallback(id);
        			this.setState({ showFeaturedPriceList: false }); 
        		}} 
        		closeCallback={() => { this.setState({ showFeaturedPriceList: false }) }} />
    }
	renderImageCarousel() {
		return (
			<div className="image-carousel">
				<ons.Carousel swipeable autoScroll fullscreen>
					{
						this.product.images.map((img, index) => {
								return <ons.CarouselItem key={index}>
									<div className="image-carousel__img"
										style={{backgroundImage: `url('${getProductImageUrl(img)}')`}}>
									</div>
								</ons.CarouselItem>
							}
						)
					}
				</ons.Carousel>
			</div>
		)
	}
	renderLabels() {
		if(this.product.labels.length === 0)
			return;

		const blockStyle = {
			paddingTop: 5,
			textAlign: 'center'
		};

		const labelStyle = {
			width: 50,
			margin: '0 5px'
		};

		return (
			<div style={blockStyle}>
				{this.product.labels.map((l) => {
					const id = Object.getOwnPropertyNames(l.images)[0];
					return <img key={id} style={labelStyle} src={ getImageUrl( l.images[id] ) } />
				})}
			</div>
		)
	}
	renderFeatured() {
		if(this.props.catalog.featured.length === 0)
			return;

		return (
			<div className="product__more">
				<h4 className="product__more-header">С этим товаром покупают</h4>
				{this.props.catalog.featured.map((f, index) => 
					<Featured key={`featured-${index}`} 
					          product={f}
							  pricesCallback={(featuredCallback) => { 
							  	this.setState({ 
							  		showFeaturedPriceList: true,
							  		featuredPriceList: f.prices,
									featuredCallback: featuredCallback
							  	}); 
							  }}
							  count={priceId => getCartPriceCount(this.props.cart, priceId)}
							  decrementCallback={(price) => {
						        const count = getCartPriceCount(this.props.cart, price.id);
						        count === 1 
						          ? this.props.removeProductPrice(price.id) 
						          : this.props.decrementProductPriceCount(price.id)}
						      }
						      incrementCallback={(price) => {
						        const count = getCartPriceCount(this.props.cart, price.id); 
						        count === 0 
						          ? this.props.addProductPrice(price, f.images[0], f.name) 
						          : this.props.incrementProductPriceCount(price.id)}
						      } />)}
			</div>
		)
	}
	renderReviewsBlock() {
		if(this.props.settings.noComments)
			return;

		return (
			<div className="product__reviews" style={{color: this.state.fontColor}}>
				{::this.renderStats()}
				<Evaluator title="Оцените товар" onChange={(r) => this.setState({ rate: r })} />
				{::this.renderReviewsForm()}
				{::this.renderReviews()}
			</div>
		)
	}
	renderStats() {
		if(this.props.catalog.reviews.length === 0)
		return;

		const count = this.props.catalog.reviews.filter(r => r.parentId === 0).length;
		const sum = this.props.catalog.reviews.filter(r => r.parentId === 0).reduce((res, rev) => { res += rev.rate; return res; } , 0);
		let result = Math.round(sum/count);

		return (
			<div className="stats">
                	<span className="stats__stars">
                    	{[1, 2, 3, 4, 5].map((i) => <i key={i} className={`fa fa-star${i > result ? '-o' : ''}`} />)}
                	</span>
				<span className="stats__count">{`Рейтинг: ${result}`}</span>
			</div>
		)
	}
	renderReviewsForm() {
		return (
			<ReviewForm
				name={this.props.profile.name}
				email={this.props.profile.email}
				onSubmit={(name, email, title, description) => {
                    		this.props.sendReview(name, email, title, description, this.state.rate, this.props.catalog.currentProductId);//todo стар каунт
                        	Ons.notification.alert({
                            	message: 'Отзыв отправлен',
                                title: ''
                    	});
                	}} />
		)
	}
	renderReviews() {
		if(this.props.catalog.reviews.length === 0)
			return;

		return (
			<Reviews
				items={this.props.catalog.reviews}
				defaultImg={this.props.settings.reviewDefaultImagePath}
				defaultOwnerImg={this.props.settings.logoImagePath || ''}
				useGravatar={this.props.settings.useGravatar} />
		)
	}
	renderPriceBlock() {
		if(this.price === undefined)
			return;

		const display = this.product.prices.length <= 1 ? 'none' : 'inline-block';

		return (
			<p style={{textAlign: 'center'}}>
				<ons.Button className="product__size" onClick={() => this.setState({ showPriceList: true })} style={{display}}>
					{this.price.description}
					<i className="ion-chevron-down pull-right" />
				</ons.Button>
				<label className={`product__price ${this.price.value2 === 0 ? '' : 'product__price--through'}`}>
					{this.price.value} руб.
				</label>
				<label className={`product__price product__price--red`}>
					{this.price.value2 === 0 ? '' : `${this.price.value2} руб.`}
				</label>
			</p>
		)
	}
	renderOrderBlock() {
		if(this.props.settings.noOrderMode)
			return;

		if(this.price === undefined)
			return;

		const count = getCartPriceCount(this.props.cart, this.price.id);

		return (
			<p style={{textAlign: 'center'}}>
				<ons.Button className="product__counter product__counter--minus" onClick={() => 
					count === 1 
						? this.props.removeProductPrice(this.price.id) 
						: this.props.decrementProductPriceCount(this.price.id)}>
					<i className="ion-minus" />
				</ons.Button>
				
				<label className="product__count">{count}</label>
						
				<ons.Button className="product__counter product__counter--plus" onClick={() => 
					count === 0 
						? this.props.addProductPrice(this.price, this.product.images[0], this.product.name)
						: this.props.incrementProductPriceCount(this.price.id)}>
					<i className="ion-plus" />
				</ons.Button>

				<ons.Button className="product__buy-now hidden" disabled={count === 0}
					onClick={() => this.setState({ showFastOrder: true }) }>
					<span>Купить сейчас</span>
				</ons.Button>
			</p>
		)
	}
	renderFavorite(isFavorite) {
        if(this.props.profile.authToken === undefined)
        	return;

		return (
			<FavoriteStar
				addFavorite={() => this.props.addFavorite(this.product.id)}
				removeFavorite={() => this.props.removeFavorite(this.product.id)}
				isFavorite={isFavorite} />
		)
	}
	renderTitle() {
		const isFavorite = this.props.profile.favoritesIds.find(f => f === this.product.id) !== undefined;

		return (
			<h3 className="product__name">
				<span style={{ marginLeft: 20}}>{this.product.name}</span>
				{::this.renderFavorite(isFavorite)}
			</h3>
		)
	}
	renderBottomToolbar() {
		return (
			<BottomToolbar 
            	changePage={this.props.changePage} 
            	filial={this.props.filial} 
            	cart={this.props.cart}
            	bgc={this.state.headerFooterColor}
            	fontColor={this.state.hfFontColor}
            	showHome={true}
	            showSearch={false}
	            showCart={true}
	            showProfile={true}
	            showReviews={true}
				settings={this.props.settings} />
		)
	}
	renderAboutCompany() {
		if(!this.props.settings.onlyCity || !this.props.settings.showFilialInfoInProduct)
			return;

        const filialId = Object.getOwnPropertyNames(this.product.places)[0];
		const filial = this.props.filial.filials.find(f => f.id == filialId);

		return <AboutCompany filial={filial} />
	}
    render() {
        return (
            <ons.Page 
            	renderToolbar={::this.renderToolbar} 
            	renderModal={::this.renderModal}
            	renderBottomToolbar={::this.renderBottomToolbar}>
            	{::this.renderBackgroundStyle()}
				<div className="product" style={{color: this.state.fontColor}}>
					{::this.renderTitle()}
					{::this.renderImageCarousel()}
					{::this.renderLabels()}
					<p className="product__desc">
						{this.product.longDescription}
					</p>
					{::this.renderPriceBlock()}
					{::this.renderOrderBlock()}
				</div>
				{::this.renderAboutCompany()}
				{::this.renderFeatured()}
				{::this.renderReviewsBlock()}
            </ons.Page>
        );
    }
}


function mapStateToProps (state) {
    return state
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({ 
    	addProductPrice, 
    	incrementProductPriceCount, 
    	decrementProductPriceCount, 
    	removeProductPrice,
    	fetchFeatured,
    	fetchReviews,
    	sendReview,
    	addFavorite,
    	removeFavorite,
    	sendOrder,
        openSideMenu
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage);