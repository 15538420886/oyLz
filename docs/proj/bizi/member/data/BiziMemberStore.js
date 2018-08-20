var Reflux = require('reflux');
var BiziMemberActions = require('../action/BiziMemberActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var BiziMemberStore = Reflux.createStore({
	listenables: [BiziMemberActions],
	
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

		MsgActions.showError('bizi-proj-member', operation, errMsg);
	},
	
	onRetrieveBiziProjMember: function(filter) {
		var self = this;
		var url = this.getServiceUrl('bizi-proj-member/retrieve1');
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
	
	onRetrieveBiziProjMemberPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveBiziProjMember( filter );
	},
	
	onInitBiziProjMember: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveBiziProjMember(filter);
	},
	
	onCreateBiziProjMember: function(biziMember) {
		var url = this.getServiceUrl('bizi-proj-member/create');
		Utils.recordCreate(this, biziMember, url);
	},
	
	onUpdateBiziProjMember: function(biziMember) {
		var url = this.getServiceUrl('bizi-proj-member/update1');
		Utils.recordUpdate(this, biziMember, url);
	},
	
	onDeleteBiziProjMember: function(uuid) {
		var url = this.getServiceUrl('bizi-proj-member/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = BiziMemberStore;

