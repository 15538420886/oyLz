var Reflux = require('reflux');
var ChkProjActions = require('../action/ChkProjActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ChkProjStore = Reflux.createStore({
	listenables: [ChkProjActions],

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

	fireEvent: function(operation, errMsg, self,titile)
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

		MsgActions.showError(titile, operation, errMsg);
	},

	//查询项目组
	onRetrieveChkProjInfo: function(corpUuid,self) {
		var filter = {};
		filter.corpUuid = corpUuid;
		var url = self.getServiceUrl('proj_info/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = self.recordSet.concat(result.object.list);
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow += result.object.totalRow;
				self.corpUuid = corpUuid;

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self,'proj_info');
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self,'proj_info');
		});

	},
	//查询项目群
	onRetrieveChkProj: function(corpUuid) {
		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		var url = this.getServiceUrl('proj_group/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.corpUuid = corpUuid;
				self.onRetrieveChkProjInfo(corpUuid,self);

			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self,'proj_group');
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self,'proj_group');
		});
	},


	onRetrieveChkProjPage: function(corpUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveChkProj( corpUuid );
	},

	onInitChkProj: function(corpUuid) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveChkProj(corpUuid);
	},

});

module.exports = ChkProjStore;
