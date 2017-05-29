import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ons from 'react-onsenui';
import TopToolbar from '../Components/topToolbar';
import BottomToolbar from '../Components/bottomToolbar';
import { fetchFavorites } from '../Actions/profile';
import { setProductId } from '../Actions/catalog';
import { getProductImageUrl } from '../utils/product';
import ProductPage from './productPage';
import BackgroundStyle from '../Components/backgroundStyle';
import { openSideMenu } from '../Actions/sideMenu';

class FavoritesPage extends Component {
	componentDidMount() {
		this.props.fetchFavorites(this.props.profile.favoritesIds);
	}
	renderBackgroundStyle() {
		return <BackgroundStyle color={this.props.settings.backGroundColor} />
    }
	renderToolbar() {
		const props = {
            name: 'Избранное',
            address: '',
            onBack: ::this.props.back,
			bgc: this.props.settings.headerFooterColor,
			logo: this.props.settings.logoImagePath || '',
			needBackButton: true
		};

        if(this.props.settings.onePageCatalog) {
            props.needButterBread = true;
            props.onButterClick = () => this.props.openSideMenu();
        }

		return <TopToolbar {...props} />
	}
	renderBottomTollbar() {
		return (
			<BottomToolbar 
            	changePage={this.props.changePage} 
            	filial={this.props.filial} 
            	cart={this.props.cart}
            	bgc={this.props.settings.headerFooterColor}
            	showHome={true}
	            showSearch={true}
	            showCart={true}
	            showReviews={true}
				settings={this.props.settings} />
		)
	}
	render() {
		return(
        	<ons.Page
        		renderToolbar={::this.renderToolbar}
        		renderBottomTollbar={::this.renderBottomTollbar}>

        		{::this.renderBackgroundStyle()}
        		<ons.List 
	    			renderHeader={() => <ons.ListHeader>Избранные товары</ons.ListHeader>}
	    			renderRow={(product, i) => {

	    				const src = getProductImageUrl(product.images[0]);
					    const bcgStyle = {
					      backgroundImage: `url('${src}')`,
					      backgroundSize: 'cover',
					      backgroundRepeat: 'no-repeat',
					      backgroundPosition: 'center'
					    };

					    return (
					      <ons.ListItem 
					      	key={`product-${i}`} 
					      	tappable 
					      	style={{ backgroundColor: this.props.bgc }}
					        onClick={() => { 
					        	this.props.setProductId(product.id);
					        	this.props.changePage(ProductPage); 
					        }}>
					        <div className='left'>
					        	<div className='list__item__thumbnail' style={bcgStyle}></div>
					        </div>
					        <div className='center' style={{display: 'block'}}>
					          <div>{product.name}</div>      
					        </div>
					      </ons.ListItem>
					    )
	    			}}
	    			dataSource={this.props.profile.favorites} />
        	</ons.Page>
		)
	}
}


function mapStateToProps (state) {
    return state
}

function mapDispathToProps (dispath) {
    return bindActionCreators({ fetchFavorites, setProductId, openSideMenu }, dispath)
}

export default connect(mapStateToProps, mapDispathToProps)(FavoritesPage);