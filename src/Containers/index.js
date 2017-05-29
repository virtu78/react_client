import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FilialPage from './filialPage';
import LoadingPage from './loadingPage';
import ProfilePage from './profilePage';
import BannersPage from './bannersPage';
import Splitter from './splitter';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { closeSideMenu } from '../Actions/sideMenu';

let CurrentPage = FilialPage;
const keyGenerator = createIdentityGenerator();

class Nav extends Component {
    changePage(navigator) {
        return (nextPageClass, isReset) => {
            if(CurrentPage === nextPageClass)
                return;

            CurrentPage = nextPageClass;
            if(isReset)
                navigator.resetPage({});
            else {
                navigator.pushPage({})
            }
        }
    }
    renderSplitter() {
        return (
            <Splitter changePage={(p) => {
                this.changePage(this.nav)(p);
                setTimeout(this.props.closeSideMenu, 200);
            }}>
                {::this.renderNavigator()}
            </Splitter>
        )
    }
    renderNavigator() {
        return (
            <Navigator ref={(nav) => { this.nav = nav }} renderPage={(navigator) =>
                <CurrentPage
                    key={keyGenerator()}
                    needBackButton={() => navigator.needBackButton()}
                    back={() => { CurrentPage = null; navigator.popPage(); }}
                    changePage={this.changePage(navigator)}
                />
            }/>
        )
    }
    render() {
        if(!this.props.loaded)
            return <LoadingPage />;

        if(this.props.settings.startPageBannerCode) {
            if(this.props.isFirstRun)
                return <BannersPage />;
        }

        if(this.props.settings.authRequired && !this.props.profile.authToken)
            return <ProfilePage />;

        if(this.props.settings.onePageCatalog || this.props.settings.sideMainMenu)
            return ::this.renderSplitter();

        return ::this.renderNavigator()
    }
}

function createIdentityGenerator() {
    let i = 0;
    return function() {
        return i++;
    }
}

function mapStateToProps(state) {
    return {
        loaded: state.loaded,
        isFirstRun: state.isFirstRun,
        settings: state.settings,
        profile: state.profile
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ closeSideMenu }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);

class Navigator extends Component {
    state = {
        pages: [],
        lastAction: undefined
    };
    pushPage() {
        const pages = this.state.pages;
        const pageToPush = this.currentPage;
        this.currentPage = this.props.renderPage(this);

        this.setState({ pages: pages.concat(pageToPush), lastAction: 'push' });
    }
    popPage() {
        const pages = this.state.pages;
        this.currentPage = pages.slice(-1)[0];

        this.setState({ pages: pages.slice(0, pages.length -1), lastAction: 'pop' });
    }
    resetPage() {
        this.currentPage = this.props.renderPage(this);
        this.setState({ pages: [], lastAction: 'push' });    
    }
    needBackButton() {
        return this.state.pages.length > 0;
    }
    render() {
        const opts = {
            transitionName: this.state.lastAction === 'push' ? 'slide' : 'stay',
            transitionEnterTimeout: 450,
            transitionLeaveTimeout: 450
        };

        this.currentPage = this.currentPage || this.props.renderPage(this);
        
        return (
            <ReactCSSTransitionGroup {...opts}>
                {this.currentPage}
            </ReactCSSTransitionGroup>
        )
    }
}