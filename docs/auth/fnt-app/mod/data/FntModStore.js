var Reflux = require('reflux');
var FntModActions = require('../action/FntModActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var FntModStore = Reflux.createStore({
	listenables: [FntModActions],
	
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

		MsgActions.showError('fnt_app_mod', operation, errMsg);
	},
	
	onRetrieveFntAppMod: function(appUuid) {
		var self = this;
		var filter = {};
		filter.appUuid = appUuid;
		var url = this.getServiceUrl('fnt_app_mod/get-by-appuuid');
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
	
	onInitFntAppMod: function(appUuid) {
		if( this.recordSet.length > 0 ){
			if( this.appUuid === appUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveFntAppMod(appUuid);
	},
	
	onCreateFntAppMod: function(fntMod) {
		var url = this.getServiceUrl('fnt_app_mod/create');
		Utils.recordCreate(this, fntMod, url);
	},
	
	onUpdateFntAppMod: function(fntMod) {
		var url = this.getServiceUrl('fnt_app_mod/update');
		Utils.recordUpdate(this, fntMod, url);
	},
	
	onDeleteFntAppMod: function(uuid) {
		var url = this.getServiceUrl('fnt_app_mod/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = FntModStore;

