var Reflux = require('reflux');
var DeptStaffActions = require('../action/DeptStaffActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var DeptStaffStore = Reflux.createStore({
	listenables: [DeptStaffActions],
	
	deptUuid: '',
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

		MsgActions.showError('hr-dept-staff', operation, errMsg);
	},
	
	onRetrieveHrDeptStaff: function(deptUuid) {
		var self = this;
		var filter = {};
		filter.deptUuid = deptUuid;
		var url = this.getServiceUrl('hr-dept-staff/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.deptUuid = deptUuid;
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveHrDeptStaffPage: function(deptUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrDeptStaff( deptUuid );
	},
	
	onInitHrDeptStaff: function(deptUuid) {
		if( this.recordSet.length > 0 ){
			if( this.deptUuid === deptUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveHrDeptStaff(deptUuid);
	},
	
	onCreateHrDeptStaff: function(deptStaff) {
		var url = this.getServiceUrl('hr-dept-staff/create');
		Utils.recordCreate(this, deptStaff, url);
	},
	
	onUpdateHrDeptStaff: function(deptStaff) {
		var url = this.getServiceUrl('hr-dept-staff/update');
		Utils.recordUpdate(this, deptStaff, url);
	},
	
	onDeleteHrDeptStaff: function(uuid) {
		var url = this.getServiceUrl('hr-dept-staff/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = DeptStaffStore;
