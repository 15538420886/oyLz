var Reflux = require('reflux');
var AppAuthActions = require('../action/AppAuthActions');
var Utils = require('../../../public/script/utils');
var Common = require('../../../public/script/common');
var MsgActions = require('../../../lib/action/MsgActions');

var AppAuthStore = Reflux.createStore({
	listenables: [AppAuthActions],
	
	filter: null,
	object:null,
	startPage : 0,
	pageRow : 0,
    totalRow: 0,
    userGroup: null,
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.authUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			filter: self.filter,
            object: self.object,
            userGroup: self.userGroup,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('appAuth', operation, errMsg);
	},
	
	onCreateAppAuth: function(filter) {
        var self = this;
		var url = this.getServiceUrl('appAuth/create');
		Utils.doCreateService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.object = result.object;
                self.filter = filter;
                if (self.userGroup !== null) {
                    if (self.userGroup.appAuthList === null) {
                        self.userGroup.appAuthList = [];
                    }

                    self.userGroup.appAuthList.push(self.object);
                }

				self.fireEvent('create', '', self);
			}
			else{
				self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('create', "调用服务错误", self);
		});
        
	},
	
	onUpdateAppAuth: function(filter) {
		var self = this;
		var url = this.getServiceUrl('appAuth/update');
		Utils.doUpdateService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.object = result.object;
                self.filter = filter;
                if (self.userGroup !== null) {
                    var appUuid = self.object.appUuid;
                    var len = self.userGroup.appAuthList.length;
                    for (var i = 0; i < len; i++) {
                        if (self.userGroup.appAuthList[i].appUuid === appUuid) {
                            Utils.copyValue(self.object, self.userGroup.appAuthList[i]);
                            break;
                        }
                    }
                }

				self.fireEvent('update', '', self);
			}
			else{
				self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('update', "调用服务错误", self);
		});
	},
	
	onDeleteAppAuth: function(filter) {
		var self = this;
		var url = this.getServiceUrl('appAuth/remove');
		Utils.doRemoveService(url, filter).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                if (self.userGroup !== null && self.userGroup.appAuthList !== null) {
                    var appUuid = filter.appUuid;
                    var len = self.userGroup.appAuthList.length;
                    for (var i = 0; i < len; i++) {
                        if (self.userGroup.appAuthList[i].appUuid === appUuid) {
                            self.userGroup.appAuthList.splice(i, 1);
                            break;
                        }
                    }
                }

                self.object = null;
                self.filter = filter;
				self.fireEvent('delete', '', self);
			}
			else{
				self.fireEvent('delete', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('delete', "调用服务错误", self);
		});
    },
    onGetUserByUuid: function (uuid) {
        var self = this;
        this.userGroup = null;
        var url = this.getServiceUrl('user-group/get-by-uuid');
        Utils.doGetRecordService(url, uuid).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.userGroup = result.object;
                if (self.userGroup.appAuthList !== null) {
                    var len = self.userGroup.appAuthList.length;
                    for (var i = len - 1; i >= 0; i--) {
                        if (self.userGroup.appAuthList[i] === null) {
                            self.userGroup.appAuthList.splice(i, 1);
                        }
                    }
                }

                self.fireEvent('find', '', self);
            }
            else {
                self.fireEvent('find', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent('find', "调用服务错误", self);
        });
    },
});

module.exports = AppAuthStore;
