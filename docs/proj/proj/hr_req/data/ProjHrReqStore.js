var Reflux = require('reflux');
var ProjHrReqActions = require('../action/ProjHrReqActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProjHrReqStore = Reflux.createStore({
	listenables: [ProjHrReqActions],
	
	corpUuid: '',
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
			corpUuid: self.corpUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('proj-hr-req', operation, errMsg);
	},
	
	onRetrieveProjHrReq: function(corpUuid,projUuid) {
		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		filter.projUuid = projUuid;
		console.log(filter)
		var url = this.getServiceUrl('proj-hr-req/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			//console.log(result);	
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.corpUuid = corpUuid;
				self.projUuid = projUuid;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	
	onInitProjHrReq: function(corpUuid,projUuid) {
		
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.corpUuid, corpUuid) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveProjHrReq(corpUuid,projUuid);
	},
	
	onCreateProjHrReq: function(projhrReq) {
		console.log(projhrReq)
		var url = this.getServiceUrl('proj-hr-req/create');
		Utils.recordCreate(this, projhrReq, url);
	},
	
	onUpdateProjHrReq: function(projhrReq) {
		var url = this.getServiceUrl('proj-hr-req/update');
		Utils.recordUpdate(this, projhrReq, url);
	},
	
	onDeleteProjHrReq: function(uuid) {
		var url = this.getServiceUrl('proj-hr-req/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ProjHrReqStore;

