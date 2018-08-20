var Reflux = require('reflux');
var CorpAppAuthActions = require('../action/CorpAppAuthActions');
var Utils = require('../../../public/script/utils');
var Common = require('../../../public/script/common');
var MsgActions = require('../../../lib/action/MsgActions');

var CorpAppAuthStore = Reflux.createStore({
	listenables: [CorpAppAuthActions],
	
	filter: null,
	object:null,
	startPage : 0,
	pageRow : 0,
    totalRow: 0,
    compUser: null,
	
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
            compUser: self.compUser,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('app-auth1', operation, errMsg);
	},
	
	onRetrieveAppAuth: function(filter) {
		var self = this;
		var url = this.getServiceUrl('app-auth1/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.object = result.object;
				self.filter = filter;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onInitAppAuth: function(filter) {
		if( this.object ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveAppAuth(filter);
	},
	
	onCreateAppAuth: function(filter) {
        var self = this;
		var url = this.getServiceUrl('app-auth1/create');
		Utils.doCreateService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.object = result.object;
                self.filter = filter;
                if (self.compUser !== null) {
                    if (self.compUser.appAuthList === null) {
                        self.compUser.appAuthList = [];
                    }

                    self.compUser.appAuthList.push(self.object);
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
		var url = this.getServiceUrl('app-auth1/update');
		Utils.doUpdateService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.object = result.object;
                self.filter = filter;
                if (self.compUser !== null) {
                    var appUuid = self.object.appUuid;
                    var len = self.compUser.appAuthList.length;
                    for (var i = 0; i < len; i++) {
                        if (self.compUser.appAuthList[i].appUuid === appUuid) {
                            Utils.copyValue(self.object, self.compUser.appAuthList[i]);
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
		var url = this.getServiceUrl('app-auth1/remove');
		Utils.doRemoveService(url, filter).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                if (self.compUser !== null && self.compUser.appAuthList !== null) {
                    var appUuid = filter.appUuid;
                    var len = self.compUser.appAuthList.length;
                    for (var i = 0; i < len; i++) {
                        if (self.compUser.appAuthList[i].appUuid === appUuid) {
                            self.compUser.appAuthList.splice(i, 1);
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
        this.compUser = null;
        var url = this.getServiceUrl('comp-user/get-by-uuid');
        Utils.doGetRecordService(url, uuid).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.compUser = result.object;

                if (self.compUser.appAuthList !== null) {
                    var len = self.compUser.appAuthList.length;
                    for (var i = len - 1; i >= 0; i--) {
                        if (self.compUser.appAuthList[i] === null) {
                            self.compUser.appAuthList.splice(i, 1);
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

module.exports = CorpAppAuthStore;
