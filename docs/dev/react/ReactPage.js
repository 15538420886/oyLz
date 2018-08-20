'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Table, Icon } from 'antd';
import ErrorMsg from '../../lib/Components/ErrorMsg';
import { Form, Input, Tooltip, Cascader, Select, Row, Checkbox, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var ReactStore = require('./data/ReactStore.js');
var ReactActions = require('./action/ReactActions');
import ReactSourcePage from './Components/ReactSourcePage';

var ReactPage;
ReactPage = React.createClass({
	getInitialState: function () {
		return {
			reactStore: {
				strStore: '',
				strAction: '',
				strPage: '',
				operation: '',
				errMsg: ''
			},
			param: {
				shortObject: 'Corp',
				objectName: 'corp',
				resourceName: 'auth-corp',
				resourceTitle: '园区',
				params: 'campusCode',

				retrieveMethod: 'retrieve',
				createMethod: 'create',
				updateMethod: 'update',
				removeMethod: 'remove'
			}
		}
	},

	// 第一次加载
	componentDidMount: function () {
	},

	//更新state
	handleOnChange: function (e) {
		var param = this.state.param;
		param[e.target.id] = e.target.value;
		this.setState({
			param: param
		});
	},


	handleActionClick: function (event) {
		this.refs.sourceWindow.state.srcType = 'action';
		this.refs.sourceWindow.state.param = this.state.param;
		this.refs.sourceWindow.genSource();
		this.refs.sourceWindow.handleOpen();
	},

	handleStoreClick: function (event) {
		this.refs.sourceWindow.state.srcType = 'store';
		this.refs.sourceWindow.state.param = this.state.param;
		this.refs.sourceWindow.genSource();
		this.refs.sourceWindow.handleOpen();
	},

	handlePageClick: function (event) {
		this.refs.sourceWindow.state.srcType = 'page';
		this.refs.sourceWindow.state.param = this.state.param;
		this.refs.sourceWindow.genSource();
		this.refs.sourceWindow.handleOpen();
	},

	handleCreatePageClick: function (event) {
		this.refs.sourceWindow.state.srcType = 'createPage';
		this.refs.sourceWindow.state.param = this.state.param;
		this.refs.sourceWindow.genSource();
		this.refs.sourceWindow.handleOpen();
	},

	handleUpdatePageClick: function (event) {
		this.refs.sourceWindow.state.srcType = 'updatePage';
		this.refs.sourceWindow.state.param = this.state.param;
		this.refs.sourceWindow.genSource();
		this.refs.sourceWindow.handleOpen();
	},

	handlePageNaviClick: function (event) {
		this.refs.sourceWindow.state.srcType = 'pageNavi';
		this.refs.sourceWindow.state.param = this.state.param;
		this.refs.sourceWindow.genSource();
		this.refs.sourceWindow.handleOpen();
	},

	render: function () {
		var errMsg = '';
		var operation = this.state.reactStore.operation;
		if (operation != 'update' && operation != 'create' && operation != '') {
			if (this.state.reactStore.errMsg != '') {
				errMsg = this.state.reactStore.errMsg;
			}
		}

	    var layout='vertical';
	    var layoutItem='form-item-'+layout;
	    const formItemLayout = {
	      labelCol: ((layout=='vertical') ? null : {span: 4}),
	      wrapperCol: ((layout=='vertical') ? null : {span: 20}),
	    };

		return (
			<div className='form-page' style={{width:'740px', paddingLeft: '16px'}}>
				<ErrorMsg message={errMsg} toggle={this.onDismiss}/>

				<Form layout={layout}>
					<FormItem {...formItemLayout} label="对象名称，比如：Update{名称}Page，{名称}Store" colon={true} className={layoutItem}>
						<Input type="text" name="shortObject" id="shortObject" size="large" value={this.state.param.shortObject}
							   onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="变量名称，比如：{名称}Set" colon={true} className={layoutItem}>
						<Input type="text" name="objectName" id="objectName" size="large" value={this.state.param.objectName}
							   onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="资源名称，和服务器的资源名称一致" colon={true} className={layoutItem}>
						<Input type="text" name="resourceName" id="resourceName" size="large" value={this.state.param.resourceName}
							   onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="资源标题，比如：修改{名称}信息" colon={true} className={layoutItem}>
						<Input type="text" name="resourceTitle" id="resourceTitle" size="large" value={this.state.param.resourceTitle}
							   onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="输入参数，从前一个页面传递下来的变量" colon={true} className={layoutItem}>
						<Input type="text" name="params" id="params" size="large" value={this.state.param.params}
							   onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="查询方法，和服务名称一致" colon={true} className={layoutItem}>
						<Input type="text" name="retrieveMethod" id="retrieveMethod" size="large" value={this.state.param.retrieveMethod}
							   onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="增加方法，和服务名称一致" colon={true} className={layoutItem}>
						<Input type="text" name="createMethod" id="createMethod" size="large" value={this.state.param.createMethod}
							   onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="修改方法，和服务名称一致" colon={true} className={layoutItem}>
						<Input type="text" name="updateMethod" id="updateMethod" size="large" value={this.state.param.updateMethod}
							   onChange={this.handleOnChange}/>
					</FormItem>
					<FormItem {...formItemLayout} label="删除方法，和服务名称一致" colon={true} className={layoutItem}>
						<Input type="text" name="removeMethod" id="removeMethod" size="large" value={this.state.param.removeMethod}
							   onChange={this.handleOnChange}/>
					</FormItem>
				</Form>

				<Button type="primary" size="large" onClick={this.handleActionClick}>Action文件</Button>{' '}
				<Button type="primary" size="large" onClick={this.handleStoreClick}>Store文件</Button>{' '}
				<Button type="primary" size="large" onClick={this.handlePageClick}>Page文件</Button>{' '}
				<Button type="primary" size="large" onClick={this.handleCreatePageClick}>CreatePage文件</Button>{' '}
				<Button type="primary" size="large" onClick={this.handleUpdatePageClick}>UpdatePage文件</Button>{' '}
				<Button type="primary" size="large" onClick={this.handlePageNaviClick}>Page_Navi文件</Button>{' '}

				<ReactSourcePage ref="sourceWindow"/>
			</div>);
	}
});

ReactMixin.onClass(ReactPage, Reflux.connect(ReactStore, 'reactStore'));
module.exports = ReactPage;
