var Reflux = require('reflux');
var GroupManActions = require('../action/GroupManActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');
var ProjContext = require('../../../ProjContext');

var GroupManStore = Reflux.createStore({
	listenables: [GroupManActions],
	
	filter: '',
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

		MsgActions.showError('group-man', operation, errMsg);
	},
	
	onRetrieveGroupMan: function(filter) {
		var self = this;
		var filter = {};
        filter.groupUuid = ProjContext.selectedGroup.uuid;
		var url = this.getServiceUrl('group-man/retrieve');
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
	
	onRetrieveGroupManPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveGroupMan( filter );
	},
	
	onInitGroupMan: function(filter) {
		if( this.recordSet.length > 0 ){
			if( this.filter === filter ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveGroupMan(filter);
	},
	
	onCreateGroupMan: function(groupMan) {
		var url = this.getServiceUrl('group-man/create');
		Utils.recordCreate(this, groupMan, url);
	},
	
	onUpdateGroupMan: function(groupMan) {
		var url = this.getServiceUrl('group-man/update');
		Utils.recordUpdate(this, groupMan, url);
	},
	
	onDeleteGroupMan: function(uuid) {
		var url = this.getServiceUrl('group-man/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = GroupManStore;