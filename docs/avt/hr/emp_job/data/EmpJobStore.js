﻿var Reflux = require('reflux');
var EmpJobActions = require('../action/EmpJobActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var EmpJobStore = Reflux.createStore({
	listenables: [EmpJobActions],

	filter: '',
	tableFilter:'',
	eju:{},
	ejList:[],
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
			tableFilter:self.tableFilter,
			eju:self.eju,
			ejList:self.ejList,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg,
		});

        if (errMsg.indexOf('没有找到记录') >= 0) {
            errMsg = '';
        }

		MsgActions.showError('hr_emp_job', operation, errMsg);
	},

	onRetrieveHrEmpJob: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr_emp_job/retrieve_p');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object.eju!==null || result.object.ejList!==null){
					self.eju = result.object.eju;
					self.ejList = result.object.ejList;
					self.filter = filter;
					self.fireEvent('retrieve_p', '', self);
				}else{
					self.fireEvent('retrieve_p', "没有找到记录["+result.object.eju+"]", self);
				}
			}
			else{
				self.fireEvent('retrieve_p', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve_p', "调用服务错误", self);
		});
	},

	onInitHrEmpJob: function(filter) {
		if( this.eju.uuid ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve_p', '', this);
				return;
			}
		}

		this.onRetrieveHrEmpJob(filter);
	},
	
	

});

module.exports = EmpJobStore;
