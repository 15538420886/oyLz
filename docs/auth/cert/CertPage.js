'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal,Input,Form,Radio} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

var CertStore = require('./data/CertStore.js');
var CertActions = require('./action/CertActions');
import CreateCertPage from './Components/CreateCertPage';
import UpdateCertPage from './Components/UpdateCertPage';

var CertPage = React.createClass({
  getInitialState : function() {
    return {
      certSet: {
        recordSet: [],
        startPage : 0,
        pageRow : 0,
        totalRow : 0,
        operation : '',
        errMsg : ''
      },
      action: '',
      device: null,
      loading: false,
      corpKey: {},
      hints: {},

    }
  },

  mixins: [Reflux.listenTo(CertStore, "onServiceComplete")],
  onServiceComplete: function(data) {
    this.setState({
      loading: false,
      certSet: data
    });
  },

  // 第一次加载
  componentDidMount : function(){
    console.log(window.loginData.compUser)
    this.setState({loading: true});
    this.state.corpKey.keyType='0';
  },

  onRadioChange: function(e) {
    var corpKey = this.state.corpKey;
    corpKey[e.target.id] = ''+e.target.value;
    this.setState({
      corpKey: corpKey
    });
  },

  render : function() {
    var layout='horizontal';
    var layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 6}),
      wrapperCol: ((layout=='vertical') ? null : {span: 18}),
    };

    var hints=this.state.hints;
  	var content =
			<div className='grid-page' style={{height:"250px"}}>
				<ServiceMsg ref='mxgBox' svcList={['corp-key/retrieve', 'corp-key/remove']}/>
				<div style={{width:'400px', paddingTop:'50px', paddingLeft:"100px"}}>
					<div style={{width:'100%',height:'100px',lineHeight:'20px',fontSize:'14px',marginBottom:'50px'}}>
						<p>企业证书用于创建特权用户，</p>
                        <p>特权用户可以查看所有员工的工资单等敏感数据，</p>
						<p>因此请妥善保管好密码。</p>
						<p>证书密码不保存在数据库中，丢失后无法找回！</p>
						<p>每个企业只能创建一个证书！</p>
					</div>
          <FormItem {...formItemLayout} label="操作类型" colon={true} className={layoutItem} help={hints.keyTypeHint} validateStatus={hints.keyTypeStatus}>
            <RadioGroup name="keyType" id="keyType" onChange={this.onRadioChange} value={this.state.corpKey.keyType}>
              <Radio id="keyType" value='0'>创建证书</Radio>
              <Radio id="keyType" value='1'>修改密码</Radio>
            </RadioGroup>
          </FormItem>
				</div>
			</div>;
    var page = null;
    if(this.state.corpKey.keyType === "0"){
      page = <CreateCertPage />
    }
    else if(this.state.corpKey.keyType === "1"){
      page = <UpdateCertPage />
    }

    return (
			<div style={{width: '100%', height: '100%'}}>
        {content}
        {page}
			</div>
    );
  }
});

module.exports = CertPage;

