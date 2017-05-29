import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ons from 'react-onsenui';
import { setCity, setFilial } from '../Actions/filial';
import { setCategoryId } from '../Actions/catalog';
import ProfilePage from './profilePage';
import CatalogPage from './catalogPage';
import ListModal from '../Components/listModal';
import TopToolbar from '../Components/topToolbar';
import BottomToolbar from '../Components/bottomToolbar';
import { getCurrentFilial } from '../utils/filial';
import { createTopToolbarProps } from '../utils/common';
import BackgroundStyle from '../Components/backgroundStyle';
import { getImageUrl } from '../utils/product';
import { openSideMenu } from '../Actions/sideMenu';

class FilialPage extends Component {
    state = {
        showCityList: false,
        showFilialList: false
    };
    componentWillMount() {
        if(this.props.settings.onlyCity) {
            const lastSelectedCity = localStorage.getItem('City');
            if (lastSelectedCity) {
                if (!this.props.filial.city) {
                    if (this.props.filial.cities.find(c => c.name === lastSelectedCity)) {
                        this.props.setCity(lastSelectedCity);
                        this.props.changePage(CatalogPage);
                    }
                }
            }
        }
    }
    componentDidMount() {
        setTimeout(() => this.props.setCategoryId(null), 600);
    }
    renderBackgroundStyle() {
        return <BackgroundStyle color={this.props.settings.backGroundColor} />
    }
    renderToolbar() {
        const props = createTopToolbarProps(this.props.filial, this.props.settings);
        props.needBackButton = false;

        if(this.props.settings.onePageCatalog) {
            props.needButterBread = true;
            props.onButterClick = () => this.props.openSideMenu();
        }

        return <TopToolbar {...props} />
    }
    renderModal() {
        if(this.state.showCityList) {
            const cities = this.props.filial.cities.map(c => {
                return { 
                    name: c.name,
                    value: c.name
                }
            });
            
            return ( 
                <ListModal source={cities}
                    headerText={'Выберите город'}
                    selectCallback={(city) => { 
                        this.props.setCity(city);
                        this.setState({ showCityList: false });
                    }}
                    closeCallback={() => this.setState({ showCityList: false })} />
            )
        }

        if(this.state.showFilialList) {
            const filials = this.props.filial.filials.filter(f => f.city === this.props.filial.city).map(f => {
                return {
                    name: (f.name && f.name.length > 0) ? f.name : `${f.street}, д.${f.house}`,
                    value: f.id
                }
            });

            return ( 
                <ListModal
                    source={filials}
                    headerText={'Выберите Район'}
                    selectCallback={(filial) => { 
                        this.props.setFilial(filial);
                        this.setState({ showFilialList: false })   
                    }} 
                    closeCallback={() => this.setState({ showFilialList: false })} />
            )
        }
    }
    renderCityButton() {
        const needToChoose = this.props.filial.cities.length > 1;

        const text = this.props.filial.city || 'Город';
        return (
            <p style={{textAlign: 'center'}}>
                <ons.Button
                    style={{width: '70%'}}
                    disabled={this.props.filial.fetching}
                    onClick={() => {
                        if(needToChoose)
                            this.setState({ showCityList: true })
                    }}>
                    <span>{text}</span>
                    <i className="ion-chevron-down pull-right" style={{ display: needToChoose ? 'inline' : 'none' }} />
                </ons.Button>
            </p>
        )
    }
    renderFilialButton() {
        if(this.props.settings.onlyCity)
            return;

        if(this.props.filial.city === undefined)
            return;

        const needToChoose = this.props.filial.filials.filter(f => f.city === this.props.filial.city).length > 1;
		
		const filial = getCurrentFilial(this.props.filial);
		return (
            <p style={{textAlign: 'center'}}>
                <ons.Button 
                    style={{width: '70%'}}
                    disabled={this.props.filial.fetching}
                    onClick={() => { 
                        if(needToChoose)
                            this.setState({ showFilialList: true })
                    }}>
                    <span>{filial ? (filial.name && filial.name.length > 0) ? filial.name : `${filial.street}, д.${filial.house}` : 'Район'}</span>
                    <i className="ion-chevron-down pull-right" style={{ display: needToChoose ? 'inline' : 'none' }} />
                </ons.Button>
            </p>
        )
    }
    renderFilialInfo() {
        if(this.props.settings.onlyCity)
            return;

        if(this.props.filial.filialId === undefined)
            return;

        const filial = getCurrentFilial(this.props.filial);
        return (
            <p style={{textAlign: 'center', color: this.props.settings.bgFontColor }}>
                <span className="block">Время работы:</span>
                <span className="block">{`С ${filial.workStartTime} До ${filial.workEndTime}`}</span>
                <span className="block">Время доставки:</span>
                <span className="block">{`С ${filial.deliveryStartTime} До ${filial.deliveryEndTime}`}</span>
            </p>
        )
    }
    renderCatalogButton() {
        if(this.props.settings.onlyCity) {
            if(this.props.filial.city === undefined)
                return;
        } else {
            if(this.props.filial.filialId === undefined)
                return;
        }
        return (
            <p style={{textAlign: 'center'}}>
                <ons.Button style={{width: '50%'}}
                            onClick={() => this.props.changePage(CatalogPage)}>
                    <span>Каталог</span>
                    <i className="ion-chevron-right pull-right" />
                </ons.Button>
            </p>
        )
    }
    renderMainLogo() {
        if(this.props.filial.filialId === undefined)
            return;

        const style = {
            display: 'block',
            margin: '0 auto',
            maxWidth: '100%'
        };

        const url = getImageUrl( getCurrentFilial(this.props.filial).mainLogoPath );

        return <img style={style} src={url} />
    }
    renderBottomButtons() {
        if(this.props.filial.city === undefined)
            return;

        return (
            <p style={{textAlign: 'center'}}>
                <ons.Button style={{width: '50%'}}
                            onClick={() => this.props.changePage(ProfilePage)}>
                    <span>Мои данные</span>
                    <i className="ion-chevron-right pull-right" />
                </ons.Button>
            </p>
        )
    }
    renderBottomToolbar() {
        return (
            <BottomToolbar 
                changePage={this.props.changePage} 
                filial={this.props.filial} 
                cart={this.props.cart}
                bgc={this.props.settings.headerFooterColor}
                fontColor={this.props.settings.hfFontColor}
                showHome={false}
                showSearch={false}
                showCart={false}
                showReviews={true && this.props.filial.city}
                settings={this.props.settings} />
        )
    }
    render() {
        return (
            <ons.Page 
                renderToolbar={::this.renderToolbar}
                renderModal={::this.renderModal}
                renderBottomToolbar={::this.renderBottomToolbar}>

                {::this.renderBackgroundStyle()}
                {::this.renderCityButton()}
                {::this.renderFilialButton()}
                {::this.renderFilialInfo()}
                {::this.renderCatalogButton()}
                {::this.renderMainLogo()}
                {::this.renderBottomButtons()}
            </ons.Page>
        );
    }
}

function mapStateToProps (state) {
    return state
}

function mapDispathToProps (dispath) {
    return bindActionCreators({ 
        setCity,
        setFilial, 
        setCategoryId,
        openSideMenu
    }, dispath)
}

export default connect(mapStateToProps, mapDispathToProps)(FilialPage);