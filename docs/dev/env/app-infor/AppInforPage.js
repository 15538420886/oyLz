'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import { Form, Modal, Input, Button } from 'antd';
const FormItem = Form.Item;
import { browserHistory } from 'react-router'
import ServiceMsg from '../../lib/Components/ServiceMsg';
import ModalForm from '../../lib/Components/ModalForm';
var Validator = require('../../public/script/common');
var EnvHostStore = require('../host/data/EnvHostStore.js');
var EnvHostActions = require('../host/action/EnvHostActions');


var AppInforPage = React.createClass({
  getInitialState : function() {
	return {
    appInforSet: {
      operation : '',
      errMsg : ''
    },
    envHost: this.props.envHost,
    hints: {},
    loading: false,
    validRules: [],
	}
  },

  mixins: [Reflux.listenTo(EnvHostStore, "onServiceComplete"), ModalForm('envHost')],
  onServiceComplete: function(data) {
    if(data.operation === 'update'){
        if( data.errMsg === ''){
            // 成功，返回
            this.handleGoBack();
            return null;
        } 
        else{
            // 失败
            this.setState({
                loading: false,
                appInforSet: data
            });
        }
    }
  },

  // 第一次加载
  componentDidMount : function(){
      this.state.validRules = [
          {id: 'hostName', desc:'服务器名称', required: true, max: '64'},
          {id: 'ipAddr', desc:'IP地址', required: true, max: '64'},
          {id: 'osName', desc:'OS编号', required: false, max: '16'},
          {id: 'memInfo', desc:'内存', required: false, max: '64'},
          {id: 'cpuInfo', desc:'CPU', required: false, max: '64'},
          {id: 'diskInfo', desc:'内置硬盘', required: false, max: '64'},
          {id: 'raidInfo', desc:'磁盘阵列', required: false, max: '64'},
          {id: 'manager', desc:'管理员', required: false, max: '64'},
          {id: 'mPhone', desc:'联系电话', required: false, max: '64'},
          {id: 'deployLoc', desc:'存放地址', required: false, max: '256'},
          {id: 'memo2', desc:'备注', required: false, max: '512'},

      ];
  },

  onClickSave : function(){
      if(Validator.validator(this, this.state.envHost)){
          EnvHostActions.updateEnvHost( this.state.envHost );
      }
      else{
          this.setState({
              hint: this.state.hint
          });
      }

  },
  handleGoBack : function(){

    browserHistory.push({
        pathname: '/env/EnvHostPage/',
    });

  },

  render : function() {

  var layout='horizontal';
  var layoutItem='form-item-'+layout;
  const formItemLayout = {
    labelCol: ((layout=='vertical') ? null : {span: 4}),
    wrapperCol: ((layout=='vertical') ? null : {span: 20}),
  };
  var hints=this.state.hints;
	return (
  		<div className='grid-page' style={{width:"540px"}}>
         <Form layout={layout}>
            <FormItem {...formItemLayout} label="服务器名称" required={true} colon={true} className={layoutItem} help={hints.hostNameHint} validateStatus={hints.hostNameStatus}>
              <Input type="text" name="hostName" id="hostName" value={this.state.envHost.hostName } onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="IP地址" required={true} colon={true} className={layoutItem} help={hints.ipAddrHint} validateStatus={hints.ipAddrStatus}>
              <Input type="text" name="ipAddr" id="ipAddr" value={this.state.envHost.ipAddr } onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="OS编号" required={false} colon={true} className={layoutItem} help={hints.osNameHint} validateStatus={hints.osNameStatus}>
              <Input type="text" name="osName" id="osName" value={this.state.envHost.osName } onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="内存" required={false} colon={true} className={layoutItem} help={hints.memInfoHint} validateStatus={hints.memInfoStatus}>
              <Input type="text" name="memInfo" id="memInfo" value={this.state.envHost.memInfo } onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="CPU" required={false} colon={true} className={layoutItem} help={hints.cpuInfoHint} validateStatus={hints.cpuInfoStatus}>
              <Input type="text" name="cpuInfo" id="cpuInfo" value={this.state.envHost.cpuInfo } onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="内置硬盘" required={false} colon={true} className={layoutItem} help={hints.diskInfoHint} validateStatus={hints.diskInfoStatus}>
              <Input type="text" name="diskInfo" id="diskInfo" value={this.state.envHost.diskInfo } onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="磁盘阵列" required={false} colon={true} className={layoutItem} help={hints.raidInfoHint} validateStatus={hints.raidInfoStatus}>
              <Input type="text" name="raidInfo" id="raidInfo" value={this.state.envHost.raidInfo } onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="管理员" required={false} colon={true} className={layoutItem} help={hints.managerHint} validateStatus={hints.managerStatus}>
              <Input type="text" name="manager" id="manager" value={this.state.envHost.manager } onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="联系电话" required={false} colon={true} className={layoutItem} help={hints.mPhoneHint} validateStatus={hints.mPhoneStatus}>
              <Input type="text" name="mPhone" id="mPhone" value={this.state.envHost.mPhone } onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="存放地址" required={false} colon={true} className={layoutItem} help={hints.deployLocHint} validateStatus={hints.deployLocStatus}>
              <Input type="textarea" name="deployLoc" id="deployLoc" value={this.state.envHost.deployLoc } onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="备注" required={false} colon={true} className={layoutItem} help={hints.memo2Hint} validateStatus={hints.memo2Status}>
              <Input type="textarea" name="memo2" id="memo2" value={this.state.envHost.memo2 } onChange={this.handleOnChange} />
            </FormItem>
            <FormItem style={{display:'block', textAlign:'center'}}>
                <ServiceMsg ref='mxgBox' svcList={['env_info/update']}/>
                <Button size="large" onClick={this.onClickSave} loading={this.state.loading}>确定</Button>{' '}
                <Button size="large" onClick={this.handleGoBack}>返回</Button>
            </FormItem>
          </Form>
        </div>);
  }
});

ReactMixin.onClass(AppInforPage, Reflux.connect(EnvHostStore, 'appInforSet'));
module.exports = AppInforPage;