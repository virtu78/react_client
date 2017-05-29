import React, { Component } from 'react';
import * as ons from 'react-onsenui';
import * as Ons from 'react-onsenui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FilialPage from '../Containers/filialPage';
import SearchPage from '../Containers/searchPage';
import CartPage from '../Containers/cartPage';
import ReviewsPage from '../Containers/reviewsPage';
import ProfilePage from '../Containers/profilePage';
import AdvertisePage from '../Containers/advertisePage';

import { getCurrentFilial } from '../utils/filial';

import { fetchProducts, selectCategory, resetCategory } from '../Actions/catalog';
import { openSideMenu, closeSideMenu } from '../Actions/sideMenu';

class Splitter extends Component {
    close() {
        this.props.closeSideMenu();
    }
    selectCategory(id, selected) {
        this.props.selectCategory(id, selected);
        ::this.fetchProducts();
    }
    resetCategory(id) {
        ::this.close();
        this.props.resetCategory(id);
        setTimeout(::this.fetchProducts, 100);
    }
    fetchProducts() {
        this.props.fetchProducts(this.props.catalog.selectedCategories, {
            pageNumber: 0
        });
    }
    renderToolbar() {
        return (
            <ons.Toolbar>
                <div className='right'>
                    <ons.ToolbarButton onClick={::this.close}>
                        <ons.Icon icon='ion-navicon, material:md-menu' />
                    </ons.ToolbarButton>
                </div>
            </ons.Toolbar>
        )
    }
    renderMenu() {
        if(!this.props.settings.sideMainMenu)
            return;

        const style = {
            textAlign: 'center'
        };

        return (
            <div style={style}>
                {::this.renderHome()}
                {::this.renderCart()}
                {::this.renderProfile()}
                {::this.renderReviews()}
                {::this.renderPhone()}
                {::this.renderAD()}
            </div>
        )
    }
    renderHome() {
        /*if(!this.props.showHome)
            return;*/

        return (
            <i className="ion-ios-home-outline bottom-toolbar__button"
               onClick={() => this.props.changePage(FilialPage, true)} />
        )
    }
    renderSearch() {
        /*if(!this.props.showSearch)
            return;*/

        const style = {
            verticalAlign: 'middle'
        };

        return (
            <div onClick={() => this.props.changePage(SearchPage)}>
                <i style={style} className="ion-ios-search-strong bottom-toolbar__button" />
                <span>Поиск</span>
            </div>
        )
    }
    renderCart() {
        /*if(!this.props.showCart)
            return;*/

        if(this.props.settings.noOrderMode)
            return;

        return (
            <i className="ion-ios-cart-outline bottom-toolbar__button"
               onClick={() => this.props.changePage(CartPage)} />
        )
    }
    renderProfile() {
        if(!this.props.settings.noOrderMode)
            return;

        /*if(!this.props.showProfile)
            return;*/

        return (
            <i className="ion-ios-person bottom-toolbar__button"
               onClick={() => this.props.changePage(ProfilePage)} />
        )
    }
    renderReviews() {
        /*if(!this.props.showReviews)
            return;*/

        if(this.props.settings.noComments)
            return;

        return (
            <i className="ion-ios-chatboxes-outline bottom-toolbar__button"
               onClick={() => this.props.changePage(ReviewsPage)} />
        )
    }
    renderPhone() {
        if(this.props.settings.onlyCity)
            return;

        const filial = getCurrentFilial(this.props.filial);

        if(filial === undefined)
            return;

        return (
            <a href={`tel:${filial.phone}`}>
                <i className="ion-ios-telephone-outline bottom-toolbar__button" />
            </a>
        )
    }
    renderAD() {
        if(!this.props.settings.onlyCity)
            return;

        return (
            <i className="ion-flag bottom-toolbar__button"
               onClick={() => this.props.changePage(AdvertisePage)} />
        )
    }
    renderCategory(category) {
        const props = {
            key: category.id,
            style: {
                fontWeight: 600
            },
            onClick: (e) => {
                e.stopPropagation();
                e.preventDefault();//todo возможно их и в бекбоксах нужно делать
                if(e.target.tagName === 'INPUT')
                    return;

                ::this.resetCategory(category.id);
            }
        };

        const inputProps = {
            style: {
                position: 'absolute',
                right: 10,
                display: 'none'
            },
            type: 'checkbox',
            onChange: (e) => ::this.selectCategory(category.id, e.target.checked)
        };

        return (
            <div className="side-menu-category" {...props}>
                <ons.ListItem>
                    <span>{category.name}</span>
                    <Ons.Input {...inputProps} checked={this.props.catalog.selectedCategories.indexOf(category.id) !== -1} />
                </ons.ListItem>
                {::this.renderCategoriesByParentId(category.id)}
            </div>
        )
    }
    renderCategories() {
        if(!this.props.settings.onePageCatalog)
            return;

        if(this.props.sideMenu.showCatalog !== true)
            return;

        return (
            <div>
                <ons.List
                    dataSource={[{id: 0, name: 'Все'}]}
                    renderRow={::this.renderCategory}
                />
                {::this.renderCategoriesByParentId(null)}
            </div>
        )
    }
    renderCategoriesByParentId(parentId) {
        const categories = this.props.catalog.categories.filter(c => c.parentId === parentId);
        return (
            <ons.List
                dataSource={categories}
                renderRow={::this.renderCategory}
            />
        )
    }
    render() {
        const props = {
            side: 'left',
            width: '90%',
            collapse: true,
            isSwipeable: false,
            isOpen: this.props.sideMenu.isOpen
        };

        return (
            <ons.Splitter>
                <ons.SplitterSide {...props}>
                    <ons.Page renderToolbar={::this.renderToolbar}>
                        {::this.renderSearch()}
                        {::this.renderCategories()}
                        {::this.renderMenu()}
                    </ons.Page>
                </ons.SplitterSide>
                <ons.SplitterContent>
                    {this.props.children}
                </ons.SplitterContent>
            </ons.Splitter>
        )
    }
}

function mapStateToProps (state) {
    return state
}

function mapDispathToProps (dispath) {
    return bindActionCreators({
        fetchProducts,
        selectCategory,
        closeSideMenu,
        openSideMenu,
        resetCategory
    }, dispath)
}

export default connect(mapStateToProps, mapDispathToProps)(Splitter);