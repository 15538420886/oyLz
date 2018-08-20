﻿var Reflux = require('reflux');
var SalaryLogActions = require('../action/SalaryLogActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var SalaryLogStore = Reflux.createStore({
	listenables: [SalaryLogActions],

	filter: '',
	recordSet: [],
	salaryLog: {},
	salaryLogHtml:{},
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
			recordSet: self.recordSet,
			filter: self.filter,
			salaryLog: self.salaryLog,
			startPage: self.startPage,
			salaryLogHtml:self.salaryLogHtml,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg,
		});

        if (errMsg.indexOf('没有找到记录') >= 0) {
            errMsg = '';
        }

		MsgActions.showError('hr-salary-log', operation, errMsg);
	},

	onRetrieveHrSalaryLog: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr-salary-log/retrieve_p');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object.list.length >0){
					self.recordSet= result.object.list;
					self.salaryLog = result.object.list[0];
					self.filter = filter;
					self.fireEvent('retrieve_p', '', self);
				}
				else{
					self.fireEvent('retrieve_p', "没有找到记录["+result.object.list.length+"]", self);
				}
			}
			else{
				self.fireEvent('retrieve_p', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve_p', "调用服务错误", self);
		});
	},

	onRetrieveHtmlSalaryLog: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr-salary-log/retrieve_p2');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object!=null){
					
					self.salaryLogHtml = result.object;
					self.filter = filter;
					self.fireEvent('retrieve_p2', '', self);
				}
				else{
					self.fireEvent('retrieve_p2', "没有找到记录["+result.object+"]", self);
				}
			}
			else{
				self.fireEvent('retrieve_p2', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve_p2', "调用服务错误", self);
		});
	},

	onInitHrSalaryLog: function(filter) {
		if( this.salaryLog.uuid ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve_p', '', this);
				return;
			}
		}

		this.onRetrieveHrSalaryLog(filter);
	},
	
});

module.exports = SalaryLogStore;
