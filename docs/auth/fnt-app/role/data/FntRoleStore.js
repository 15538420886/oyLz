var Reflux = require('reflux');
var FntRoleActions = require('../action/FntRoleActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var FntRoleStore = Reflux.createStore({
	listenables: [FntRoleActions],
	
	appUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.authUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			appUuid: self.appUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('fnt_app_role', operation, errMsg);
	},
	
	onRetrieveFntAppRole: function(appUuid) {
		var self = this;
		var filter = {};
		filter.appUuid = appUuid;
		var url = this.getServiceUrl('fnt_app_role/get-by-appuuid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.appUuid = appUuid;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onInitFntAppRole: function(appUuid) {
		if( this.recordSet.length > 0 ){
			if( this.appUuid === appUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveFntAppRole(appUuid);
	},
	
	onCreateFntAppRole: function(fntRole) {
		var url = this.getServiceUrl('fnt_app_role/create');
		Utils.recordCreate(this, fntRole, url);
	},
	
	onUpdateFntAppRole: function(fntRole) {
		var url = this.getServiceUrl('fnt_app_role/update');
		Utils.recordUpdate(this, fntRole, url);
	},
	
	onDeleteFntAppRole: function(uuid) {
		var url = this.getServiceUrl('fnt_app_role/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = FntRoleStore;

