﻿var Reflux = require('reflux');
var EmpJobActions = require('../action/EmpJobActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var EmployeeJobStore = Reflux.createStore({
	listenables: [EmpJobActions],

	filter: {},
	recordSet: [],
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
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr_emp_job', operation, errMsg);
	},
	onGetCacheData: function() {
		this.fireEvent('cache', '', this);
	},

	onRetrieveHrEmpJob: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr_emp_job/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			// console.log('result', result);
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.filter = filter;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onRetrieveHrEmpJobPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrEmpJob( filter );
	},

	onInitHrEmpJob: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveHrEmpJob(filter);
	},

	onCreateHrEmpJob: function(empJob) {

		var self = this;
		var data = empJob;
		var url = this.getServiceUrl('hr_emp_job/create');
		Utils.doCreateService(url, data).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				result.object.perName = data.perName;
				result.object.staffCode = data.staffCode;
				self.recordSet.push(result.object);

				self.totalRow = self.totalRow + 1;
				self.fireEvent('create', '', self);
			}
			else{
				self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('create', "调用服务错误", self);
		});

	},

	onUpdateHrEmpJob: function(empJob) {
		var url = this.getServiceUrl('hr_emp_job/update');
		Utils.recordUpdate(this, empJob, url);
	},

	onDeleteHrEmpJob: function(uuid) {
		var url = this.getServiceUrl('hr_emp_job/remove');
		Utils.recordDelete(this, uuid, url);
    },
    onBatchCreateHrEmpJob: function (empJobList) {
        // 用于回填姓名
        var empJobMap = {};
        var len = empJobList.length;
        for (var i = 0; i < len; i++) {
            var obj = empJobList[i];
            empJobMap[obj.userUuid] = obj;
        }

        var self = this;
        var url = this.getServiceUrl('hr_emp_job/batchCreate');
        Utils.doCreateService(url, empJobList).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                var len = result.object.list.length;
                for (var i = 0; i < len; i++) {
                    var obj = result.object.list[i];
                    var data = empJobMap[obj.userUuid];
                    if (data !== undefined) {
                        obj.perName = data.perName;
                        obj.staffCode = data.staffCode;
                    }

                    self.recordSet.push(obj);
                }

                self.totalRow = self.totalRow + len;
                self.fireEvent('create', '', self);
            }
            else {
                self.fireEvent('create', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent('create', "调用服务错误", self);
        });
    },
});

module.exports = EmployeeJobStore;
