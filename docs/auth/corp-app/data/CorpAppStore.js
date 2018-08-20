var Reflux = require('reflux');
var CorpAppActions = require('../action/CorpAppActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var CorpAppStore = Reflux.createStore({
	listenables: [CorpAppActions],
	
	corpUuid: '',
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
			corpUuid: self.corpUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('auth-corp-app', operation, errMsg);
	},
	
	onRetrieveAuthCorpApp: function(corpUuid) {
		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		var url = this.getServiceUrl('auth-corp-app/get-by-corpUuid');
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
	
	onInitAuthCorpApp: function(corpUuid) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveAuthCorpApp(corpUuid);
	},
	
	onCreateAuthCorpApp: function(batchList) {
		var url = this.getServiceUrl('auth-corp-app/batch-create');
		Utils.recordCreate(this, batchList, url);
	},
	
	onUpdateAuthCorpApp: function(corpApp) {
		var url = this.getServiceUrl('auth-corp-app/update');
		Utils.recordUpdate(this, corpApp, url);
	},
	
	onDeleteAuthCorpApp: function(uuid) {
		var url = this.getServiceUrl('auth-corp-app/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = CorpAppStore;

