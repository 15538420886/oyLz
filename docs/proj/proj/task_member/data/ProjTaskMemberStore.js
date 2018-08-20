var Reflux = require('reflux');
var ProjTaskMemberActions = require('../action/ProjTaskMemberActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProjTaskMemberStore = Reflux.createStore({
	listenables: [ProjTaskMemberActions],
	
	taskUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.projUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			taskUuid: self.taskUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});
		MsgActions.showError('proj-task-member', operation, errMsg);
	},
	
	onRetrieveProjTaskMember: function(taskUuid) {
		var self = this;
		var filter = {};
		filter.taskUuid = taskUuid;
		var url = this.getServiceUrl('proj-task-member/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.taskUuid = taskUuid;
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveProjTaskMemberPage: function(taskUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveProjTaskMember( taskUuid );
	},
	
	onInitProjTaskMember: function(taskUuid) {
		if( this.recordSet.length > 0 ){
			if( this.taskUuid === taskUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveProjTaskMember(taskUuid);
	},

	onCreateProjTaskMember: function(projTaskMember) {
		var url = this.getServiceUrl('proj-task-member/create');
		Utils.recordCreate(this, projTaskMember, url);
	},
	
	onUpdateProjTaskMember: function(projTaskMember) {
		var url = this.getServiceUrl('proj-task-member/update');
		Utils.recordUpdate(this, projTaskMember, url);
	},
	
	onDeleteProjTaskMember: function(uuid) {
		var url = this.getServiceUrl('proj-task-member/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ProjTaskMemberStore;

