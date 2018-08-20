'use strict';

var $ = require('jquery');
import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import { Form, Button, Input, Select, Table, layout, Spin} from 'antd';
const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;

import SourcePage from './Components/SourcePage';

var AppActions = require('../../param/app/action/AppActions.js');
var AppStore = require('../../param/app/data/AppStore.js');

var SearchDictPage = React.createClass({
	getInitialState: function () {
		return {
			searchDictSet:{
				recordSet: [],
				operation: "",
				errMsg: ""
			},
			appName:"",
			itemMap:{},
			relatedMap:[],
			selectedRow:-1,
			code:"",
			loading:false
		}
	},

	// 第一次加载
	componentDidMount: function () {
		this.state.searchDictSet = {
            recordSet: [],
      	};
      	this.state.searchDictSet.operation = '';
   		this.setState({loading: true});
		AppActions.retrieveAppInfo();
	},
	onChangeApp:function(value){
		var self = this;
        var fileName = this.paramUrl + 'app-info/dict?appName=' + value;
		this.state.appName = value;
		$.getScript(fileName, function(){
			var itemMap = {};
			dict.map((node, i) => {
				itemMap[node.indexName] = node;
			});
			 self.state.itemMap = itemMap;
		});
	},

	onSearch:function(value){
		let itemMap = this.state.itemMap;
		//查找有关value的所有项，并添加到this.state.relatedMap数组中
		let reg=new RegExp(value,"i");
		//遍历itemMap
		var relatedMap=[];
		for(let item in itemMap){
			if(reg.test(item)){
				relatedMap.push(itemMap[item]);
			}else{
				let arr = itemMap[item].codeData;
				let len = arr.length;
				for(let i = 0 ; i < len ; i++ ){

					let value=arr[i].codeValue;
					let desc=arr[i].codeDesc;
					if( reg.test(value)||reg.test(desc) ){
						relatedMap.push(itemMap[item]);
						break;
					}

				}
			}
		}
		relatedMap.map((related,i)=>{
			related.index = i;
			related.opts = this.doOptionsShow(related.codeData);
		});
		this.setState({relatedMap:relatedMap});

	},

	doOptionsShow:function(arr){
		var newArr = [];
		var data = '';
		arr.map(item=>{
			data = item.codeValue+' - '+item.codeDesc
			newArr.push( data );
		})
		var str = newArr.join(`  /  `)
		return str;

	},

	handleRelatedClick:function(related,index){
		let appName = this.state.appName;
		let optName = related.indexName;
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

render: (text, record) => (Utils.getOptionName('${appName}', '${optName}', record.corpType, true, this)),
`;
		this.setState({selectedRow : index, code : code});

	},

	getRowClassName: function(record, index){

		if(this.state.selectedRow === index){
			return 'selected';
		}
		else{
			return null;
		}
	},

	render: function () {

		if( this.state.loading ){
	      if(this.state.searchDictSet.operation === 'retrieve' || this.state.searchDictSet.operation === 'remove'){
	          this.state.loading = false;
	      }
	    }

		const appNameOptions = this.state.searchDictSet.recordSet;
		const relatedMap = this.state.relatedMap;
		const code = this.state.code;
		const columns = [
		{
			title: '相关字典名称',
			dataIndex: 'indexName',
			key: 'indexName',
			render: text => <span title="点击查看代码">{text}</span>
		},{
			title: '字典项(value - desc)',
			dataIndex: 'opts',
			key: 'opts',
			render: text => <span title="点击查看代码">{text}</span>
		}
		];
		const obj = (<Select required={true} style={{width:400}} onChange={value => this.onChangeApp(value)} loading={this.state.loading} >
							{
					          appNameOptions.map((app, i) => {
					              return <Option key={app.uuid} value={app.appName}>{app.appName+" - "+app.appDesc}</Option>
					          })
					        }
						</Select>);

		return (
			<div className='form-page' style={{width:'740px', paddingLeft: '16px'}}>
				<Form layout={layout}>
					<FormItem label="请选择要查找的App：" colon={true}>
						{this.state.loading ? <Spin>{obj}</Spin> : obj}
					</FormItem>
					<FormItem label="请输入关键字查询字典项：" colon={true}>
						<Search placeholder="input search text" style={{ width: 400 }} onSearch={value => this.onSearch(value)} name="keyword" id="keyword" size="large"
			          />
					</FormItem>
				</Form>
				<Table style={{ width: 800, marginTop:30 }} columns={columns} dataSource={relatedMap} onRowClick={(record, index) => {this.handleRelatedClick(record,index)} } rowClassName={this.getRowClassName}  rowKey={record => record.index} pagination={false} bordered />
				<SourcePage ref="sourceWindow" codeText={code} />
			</div>);
	}
});

ReactMixin.onClass(SearchDictPage, Reflux.connect(AppStore, 'searchDictSet'));
module.exports = SearchDictPage;
