import React, { Component, PropTypes } from 'react';

export default class BackgroundStyle extends Component {
	render() {
		return (
			<style>
                {`
                    .page__content {
                        background-color: ${this.props.color} !important
                    }
                `}
            </style>
		)
	}
}

BackgroundStyle.propTypes = {
	color: PropTypes.string
}

