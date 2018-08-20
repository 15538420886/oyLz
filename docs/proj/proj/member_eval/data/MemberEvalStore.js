var Reflux = require('reflux');
var MemberEvalActions = require('../action/MemberEvalActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var MemberEvalStore = Reflux.createStore({
	listenables: [MemberEvalActions],
	
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

		MsgActions.showError('proj-member', operation, errMsg);
	},
    onGetCacheData: function (projUuid) {
        if (this.filter.projUuid !== projUuid) {
            this.filter = {};
            this.recordSet = [];
            this.startPage = 0;
            this.pageRow = 0;
            this.totalRow = 0;
        }

		this.fireEvent('cache', '', this);
	},
	onRetrieveProjMember: function(filter) {
		var self = this;
		var url = this.getServiceUrl('proj-member/retrieve2');
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
	onRetrieveProjMemberPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveProjMember( filter );
	},
	onInitProjMember: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveProjMember(filter);
	},
	onCreateProjMember: function(memberEval) {
		var url = this.getServiceUrl('proj-member/create');
		Utils.recordCreate(this, memberEval, url);
	},
	onUpdateProjMember: function(memberEval) {
		var url = this.getServiceUrl('proj-member/update');
		Utils.recordUpdate(this, memberEval, url);
	},
	onDeleteProjMember: function(uuid) {
		var url = this.getServiceUrl('proj-member/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = MemberEvalStore;

