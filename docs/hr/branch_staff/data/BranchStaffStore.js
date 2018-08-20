var Reflux = require('reflux');
var BranchStaffActions = require('../action/BranchStaffActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var BranchStaffStore = Reflux.createStore({
	listenables: [BranchStaffActions],
	
	branchUuid: '',
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
			branchUuid: self.branchUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-branch-staff', operation, errMsg);
	},
	
	onRetrieveHrBranchStaff: function(branchUuid) {
		var self = this;
		var filter = {};
		filter.branchUuid = branchUuid;
		var url = this.getServiceUrl('hr-branch-staff/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.branchUuid = branchUuid;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveHrBranchStaffPage: function(branchUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrBranchStaff( branchUuid );
	},
	
	onInitHrBranchStaff: function(branchUuid) {
		if( this.recordSet.length > 0 ){
			if( this.branchUuid === branchUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveHrBranchStaff(branchUuid);
	},
	
	onCreateHrBranchStaff: function(branchStaff) {
		var url = this.getServiceUrl('hr-branch-staff/create');
		Utils.recordCreate(this, branchStaff, url);
	},
	
	onUpdateHrBranchStaff: function(branchStaff) {
		var url = this.getServiceUrl('hr-branch-staff/update');
		Utils.recordUpdate(this, branchStaff, url);
	},
	
	onDeleteHrBranchStaff: function(uuid) {
		var url = this.getServiceUrl('hr-branch-staff/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = BranchStaffStore;

