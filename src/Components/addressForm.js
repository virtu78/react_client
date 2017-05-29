import React, { Component, PropTypes } from 'react';
import * as ons from 'react-onsenui';
import * as Ons from 'onsenui';

export default class AddressForm extends Component {
    state = {
        description: undefined,
        city: undefined,
        street: undefined,
        house: undefined,
        entrance: undefined,
        floor: undefined,
        flat: undefined
    }
    componentWillMount() {
        this.setState({ city: this.props.city });
    }
    render() {
        return (
            <div>
                <p>
                    <ons.Input className="input--full"
                               onChange={(e) => this.setState({ description: e.target.value })}
                               placeholder='Название'
                               modifier='underbar' />
                </p>
                <p>
                    <ons.Input className="input--full"
                               onChange={(e) => this.setState({ city: e.target.value })}
                               value={this.state.city}
                               placeholder='Город'
                               modifier='underbar' />
                </p>
                <p>
                    <ons.Input className="input--full"
                               onChange={(e) => this.setState({ street: e.target.value })}
                               placeholder='Улица'
                               modifier='underbar' />
                </p>
                <p>
                    <ons.Input className="input--full"
                               onChange={(e) => this.setState({ house: e.target.value })}
                               placeholder='Дом'
                               modifier='underbar' />
                </p>
                <p>
                    <ons.Input className="input--full"
                               onChange={(e) => this.setState({ entrance: e.target.value })}
                               placeholder='Подъезд'
                               modifier='underbar' />
                </p>
                <p>
                    <ons.Input className="input--full"
                               onChange={(e) => this.setState({ floor: e.target.value })}
                               placeholder='Этаж'
                               modifier='underbar' />
                </p>
                <p>
                    <ons.Input className="input--full"
                               onChange={(e) => this.setState({ flat: e.target.value })}
                               placeholder='Квартира'
                               modifier='underbar' />
                </p>
                <p>
                    <ons.Button style={{ marginRight: '10px' }}
                                onClick={() => {
							if(this.state.description &&
								this.state.street &&
								this.state.house &&
                                this.state.entrance &&
                                this.state.floor &&
								this.state.flat)
							    this.props.onAdd(
							        this.state.description,
							        this.state.city,
							        this.state.street,
							        this.state.house,
                                    this.state.entrance,
                                    this.state.floor,
							        this.state.flat);
							else
								Ons.notification.alert({
									message: 'Не все поля заполнены!',
									title: ''
								});
						}}>
                        <span>Добавить</span>
                    </ons.Button>
                    <ons.Button
                        onClick={this.props.onCancel}>
                        <span>Отмена</span>
                    </ons.Button>
                </p>
            </div>
        )
    }
}


AddressForm.protoTypes = {
    city: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired
};