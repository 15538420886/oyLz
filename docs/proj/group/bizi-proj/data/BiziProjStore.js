var Reflux = require('reflux');
var BiziProjActions = require('../action/BiziProjActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var BiziProjStore = Reflux.createStore({
	listenables: [BiziProjActions],
	
	filter: {},
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
			filter: self.filter,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('bizi-proj', operation, errMsg);
	},
	onGetCacheData: function() {
		this.fireEvent('cache', '', this);
	},
	
	onRetrieveBiziProjInfo: function(filter) {
		var self = this;
		var url = this.getServiceUrl('bizi-proj/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.filter = filter;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveBiziProjInfoPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveBiziProjInfo( filter );
	},
	
	onInitBiziProjInfo: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveBiziProjInfo(filter);
	},
	
	onCreateBiziProjInfo: function(biziProj) {
		var url = this.getServiceUrl('bizi-proj/create');
		Utils.recordCreate(this, biziProj, url);
	},
	
	onUpdateBiziProjInfo: function(biziProj) {
		var url = this.getServiceUrl('bizi-proj/update');
		Utils.recordUpdate(this, biziProj, url);
	},
	
	onDeleteBiziProjInfo: function(uuid) {
		var url = this.getServiceUrl('bizi-proj/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = BiziProjStore;

