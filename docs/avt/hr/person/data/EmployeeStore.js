var Reflux = require('reflux');
var EmployeeActions = require('../action/EmployeeActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var EmployeeStore = Reflux.createStore({
	listenables: [EmployeeActions],

	filter: {},
	recordSet: [],
	employee:{},
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
			deptUuid: self.deptUuid,
			recordSet: self.recordSet,
			employee: self.employee,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-employee', operation, errMsg);
	},

	onRetrieveHrEmployee: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr-employee/retrieve-p');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object){
					self.employee = result.object;
					self.filter = filter;
					self.fireEvent('retrieve-p', '', self);
				}
				else{
					self.fireEvent('retrieve-p', "没有找到记录["+result.object+"]", self);
				}
			}
			else{
				self.fireEvent('retrieve-p', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve-p', "调用服务错误", self);
		});
	},

	onRetrieveHrEmployeePage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrEmployee( filter );
	},

	onInitHrEmployee: function(filter) {
		if( this.employee.uuid ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve-p', '', this);
				return;
			}
		}

		this.onRetrieveHrEmployee(filter);
	},

});

module.exports = EmployeeStore;
