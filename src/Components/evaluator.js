import React, { Component, PropTypes } from 'react';

export default class Evaluater extends Component {
    state = {
        rate: 5
    }
    renderStar(i) {
        return (
            <i key={i}
               className={`fa fa-star${i > this.state.rate ? '-o' : ''}`}
               onClick={() => {
                    this.setState({ rate: i });
                    this.props.onChange(i);
               }}></i>
        )
    }
    render() {
        return (
            <div className="voute" style={{color: this.props.fontColor}}>
                <div className="voute__text">{this.props.title}</div>
                <span className="voute__stars">
                    {[1, 2, 3, 4, 5].map((i) => { return ::this.renderStar(i); })}
                </span>
            </div>
        )
    }
}

Evaluater.propTypes = {
    title: PropTypes.string.isRequired,
    fontColor: PropTypes.string,
    onChange: PropTypes.func.isRequired
}