import React, { Component, PropTypes } from 'react';
import * as ons from 'react-onsenui';

export default class AddressList extends Component {
    renderAddress(a, i) {
        return (
            <ons.ListItem key={`address-${i}`} tappable style={{color: this.props.fontColor}}>
                <ons.Row>
                    <ons.Col>
                        <div className="timeline-date">{a.city}</div>
                        <div className="timeline-from">
                            <div className="timeline-name">{a.description}</div>
                            <div className="timeline-id">{`ул. ${a.street}, д. ${a.house}, под. ${a.entrance}, этаж: ${a.floor}, кв.: ${a.flat}`}</div>
                        </div>
                        <ons.Button
                            style={{ float: 'right', padding: '0 12px',	marginRight: 5 }}
                            onClick={() => this.props.onDelete(a) }>
                            <i className='fa fa-trash'></i>
                        </ons.Button>
                    </ons.Col>
                </ons.Row>
            </ons.ListItem>
        )
    }
    render() {
        return (
            <ons.List
                renderHeader={() => <ons.ListHeader style={{color: this.props.fontColor}}>Адреса куда доставить заказ</ons.ListHeader>}
                renderRow={::this.renderAddress}
                dataSource={this.props.items} />
        )
    }
}

AddressList.protoTypes = {
    items: PropTypes.array.isRequired,
    fontColor: PropTypes.string,
    onDelete: PropTypes.func.isRequired
};

