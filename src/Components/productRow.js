import React, { Component, PropTypes } from 'react';
import * as ons from 'react-onsenui';
import { getProductImageUrl, getImageUrl } from '../utils/product';
import FavoriteStar from './favoriteStar';

export default class ProductRow extends Component {
    componentWillMount() {
        this.currentPrice = this.props.product.prices[0];
    }
    renderPriceBlock() {
        if(this.currentPrice === undefined)
            return;

        const display = this.props.product.prices.length <= 1 ? 'none' : 'inline-block';

        const buttonStyle = {
            width: '75px',
            padding: '4px 6px',
            textAlign: 'left', 
            fontSize: '14px', 
            lineHeight: 1.5, 
            marginRight: 5, 
            display
        };

        const descStyle = {
            display: 'block',
            width: 50,
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        };

        return (
            <div>
                <ons.Button 
                    style={buttonStyle}
                    onClick={(e) => {
                        e.stopPropagation();
                        this.props.pricesCallback((id) => this.currentPrice = this.props.product.prices.find(p => p.id === id));
                    }}>
                    <i className="ion-chevron-down pull-right" />
                    <span style={descStyle}>{this.currentPrice.description}</span>
                </ons.Button>
                <span className={this.currentPrice.value2 === 0 ? '' : 'through'}>
                    {` ${this.currentPrice.value} р.`}
                </span>
                <span className='red'>
                    {this.currentPrice.value2 === 0 ? '' : ` ${this.currentPrice.value2} р.`}
                </span>
            </div>
        )
    }
    renderOrderBLock() {
        if(this.currentPrice === undefined)
            return;

        return (
          <div className="product-row__order">
            <ons.Button className="product__more-counter product__more-counter--minus" onClick={() => this.props.decrementCallback(this.currentPrice)}><i className="ion-minus" /></ons.Button>
            <label className="product__more-count">{this.props.count(this.currentPrice.id)}</label>
            <ons.Button className="product__more-counter product__more-counter--plus" onClick={() => this.props.incrementCallback(this.currentPrice)}><i className="ion-plus" /></ons.Button>
          </div>
        )
    }
    renderFavoriteBlock() {
        return (
            this.props.isAutorised
                ? <FavoriteStar
                    addFavorite={() => this.props.addFavorite(this.props.product.id)}
                    removeFavorite={() => this.props.removeFavorite(this.props.product.id)}
                    isFavorite={this.props.isFavorite}
                />
                : ''
        )
    }
    renderSingleLabel() {
        if(this.props.product.labels.length !== 1)
            return;

        const label = this.props.product.labels[0];
        const id = Object.getOwnPropertyNames(label.images)[0];

        return (
            <img key={id} className="product-row__label product-row__label--single" src={ getImageUrl( label.images[id] ) } />
        )
    }
    renderLabels() {
        if(this.props.product.labels.length < 2)
            return;
        
        return (
            <div className="product-row__labels">
                {this.props.product.labels.map((l) => {
                    const id = Object.getOwnPropertyNames(l.images)[0];
                    return <img key={id} className="product-row__label" src={ getImageUrl( l.images[id] ) } />
                })}
            </div>
        )
    }
    renderShortProductDesc() {
        const style = {
            lineHeight: 0.9
        };

        return (
            <div style={style}>
                {this.props.product.shortDescription}
            </div>
        )
    }
    renderEndActivityDate() {
        if(!this.props.product.endActivityDate)
            return;

        return (
            <div className="product-row__end-date">
                {`ДО ${this.props.product.endActivityDate}`}
            </div>
        )
    }
    render() {
        let src = getProductImageUrl(this.props.product.images[0]);

        const bcgStyle = {
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
        };

        if(src)
            bcgStyle.backgroundImage = `url('${src}')`;

        const descStyle = {
            display: 'block'
        };

        if(this.props.noOrderMode)
            descStyle.width = '62%';

        return (
            <div className="product-row">
                <div onClick={this.props.selectCallback} className="product-row__thumbnail" style={bcgStyle}>
                    {::this.renderSingleLabel()}   
                </div>
                {::this.renderLabels()}
                <div className="product-row__desc" onClick={this.props.selectCallback} style={descStyle}>
                    <div style={nameStyle}>{this.props.product.name}</div>
                    {::this.renderPriceBlock()}
                    {this.renderShortProductDesc()}
                    {this.renderEndActivityDate()}
                </div>
                {this.props.noOrderMode ? ::this.renderFavoriteBlock() : ::this.renderOrderBLock()}
            </div>
        )
    }
}

ProductRow.propTypes = {
    product: PropTypes.object.isRequired,
    selectCallback: PropTypes.func.isRequired,
    pricesCallback: PropTypes.func.isRequired,
    incrementCallback: PropTypes.func.isRequired,
    decrementCallback: PropTypes.func.isRequired,
    addFavorite: PropTypes.func.isRequired,
    removeFavorite: PropTypes.func.isRequired,
    isAutorised: PropTypes.bool.isRequired,
    noOrderMode: PropTypes.bool.isRequired,
    isFavorite: PropTypes.bool.isRequired
};

const nameStyle = {
    display: 'inline-block',
    maxHeight: 40,
    overflow: 'hidden',
    fontSize: 17,
    fontWeight: 600
};