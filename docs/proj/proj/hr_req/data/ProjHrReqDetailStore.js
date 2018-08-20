var Reflux = require('reflux');
var HrReqDetailActions = require('../action/ProjHrReqDetailActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var HrReqDetailStore = Reflux.createStore({
	listenables: [HrReqDetailActions],
	
	reqUuid: '',
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
			reqUuid: self.reqUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('proj-hr-req-detail', operation, errMsg);
	},
	
	onRetrieveProjHrReqDetail: function(reqUuid) {
		var self = this;
		var filter = {};
		//console.log(reqUuid);
		filter.reqUuid = reqUuid;
		var url = this.getServiceUrl('proj-hr-req-detail/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			//console.log(result);
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.reqUuid = reqUuid;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	
	onInitProjHrReqDetail: function(reqUuid) {
		
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.reqUuid, reqUuid) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		//console.log(reqUuid);
		this.onRetrieveProjHrReqDetail(reqUuid);
	},
	
	onCreateProjHrReqDetail: function(HrReqDetail) {

		var url = this.getServiceUrl('proj-hr-req-detail/create');
		Utils.recordCreate(this, HrReqDetail, url);
	},
	
	onUpdateProjHrReqDetail: function(HrReqDetail) {
		var url = this.getServiceUrl('proj-hr-req-detail/update');
		Utils.recordUpdate(this, HrReqDetail, url);
	},
	
	onDeleteProjHrReqDetail: function(uuid) {
		var url = this.getServiceUrl('proj-hr-req-detail/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = HrReqDetailStore;

