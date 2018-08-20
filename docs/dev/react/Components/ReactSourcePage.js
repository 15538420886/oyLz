import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ErrorMsg from '../../../lib/Components/ErrorMsg';
import { Modal, Button, Input } from 'antd';
var ReactStore = require('../data/ReactStore.js');
var ReactActions = require('../action/ReactActions');

var ReactSourcePage;
ReactSourcePage = React.createClass({
    getInitialState: function () {
        return {
            reactStore: {
                operation: '',
                errMsg: '',

                strStore: '',
                strAction: '',
                strPage: '',
                strCreatePage: '',
                strUpdatePage: '',
                strPageNavi: ''
            },

            modal: false,
            srcText: '',
            srcType: '',
            param: {}
        }
    },

    genSource: function () {
        var srcType = this.state.srcType;
        if (srcType === 'action') {
            ReactActions.genActionFile(this.state.param);
        }
        else if (srcType === 'store') {
            ReactActions.genStoreFile(this.state.param);
        }
        else if( srcType==='page' ){
            ReactActions.genPageFile(this.state.param);
        }
        else if( srcType==='createPage' ){
            ReactActions.genCreatePageFile(this.state.param);
        }
        else if( srcType==='updatePage' ){
            ReactActions.genUpdatePageFile(this.state.param);
        }
        else if( srcType==='pageNavi' ){
            ReactActions.genPageNaviFile(this.state.param);
        }

    },

    handleClose: function () {
        this.setState({
            modal: false
        });

        this.state.reactStore.operation = '';
    },

    handleOpen: function () {
        this.setState({
            modal: true
        });
    },

    noToggle: function () {

    },

    onDismiss: function () {
        var reactStore = this.state.reactStore;
        reactStore.errMsg = '';
        reactStore.operation = '';
        this.setState({
            reactStore: reactStore
        });
    },

    render: function () {
        var errMsg = '';
        if (this.state.modal && this.state.reactStore.operation != '') {
            if (this.state.reactStore.errMsg != '') {
                errMsg = this.state.reactStore.errMsg;
            }
        }

        var srcText = '';
        var srcType = this.state.srcType;
        if (srcType === 'action') {
            srcText = this.state.reactStore.strAction;
        }
        else if (srcType === 'store') {
            srcText = this.state.reactStore.strStore;
        }
        else if (srcType === 'page') {
            srcText = this.state.reactStore.strPage;
        }
        else if( srcType==='createPage' ){
            srcText = this.state.reactStore.strCreatePage;
        }
        else if( srcType==='updatePage' ){
            srcText = this.state.reactStore.strUpdatePage;
        }
        else if( srcType==='pageNavi' ){
            srcText = this.state.reactStore.strPageNavi;
        }

        return (
            <Modal visible={this.state.modal} width='720px' title="源代码" maskClosable={false} onOk={this.handleClose}
                   onCancel={this.handleClose}
                   footer={[
          	<div style={{display:'block', textAlign:'right'}}>
		          <ErrorMsg message={errMsg} toggle={this.onDismiss}/>
           		<Button key="btnClose" size="large" onClick={this.handleClose}>关闭</Button>
           </div>
          ]}
                >
                <Input type="textarea" name="srcText" id="srcText" value={srcText} style={{height:'320px'}}/>
            </Modal>
        );
    }
});

ReactMixin.onClass(ReactSourcePage, Reflux.connect(ReactStore, 'reactStore'));
export default ReactSourcePage;
