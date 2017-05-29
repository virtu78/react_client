import React, { Component, PropTypes } from 'react';
import FilialPage from '../Containers/filialPage';
import SearchPage from '../Containers/searchPage';
import CartPage from '../Containers/cartPage';
import ReviewsPage from '../Containers/reviewsPage';
import ProfilePage from '../Containers/profilePage';
import AdvertisePage from '../Containers/advertisePage';
import * as ons from 'react-onsenui';
import { getCurrentFilial } from '../utils/filial';
import { getSum } from '../utils/cart';

export default class BottomToolbar extends Component {
    renderHome() {
        if(!this.props.showHome)
            return; 
                    
        return ( 
            <i className="ion-ios-home-outline bottom-toolbar__button"
               style={{color: this.props.fontColor}}
               onClick={() => this.props.changePage(FilialPage, true)} />
        )
    }
    renderSearch() {
        if(!this.props.showSearch)
            return;

        return ( 
            <i className="ion-ios-search-strong bottom-toolbar__button" 
               style={{color: this.props.fontColor}}
               onClick={() => this.props.changePage(SearchPage)} />
        )
    }
    renderCart() {
        if(!this.props.showCart)
            return;

        if(this.props.settings.noOrderMode)
            return;

        const sum = getSum(this.props.cart);

        return ( 
            <i className="ion-ios-cart-outline bottom-toolbar__button"
               style={{color: this.props.fontColor}}
               onClick={() => this.props.changePage(CartPage)}>
                    <div className="bottom-toolbar__sum" style={{ display: sum !== 0 ? 'block' : 'none' }}>{sum}</div>
            </i>
        )
    }
    renderProfile() {
        if(!this.props.settings.noOrderMode)
            return;

        if(!this.props.showProfile)
            return;

        return (
            <i className="ion-ios-person bottom-toolbar__button"
               style={{color: this.props.fontColor}}
               onClick={() => this.props.changePage(ProfilePage)} />
        )
    }
    renderReviews() {
        if(!this.props.showReviews)
            return;

        if(this.props.settings.noComments)
            return;

        return (
            <i className="ion-ios-chatboxes-outline bottom-toolbar__button" 
               style={{color: this.props.fontColor}}
               onClick={() => this.props.changePage(ReviewsPage)} />
        )
    }
    renderPhone() {
        if(this.props.settings.onlyCity)
            return;

        const filial = getCurrentFilial(this.props.filial);

        return (
            <a href={`tel:${filial.phone}`}>
                <i className="ion-ios-telephone-outline bottom-toolbar__button"
                   style={{color: this.props.fontColor}} />
            </a>
        )
    }
    renderAD() {
        if(!this.props.settings.onlyCity)
            return;

        return (
            <i className="ion-flag bottom-toolbar__button"
               style={{color: this.props.fontColor}}
               onClick={() => this.props.changePage(AdvertisePage)} />
        )
    }
    render() {
        if(this.props.settings.sideMainMenu)
            return null;

		if(this.props.filial.filialId === undefined && !this.props.settings.noOrderMode)
			return null;

		return (
            <ons.BottomToolbar 
                ons-keyboard-inactive 
                className="bottom-toolbar" 
                style={{backgroundColor: this.props.bgc}}>
                {::this.renderHome()}
                {::this.renderSearch()}
                {::this.renderCart()}
                {::this.renderProfile()}
                {::this.renderReviews()}
                {::this.renderPhone()}                
                {::this.renderAD()}
            </ons.BottomToolbar>
        )
    }
}

BottomToolbar.propTypes = {
    filial: PropTypes.object.isRequired,
    cart: PropTypes.array.isRequired,
    bgc: PropTypes.string,
    fontColor: PropTypes.string,
    settings: PropTypes.object.isRequired
};