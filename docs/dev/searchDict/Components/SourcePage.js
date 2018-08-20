import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Modal, Button, Input } from 'antd';

var SourcePage;
SourcePage = React.createClass({
    getInitialState: function () {
        return {
            modal: false,
        }
    },

    handleClose: function () {
        this.setState({
            modal: false
        });
    },

    handleOpen: function () {
        this.setState({
            modal: true
        });
    },

    render: function () {
        const codeText = this.props.codeText;

        return (
            <Modal visible={this.state.modal} width='720px' title="源代码" maskClosable={false} onOk={this.handleClose}
                   onCancel={this.handleClose}
                >
                <Input type="textarea" name="codeText" id="codeText" value={codeText} style={{height:'320px'}}/>
            </Modal>
        );
    }
});
export default SourcePage;
