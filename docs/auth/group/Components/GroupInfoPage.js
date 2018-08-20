'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
import { browserHistory } from 'react-router'
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');
import {Form, Input, Button, Table, Icon} from 'antd';
const FormItem = Form.Item;

var Utils = require('../../../public/script/utils');
var AppGroupActions = require('../../appGroup/action/AppGroupActions');
var AppGroupStore = require('../../appGroup/data/AppGroupStore');

var GroupInfoPage = React.createClass({
    getInitialState : function() {
        return {
            appGroupSet: {
                operation : '',
                errMsg : '',
                recordSet: []
            },

            loading: false,
            appGroup: this.props.appGroup,
            hints: {},
            validRules: [],
        }
    },

      mixins: [Reflux.listenTo(AppGroupStore, "onServiceComplete"), ModalForm('appGroup')],
      onServiceComplete: function(data) {
          if(data.operation === 'update'){
              if( data.errMsg === ''){
                  // 成功
                  this.handleGoBack();
              }
              else{
                  // 失败
                  this.setState({
                      loading: false,
                      appGroupSet: data
                  });
              }
          }
      },

    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
            {id: 'groupName', desc:'应用名称', max: 64},
            {id: 'groupDesc', desc:'说明', max: 1024}
        ];
    },

    onClickSave : function(){
        if(Validator.formValidator(this, this.state.appGroup)){
        	this.setState({loading: true});
            AppGroupActions.updateAuthAppGroup( this.state.appGroup );
        }
    },

    handleGoBack : function()
    {
        browserHistory.push({
            pathname: '/auth/AppGroupPage/',
        });
    },

    render : function() {
        var layout='horizontal';
        var layoutItem='form-item-'+layout;
        const formItemLayout = {
            labelCol: ((layout=='vertical') ? null : {span: 3}),
            wrapperCol: ((layout=='vertical') ? null : {span: 21}),
        };

        var hints=this.state.hints;

        return (
            <div className='grid-page'>
                <Form layout={layout} className='form-body' style={{width:'640px'}}>
                    <FormItem {...formItemLayout} label="应用组名称" colon={true} className={layoutItem} help={hints.groupNameHint} validateStatus={hints.groupNameStatus}>
                        <Input type="text" name="groupName" id="groupName" value={this.state.appGroup.groupName} onChange={this.handleOnChange}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="说明" colon={true} className={layoutItem} help={hints.groupDescHint} validateStatus={hints.groupDescStatus}>
                        <Input type="textarea" name="groupDesc" id="groupDesc" value={this.state.appGroup.groupDesc} onChange={this.handleOnChange} style={{height:'80px'}}/>
                    </FormItem>
                    <FormItem/>
                    <FormItem style={{display:'block', textAlign:'right'}}>
                        <ServiceMsg ref='mxgBox' svcList={['auth-app-group/update']}/>
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>确定</Button>
                        <Button key="btnBack" size="large" style={{marginLeft: '12px'}} onClick={this.handleGoBack}>返回</Button>
                    </FormItem>
                </Form>

            </div>
        );
    }
});

module.exports = GroupInfoPage;
