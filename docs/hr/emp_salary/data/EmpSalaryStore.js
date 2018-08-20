var Reflux = require('reflux');
var EmpSalaryActions = require('../action/EmpSalaryActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var EmpSalaryStore = Reflux.createStore({
	listenables: [EmpSalaryActions],

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

		MsgActions.showError('hr-emp-salary', operation, errMsg);
	},
	onGetCacheData: function() {
		this.fireEvent('cache', '', this);
	},

	onRetrieveHrEmpSalary: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr-emp-salary/retrieve1');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
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

	onRetrieveHrEmpSalaryPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrEmpSalary( filter );
	},

	onInitHrEmpSalary: function(filter) {
		if( this.recordSet.length > 0 ){
			if( this.filter === filter ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveHrEmpSalary(filter);
	},


	onCreateHrEmpSalary: function(empSalary) {

		var self = this;
		var data = empSalary;
		var url = this.getServiceUrl('hr-emp-salary/create');
		Utils.doCreateService(url, data).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				result.object.perName = data.perName;
				result.object.staffCode = data.staffCode;
				result.object.deptName = data.deptName;
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

	onUpdateHrEmpSalary: function(empSalary) {
		var url = this.getServiceUrl('hr-emp-salary/update');
		Utils.recordUpdate(this, empSalary, url);
	},

	onDeleteHrEmpSalary: function(uuid) {
		var url = this.getServiceUrl('hr-emp-salary/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = EmpSalaryStore;
