var Reflux = require('reflux');
var EmployeeActions = require('../action/EmployeeActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var EmployeeStore = Reflux.createStore({
	listenables: [EmployeeActions],

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
			deptUuid: self.deptUuid,
			recordSet: self.recordSet,
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
		var url = this.getServiceUrl('hr-employee/retrieve');
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

	onRetrieveHrEmployeePage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrEmployee( filter );
	},

	onInitHrEmployee: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveHrEmployee(filter);
	},
    
    onCreateHrEmployee: function(data) {
        var url = this.getServiceUrl('hr-employee/createWithJob');
		
		var self = this;
		Utils.doCreateService(url, data).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet.push(result.object.os);
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

	onUpdateHrEmployee: function(employee) {
		var url = this.getServiceUrl('hr-employee/update');
		Utils.recordUpdate(this, employee, url);
	},

	onDeleteHrEmployee: function(uuid) {
		var url = this.getServiceUrl('hr-employee/remove');
		Utils.recordDelete(this, uuid, url);
    },
});

module.exports = EmployeeStore;
