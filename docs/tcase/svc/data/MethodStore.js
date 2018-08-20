var Reflux = require('reflux');
var MethodActions = require('../action/MethodActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var MethodStore = Reflux.createStore({
	listenables: [MethodActions],

	uuid: '',
	methodInfo: {},

	init: function() {
	},

	getServiceUrl: function(action)
	{
		return Utils.devUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			uuid: self.uuid,
			methodInfo: self.methodInfo,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('devService', operation, errMsg);
	},

	getDevService2: function(uuid) {
		var self = this;
		var url = this.getServiceUrl('devService/get-by-uuid');
		Utils.doGetRecordService(url, uuid).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.uuid = uuid;
				self.methodInfo = result.object;
				if( self.methodInfo === null || typeof(self.methodInfo)==="undefined" ){
					self.methodInfo={};
				}

				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},

	onGetDevService: function(uuid) {
		if(this.methodInfo !== null){
			if( this.methodInfo.uuid !== null && typeof(this.methodInfo.uuid)!=="undefined" ){
				if( this.uuid === uuid ){
					this.fireEvent('retrieve', '', this);
					return;
				}
			}
		}

		this.getDevService2(uuid);
	}
});

module.exports = MethodStore;
