import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Checkbox, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var ArticlesStore = require('../data/ArticlesStore.js');
var ArticlesActions = require('../action/ArticlesActions');

var CreateArticlesPage = React.createClass({
	getInitialState : function() {
		return {
			articlesSet: {},
			loading: false,
			modal: false,
			articles: {},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(ArticlesStore, "onServiceComplete"), ModalForm('articles')],
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
					articlesSet: data
				});
			}
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'inventCode', desc:'序号', required: true, max: '24'},
            {id: 'isQrcode', desc:'二维码', required: false, max: '24'},
            {id: 'inventName', desc:'名称', required: true, max: '24'},
		];
	},
	
	clear : function(filter){
		this.state.hints = {};
        this.state.articles.inventCode='';
        this.state.articles.isQrcode='';
        this.state.articles.inventName='';
		
		this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

    handleOnChange2 : function(e) {
        var isQrcode = this.state.articles.isQrcode;
        this.state.articles.isQrcode = isQrcode === '是' ? '否':'是';
        this.setState({
            loading: this.state.loading
        });
    },

	onClickSave : function(){
		if(Common.formValidator(this, this.state.articles)){
			this.setState({loading: true});
			var obj = {
				filter: this.props.assetType.uuid,
				object: this.state.articles
        	}
			ArticlesActions.createArticles( obj );
		}
	},

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		const formItemLayout2 = {
			labelCol: ((layout == 'vertical') ? null : { span: 8 }),
			wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
		};

		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="增加物品清单" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['articles/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout2} label="序号" required={true} colon={true} className={layoutItem} help={hints.inventCodeHint} validateStatus={hints.inventCodeStatus}>
                                <Input type="text" name="inventCode" id="inventCode" value={this.state.articles.inventCode } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout2} required={false} colon={true} className={layoutItem} >
                                <Checkbox style={{marginLeft: '30px'}} name="isQrcode" id="isQrcode" checked={this.state.articles.isQrcode === '是'} onChange={this.handleOnChange2} >生成二维码</Checkbox>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} label="名称" required={true} colon={true} className={layoutItem} help={hints.inventNameHint} validateStatus={hints.inventNameStatus}>
                        <Input type="text" name="inventName" id="inventName" value={this.state.articles.inventName } onChange={this.handleOnChange} />
                    </FormItem>
				</Form>
			</Modal>
		);
	}
});

export default CreateArticlesPage;