﻿var Reflux = require('reflux');
var WorkLogActions = require('../action/WorkLogActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var WorkLogStore = Reflux.createStore({
	listenables: [WorkLogActions],
	filter: {},
	tableFilter:'',
	hwlu:{},
	hwlList:[],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.hrUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			filter: self.filter,
			tableFilter: self.tableFilter,
			hwlu:self.hwlu,
			hwlList:self.hwlList,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

        if (errMsg.indexOf('没有找到记录') >= 0) {
            errMsg = '';
        }

		MsgActions.showError('hr_work_log', operation, errMsg);
	},
	

	onRetrieveHrWorkLog: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr_work_log/retrieve_p');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object.hwlu!==null || result.object.hwlList!==null){
					self.hwlu = result.object.hwlu;
					self.hwlList = result.object.hwlList;
					self.filter = filter;
					self.fireEvent('retrieve_p', '', self);
				}else{
					self.fireEvent('retrieve_p', "没有找到记录["+result.object.hwlu+"]", self);
				}
			}
			else{
				self.fireEvent('retrieve_p', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve_p', "调用服务错误", self);
		});
	},

 
	onRetrieveHrWorkLogPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrWorkLog( filter );
	},

	onInitHrWorkLog: function(filter) {
		if( this.hwlu.uuid){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve_p', '', this);
				return;
			}
		}

		this.onRetrieveHrWorkLog(filter);
	},


	
});

module.exports = WorkLogStore;
