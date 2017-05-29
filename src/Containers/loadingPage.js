import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ons from 'react-onsenui';

const tableStyle = {
    width: '100%',
    height: '100%',
    display: 'table'
};

const rowStyle = {
    display: 'table-row',
    textAlign: 'center'
};

const cellStyle = {
    display: 'table-cell',
    verticalAlign: 'middle'
};

const containerStyle = {
    width: '80%',
    display: 'inline-block'
};

export default class LoadingPage extends Component {
    render() {
        return (
            <ons.Page>
                <div style={tableStyle}>
                    <div style={rowStyle}>
                        <div style={cellStyle}>
                            <div style={containerStyle}>
                                <h3>Загрузка...</h3>
                                <ons.ProgressBar indeterminate />
                            </div>
                        </div>
                    </div>
                </div>
            </ons.Page>
        );
    }
}