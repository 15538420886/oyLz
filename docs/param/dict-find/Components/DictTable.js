'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import {Button, Table, Icon, Modal} from 'antd';
import SourcePage from '../../../dev/searchDict/Components/SourcePage';
var Context = require('../../ParamContext');
var Utils = require('../../../public/script/utils');
var Common = require('../../../public/script/common');
var DictStore = require('../../dict/data/DictStore');
var DictActions = require('../../dict/action/DictActions');


var DictTable = React.createClass({
	getInitialState : function() {
		return {
			DictTableSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			loading: false,
            indexName:'',
            code:'',
            isSelected:true,
		}
	},
    mixins: [Reflux.listenTo(DictStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            DictTableSet: data
        });
    },
    // 第一次加载
    componentDidMount : function(){
    	
    },

	onClickCoding:function(){
    	let appName = this.props.appName;
    	let optName = this.props.indexName;
		this.refs.sourceWindow.handleOpen();
		var code = `import DictSelect from '../lib/Components/DictSelect';
import DictRadio from '../lib/Components/DictRadio';
<FormItem labelCol={{span: 0}} wrapperCol={{span: 24}} colon={true} style={{marginBottom: '20px'}}>
	<DictSelect name="idType" id="idType" value={this.props.authUser.idType} appName='${appName}' optName='${optName}' onSelect={this.handleOnSelected.bind(this, "idType")}/>
</FormItem>
<FormItem >
	<DictRadio name="hiberarchy" id="hiberarchy" value={this.state.dictdef.hiberarchy} appName='${appName}' optName='${optName}' onChange={this.onRadioChange}/>
</FormItem >

============================表格 columns===============================

render: (text, record) => (Utils.getOptionName('${appName}', '${optName}', record.corpType, true, this)),`;
			this.setState({code : code});
	},


	render : function() {
		var code = this.state.code;
		var recordSet = Common.filter(this.state.DictTableSet.recordSet);
		var isSelected = this.state.isSelected;
		if (this.props.isSelected === false) {
			isSelected = false;
		};
		const columns = [
			{
				title: '代码值',
				dataIndex: 'codeValue',
				key: 'codeValue',
				width: 240,
			},
			{
				title: '代码名称',
				dataIndex: 'codeDesc',
				key: 'codeDesc',
				width: 240,
			}
		];

		return (
			<div className='full-page'>
				<div className='toolbar-table'>
					<Button disabled={isSelected} icon="code-o" onClick={this.onClickCoding} title='生成代码' style={{marginLeft:'4px'}}/>
				</div>
				<div className='grid-body'>
                  <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false}  size="middle" bordered={Common.tableBorder}/>
				</div>,
				<SourcePage ref="sourceWindow" codeText={code} />
			</div>
		);
	}
});

module.exports = DictTable;
