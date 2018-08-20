var Reflux = require('reflux');
var GroupStaffActions = require('../action/GroupStaffActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var GroupStaffStore = Reflux.createStore({
	listenables: [GroupStaffActions],
	
	groupUuid: '',
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
			groupUuid: self.groupUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-group-staff', operation, errMsg);
	},
	
	onRetrieveHrGroupStaff: function(groupUuid) {
		var self = this;
		var filter = {};
		filter.groupUuid = groupUuid;
		var url = this.getServiceUrl('hr-group-staff/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.groupUuid = groupUuid;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveHrGroupStaffPage: function(groupUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrGroupStaff( groupUuid );
	},
	
	onInitHrGroupStaff: function(groupUuid) {
		if( this.recordSet.length > 0 ){
			if( this.groupUuid === groupUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveHrGroupStaff(groupUuid);
	},
	
	onCreateHrGroupStaff: function(staff) {
		var url = this.getServiceUrl('hr-group-staff/create');
		Utils.recordCreate(this, staff, url);
	},
	
	onUpdateHrGroupStaff: function(staff) {
		var url = this.getServiceUrl('hr-group-staff/update');
		Utils.recordUpdate(this, staff, url);
	},
	
	onDeleteHrGroupStaff: function(uuid) {
		var url = this.getServiceUrl('hr-group-staff/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = GroupStaffStore;

