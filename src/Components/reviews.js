import React, { Component, PropTypes } from 'react';
import * as ons from 'react-onsenui';
import Review from './review'

export default class Reviews extends Component {//todo картинку с граватар
	_renderRow(r, i) {
		return (
			<Review 
				key={`review-${i}`}
				review={r}
				answers={this.props.items.filter(a => a.parentId === r.id)}
				defaultImg={this.props.defaultImg}
				defaultOwnerImg={this.props.defaultOwnerImg}
				useGravatar={this.props.useGravatar} />
		)
	}
	render() {
		const parentId = this.props.parentId || 0;
		return (
			<ons.List 
				dataSource={this.props.items.filter(r => r.parentId === parentId)}
				renderRow={::this._renderRow}
				className="timeline" 
				modifier="inset" />
		)
	}
}

Reviews.propTypes = {
	items: PropTypes.array.isRequired,
	defaultImg: PropTypes.string.isRequired,
	defaultOwnerImg: PropTypes.string.isRequired,
	useGravatar: PropTypes.bool.isRequired,
	parentId: PropTypes.number
}