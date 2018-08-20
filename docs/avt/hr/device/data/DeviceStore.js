﻿var Reflux = require('reflux');
var DeviceActions = require('../action/DeviceActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var DeviceStore = Reflux.createStore({
	listenables: [DeviceActions],

	filter: '',
	recordSet: [],
	device: {},
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.hrUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			recordSet: self.recordSet,
			filter: self.filter,
			device: self.device,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg,
		});

        if (errMsg.indexOf('没有找到记录') >= 0) {
            errMsg = '';
        }

		MsgActions.showError('hr_device', operation, errMsg);
	},

	onRetrieveHrDevice: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr_device/retrieve_p');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object){
					self.device = result.object;
					self.filter = filter;
					self.fireEvent('retrieve_p', '', self);
				}
				else{
					self.fireEvent('retrieve_p', "没有找到记录["+result.object+"]", self);
				}
			}
			else{
				self.fireEvent('retrieve_p', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve_p', "调用服务错误", self);
		});
	},

	onInitHrDevice: function(filter) {
		if( this.device.uuid ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve_p', '', this);
				return;
			}
		}

		this.onRetrieveHrDevice(filter);
	},

});

module.exports = DeviceStore;
