import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ons from 'react-onsenui';
import axios from 'axios';
import { fetchCategories, fetchProducts, fetchProductsReceived, setCategoryId, setProductId } from '../Actions/catalog';
import { addProductPrice, incrementProductPriceCount, decrementProductPriceCount, removeProductPrice } from '../Actions/cart';
import { addFavorite, removeFavorite } from '../Actions/profile';
import { openSideMenu } from '../Actions/sideMenu';
import TopToolbar from '../Components/topToolbar';
import Infobar from '../Components/infobar'
import BottomToolbar from '../Components/bottomToolbar';
import ProductRow from '../Components/productRow';
import CategoryRow from '../Components/categoryRow';
import ListModal from '../Components/listModal';
import ProductPage from './productPage';
import { getCurrentFilial } from '../utils/filial';
import { getCartPriceCount } from '../utils/cart';
import { createTopToolbarProps, getHeader } from '../utils/common';
import { HOST } from '../utils/constants';
import BackgroundStyle from '../Components/backgroundStyle';

class CatalogPage extends Component {
	state = {
		showPriceList: false,
		priceList: [],
		productRowCallback: () => {},
		backGroundColor: undefined,
		headerFooterColor: undefined,
		fontColor: undefined,
        pageNumber: 0,
        moreProductsLoading: false,
        productsDbCount: 0,
        shouldUpdate: true
	};
	componentWillMount() {
		this.props.fetchCategories();

		const categoryId = this.props.settings.onePageCatalog
			? 0
			: this.props.catalog.currentCategoryId;

		this.props.fetchProducts([categoryId], {
            pageNumber: 0
        });

		this.filial = getCurrentFilial(this.props.filial);
		this.path = [];
	}
	componentDidMount() { 
		::this.setColors();
	}
    componentWillReceiveProps(nextProps) {
		if(nextProps.catalog.products !== this.props.catalog.products) {
			const categories = this.props.catalog.selectedCategories.length !== 0
				? this.props.catalog.selectedCategories
				: [this.props.catalog.currentCategoryId];

			this.fetchProductsCount(categories);
        }
	}
	fetchProductsCount(categoryIds) {
		const headers = getHeader(this.props.filial, this.props.settings.onlyCity);

        axios.post(`${HOST}/api/catalog/ProductsCount`, { categoryId: categoryIds }, { headers })
			.then(res => {
                this.setState({ productsDbCount: res.data });
			});
	}
	changeCategory(id) {
		this.props.fetchProductsReceived([], 0);
        this.setState({ pageNumber: 0, shouldUpdate: true });
		this.props.setCategoryId(id);
		this.props.fetchProducts([id], {
            pageNumber: 0
        });
		::this.setColors(id);
	}
	setColors(nextCategoryId) {
		if(nextCategoryId === undefined)
			nextCategoryId = this.props.catalog.currentCategoryId;

		if(this.props.settings.categoriesColors) {
			const length = this.props.settings.categoriesColors.length;
			for(let i = 0; i < length; i++) {
				const c = this.props.settings.categoriesColors[i];
				if(c.categoryId === nextCategoryId) {
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
			hfFontColor: this.props.settings.hfFontColor,
			shouldUpdate: true
		});
	}
	renderToolbar() {
		const props = createTopToolbarProps(this.props.filial, this.props.settings, this.state.headerFooterColor, this.state.hfFontColor);

		if(this.props.settings.onePageCatalog) {
            props.needBackButton = false;
            props.needButterBread = true;
			props.onButterClick = () => this.props.openSideMenu(true);
		} else {
            props.needBackButton = this.props.needBackButton() || this.path.length > 1;
            props.onBack = () => this.path.length === 1
                ? this.props.back()
                : ::this.changeCategory(this.path[this.path.length - 2].id);
        }

		return ( 
			<TopToolbar {...props} />
		)
	}
	renderModal() {
		if(this.state.showPriceList)
			return ( 
				<ListModal 
					headerText={'Выберите'} 
					source={this.state.priceList.map(p => { return { name: p.description, value: p.id }})}
					selectCallback={(id) => { 
						this.state.productRowCallback(id);
						this.setState({ showPriceList: false, shouldUpdate: true });
					}}
					closeCallback={() => this.setState({ showPriceList: false, shouldUpdate: true })} />  
			)
	}
	renderBackgroundStyle() {
		return <BackgroundStyle color={this.state.backGroundColor} />
	}
	renderInfobar() {
		if(this.props.settings.onlyCity)
			return;

		return (
			<Infobar 
				minDeliveryTime={this.filial.minDeliveryTime}
				minOrderSum={this.filial.minOrderSum}
				minDeliverySum={this.filial.minDeliverySum}
				deliveryFreeSum={this.filial.deliveryFreeSum}
				fontColor={this.state.fontColor} />		
		);
	}
	renderCategoryRow(category) {
		return (
            <CategoryRow
				key={category.id}
				category={category}
				onClick={::this.changeCategory} />
		);    
	}
	renderProductList() {
		return (
			<div style={{color: this.state.fontColor}}>
				{this.props.catalog.products.map((product) => {
                    const isFavorite = this.props.profile.favoritesIds.find(f => f === product.id) !== undefined;

					return (
						<ProductRow
							key={product.id}
							product={product}
							count={priceId => getCartPriceCount(this.props.cart, priceId)}
							selectCallback={() => {
								this.props.setProductId(product.id);
								this.props.changePage(ProductPage, false);
							}}
							pricesCallback={(productRowCallback) => this.setState({
								showPriceList: true,
								priceList: product.prices,
								productRowCallback: productRowCallback,
								shouldUpdate: true
							})}
							decrementCallback={(price) => {
								const count = getCartPriceCount(this.props.cart, price.id);
								count === 1
									? this.props.removeProductPrice(price.id)
									: this.props.decrementProductPriceCount(price.id)}
							}
							incrementCallback={(price) => {
								const count = getCartPriceCount(this.props.cart, price.id);
								count === 0
									? this.props.addProductPrice(price, product.images[0], product.name)
									: this.props.incrementProductPriceCount(price.id)}
							}
							addFavorite={() => this.props.addFavorite(product.id)}
							removeFavorite={() => this.props.removeFavorite(product.id)}
							isAutorised={this.props.profile.authToken !== undefined}
							noOrderMode={this.props.settings.noOrderMode}
							isFavorite={isFavorite}
						/>
					);
				})}
			</div>
		);
	}
	renderCategoriesList() {
		if(this.props.settings.onePageCatalog)
			return;

		const categories = this.props.catalog.categories.filter(c => c.parentId === this.props.catalog.currentCategoryId) || [];
		
		return (
			<ons.List
				style={{color: this.state.fontColor}}
				renderRow={::this.renderCategoryRow}
				dataSource={categories}
				renderHeader={::this.renderHeader} />
		)
	}
	renderHeader() {
		this.path.splice(0, Number.MAX_VALUE, { name: 'Каталог', id: null });
		
		let category = this.props.catalog.categories.find(c => c.id === this.props.catalog.currentCategoryId);
		if(typeof category === 'undefined')
			return;

		while(typeof category !== 'undefined') {
			this.path.splice(1, 0, { name: category.name, id: category.id });
			category = this.props.catalog.categories.find(c => c.id === category.parentId);
		}

		return ( 
			<ons.ListHeader>
				<div className="breadCrumbs" style={{color: this.state.fontColor}}>
				{ 
					this.path.map((p, i) => 
						<span className="breadCrumbs__item"
							key={i} 
							onClick={() => {           
								if(i === this.path.length - 1)
									return;
								::this.changeCategory(p.id);
							}}>
							<span className="breadCrumbs__name">{p.name}</span>
							<span className="breadCrumbs__separator">/</span>
					</span>)
				}
				</div>
			</ons.ListHeader>
		)
	}
	renderBottomToolbar() {
		return (
			<BottomToolbar 
				changePage={(p, isRes) => { 
					this.setState({ shouldUpdate: false }); 
					this.props.changePage(p, isRes, () => this.setState({ shouldUpdate: true }))
				}}
				filial={this.props.filial} 
				cart={this.props.cart}
				bgc={this.state.headerFooterColor}
				fontColor={this.state.hfFontColor}
				showHome={true}
				showSearch={true}
				showCart={true}
				showProfile={true}
				showReviews={true}
				settings={this.props.settings} />
		)
	}
	renderMoreProductsButton() {
		if(this.state.moreProductsLoading || this.props.catalog.fetching || !this.state.shouldUpdate)
			return;

		if(this.state.productsDbCount === this.props.catalog.products.length)
			return;

		return (
			<p style={{ textAlign: 'center' }}>
				<ons.Button onClick={() => {
					const pageNumber = this.state.pageNumber + 1;

		            this.setState({ pageNumber: pageNumber, moreProductsLoading: true, shouldUpdate: true });
		            this.props.fetchProducts([this.props.catalog.currentCategoryId], {
		                pageNumber: pageNumber,
		                done: () => this.setState({ moreProductsLoading: false })
		            });
				}}>
					<span>Загрузить еще</span>					
				</ons.Button>
			</p>
		)
	}
	render() {
		return  (
			<ons.Page
				renderToolbar={::this.renderToolbar}
                renderModal={::this.renderModal}
                renderBottomToolbar={::this.renderBottomToolbar}>

				{::this.renderBackgroundStyle()}				
				{::this.renderInfobar()}
				<ons.ProgressBar indeterminate style={{visibility: this.props.catalog.fetching ? 'visible' : 'hidden'}} />
				{::this.renderCategoriesList()}
				{::this.renderProductList()}
				<ons.ProgressBar indeterminate style={{ visibility: this.state.moreProductsLoading ? 'visible' : 'hidden' }} />
				
				{::this.renderMoreProductsButton()}
			</ons.Page>
		);
	}
}

function mapStateToProps (state) {
	return state
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({
		fetchCategories,
		fetchProducts,
		setCategoryId,
		setProductId,
		fetchProductsReceived,
		addProductPrice,
		incrementProductPriceCount, 
		decrementProductPriceCount, 
		removeProductPrice,
		addFavorite,
		removeFavorite,
        openSideMenu
	}, dispatch)
}

const exportPage = connect(mapStateToProps, mapDispatchToProps)(CatalogPage);

export default exportPage;