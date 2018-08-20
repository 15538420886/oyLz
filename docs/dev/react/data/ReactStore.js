var Reflux = require('reflux');
var ReactActions = require('../action/ReactActions');
var Utils = require('../../../public/script/utils');

var ReactStore = Reflux.createStore({
	listenables: [ReactActions],
	
	strStore: '',
	strAction: '',
	strPage: '',
	strCreatePage: '',
	strUpdatePage: '',
	strPageNavi: '',
	
	init: function() {
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			strStore: self.strStore,
			strAction: self.strAction,
			strPage: self.strPage,
			strCreatePage: self.strCreatePage,
			strUpdatePage: self.strUpdatePage,
			strPageNavi: self.strPageNavi,

			operation: operation,
			errMsg: errMsg
		});
	},

	//ajax调用后台接口，返回json
	onGenActionFile: function(param) {
		var self = this;
		Utils.doCreateService(Utils.devUrl+'react/action', param).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.strAction = result.object;
				self.fireEvent('action', '', self);
			}
			else{
				self.fireEvent('action', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('action', "调用服务错误", self);
		});
	},
	
	onGenStoreFile: function(param) {
		var self = this;
		Utils.doUpdateService(Utils.devUrl+'react/store', param).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.strStore = result.object;
				self.fireEvent('store', '', self);
			}
			else{
				self.fireEvent('store', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('store', "调用服务错误", self);
		});
	},

	onGenPageFile: function(param) {
		var self = this;
		Utils.doCreateService(Utils.devUrl+'react/page', param).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.strPage = result.object;
				self.fireEvent('page', '', self);
			}
			else{
				self.fireEvent('page', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('page', "调用服务错误", self);
		});
	},

	onGenCreatePageFile: function(param) {
		var self = this;
		Utils.doCreateService(Utils.devUrl+'react/createPage', param).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.strCreatePage = result.object;
				self.fireEvent('createPage', '', self);
			}
			else{
				self.fireEvent('createPage', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('createPage', "调用服务错误", self);
		});
	},

	onGenUpdatePageFile: function(param) {
		var self = this;
		Utils.doCreateService(Utils.devUrl+'react/updatePage', param).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.strUpdatePage = result.object;
				self.fireEvent('updatePage', '', self);
			}
			else{
				self.fireEvent('updatePage', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('updatePage', "调用服务错误", self);
		});
	},

	onGenPageNaviFile: function(param) {
		var self = this;
		Utils.doCreateService(Utils.devUrl+'react/pageNavi', param).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.strPageNavi = result.object;
				self.fireEvent('pageNavi', '', self);
			}
			else{
				self.fireEvent('pageNavi', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('pageNavi', "调用服务错误", self);
		});
	}
});

module.exports = ReactStore;

