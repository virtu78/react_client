import React, { Component, PropTypes } from 'react';
import * as ons from 'react-onsenui';
import { getProductImageUrl } from '../utils/product';

export default class Featured extends Component {
  componentWillMount() {
    this.currentPrice = this.props.product.prices[0];
  }
  render() {
  	const product = this.props.product;

    let src = getProductImageUrl(product.images[0]);
    const bcgStyle = {
      backgroundImage: `url('${src}')`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }

    return (
    	<span className="product__more-item">
			<div style={bcgStyle} className="product__more-img"></div>
			<div className="product__more-name">{product.name}</div>
			<ons.Button style={{width: '50%', textAlign: 'center', fontSize: '14px', lineHeight: 1.5}} 
					onClick={(e) => {
		        this.props.pricesCallback((id) => this.currentPrice = this.props.product.prices.find(p => p.id === id));
		      }}>
        <span>{this.currentPrice.description}</span>
        <i className="ion-chevron-down pull-right"></i>
      </ons.Button>
      <div style={{ float: 'right', marginTop: 5 }}>
        <span>{`${this.currentPrice.value} руб. `}</span>
				<ons.Button className="product__more-counter product__more-counter--minus" onClick={() => this.props.decrementCallback(this.currentPrice)}><i className="ion-minus"></i></ons.Button>
				<label className="product__more-count">{this.props.count(this.currentPrice.id)}</label>
				<ons.Button className="product__more-counter product__more-counter--plus" onClick={() => this.props.incrementCallback(this.currentPrice)}><i className="ion-plus"></i></ons.Button>
			</div>
		</span>
    )
  }
}

Featured.propTypes = {
  product: PropTypes.object.isRequired,
  pricesCallback: PropTypes.func.isRequired,
  incrementCallback: PropTypes.func.isRequired,
  decrementCallback: PropTypes.func.isRequired
}