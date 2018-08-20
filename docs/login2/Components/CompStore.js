var Reflux = require('reflux');
var CompActions = require('./CompActions');
var Utils = require('../../public/script/utils');
var MsgActions = require('../../lib/action/MsgActions');

var CompStore = Reflux.createStore({
	listenables: [CompActions],
	
	username: '',
	recordSet: [],
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.authUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			username: self.username,
			recordSet: self.recordSet,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('comp-user', operation, errMsg);
	},
	
	onRetrieveCompUser: function(username) {
		var self = this;
		var filter = {};
		filter.username = username;
		var url = this.getServiceUrl('comp-user/get-by-username');
		Utils.doGetRecordService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.username = username;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onInitCompUser: function(username) {
		if( this.recordSet.length > 0 ){
			if( this.username === username ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveCompUser(username);
	},
});

module.exports = CompStore;

