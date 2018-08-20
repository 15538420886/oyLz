var Reflux = require('reflux');
var ProvFlowActions = require('../action/ProvFlowActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProvFlowStore = Reflux.createStore({
	listenables: [ProvFlowActions],
	checkObj:{},
	filter: {},
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.flowUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			filter: self.filter,
			checkObj: self.checkObj,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('chk-flow', operation, errMsg);
	},
	
	onRetrieveChkFlow: function(filter) {
		var self = this;
        var url = this.getServiceUrl('chk-flow/findFour');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSet = result.object.list;
                self.startPage = result.object.startPage;
                self.pageRow = result.object.pageRow;
                self.totalRow = result.object.totalRow;
                self.filter = filter;

                self.fireEvent('findFour', '', self);
			}
			else{
                self.fireEvent('findFour', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
            self.fireEvent('findFour', "调用服务错误", self);
		});
	},

	
	onRetrieveChkFlowPage: function(campusCode, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveChkFlow( campusCode );
	},

    onInitChkFlow: function (filter, startPage, pageRow) {
        if (this.recordSet.length > 0) {
            if (Utils.compareTo(this.filter, filter) && this.startPage === startPage && this.pageRow === pageRow) {
                this.fireEvent('findFour', '', this);
                return;
            }
        }

        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveChkFlowPage(filter, startPage, pageRow);
    },
});

module.exports = ProvFlowStore;