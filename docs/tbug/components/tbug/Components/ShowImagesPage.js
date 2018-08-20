﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var $ = require('jquery');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Utils = require('../../../../public/script/utils');
var Common = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var TmBugStore = require('../data/TmBugStore.js');
var TmBugActions = require('../action/TmBugActions');


var ShowImagesPage = React.createClass({
	getInitialState : function() {
		return {
			tmBugSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			tmBug: {},
			hints: {},
			Bigprice:"预览失败",
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(TmBugStore, "onServiceComplete"), ModalForm('tmBug')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'create'){
	      if( data.errMsg === ''){
	          // 成功，关闭窗口
	          this.setState({
	              modal: false
	          });
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	              tmBugSet: data
	          });
	      }
	  }
	},

	initPage: function(tmBug)
	{
		this.setState({
			Bigprice:"",
			tmBug:""
		})
		var self = this;
		this.state.hints = {};
		this.state.loading = false;
		this.state.tmBugSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
		var url = "http://10.10.10.201:8082/defect_s/bug-attach-upload/findpicbyid?uuid="+tmBug.uuid;
		$.get(url).done(function(data){
			if(data.length != 0){
				var html = <img src={"http://10.10.10.201:8082/defect_s/bug-attach-upload/download3/"+data[0].uuid} style={{height:"100%"}} />;
				self.setState({
					tmBug:data,
					Bigprice:html
				})
			}
		})
	},
	showImage: function(e){
		
		var target = e.target.src;
		console.log(target)
		var html  = <img src={target} style={{height:"100%"}}/>;
		this.setState({
			Bigprice:html
		})
	},
	render : function(){
		var temp = this.state.tmBug;
		var seft = this;
		var list = [];
		var url = "http://10.10.10.201:8082/defect_s/bug-attach-upload/download3/"
		for(var i = 0 ; i < temp.length; i++){
			list.push(temp[i].uid);
		};
	
		temp = list.map(function(item){
			return (<li style={{width:"120px",height:"120px",overflow:"hidden",padding:"0",margin:"10px",textAlign:"center"}} >
					<img src={url + item} style={{width:"80%",display:"inline-block"}} onClick={seft.showImage} />
					</li>);
		})
		
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
		const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 4}),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };
		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='840px' title="图片预览" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   	<div style={{width:"100%",height:"100%",display:"flex","marign":"0","padding":"0"}}>
				   <ul style={{flex:"1",height:"380px",overflow:"auto"}}>
				   		{temp?temp:"暂无附件"}
				   </ul>
				   <div style={{flex:"4",textAlign:"center",height:"380px",overflow:"auto"}}>
				 	   {this.state.Bigprice?this.state.Bigprice:""}
				   </div>
			</div>
			</Modal>
		);
	}
});

export default ShowImagesPage;