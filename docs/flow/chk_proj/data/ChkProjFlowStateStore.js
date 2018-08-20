var Reflux = require('reflux');
var ChkProjActions = require('../action/ChkProjActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ChkProjFlowStateStore = Reflux.createStore({
	listenables: [ChkProjActions],

	object:{},

	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.flowUrl+action;
	},
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			object:self.object,
			operation: self.operation,
			errMsg: errMsg
		});
		MsgActions.showError('chk-proj', operation, errMsg);
	},
	//查询项目组已管理权限
	onRetrieveChkProjFlowState: function (uuid) {
			var self = this;
			self.uuid = uuid;
			var url = this.getServiceUrl('chk-proj/get-by-uuid');
			Utils.doGetRecordService(url, uuid).then(function (result) {
					if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
							self.operation = 'find';
							self.object = result.object;
							self.fireEvent('find', '', self);
					}
					else {
							self.fireEvent('find', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
					}
			}, function (value) {
					self.fireEvent('find', "调用服务错误", self);
			});
	},
	//更新项目组管理权限内容
  onUpdateChkProjFlowState: function(filter) {
		var self = this;
		var url = this.getServiceUrl('chk-proj/update');
		Utils.doUpdateService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
          self.object = result.object;
					self.operation = 'update';
					self.fireEvent('update', '', self);
			}
			else{
				self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('update', "调用服务错误", self);
		});
	},
	//新建项目组管理权限内容
  onCreateChkProjFlowState: function(filter) {
		var self = this;
		var url = this.getServiceUrl('chk-proj/create');
		Utils.doUpdateService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
          self.object = result.object;
					self.operation = 'create';
				self.fireEvent('create', '', self);
			}
			else{
				self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('create', "调用服务错误", self);
		});
	},
	//查询项目群已管理权限
	onGetProjByUuid: function (uuid) {
			var self = this;
			self.uuid = uuid;
			var url = this.getServiceUrl('chk-proj-grp/get-by-uuid');
			Utils.doGetRecordService(url, uuid).then(function (result) {
					if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
							self.operation = 'find';
							self.object = result.object;
							self.fireEvent('find', '', self);
					}
					else {
							self.fireEvent('find', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
					}
			}, function (value) {
					self.fireEvent('find', "调用服务错误", self);
			});
	},
	//新建项目群管理权限内容
	onCreateChkProjGrp: function(filter) {
			var self = this;
			var url = this.getServiceUrl('chk-proj-grp/create');
			Utils.doUpdateService(url, filter).then(function(result) {
				if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
						self.operation = 'create';
						self.object = result.object;
						self.fireEvent('create', '', self);
				}else{
					self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
				}
			}, function(value){
				self.fireEvent('create', "调用服务错误", self);
			});
	},
  //更新项目群管理权限内容
	onUpdateChkProjGrp: function(filter) {
			var self = this;
			var url = this.getServiceUrl('chk-proj-grp/update');
			Utils.doUpdateService(url, filter).then(function(result) {
					if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
							self.operation = 'update';
							self.object = result.object;
							self.fireEvent('update', '', self);
					}else{
						self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
					}
			}, function(value){
				self.fireEvent('update', "调用服务错误", self);
			});
	},

});

module.exports = ChkProjFlowStateStore;
