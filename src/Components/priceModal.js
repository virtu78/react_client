import React, { Component } from 'react';
import * as ons from 'react-onsenui';

export default class PriceModal extends Component {
    renderRow(price, index) {
        return (
            <ons.ListItem key={index} tappable>
                <div className='center' onClick={() => { this.props.setPriceId(price.id) }}>
                    {price.description}
                </div>
            </ons.ListItem>
        );
    }
    render() {
        return (
            <ons.Modal isOpen={true}>
                <div className="alert-dialog alert-dialog--android">
                    <div className="alert-dialog-title alert-dialog-title--android">
                        <p>Выберите</p>
                    </div>

                        <div className="alert-dialog-content alert-dialog-content--android">
                            <ons.List
                                dataSource={this.props.prices}
                                renderRow={::this.renderRow} />                            
                        </div>

                        <div className="alert-dialog-footer alert-dialog-footer--one">
                            <button 
                                className="alert-dialog-button alert-dialog-button--one" 
                                onClick={this.props.close}>
                                Отмена</button>                                         
                    </div>
                </div>
            </ons.Modal>
        )
    }
}