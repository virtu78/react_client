import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ons from 'react-onsenui';
import TopToolbar from '../Components/topToolbar';
import BackgroundStyle from '../Components/backgroundStyle';

class AdvertisePage extends Component {
    renderToolbar() {
        return (
            <TopToolbar
                name='О приложении'
                address=''
                onBack={::this.props.back}
                bgc={this.props.settings.headerFooterColor}
                fontColor={this.props.settings.hfFontColor}
                needBackButton={true} />
        )
    }
    renderBackgroundStyle() {
        return <BackgroundStyle color={this.props.settings.backGroundColor} />
    }
    render() {
        return (
            <ons.Page
                renderToolbar={::this.renderToolbar}>

                {::this.renderBackgroundStyle()}
            </ons.Page>
        );
    }
}

function mapStateToProps (state) {
    return state
}

function mapDispathToProps (dispatch) {
    return bindActionCreators({  }, dispatch)
}

export default connect(mapStateToProps, mapDispathToProps)(AdvertisePage);