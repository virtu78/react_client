import React, { Component, PropTypes } from 'react';
import * as ons from 'react-onsenui';
import moment from 'moment';

export default class TimeStampList extends Component {
	getTimeStamps(endTimeString) {
		var out = document.getElementById('out');

		var startTime = moment().add(1, 'hour').startOf('hour');
		var endTime = moment(endTimeString, 'HH:mm');

		if(endTime < startTime)
			endTime.add(1, 'day');

		var timeStamps = [];
		while(startTime <= endTime) {
			timeStamps.push(startTime.format('HH:mm'));
			startTime.add(30, 'minute');
		}

		return timeStamps;
	}
	renderRow(t, i) {
		return (
			<ons.ListItem key={`timeStamp-${i}`} tappable>
				<div onClick={() => this.props.onClick(t)} className='center'>{t}</div>
			</ons.ListItem>
		)
	}
	render() {
		return (
			<ons.List
				renderRow={::this.renderRow}
				dataSource={this.getTimeStamps(this.props.endTime)} />
		)
	}
}

TimeStampList.propTypes = {
	endTime: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired
}