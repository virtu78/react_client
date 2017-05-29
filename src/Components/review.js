import React, { Component, PropTypes } from 'react';
import { getImageUrl } from '../utils/product';
import * as ons from 'react-onsenui';
import Reviews from './reviews';
import md5 from 'md5';

export default class Review extends Component {
	renderStars() {
		return (
            <span className="review__stars">
            	{[1, 2, 3, 4, 5].map((i) => 
            		<i key={i} className={`fa fa-star${i > this.props.review.rate ? '-o' : ''}`}></i>)}
            </span>
        )
	}
	renderAnswers() {
		if(this.props.answers.length === 0)
			return;

		return (
			<div>
				<Reviews 
					items={this.props.answers} 
					defaultImg={this.props.defaultImg}
					defaultOwnerImg={this.props.defaultOwnerImg}
					useGravatar={this.props.useGravatar}
					parentId={this.props.review.id} />
			</div>
		)
	}
	render() {
		let imgSrc = '';
		if(this.props.review.customerAvatarPath)
			imgSrc = `${getImageUrl(this.props.review.customerAvatarPath)}`;
		else if(this.props.useGravatar) {
			const email = this.props.review.displayEMail || '';
			imgSrc = `https://www.gravatar.com/avatar/${md5(email.toLowerCase())}`;
		}
		else if(this.props.review.isOwnerAnswer)
			imgSrc = `${getImageUrl(this.props.defaultOwnerImg)}`; 
		else imgSrc = `${getImageUrl(this.props.defaultImg)}`; 
		
		const bcgStyle = {
	      backgroundImage: `url('${imgSrc}')`,
	      backgroundSize: 'cover',
	      backgroundRepeat: 'no-repeat',
	      backgroundPosition: 'center'
	    }

		return (
			<div className="review" style={this.props.review.isOwnerAnswer ? ownerAnswerStyle : null}>
	            <div className='review__thumbnail' style={bcgStyle}></div>
	            <div className="review__right">
                	<div className="review__date">{this.props.review.creationDate.split(' ')[0]}</div>
                	{::this.renderStars()}
	            </div>
	            <div className="review__form">
	                  <div className="review__name">{this.props.review.displayName || ' '}</div>
	                  <div className="review__email">{this.props.review.displayEMail || ' '}</div>
	                </div>
	            <div className='review__content'>
	                <div className="review__title">{this.props.review.title}</div>
	            	<div className="review__message">{this.props.review.description}</div>
	        	</div>
		    	{::this.renderAnswers()}
		    </div>
	    )
	}
}

Review.propTypes = {
	review: PropTypes.object.isRequired,
	answers: PropTypes.array.isRequired,
	defaultImg: PropTypes.string.isRequired,
	defaultOwnerImg: PropTypes.string.isRequired,
	useGravatar: PropTypes.bool.isRequired
}

const ownerAnswerStyle = {
	backgroundColor: '#ddd'
}