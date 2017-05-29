import React, { Component, PropTypes } from 'react';
import { getProductImageUrl, getImageUrl } from '../utils/product';

export default class CategoryRow extends Component {
    static propTypes = {
        category: PropTypes.object.isRequired,
        onClick: PropTypes.func.isRequired
    };
    renderImage() {
        if(!this.props.category.imagePath)
            return;

        const src = getImageUrl(this.props.category.imagePath);
        const bcgStyle = {
            backgroundImage: `url('${src}')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
        };

        return <div className='category-row__thumbnail' style={bcgStyle}></div>
    }
    render() {


        return (
            <div className='category-row' onClick={() => this.props.onClick(this.props.category.id)}>
                {::this.renderImage()}
                <div className='category-row__name'>{this.props.category.name}</div>
            </div>
        )
    }
}