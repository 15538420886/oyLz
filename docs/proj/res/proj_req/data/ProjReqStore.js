var Reflux = require('reflux');
var ProjReqActions = require('../action/ProjReqActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProjReqStore = Reflux.createStore({
	listenables: [ProjReqActions],
	
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

		MsgActions.showError('proj-hr-req-detail', operation, errMsg);
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
	onRetrieveProjReq: function(filter) {
		var self = this;
		var url = this.getServiceUrl('proj-hr-req-detail/retrieve1');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			console.log(self.startPage)
			console.log(self.pageRow)
			console.log(self.totalRow)
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.filter = filter;
				
				self.fireEvent('retrieve1', '', self);
			}
			else{
				self.fireEvent('retrieve1', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve1', "调用服务错误", self);
		});
	},	
	onRetrieveProjReqPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveProjReq( filter );
	},
	onInitProjReq: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveProjReq(filter);
	}
});

module.exports = ProjReqStore;

