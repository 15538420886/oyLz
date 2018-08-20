var Reflux = require('reflux');
var ResSmallGroupActions = require('../action/ResSmallGroupActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ResSmallGroupStore = Reflux.createStore({
	listenables: [ResSmallGroupActions],
	
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

		MsgActions.showError('res-member', operation, errMsg);
	},
	
	onRetrieveResTeamGrp: function(filter) {
		var self = this;
		var url = this.getServiceUrl('res-member/retrieve');
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
	
	onRetrieveResTeamGrpPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveResTeamGrp( filter );
	},
	
	onInitResTeamGrp: function(filter) {
		if( this.recordSet.length > 0 ){
			if( this.filter === filter ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveResTeamGrp(filter);
	},
	
	onCreateResTeamGrp: function(resGroupMan) {
		var url = this.getServiceUrl('res-member/create');
		Utils.recordCreate(this, resGroupMan, url);
	},
	
	onUpdateResTeamGrp: function(resGroupMan) {
		var url = this.getServiceUrl('res-member/update');
		Utils.recordUpdate(this, resGroupMan, url);
	},
	
	onDeleteResTeamGrp: function(uuid) {
		var url = this.getServiceUrl('res-member/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ResSmallGroupStore;

