var Reflux = require('reflux');
var DispLogActions = require('../action/DispLogActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var DispLogStore = Reflux.createStore({
	listenables: [DispLogActions],
	poolUuid: '',
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
			poolUuid: self.poolUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('proj-member', operation, errMsg);
	},
	
	onRetrieveProjMember: function(poolUuid,chkDate) {
		var self = this;
		var filter = {};
		filter.poolUuid = poolUuid;
		filter.chkDate =chkDate;
		var url = this.getServiceUrl('proj-member/retrieve3');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.poolUuid = poolUuid;
				self.chkDate = chkDate;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveProjMemberPage: function(poolUuid,chkDate, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.chkDate = chkDate;
		this.onRetrieveProjMember( poolUuid,chkDate );
	},
});

module.exports = DispLogStore;

