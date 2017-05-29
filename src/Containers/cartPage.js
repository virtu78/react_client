import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import * as ons from 'react-onsenui';
import * as Ons from 'onsenui';
import TopToolbar from '../Components/topToolbar'
import CouponForm from '../Components/couponForm';
import { incrementProductPriceCount, decrementProductPriceCount, removeProductPrice, clearCart } from '../Actions/cart';
import OrderPage from './orderPage';
import ProductPage from './productPage';
import { getProductImageUrl } from '../utils/product';
import { getCurrentFilial } from '../utils/filial';
import { getSum } from '../utils/cart';
import { getCouponDiscountSum, setCoupon, clearDiscounts, setComment, setPayType } from '../Actions/order';
import { setProductId } from '../Actions/catalog';
import BackgroundStyle from '../Components/backgroundStyle';
import { openSideMenu } from '../Actions/sideMenu';

class CartPage extends Component {
    renderBackgroundStyle() {
        return <BackgroundStyle color={this.props.settings.backGroundColor} />
    }
    renderToolbar() {
        const props = {
            name: 'Корзина',
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
    renderRow(price) {
        const src = getProductImageUrl(price.image);
        const bcgStyle = {
            backgroundImage: `url('${src}')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
        }

        return (
            <div 
                className="product-row"
                key={price.id} onClick={(e) => {
                    this.props.setProductId(price.productId);
                    this.props.changePage(ProductPage, false);
                }}>
                <div className="product-row__thumbnail" style={bcgStyle}></div>
                <div className="product-row__desc product-row__desc--cart" onClick={this.props.selectCallback} style={{display: 'block'}}>
                    <div style={nameStyle}>{`${price.productName} ${price.description || ''}`}</div>      
                </div>
                <div className="product-row__order product-row__order--cart">
                    <ons.Button className="cart__counter cart__counter--minus" onClick={(e) => { e.stopPropagation(); this.props.decrementProductPriceCount(price.id)} }><i className="ion-minus"></i></ons.Button>
                    <label className="cart__count">{price.count}</label>
                    <ons.Button className="cart__counter cart__counter--plus" onClick={(e) => { e.stopPropagation(); this.props.incrementProductPriceCount(price.id)} }><i className="ion-plus"></i></ons.Button>
                    <ons.Button className="cart__counter cart__counter--delete" onClick={(e) => { e.stopPropagation(); this.props.removeProductPrice(price.id)} }><i className="ion-close"></i></ons.Button>
                </div>
                <div className={`product-row__result-price ${price.value2 === 0 ? '' : 'through'}`}>{price.value * price.count} р.</div>
                <div className="product-row__result-price red" style={{top: 20}}>{`${price.value2 === 0 ? '' : price.value2 * price.count + ' р.'}`}</div>
            </div>
        );
    }
    renderClearCartButton() {
        if(this.props.cart.length === 0)
            return;

        return (
            <p style={{textAlign: 'center'}}>
                <ons.Button
                    onClick={() => { 
                        Ons.notification.confirm({
                            title: 'Очистка корзины',
                            message: 'Вы уверены?',
                            buttonLabels: ["Нет", "Да"],
                            callback: (i) => {
                                if(i === 1) {
                                    this.props.clearCart();
                                    this.props.clearDiscounts();
                                }
                            }
                        }) 
                    }}>
                    <span>Очистить корзину</span>
                </ons.Button>
            </p>
        )
    }
    render() {
        const filial = getCurrentFilial(this.props.filial);
        const sum = getSum(this.props.cart);
        const deliveryPrice = sum >= filial.deliveryFreeSum ? 0 : filial.minDeliverySum;
        const buyMore = sum >= filial.deliveryFreeSum/100*this.props.settings.freeDeliveryPercentNotify && sum <= filial.deliveryFreeSum ? filial.deliveryFreeSum - sum : 0;
//todo подумать что с доставкой если у нас онли сити
        return (
            <ons.Page className="cart" renderToolbar={::this.renderToolbar}>
                {::this.renderBackgroundStyle()}
                {::this.renderClearCartButton()}
                <ons.List
                    style={{color: this.props.settings.bgFontColor}}
                    dataSource={this.props.cart}
                    renderRow={::this.renderRow} />
                <div className="cart__result" style={{color: this.props.settings.bgFontColor}}>
                    <span>Сумма заказа:</span>
                    <span className="pull-right">{sum} р.</span>
                </div>
                <div className="cart__result" style={{color: this.props.settings.bgFontColor}}>
                    <span>Доставка:</span>
                    <span className="pull-right">{`${deliveryPrice === 0 ? 'бесплатно' : deliveryPrice} р.`}</span>
                </div>
                <div className="cart__result cart__result--uppercase" style={{color: this.props.settings.bgFontColor}}>
                    <span>Итого:</span>
                    <span className="pull-right">{sum + deliveryPrice} Р.</span>
                </div>
                <div className="cart__buy-more">{buyMore !== 0 ? `Закажите еще товара на ${buyMore} рублей и получите доставку бесплатно!` : ''} {}</div>
                <div className="cart__coupon">
                    <CouponForm
                        getCouponDiscountSum={this.props.getCouponDiscountSum} 
                        discounts={this.props.order.discounts}
                        prices={this.props.cart}
                        onChange={this.props.setCoupon}
                        fontColor={this.props.settings.bgFontColor} />
                </div>
                <div className="cart__comment">
                    <ons.Input
                        className='input--half'
                        value={this.props.order.comment}
                        onChange={(e) => {this.props.setComment(e.target.value)}}
                        modifier='underbar'
                        float
                        placeholder='Комментарий' />
                </div>
                <div className="cart__pay_type">
                    <ons.ListHeader>Тип оплаты</ons.ListHeader>
                    <ons.ListItem tappable>
                        <label className='left'>
                            <ons.Input
                                inputId='radio-cash'
                                type="radio"
                                checked={this.props.order.useCash}
                                onChange={() => this.props.setPayType(true)} />
                        </label>
                        <label htmlFor={`radio-cash`} className='center'>
                            Наличный расчет.
                        </label>
                    </ons.ListItem>
                    <ons.ListItem tappable>
                        <label className='left'>
                            <ons.Input
                                inputId='radio-cart'
                                type="radio"
                                checked={!this.props.order.useCash}
                                onChange={() => this.props.setPayType(false)}
                            />
                        </label>
                        <label htmlFor={`radio-cart`} className='center'>
                            Безналичный расчет.
                        </label>
                    </ons.ListItem>
                </div>

                {/*style={{display: sum === 0 ? 'none' : 'inline-block'} todo если заказ меньше чем мин сумма доставки}*/}
                <p style={{textAlign: 'center'}}>
                    <ons.Button
                        onClick={() => this.props.changePage(OrderPage)}>
                        <span>Оформить заказ</span>
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
        getCouponDiscountSum, 
        setCoupon,
        setComment,
        setPayType,
        incrementProductPriceCount, 
        decrementProductPriceCount, 
        removeProductPrice,
        setProductId,
        clearCart,
        clearDiscounts,
        openSideMenu
    }, dispath)
}

export default connect(mapStateToProps, mapDispathToProps)(CartPage);

const nameStyle = {
    display: 'inline-block',
    maxHeight: 40,
    overflow: 'hidden'
}