'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Utils = require('../../public/script/utils');

var XlsDown = React.createClass({
    getInitialState: function () {
        return {
            fields: '',
            data: '',
            isLoading: false,
            timer: null,
        }
    },
    downFile: function (fields, data) {
        this.setState({ isLoading: true, fields: fields, data: data });
    },
    downClick: function () {
        this.refs.fileForm.submit();
    },
    render: function () {
        var url = Utils.paramUrl + 'xlsx-file/create-excel';
        if (this.state.isLoading) {
            this.state.isLoading = false;

            this.state.timer = setTimeout(
                () => {
                    this.downClick();
                    clearInterval(this.state.timer);
                },
                100
            );
        }

        return (
            <form ref='fileForm' action={url} method="post" style={{ display: 'none' }} target="downloadFrame">
                <iframe name="downloadFrame" style={{ display: 'none' }} frameborder="0"></iframe>
                <input type="hidden" name="fields" id="fields" value={this.state.fields} />
                <input type="hidden" name="data" id="data" value={this.state.data} />
            </form>
        );
    }
});

export default XlsDown;
