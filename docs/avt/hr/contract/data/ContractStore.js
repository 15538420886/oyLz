var Reflux = require('reflux');
var ContractActions = require('../action/ContractActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ContractStore = Reflux.createStore({
	listenables: [ContractActions],

	filter: {},
	tableFilter:'',
	hc:{},
	hcList:[],
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
			tableFilter: self.tableFilter,
			hc:self.hc,
			hcList:self.hcList,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

        if (errMsg.indexOf('没有找到记录') >= 0) {
            errMsg = '';
        }

		MsgActions.showError('hr_contract', operation, errMsg);
	},
	

	onRetrieveHrContract: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr_contract/retrieve_p');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object){
                    self.hc = result.object.hc;
                    if (self.hc === null) {
                        self.hc = {};
                    }

					self.hcList = result.object.hcList;
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

	onRetrieveHrContractPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrContract( filter );
	},
	onInitHrContract: function(filter) {
        if (this.hc !== null && this.hc.uuid ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve_p', '', this);
				return;
			}
		}

		this.onRetrieveHrContract(filter);
	},

	
});

module.exports = ContractStore;
