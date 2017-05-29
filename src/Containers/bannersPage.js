import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ons from 'react-onsenui';
import axios from 'axios';
import { HOST } from '../utils/constants';
import { getImageUrl } from '../utils/product';
import BackgroundStyle from '../Components/backgroundStyle';
import { setFirstRunFlag } from '../Actions/global';

const imageStile = {
    maxWidth: '100%',
    display: 'block',
    margin: '0 auto'
};

class BannersPage extends Component {
    state = {
        banners: []
    };
    componentWillMount() {
        axios.post(`${HOST}/api/banners/get`, {
            BannerTypeCode: this.props.settings.startPageBannerCode
        }).then(res => this.setState({ banners: res.data }));
    }
    renderBackgroundStyle() {
        return <BackgroundStyle color={this.props.settings.backGroundColor} />
    }
    renderBanners() {
        if(this.state.banners.length === 0)
            return;

        return this.state.banners.map(b => {
            const keys = Object.getOwnPropertyNames(b.images);
            return keys.map(k => <img src={ getImageUrl(b.images[k]) } style={imageStile} />);
        });
    }
    render() {
        return (
            <ons.Page>
                {::this.renderBackgroundStyle()}
                <p style={{textAlign: 'center'}}>
                    {::this.renderBanners()}
                    <br />
                    <button
                        className="button"
                        onClick={() => {
                            localStorage.setItem('FirstRunFlag', true);
                            this.props.setFirstRunFlag(false)
                        }}>Продолжить</button>
                </p>
            </ons.Page>
        );
    }
}

function mapStateToProps (state) {
    return state
}

function mapDispathToProps (dispath) {
    return bindActionCreators({ setFirstRunFlag }, dispath)
}

export default connect(mapStateToProps, mapDispathToProps)(BannersPage);