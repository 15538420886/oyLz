var Reflux = require('reflux');
var ResRoleActions = require('../action/ResRoleActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ResRoleStore = Reflux.createStore({
	listenables: [ResRoleActions],
	
	poolUuid: '',
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
			poolUuid: self.poolUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('res-role', operation, errMsg);
	},
	
	onRetrieveResRole: function(poolUuid) {
		var self = this;
		var filter = {};
		filter.poolUuid = poolUuid;
		var url = this.getServiceUrl('res-role/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.poolUuid = poolUuid;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveResRolePage: function(poolUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveResRole( poolUuid );
	},
	
	onInitResRole: function(poolUuid) {
		if( this.recordSet.length > 0 ){
			if( this.poolUuid === poolUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveResRole(poolUuid);
	},
	
	onCreateResRole: function(resRole) {
		var url = this.getServiceUrl('res-role/create');
		Utils.recordCreate(this, resRole, url);
	},
	
	onUpdateResRole: function(resRole) {
		var url = this.getServiceUrl('res-role/update');
		Utils.recordUpdate(this, resRole, url);
	},
	
	onDeleteResRole: function(uuid) {
		var url = this.getServiceUrl('res-role/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ResRoleStore;

