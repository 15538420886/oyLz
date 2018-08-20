import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import DictRadio from '../../../lib/Components/DictRadio';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import ResTreeSelect from '../../lib/Components/ResTreeSelect';
 
var PageDesignActions = require('../../page/action/PageDesignActions');
var PageDesignStore = require('../../page/data/PageDesignStore');


var CreateResourcePage = React.createClass({
	getInitialState : function() {
		return {
			resSet: {
				operation : '',
				errMsg : ''
			},
			loading:false,
			modal: false,
			res2: {},
			hints: {},
            validRules: [],
            pageInfo: {}
		}
	},

	mixins: [Reflux.listenTo(PageDesignStore, "onServiceComplete"), ModalForm('res2')],
	onServiceComplete: function(data) {
	    if(this.state.modal && data.operation === 'createResource'){
	        if( data.errMsg === ''){
	            // 成功，关闭窗口
	            this.setState({
	                modal: false,
	                loading:false
	            });
	        }
	        else{
	            // 失败
	            this.setState({
	                loading: false,
	                resSet: data
	            });
	        }
	    }  
	},
	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            { id: 'resName', desc: '资源名称', required: true, validator: this.checkResName, max: '0'},
			{id: 'resDesc', desc:'资源描述', required: false, max: '0'},
		];
    },
    checkResName: function (value, rule, page) {
        var resList = this.state.pageInfo.resList;
        if (resList !== null) {
            for (var x = resList.length - 1; x >= 0; x--) {
                var resNode = resList[x];
                if (resNode.resName === value) {
                    return '资源名称[' + value + ']已经存在';
                }
            }
        }
    },

    clear: function (pageInfo){
        this.state.hints = {};
        this.state.pageInfo = pageInfo;
		this.state.res2.resName='';
		this.state.res2.resDesc='';
	},

	onClickSave : function(){
		if(Validator.formValidator(this, this.state.res2)){
			this.setState({loading: true});	
			console.log(this.state.res2)
			PageDesignActions.addResource( this.state.res2 );
		}
	},
	onSelect:function(e,res){
		var res2
		if(res.length !== 0){	
			var res = res[0].props.title;
			res2 = {
				resName : res.slice(0,res.indexOf('(')),
				resDesc : res.slice(res.indexOf('(')+1,res.indexOf(')'))
			}				
		}else{
			res2 = {
				resName : '',
				resDesc : ''
			}	
		}
		this.setState({
			res2:res2
		})	
	},

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};

		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="增加资源" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['page-design/createResource']} />
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
				    <FormItem {...formItemLayout} label="资源名称" colon={true} className={layoutItem} help={hints.resNameHint} validateStatus={hints.resNameStatus}>
				    	<ResTreeSelect  name="resName" id="resName" value={this.state.res2.resName} onSelect={this.onSelect}/>
					</FormItem>
				    <FormItem {...formItemLayout} label="资源描述" colon={true} className={layoutItem} help={hints.resDescHint} validateStatus={hints.resDescStatus}>
						<Input type="text" name="resDesc" id="resDesc" value={this.state.res2.resDesc} onChange={this.handleOnChange}/>
					</FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateResourcePage;
