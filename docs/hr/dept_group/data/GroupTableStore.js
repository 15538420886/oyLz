var Reflux = require('reflux');
var GroupTableActions = require('../action/GroupTableActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var GroupTableStore = Reflux.createStore({
	listenables: [GroupTableActions],
	
	corpUuid: '',
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
			corpUuid: self.corpUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr_dept_group', operation, errMsg);
	},
	
	onRetrieveHrDeptGroup: function(corpUuid) {
		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		var url = this.getServiceUrl('hr_dept_group/get-by-corp_uuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.corpUuid = corpUuid;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveHrDeptGroupPage: function(corpUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrDeptGroup( corpUuid );
	},
	
	onInitHrDeptGroup: function(corpUuid) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveHrDeptGroup(corpUuid);
	},
	
	onCreateHrDeptGroup: function(group) {
        console.log("group",group);
		var url = this.getServiceUrl('hr_dept_group/create');
		Utils.recordCreate(this, group, url);
	},
	
	onUpdateHrDeptGroup: function(group) {
		var url = this.getServiceUrl('hr_dept_group/update');
		Utils.recordUpdate(this, group, url);
	},
	
	onDeleteHrDeptGroup: function(uuid) {
		var url = this.getServiceUrl('hr_dept_group/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = GroupTableStore;

