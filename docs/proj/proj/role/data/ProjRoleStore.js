var Reflux = require('reflux');
var ProjRoleActions = require('../action/ProjRoleActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProjRoleStore = Reflux.createStore({
	listenables: [ProjRoleActions],
	
	projUuid: '',
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
			projUuid: self.projUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('proj-role', operation, errMsg);
	},
	
	onRetrieveProjRole: function(projUuid) {
		var self = this;
		var filter = {};
		filter.projUuid = projUuid;
		var url = this.getServiceUrl('proj-role/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.projUuid = projUuid;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveProjRolePage: function(projUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveProjRole( projUuid );
	},
	
	onInitProjRole: function(projUuid) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.projUuid, projUuid) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveProjRole(projUuid);
	},
	
	onCreateProjRole: function(projRole) {
		var url = this.getServiceUrl('proj-role/create');
		Utils.recordCreate(this, projRole, url);
	},
	
	onUpdateProjRole: function(projRole) {
		var url = this.getServiceUrl('proj-role/update');
		Utils.recordUpdate(this, projRole, url);
	},
	
	onDeleteProjRole: function(uuid) {
		var url = this.getServiceUrl('proj-role/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ProjRoleStore;



