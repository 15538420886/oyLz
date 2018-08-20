'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input , Upload, message} from 'antd';
const Search = Input.Search;

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var DeviceStore = require('./data/DeviceStore.js');
var DeviceActions = require('./action/DeviceActions');
import CreateDevicePage from './Components/CreateDevicePage';
import UpdateDevicePage from './Components/UpdateDevicePage';
import DeviceFilter from './Components/DeviceFilter';
import XlsTempFile from '../../lib/Components/XlsTempFile';
import XlsConfig from '../lib/XlsConfig';

var pageRows = 10;
var DevicePage = React.createClass({
	getInitialState : function() {
		return {
			deviceSet: {
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			action: 'query',
            device: null,

			loading: false,
			moreFilter: false,
            filterValue: '',
            filter: {},
		}
	},

    mixins: [Reflux.listenTo(DeviceStore, "onServiceComplete"),XlsTempFile()],
	onServiceComplete: function(data) {
        if(data.operation === 'cache'){
            var ff = data.filter.staffCode;
            if(ff === null || typeof(ff) === 'undefined' || ff === ''){
                ff = data.filter.perName;
                if(ff === null || typeof(ff) === 'undefined'){
                    ff = '';
                }
            }
            this.state.filterValue = ff;
            this.state.filter = data.filter;
            this.state.moreFilter = (data.filter.more === '1');

            if(this.state.moreFilter){
                var mp = this.refs.DeviceFilter;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.device = this.state.filter;
                }
            }
        }
        this.setState({
            loading: false,
            deviceSet: data
        });
    },
	componentDidMount : function(){
		DeviceActions.getCacheData();
	},
	handleQueryClick : function() {
		this.setState({loading: true});
        this.state.filter.status = '1';
        this.state.filter.corpUuid = window.loginData.compUser.corpUuid;
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
        DeviceActions.retrieveHrDevicePage(this.state.filter, this.state.deviceSet.startPage, pageRows);
	},
	showMoreFilter: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },
	onChangePage: function(pageNumber){
        this.state.deviceSet.startPage = pageNumber;
        this.handleQueryClick();
    },
    onShowSizeChange: function(current, pageSize){
        pageRows = pageSize;
        this.handleQueryClick();
    },
    onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
    },
    onSearch: function(e){
        this.state.filter={};
        var filterValue = this.state.filterValue;
        if (Common.isIncNumber(filterValue)){
            this.state.filter.staffCode = filterValue;
        }
        else{
            this.state.filter.perName = filterValue;
        }

        this.handleQueryClick();
    },
    onMoreSearch: function(){
        var filter = this.refs.DeviceFilter.state.device;
        if(filter.applyDate !== null && filter.applyDate !== ''){
        	filter.applyDate1 = filter.applyDate + '01';
        	filter.applyDate2 = filter.applyDate + '31';
        }

        if(filter.payDate !== null && filter.payDate !== ''){
        	filter.date1 = filter.payDate + '01';
        	filter.date2 = filter.payDate + '31';
        }

        this.state.filter = filter;
        this.handleQueryClick();
    },
	onClickDelete : function(device, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的员工 【'+device.staffCode+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, device)
		});
	},
	onClickDelete2 : function(device)
	{
		this.setState({loading: true});
		this.state.deviceSet.operation = '';
		DeviceActions.deleteHrDevice( device.uuid );
	},
	handleCreate: function(e){
        this.setState({action: 'create'});
    },
    onClickUpdate : function(device, event){
        this.setState({device: device, action: 'update'});
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },
    handleTempDown: function(e){
        this.downXlsTempFile(XlsConfig.deviceFields);
    },
    uploadComplete: function(errMsg){
        this.setState({loading: false});
        if(errMsg !== ''){
            Common.errMsg(errMsg);
        }
    },
    beforeUpload: function(file) {   
        this.setState({loading: true});
        var url = Utils.hrUrl+'hr_device/upload-xls';
        var data={corpUuid: window.loginData.compUser.corpUuid};
        this.uploadXlsFile(url, data, XlsConfig.deviceFields, file, this.uploadComplete);
        return false;
    },

	render : function() {
		const columns = [
			{
				title: '员工号',
				dataIndex: 'staffCode',
				key: 'staffCode',
				width: 140,
			},
			{
				title: '姓名',
				dataIndex: 'perName',
				key: 'perName',
				width: 140,
			},
			{
				title: '部门',
				dataIndex: 'deptName',
				key: 'deptName',
				width: 140,
			},
			{
				title: '设备名称',
				dataIndex: 'devName',
				key: 'devName',
				width: 140,
			},
			{
				title: '补贴金额',
				dataIndex: 'devAllow',
				key: 'devAllow',
				width: 140,
			},
			{
				title: '采购价格',
				dataIndex: 'devPrice',
				key: 'devPrice',
				width: 140,
			},
			{
				title: '开始月份',
				dataIndex: 'effectDate',
				key: 'effectDate',
				width: 140,
			},
			{
				title: '结束月份',
				dataIndex: 'expiryDate',
				key: 'expiryDate',
				width: 140,
			},
			{
				title: '更多操作',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
						<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改设备补贴'><Icon type={Common.iconUpdate}/></a>
						<span className="ant-divider" />
						<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除设备补贴'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

		var recordSet = this.state.deviceSet.recordSet;
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {showQuickJumper: true, total:this.state.deviceSet.totalRow, pageSize:this.state.deviceSet.pageRow,
                current:this.state.deviceSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};

		var contactTable =
            <div className='grid-page' style={{padding: '8px 0 0 0', overflow: 'auto', display:visible}}>
                <ServiceMsg ref='mxgBox' svcList={['hr_device/retrieve', 'hr_device/remove']}/>
                <DeviceFilter ref="DeviceFilter" moreFilter={moreFilter}/>

                <div style={{margin: '8px 0 0 0'}}>
                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加设备补贴" onClick={this.handleCreate}/>{' '}
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} />
                            <Button icon='download' title="下载模板" onClick={this.handleTempDown} style={{marginLeft: '4px'}}/>
                            <Upload name='file' action='/posts/' beforeUpload={this.beforeUpload}  style={{marginLeft: '4px'}}>
                                <Button icon="upload"/>
                            </Upload>
                        </div>
                    {
                        moreFilter ?
                        <div style={{textAlign:'right', width:'100%'}}>
                            <Button title="查询" onClick={this.onMoreSearch} loading={this.state.loading} style={{marginRight:'5px'}}>查询</Button>
                            <Button title="快速条件" onClick={this.showMoreFilter}>快速条件</Button>
                        </div>:
                        <div style={{textAlign:'right', width:'100%'}}>
                            <Search placeholder="查询(员工编号/员工姓名)" style={{width: Common.searchWidth}}  value={this.state.filterValue}  onChange={this.onChangeFilter} onSearch={this.onSearch}/>
                            <Button  title="更多条件" onClick={this.showMoreFilter} style={{marginLeft:'8px'}}>更多条件</Button>
                        </div>
                    }
                    </div>
                </div>
                <div style={{width:'100%', padding: '0 18px 8px 20px'}}>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag}  size="middle" bordered={Common.tableBorder}/>
                </div>
             </div>;

          var page = null;
          if(this.state.action === 'create'){
              page = <CreateDevicePage onBack={this.onGoBack}/>;
          }
          else if(this.state.action === 'update'){
              page = <UpdateDevicePage onBack={this.onGoBack} device={this.state.device}/>
          }

          return (
              <div style={{width: '100%', height: '100%'}}>
                   {contactTable}
                   {page}
               </div>
          );
    }
});

module.exports = DevicePage;
