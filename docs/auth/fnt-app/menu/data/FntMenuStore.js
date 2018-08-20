var Reflux = require('reflux');
var FntMenuActions = require('../action/FntMenuActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var FntMenuStore = Reflux.createStore({
	listenables: [FntMenuActions],
	
	modUuid: '',
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
			modUuid: self.modUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('fnt-app-menu', operation, errMsg);
	},
	
	onRetrieveFntAppMenu: function(modUuid) {
		var self = this;
		var filter = {};
		filter.modUuid = modUuid;
		var url = this.getServiceUrl('fnt-app-menu/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.modUuid = modUuid;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onInitFntAppMenu: function(modUuid) {
		if( this.recordSet.length > 0 ){
			if( this.modUuid === modUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveFntAppMenu(modUuid);
	},
	
	onCreateFntAppMenu: function(fntMenu) {
		var url = this.getServiceUrl('fnt-app-menu/create');
		Utils.recordCreate(this, fntMenu, url);
	},
	
	onUpdateFntAppMenu: function(fntMenu) {
		var url = this.getServiceUrl('fnt-app-menu/update');
		Utils.recordUpdate(this, fntMenu, url);
	},
	
	onDeleteFntAppMenu: function(uuid) {
		var url = this.getServiceUrl('fnt-app-menu/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = FntMenuStore;

