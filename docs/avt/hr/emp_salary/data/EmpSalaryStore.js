﻿var Reflux = require('reflux');
var EmpSalaryActions = require('../action/EmpSalaryActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var EmpSalaryStore = Reflux.createStore({
	listenables: [EmpSalaryActions],

	filter: '',
	tableFilter: '',
	hesu:{},
	hesList:[],
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
			hesu:self.hesu,
			hesList:self.hesList,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg,
		});

        if (errMsg.indexOf('没有找到记录') >= 0) {
            errMsg = '';
        }

		MsgActions.showError('hr-emp-salary', operation, errMsg);
	},

	onRetrieveHrEmpSalary: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr-emp-salary/retrieve_p');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object.hesu!==null || result.object.hesList!==null){
					self.hesu = result.object.hesu;
					self.hesList = result.object.hesList;
					self.filter = filter;
					self.fireEvent('retrieve_p', '', self);
				}
				else{
					self.fireEvent('retrieve_p', "没有找到记录["+result.object.hesu+"]", self);
				}
			}
			else{
				self.fireEvent('retrieve_p', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve_p', "调用服务错误", self);
		});
	},

	onInitHrEmpSalary: function(filter) {
		if( this.hesu.uuid ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve_p', '', this);
				return;
			}
		}

		this.onRetrieveHrEmpSalary(filter);
	},
	
	

});

module.exports = EmpSalaryStore;
