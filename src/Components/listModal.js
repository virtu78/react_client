import React, { Component, PropTypes } from 'react';
import * as ons from 'react-onsenui';

export default class ListModal extends Component {
    renderRow(item, index) {
        return (
            <ons.ListItem key={index} tappable>
                <div className='center' onClick={() => this.props.selectCallback(item.value)}>{item.name}</div>
            </ons.ListItem>
        );
    }
    render() {
        return (
            <ons.Modal isOpen={true}>
                <div className="alert-dialog alert-dialog--android">
                    <div className="alert-dialog-title alert-dialog-title--android">
                        <p>{this.props.headerText}</p>
                    </div>

                        <div className="alert-dialog-content alert-dialog-content--android">
                            <ons.List
                                dataSource={this.props.source}
                                renderRow={::this.renderRow} />                            
                        </div>

                        <div className="alert-dialog-footer alert-dialog-footer--one">
                            <button 
                                className="alert-dialog-button alert-dialog-button--one" 
                                onClick={this.props.closeCallback}>
                                    <span>Отмена</span>
                                </button>                                         
                    </div>
                </div>
            </ons.Modal>
        )
    }
}

ListModal.propTypes = {
    source: PropTypes.array.isRequired,
    headerText: PropTypes.string.isRequired,
    selectCallback: PropTypes.func.isRequired,
    closeCallback: PropTypes.func.isRequired,
};