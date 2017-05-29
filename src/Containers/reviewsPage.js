import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import * as Ons from 'onsenui';
import * as ons from 'react-onsenui';
import TopToolbar from '../Components/topToolbar'
import BottomToolbar from '../Components/bottomToolbar'
import Reviews from '../Components/reviews';
import ReviewForm from '../Components/reviewForm'
import Evaluator from '../Components/evaluator'
import { getCurrentFilial } from '../utils/filial';
import * as actions from '../Actions/reviews';
import BackgroundStyle from '../Components/backgroundStyle';
import { openSideMenu } from '../Actions/sideMenu';

class ReviewsPage extends Component {
    state = {
        rate: 5
    };
    componentWillMount() {
        this.filial = getCurrentFilial(this.props.filial);
    }
    componentDidMount() {
        this.props.fetchReviews();
    }
    renderBackgroundStyle() {
        return <BackgroundStyle color={this.props.settings.backGroundColor} />
    }
    renderShopInfo() {
        const style = {
            textAlign: 'center',
            color: this.props.settings.bgFontColor
        };
        if(this.props.settings.onlyCity)
            return (
                <div style={style}>
                    <h3>{this.filial ? this.filial.city : ''}</h3>
                </div>
            );

        return (
            <div style={style}>
                <h3>{this.props.settings.shopName}</h3>
                <h3>{this.filial ? `${this.filial.street}, д.${this.filial.house}` : 'Район'}</h3>
            </div>
        )
    }
    renderToolbar() {
        const props = {
            name: 'Отзывы',
            address: '',
            onBack: ::this.props.back,
            bgc: this.props.settings.headerFooterColor,
            fontColor: this.props.settings.hfFontColor,
            logo: this.props.settings.logoImagePath || '',
            needBackButton: true
        };

        if(this.props.settings.onePageCatalog) {
            props.needButterBread = true;
            props.onButterClick = () => this.props.openSideMenu();
        }

        return <TopToolbar {...props} />
    }
    renderStats() {
        if(this.props.reviews.reviews.length === 0)
            return;

        const count = this.props.reviews.reviews.filter(r => r.parentId === 0).length;
        const sum = this.props.reviews.reviews.filter(r => r.parentId === 0).reduce((res, rev) => { res += rev.rate; return res; } , 0);
        let result = Math.round(sum/count);

        return (
            <div className="stats">
                <span className="stats__stars">
                    {[1, 2, 3, 4, 5].map((i) => <i key={i} 
                        className={`fa fa-star${i > result ? '-o' : ''}`} />)}
                </span>
                <span className="stats__count">{`Рейтинг: ${result}`}</span>
            </div>
        )
    }
    renderEvaluator() {
        const props = {
            title: "Оцените заведение",
            fontColor: this.props.settings.bgFontColor,
            onChange: (r) => this.setState({ rate: r })
        };

        return (
            <Evaluator {...props} />
        )
    }
    renderForm() {
        return ( 
            <ReviewForm
                name={this.props.profile.name}
                email={this.props.profile.email}
                onSubmit={(name, email, title, description) => {
                    this.props.sendReview(name, email, title, description, this.state.rate);
                    Ons.notification.alert({
                        message: 'Отзыв отправлен',
                        title: ''
                    });
                }} />
        )
    }
    renderReviews() {
        if(this.props.reviews.reviews.length === 0)
            return;

        return (
            <div className="product__reviews">
                <h4 className="product__reviews-header">Отзывы</h4>
                <Reviews 
                    items={this.props.reviews.reviews}
                    defaultImg={this.props.settings.reviewDefaultImagePath}
                    defaultOwnerImg={this.props.settings.logoImagePath || ''}
                    useGravatar={this.props.settings.useGravatar} />
            </div>
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
                showHome={true}
                showSearch={false}
                showCart={true}
                showProfile={true}
                showReviews={false}
                settings={this.props.settings} />
        )
    }
    render() {
        return (
            <ons.Page 
                renderToolbar={::this.renderToolbar}
                renderBottomToolbar={::this.renderBottomToolbar}>
                {::this.renderBackgroundStyle()}
                {::this.renderShopInfo()}
                {::this.renderStats()}
                {::this.renderEvaluator()}
                {::this.renderForm()}
                {::this.renderReviews()}
            </ons.Page>
        );
    }
}

function mapStateToProps (state) {
    return state
}

function mapDispathToProps (dispath) {
    return bindActionCreators({ ...actions, openSideMenu }, dispath)
}

export default connect(mapStateToProps, mapDispathToProps)(ReviewsPage);