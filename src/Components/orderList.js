import React, { Component, PropTypes } from 'react';
import * as ons from 'react-onsenui';
import { getProductImageUrl } from '../utils/product';

export default class OrderList extends Component {
	renderOrderDetail(l, i) {
		if(this.props.orderDetails === undefined || this.props.orderDetails.length === 0)
			return;

		const product = this.props.orderDetails.find(p => p.id === l.productId);
		
		const src = getProductImageUrl(product.images[0]);
		const bcgStyle = {
			backgroundImage: `url('${src}')`,
			backgroundSize: 'cover',
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center'
		};

		return (
			<ons.ListItem key={`order-detail-${i}`}>
				<span className='left'>
					<div className="list__item__thumbnail" style={bcgStyle}></div>
				</span>
				<span className='center'>{l.productName}</span>
				<span className='right'>{l.productAmount}</span>
			</ons.ListItem>
		)
	}
	renderOrderDetails(order) {
		if(this.props.orderDetailsId !== order.id)
			return;

		if(this.props.items.length === 0)
			return;

		//todo загрузчик
		return (
			<ons.Col>
				<ons.List style={{ width: '100%', marginTop: 10 }}
						  renderRow={::this.renderOrderDetail}
						  dataSource={order.lines} />

				<p style={{ textAlign: 'center' }}>
					<ons.Button class="hidden"
						onClick={() => { this.props.onResendOrder(order); }}>
						<span>Повторить заказ</span>
					</ons.Button>
				</p>
			</ons.Col>
		)
	}
	render() {
		return (
			<ons.List
				renderHeader={() => <ons.ListHeader>Заказы пользователя</ons.ListHeader>}
				renderRow={(o, i) => {
						const sum = o.lines.reduce((r, l) => { r += l.lineSum; return r; }, 0);
						return (
							<ons.ListItem key={`order-${i}`} tappable
								onClick={() => {
									if(this.props.orderDetailsId === o.id)
										return;

									this.props.onSelectOrder(o);
								}}>
								<ons.Row>
						            <ons.Col>{o.creationDate.split(' ')[0]}</ons.Col>
						            <ons.Col style={{ textAlign: 'right' }}>{sum} руб.</ons.Col>
						    	</ons.Row>
								<ons.Row>
									{::this.renderOrderDetails(o)}
								</ons.Row>
							</ons.ListItem>
						)
					}}
				dataSource={this.props.items} />
		)
	}
}

OrderList.propTypes = {
	items: PropTypes.array.isRequired,
	orderDetails: PropTypes.array,
	orderDetailsId: PropTypes.number,
	onSelectOrder: PropTypes.func.isRequired,
	onResendOrder: PropTypes.func.isRequired
};