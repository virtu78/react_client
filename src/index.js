import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import * as ons from 'react-onsenui';
import * as Ons from 'onsenui'

import reducers from './Reducers';
import middlewares from './middlewares';
import Nav from './Containers';

import { load } from './Actions/global';

Ons.platform.select('ios');

import './sass/main.scss';
import './utils/polifils';

const store = createStore(reducers, {}, middlewares);
store.dispatch(load());

if(process.env.NODE_ENV === 'development') {
    window.store = store
}

class App extends React.Component {
    render() {
        return (
            <Provider store={ store }>
                <Nav />
            </Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));