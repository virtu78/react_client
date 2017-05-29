import React, { Component, PropTypes } from 'react';
import FilialPage from '../Containers/filialPage';
import SearchPage from '../Containers/searchPage';
import CartPage from '../Containers/cartPage';
import ReviewsPage from '../Containers/reviewsPage';
import * as ons from 'react-onsenui';
import { getCurrentFilial } from '../utils/filial';
import { getSum } from '../utils/cart';

export default class BottomToolbar extends Component {
    render() {
        return <i
            style={{ float: 'right', marginRight: 10, color: 'gold' }}
            className={`fa fa-star${this.props.isFavorite ? '' : '-o'}`}
            onClick={() => {
                if(this.props.isFavorite)
                    this.props.removeFavorite();
                else
                    this.props.addFavorite();
            }} />
    }
}

BottomToolbar.propTypes = {
    addFavorite: PropTypes.func.isRequired,
    removeFavorite: PropTypes.func.isRequired,
    isFavorite: PropTypes.bool.isRequired
};