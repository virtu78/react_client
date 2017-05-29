import React, { Component, PropTypes } from 'react';

const mainStyle = {
    marginTop: 20,
    textAlign: 'center'
};

const mapStyle = {
    width: '100%',
    height: 300,
    margin: '10px auto'
};

const phoneStyle = {
    color: '#000'
};

const iconStyle = {
    verticalAlign: 'middle',
    fontSize: 32,
    margin: '0 5px'
};

const hStyle = {
    margin: '10px 0'
};

export default class AboutCompany extends Component {
    static propTypes = {
        filial: PropTypes.object.isRequired
    };
    componentDidMount() {
        const coordTarget = this.props.filial.coordinates || this.props.filial.addressName;

        if(!coordTarget)
            return;

        ymaps.geocode(coordTarget)
            .then(res => {
                    const filialCoords = res.geoObjects.get(0).geometry.getCoordinates();

                    setTimeout(() => {
                        const map = new ymaps.Map ("map", {
                            center: filialCoords,
                            zoom: 16
                        });

                        map.geoObjects.add( new ymaps.Placemark(filialCoords) );
                    }, 500)
                }
            );
    }
    renderInfo() {
        return (
            <div>
                <h4 style={hStyle}>{this.props.filial.name}</h4>
                <h5 style={hStyle}>{this.props.filial.addressName}</h5>
            </div>
        )
    }
    renderPhone() {
        return (
            <a href={`tel:${this.props.filial.phone}`} style={phoneStyle}>
                <i className="ion-ios-telephone-outline" style={iconStyle} />
                <span>{this.props.filial.phone}</span>
            </a>
        )
    }
    renderMap() {
        return (
            <div id="map" style={mapStyle}></div>
        )
    }
    render() {
        return (
            <div style={mainStyle}>
                <h4 style={hStyle}>О компании</h4>
                {::this.renderInfo()}
                {::this.renderPhone()}
                {::this.renderMap()}
            </div>
        )
    }
}