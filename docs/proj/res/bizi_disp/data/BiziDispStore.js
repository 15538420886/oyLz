var Reflux = require('reflux');
var BiziDispActions = require('../action/BiziDispActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var BiziDispStore = Reflux.createStore({
	listenables: [BiziDispActions],
	
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
	
	onRetrieveBiziProj: function(filter) {
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
	
	onRetrieveBiziProjPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveBiziProj( filter );
	},
	
	onInitBiziProj: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveBiziProj(filter);
	},
	
	onCreateBiziProj: function(biziDisp) {
		var url = this.getServiceUrl('bizi-proj/create');
		Utils.recordCreate(this, biziDisp, url);
	},
	
	onUpdateBiziProj: function(biziDisp) {
		var url = this.getServiceUrl('bizi-proj/update');
		Utils.recordUpdate(this, biziDisp, url);
	},
	
	onDeleteBiziProj: function(uuid) {
		var url = this.getServiceUrl('bizi-proj/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = BiziDispStore;

