var Reflux = require('reflux');
var AllowLogActions = require('../action/AllowLogActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var AllowLogStore = Reflux.createStore({
	listenables: [AllowLogActions],
	
	filter: {},
	recordSet: [],
	allowLog:{},
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
			filter: self.filter,
			recordSet: self.recordSet,
			allowLog:self.allowLog,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

        if (errMsg.indexOf('没有找到记录') >= 0) {
            errMsg = '';
        }

		MsgActions.showError('hr-allow-log', operation, errMsg);
	},
	
	onRetrieveHrAllowLog: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr-allow-log/retrieve_p');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {

			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object.list.length >0){
					self.recordSet= result.object.list;
					self.allowLog = result.object.list[0];
					self.filter = filter;
					self.fireEvent('retrieve_p', '', self);
				}
				else{
					self.fireEvent('retrieve_p', "没有找到记录["+result.object.list.length+"]", self);
				}
			}
			else{
				self.fireEvent('retrieve_p', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve_p', "调用服务错误", self);
		});
	},
	
	onRetrieveHrAllowLogPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrAllowLog( filter );
	},
	
	onInitHrAllowLog: function(filter) {
		if(  this.allowLog.uuid ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve_p', '', this);
				return;
			}
		}
		
		this.onRetrieveHrAllowLog(filter);
	},
	
	
});

module.exports = AllowLogStore;

