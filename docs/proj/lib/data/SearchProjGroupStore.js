var Reflux = require('reflux');
var SearchProjGroupActions = require('../action/SearchProjGroupActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var SearchProjGroupStore = Reflux.createStore({
	listenables: [SearchProjGroupActions],

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

		MsgActions.showError('proj_group', operation, errMsg);
	},

	onRetrieveProjGroup: function(filter) {
		var self = this;
		var url = this.getServiceUrl('proj_group/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(projult) {
			if(projult.errCode==null || projult.errCode=='' || projult.errCode=='000000'){
				self.recordSet = projult.object.list;
				self.startPage = projult.object.startPage;
				self.pageRow = projult.object.pageRow;
				self.totalRow = projult.object.totalRow;
				self.filter = filter;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+projult.errCode+"]["+projult.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onRetrieveProjGroupPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveProjGroup( filter );
	},

	onInitProjGroup: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveProjGroup(filter);
	},

});

module.exports = SearchProjGroupStore;
