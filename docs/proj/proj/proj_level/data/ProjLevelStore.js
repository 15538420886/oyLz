var Reflux = require('reflux');
var ProjLevelActions = require('../action/ProjLevelActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProjLevelStore = Reflux.createStore({
	listenables: [ProjLevelActions],
	
	filter:{},
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

		MsgActions.showError('proj-member-level', operation, errMsg);
	},
	
	onRetrieveProjMemberLevel: function(filter) {
		var self = this;
		var url = this.getServiceUrl('proj-member-level/retrieve');
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
	
	onRetrieveProjMemberLevelPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveProjMemberLevel( filter );
	},
	
	onInitProjMemberLevel: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveProjMemberLevel(filter);
	},
	onCreateProjMemberLevel: function(projLevel) {
		var url = this.getServiceUrl('proj-member-level/create');
		Utils.recordCreate(this, projLevel, url);
	},
	
	onUpdateProjMemberLevel: function(projLevel) {
		var url = this.getServiceUrl('proj-member-level/update');
		Utils.recordUpdate(this, projLevel, url);
	},
	
	onDeleteProjMemberLevel: function(uuid) {
		var url = this.getServiceUrl('proj-member-level/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ProjLevelStore;

