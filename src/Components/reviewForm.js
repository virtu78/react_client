import React, { Component, PropTypes } from 'react';
import * as ons from 'react-onsenui';
import Formsy from 'formsy-react';
import { ValidationInput, ValidationTextarea } from './validationInput'

export default class ReviewForm extends Component {
    render() {
        return (
            <Form onSubmit={(m) => this.props.onSubmit(m.name, m.email, m.title, m.description)} 
                  email={this.props.email}
                  name={this.props.name} />
        )
    }
}

ReviewForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    name: PropTypes.string,
    email: PropTypes.string
};

class Form extends Component {
    state = {
        canSubmit: false
    }
    enableButton() {
        this.setState({
            canSubmit: true
        });
    }
    disableButton() {
        this.setState({
            canSubmit: false
        });
    }
    submit(model) {
        this.props.onSubmit(model);
        this.title.setValue('');
        this.desc.setValue('');
    }
    render() {
        return (
            <Formsy.Form onValidSubmit={::this.submit} onValid={::this.enableButton} onInvalid={::this.disableButton}>
                <div className="reviews-form">
                    <ValidationInput 
                        name="name"
                        inititalValue={this.props.name}
                        placeholder="Ф.И.О."
                        type="text" 
                        required />

                    <ValidationInput 
                        name="email"
                        inititalValue={this.props.email}
                        placeholder="Email"
                        type="text"
                        validations="isEmail" 
                        validationError="Некорректный email" 
                        required />

                    <ValidationInput
                        ref={(input) => this.title = input}
                        name="title"
                        placeholder="Заголовок"
                        type="text" 
                        required />

                    <ValidationTextarea
                        ref={(input) => this.desc = input} 
                        name="description"
                        placeholder="Ваш отзыв..."
                        required />

                    <p style={{textAlign: 'center'}}>
                        <button className="button" disabled={!this.state.canSubmit}>
                            <span>Отправить</span>
                        </button>
                    </p>

                </div>             
            </Formsy.Form>
        );
    }
 }