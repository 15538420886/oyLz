import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var $ = require('jquery');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Utils = require('../../../../public/script/utils');
var Common = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col,Upload,Icon ,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
var BmSystemActions = require('../action/BmSystemActions');
var BmSystemStore = require('../data/BmSystemStore');


var EnclosurePage = React.createClass({
	getInitialState : function() {
		return {
			tmUserSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			tmBug: {},
			tmBug1:{},
			hints: {},
			Bigprice:"预览失败",
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(BmSystemStore, "onServiceComplete"), ModalForm('tmBug')],
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
	              tmUserSet: data
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
		this.state.tmUserSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
		
		var url = "http://10.10.10.201:8082/defect_s/bug-attach-upload/findpicbyid3?uuid="+tmBug.uuid;
		$.get(url).done(function(data){
			console.log(data)
			if(data.length != 0){
				var html =
				<img src={"http://10.10.10.201:8082/defect_s/bug-attach-upload/download3/"+data.pid} style={{height:"100%"}} />;
				self.setState({
					tmBug:data.list,
					Bigprice:html,
					tmBug1:data
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
	handleDelete:function(filed,event){
		console.log(filed)
		var url ='http://10.10.10.201:8082/defect_s/bug-attach-upload/delpicbyid?uuid='+filed
		Modal.confirm({
            title: '删除确认',
            content: '是否删除这个附件',
            okText: '确定',
            cancelText: '取消',
            onOk: this.handleDelete2.bind(this,filed)
        });
		
		
	},
	handleDelete2:function(filed){
	
	var url ='http://10.10.10.201:8082/defect_s/bug-attach-upload/delpicbyid?uuid='+filed
		$.get(url).done(function(data){
			message.success(data.message)
		})
		
		
	},
	render : function(){
		var temp = this.state.tmBug;
		var seft = this;
		var list = [];
		var url = "http://10.10.10.201:8082/defect_s/bug-attach-upload/download3/"
		// 删除http://10.10.10.201:8082/defect_s/bug-attach-upload/delpicbyid?uuid=53c19f3264df47468e94ec396ae69baa
		for(var i = 0 ; i < temp.length; i++){
			list.push(temp[i].uid);
		};
		
		temp = list.map(function(item){
			console.log(item)
			return (<li style={{ border: '1px solid #ccc',borderRadius:'4px',height:"120px",overflow:"hidden",position:'relative',padding:"0",margin:"10px",textAlign:"center",sursor:'pointer'}} > 
						<Icon type="close-circle-o" style={{position:'absolute',right:'3px',top:'3px',fontSize:"20px",cursor:'pointer'}} onClick={seft.handleDelete.bind(this,item)}/>
						<img src={url + item} style={{width:"80%",display:"inline-block",}} onClick={seft.showImage} />
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
        console.log(this.state.tmBug1.pid)
		var hints=this.state.hints;
		
		const props = {
			name: 'file',
			multiple: true,
			action: 'http://10.10.10.201:8082/defect_s/bug-attach-upload/upload?uuid='+this.state.tmBug1.pid,
			onChange(info) {
			  const status = info.file.status;
			  if (status !== 'uploading') {
				console.log(info.file, info.fileList);
			  }
			  if (status === 'done') {
				message.success(`${info.file.name} 文件上传成功!.`);
			  } else if (status === 'error') {
				message.error(`${info.file.name} 文件上传失败!.`);
			  }
			},
			
			
		};
		return (
			<Modal visible={this.state.modal} width='840px' title="附件预览" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   	<div >
		   	         <Upload {...props}>
					    <Button>
					      <Icon type="upload" /> 点击上传
					    </Button>
				     </Upload>    
		   	      <div style={{width:"100%",height:"100%",display:"flex","marign":"0","padding":"0"}}>
					   <ul style={{flex:"1",height:"380px",overflow:"auto"}}>
					   		{temp?temp:"暂无附件"}
					   </ul>
					   <div style={{flex:"3.5",textAlign:"center",height:"380px",overflow:"auto"}}>
					 	   {this.state.Bigprice?this.state.Bigprice:""}
					   </div>
				  </div>
			</div>
			</Modal>
		);
	}
});

export default EnclosurePage;