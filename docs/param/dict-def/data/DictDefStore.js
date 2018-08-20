﻿var Reflux = require('reflux');
var DictDefActions = require('../action/DictDefActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var DictDefStore = Reflux.createStore({
		listenables: [DictDefActions],

		groupUuid: '',
		recordSet: [],
		startPage : 0,
		pageRow : 0,
		totalRow : 0,

	init: function() {
	},

	getServiceUrl: function(action)
	{
		return Utils.paramUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			groupUuid: self.groupUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('SysCodeIndex', operation, errMsg);
	},
	//index首页
	onRetrieveParamDictDef: function(groupUuid) {
		var self = this;
		var filter = {
			groupUuid : groupUuid
		};

		var url = this.getServiceUrl('SysCodeIndex/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.groupUuid = groupUuid;
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onInitParamDictDef: function(groupUuid) {
		if( this.recordSet.length > 0 ){
			if( this.groupUuid === groupUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveParamDictDef(groupUuid);
	},

	onCreateParamDictDef: function(dictdef) {
		var url = this.getServiceUrl('SysCodeIndex/create');
		Utils.recordCreate(this, dictdef, url);
	},

	onUpdateParamDictDef: function(dictdef) {
		var url = this.getServiceUrl('SysCodeIndex/update');
		Utils.recordUpdate(this, dictdef, url);
	},

	onDeleteParamDictDef: function(uuid) {
		var url = this.getServiceUrl('SysCodeIndex/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = DictDefStore;
