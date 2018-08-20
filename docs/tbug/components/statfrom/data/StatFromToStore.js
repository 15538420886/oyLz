var Reflux = require('reflux');
var StatFromToActions = require('../action/StatFromToActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var StatFromToStore = Reflux.createStore({
	listenables: [StatFromToActions],
	
	InStatFromTo: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.tbugUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			InStatFromTo: self.InStatFromTo,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('stat-from-to', operation, errMsg);
	},
	
	onRetrieveStatFromTo: function(InStatFromTo) {
		var self = this;
		var filter = {};
		filter.corpUuid = InStatFromTo.InstatFromTo.cmpId;
		var url = this.getServiceUrl('/stat-from-to/get-by-cmpid');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.InStatFromTo = InStatFromTo;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveStatFromToPage: function(InStatFromTo, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveStatFromTo( InStatFromTo );
	},
	
	onInitStatFromTo: function(InStatFromTo) {
		if( this.recordSet.length > 0 ){
			if( this.InStatFromTo === InStatFromTo ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveStatFromTo(InStatFromTo);
	},
	
	onCreateStatFromTo: function(statFromTo) {
		var url = this.getServiceUrl('stat-from-to/create');
		Utils.recordCreate(this, statFromTo, url);
	},
	
	onUpdateStatFromTo: function(statFromTo) {
		var url = this.getServiceUrl('stat-from-to/update');
		Utils.recordUpdate(this, statFromTo, url);
	},
	
	onDeleteStatFromTo: function(uuid) {
		var url = this.getServiceUrl('stat-from-to/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = StatFromToStore;

