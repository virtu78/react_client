import React, { Component, PropTypes } from 'react';
import * as ons from 'react-onsenui';
import { getImageUrl } from '../utils/product';

export default class TopToolbar extends Component {
    renderButterBread() {
        return (
            <ons.ToolbarButton onClick={this.props.onButterClick}>
                <ons.Icon icon='ion-navicon, material:md-menu' />
            </ons.ToolbarButton>
        )
    }
    renderBackButton() {
        if(!this.props.needBackButton)
            return;

        return <ons.BackButton onClick={this.props.onBack}>Назад</ons.BackButton>
    }
    render() {
        const text = this.props.name || this.props.address;

        const bgcImage = {
            height: '95%',
            backgroundImage: `url('${getImageUrl(this.props.logo)}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center'
        };

        const contentBlock = this.props.logo 
            ? <div className='center' style={bgcImage}></div>
            : <div className='center' style={{color: this.props.fontColor}}>{text}</div>

        if(this.props.needButterBread)
            return (
                <ons.Toolbar style={{backgroundColor: this.props.bgc}}>
                    <div className='left'>
                        {::this.renderButterBread()}
                    </div>
                    {contentBlock}
                    <div className='right' style={{ paddingRight: 15 }}>
                        {::this.renderBackButton()}
                    </div>
                </ons.Toolbar>
            );

		return (
            <ons.Toolbar style={{backgroundColor: this.props.bgc}}>
                <div className='left'>
                    {::this.renderBackButton()}
                </div>
                {contentBlock}
            </ons.Toolbar>
        );
	}
}

TopToolbar.propTypes = {
	address: PropTypes.string.isRequired,
	logo: PropTypes.string,
    name: PropTypes.string,
    bgc: PropTypes.string,
    fontColor: PropTypes.string,
    onBack: PropTypes.func,
    needBackButton: PropTypes.bool.isRequired,
    needButterBread: PropTypes.bool,
    onButterClick: PropTypes.func
};