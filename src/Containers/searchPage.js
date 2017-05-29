import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ons from 'react-onsenui';
import TopToolbar from '../Components/topToolbar';
import BottomToolbar from '../Components/bottomToolbar';
import BackgroundStyle from '../Components/backgroundStyle';
import { searchProducts, foundProductsReceived, setProductId } from '../Actions/catalog';
import { getProductImageUrl } from '../utils/product';
import { minPriceValue } from '../utils/search';
import ProductPage from './productPage';
import { openSideMenu } from '../Actions/sideMenu';

class SearchPage extends Component {
    state = {
        name: null,
        categoryName: '',
        categoryId: 0,
        startPrice: null,
        endPrice: null,
        currentSortTypeIndex: 0,
        sortTypes: [
            'По цене (по возрастанию)',
            'По цене (по убыванию)',
            'По названию (от А до Я)',
            'По названию (от Я до А)'
        ],
        pageNumber: 0,
        moreProductsLoading: false
    };
    componentWillMount() {
        const category = this.props.catalog.categories.find(c => c.id === this.props.catalog.currentCategoryId);
        if(category) 
            this.setState({ categoryId: category.id, categoryName: category.name });
    }
    componentWillUnmount() {
        this.props.foundProductsReceived([], 0)
    }
    searchProducts(callback) {
        let sortByName, sortByPrice, sortDirection;
            switch(this.state.currentSortTypeIndex) {
                case 0:
                    sortByName = false;
                    sortByPrice = true;
                    sortDirection = 'Asc';
                    break;
                case 1:
                    sortByName = false;
                    sortByPrice = true;
                    sortDirection = 'Desc';
                    break;
                case 2:
                    sortByName = true;
                    sortByPrice = false;
                    sortDirection = 'Asc';
                    break;
                case 3:
                    sortByName = true;
                    sortByPrice = false;
                    sortDirection = 'Desc';
                    break;
            }

            this.props.searchProducts( 
                this.state.categoryId, {
                    name: this.state.name, 
                    startPrice: this.state.startPrice, 
                    endPrice: this.state.endPrice,
                    pageNumber: this.state.pageNumber,
                    sortByName,
                    sortByPrice,
                    sortDirection,
                    done: callback
                }
            );
    }
    renderBackgroundStyle() {
        return <BackgroundStyle color={this.props.settings.backGroundColor} />
    }
    renderToolbar() {
        const props = {
            name: 'Поиск',
            address: '',
            onBack: ::this.props.back,
            bgc: this.props.settings.headerFooterColor,
            fontColor: this.props.settings.hfFontColor,
            needBackButton: true
        };

        if(this.props.settings.onePageCatalog) {
            props.needButterBread = true;
            props.onButterClick = () => this.props.openSideMenu();
        }

        return <TopToolbar {...props} />
    }
    renderRadioRow(type, index) {
        return (
            <ons.ListItem key={index} tappable style={{color: this.props.settings.bgFontColor}}>
                <label className='left'>
                    <ons.Input
                        inputId={`sortType-${index}`}
                        checked={index === this.state.currentSortTypeIndex}
                        onChange={() => {
                            this.setState({ currentSortTypeIndex : index, pageNumber: 0 });        
                            ::this.searchProducts();
                        }}
                        type='radio'
                    />
                </label>
                <label htmlFor={`sortType-${index}`} className='center'>{type}</label>
            </ons.ListItem>
        )
    }
    renderProductRow(product, index) {
        const bcgStyle = {
            backgroundImage: `url('${getProductImageUrl(product.images[0])}')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
        };

        const textStyle = {
            maxHeight: 40,
            overflow: 'hidden',
            display: 'inline-block'
        };

        const minPrice = minPriceValue(product);
        
        return (
            <div
                key={product.id}
                className="product-row" 
                onClick={() => {
                    this.props.setProductId(product.id);
                    this.props.changePage(ProductPage, false);
                }}>
                    <div className="product-row__thumbnail" style={bcgStyle}></div>
                    <div className="product-row__desc" style={{display: 'block', paddingTop: 10}}>
                        <div style={textStyle}>{product.name}</div>     
                    </div>
                    {this.renderMinPrice(minPrice)} 
            </div>
        )
    }
    renderMinPrice(minPrice) {
        if(minPrice === undefined)
            return;

        const value1 = `${minPrice.value} р.`;
        const value2 = minPrice.value2 !== 0 ? `${minPrice.value2} р.` : '';        

        return (
            <div className="product-row__order">
                <div className={value2 !== '' ? 'through' : ''}>{value1}</div>
                <div className="red">{value2}</div>
            </div>
        )
    }
    renderCategoryRow(category) {
        return (
            <ons.ListItem key={category.id} tappable style={{color: this.props.settings.bgFontColor}}>
                <label className='left'>
                    <ons.Input
                        inputId={`category-${category.id}`}
                        checked={category.id === this.state.categoryId}
                        onChange={() => { this.setState({ categoryId: category.id }); }}
                        type='radio'
                    />
                </label>
                <label htmlFor={`category-${category.id}`} className='center'>{category.name}</label>
            </ons.ListItem>
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
                showSearch={false}
                showCart={true}
                showProfile={true}
                showReviews={true}
                settings={this.props.settings} />
        )
    }
    render() {
        return (
            <ons.Page 
                renderToolbar={::this.renderToolbar}
                renderBottomToolbar={::this.renderBottomToolbar}>
                
                {::this.renderBackgroundStyle()}
                <section style={{textAlign: 'center'}}>
                    <p>
                        <ons.Input className="input--full"
                            onChange={(e) => { this.setState({ name: e.target.value }) }}
                            modifier='underbar'
                            placeholder='Введите запрос' />

                    </p>
                    <p>
                        <ons.Input className="input--full" value={this.state.categoryName}
                            onChange={(e) => { this.setState({ categoryName: e.target.value, categoryId: 0 }) }}
                            modifier='underbar'
                            placeholder='Выберите категорию' />
                        <ons.List
                            dataSource={this.props.catalog.categories.filter(c => this.state.categoryName && c.name.toLowerCase().indexOf(this.state.categoryName.toLowerCase()) !== -1)}
                            renderRow={::this.renderCategoryRow}/>                            
                    </p>
                    <div style={{color: this.props.settings.bgFontColor}}>Цена</div>
                    <p>
                        <ons.Input className="input--half"
                            onChange={(e) => { this.setState({ startPrice: e.target.value }) }}
                            modifier='underbar'
                            type='number'
                            float
                            placeholder='От' />

                        <ons.Input className="input--half input--half-last"
                            onChange={(e) => { this.setState({ endPrice: e.target.value }) }}
                            modifier='underbar'
                            type='number'
                            float
                            placeholder='До' />
                            
                    </p>
                    <ons.List
                        dataSource={this.state.sortTypes}
                        renderRow={::this.renderRadioRow}/>
                    <ons.ProgressBar indeterminate style={{visibility: this.props.catalog.fetching ? 'visible' : 'hidden'}} />
                    <p>
                        <ons.Button
                            onClick={() => {
                                this.setState({ pageNumber: 0 });
                                ::this.searchProducts();
                            }}>
                            <span>Начать поиск</span>
                        </ons.Button>
                    </p>
                </section>
                
                <ons.List
                    style={{color: this.props.settings.bgFontColor}}
                    renderRow={::this.renderProductRow}
                    dataSource={this.props.catalog.foundProducts}/>

                <ons.ProgressBar indeterminate style={{ visibility: this.state.moreProductsLoading ? 'visible' : 'hidden' }} />
                
                <p style={{ textAlign: 'center' }}>
                    <ons.Button style={{ visibility: this.state.moreProductsLoading || this.props.catalog.foundProducts.length === 0 ? 'hidden' : 'visible' }} onClick={() => {
                        const pageNumber = this.state.pageNumber + 1;

                        this.setState({ pageNumber: pageNumber, moreProductsLoading: true });
                        ::this.searchProducts(() => this.setState({ moreProductsLoading: false }) );    
                    }}>
                        <span>Загрузить еще</span>                  
                    </ons.Button>
                </p>
            </ons.Page>
        );
    }
}

function mapStateToProps (state) {
    return state
}

function mapDispathToProps (dispath) {
    return bindActionCreators({
        searchProducts,
        foundProductsReceived,
        setProductId,
        openSideMenu
    }, dispath)
}

export default connect(mapStateToProps, mapDispathToProps)(SearchPage);