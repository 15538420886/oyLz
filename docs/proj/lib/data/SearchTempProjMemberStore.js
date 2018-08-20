var Reflux = require('reflux');
var SearchTempProjMemberActions = require('../action/SearchTempProjMemberActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var SearchTempProjMemberStore = Reflux.createStore({
	listenables: [SearchTempProjMemberActions],

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

	onRetrieveTempProjMember: function(filter) {
		var self = this;
		var url = this.getServiceUrl('proj_temp_member/retrieve');
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

	onRetrieveTempProjMemberPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveTempProjMember( filter );
	},

    onInitTempProjMember: function (filter, startPage, pageRow) {
        if (this.recordSet.length > 0 && this.startPage === startPage && this.pageRow === pageRow) {
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

        this.startPage = startPage;
        this.pageRow = pageRow;
		this.onRetrieveTempProjMember(filter);
	},
});

module.exports = SearchTempProjMemberStore;
