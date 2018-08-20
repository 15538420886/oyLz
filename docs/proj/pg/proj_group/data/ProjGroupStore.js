var Reflux = require('reflux');
var ProjGroupActions = require('../action/ProjGroupActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProjGroupStore = Reflux.createStore({
	listenables: [ProjGroupActions],
	
	corpUuid: '',
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
			corpUuid: self.corpUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('proj_group', operation, errMsg);
	},
	
	onRetrieveProjGroup: function(corpUuid) {
		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		var url = this.getServiceUrl('proj_group/retrieve');
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
	
	onInitProjGroup: function(corpUuid) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveProjGroup(corpUuid);
	},
	
	onCreateProjGroup: function(projGroup) {
		var url = this.getServiceUrl('proj_group/create');
		Utils.recordCreate(this, projGroup, url);
	},
	
	onUpdateProjGroup: function(projGroup) {
		var url = this.getServiceUrl('proj_group/update');
		Utils.recordUpdate(this, projGroup, url);
	},
	
	onDeleteProjGroup: function(uuid) {
		var url = this.getServiceUrl('proj_group/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ProjGroupStore;

