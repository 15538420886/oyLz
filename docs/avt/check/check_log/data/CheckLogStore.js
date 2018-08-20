var Reflux = require('reflux');
var CheckLogActions = require('../action/CheckLogActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var CheckLogStore = Reflux.createStore({
	listenables: [CheckLogActions],

	filter: {},
	tableFilter:'',
	recordSet: [],
	checkLog:{},
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},
	getServiceUrl: function(action)
	{
		
		return Utils.campUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			filter: self.filter,
			recordSet: self.recordSet,
			tableFilter: self.tableFilter,
			checkLog:self.checkLog,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

        if (errMsg.indexOf('没有找到记录') >= 0) {
            errMsg = '';
        }

		MsgActions.showError('user-pos', operation, errMsg);
	},
	
	// onRetrieveCheckLogPage
	onRetrieveCheckLog: function(filter) {
		var self = this;
		var url = this.getServiceUrl('user-pos/get-by-userName');
		Utils.doCreateService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object){
					// self.recordSet = result.object.list;
					self.checkLog= result.object
					self.filter = filter;
					self.fireEvent('retrieve', '', self);
				}
				else{
					self.fireEvent('retrieve', "没有找到记录["+result.object+"]", self);
				}
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onInitCheckLog: function(filter) {
		if( this.checkLog.uuid ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveCheckLog(filter);
	},

	
});

module.exports = CheckLogStore;
