var Reflux = require('reflux');
var BenefitsActions = require('../action/BenefitsActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var BenefitsStore = Reflux.createStore({
	listenables: [BenefitsActions],

	filter: '',
	tableFilter: '',
	hbu:{},
	hbList:[],
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
			hbu:self.hbu,
			hbList:self.hbList,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg,
		});

        if (errMsg.indexOf('没有找到记录') >= 0) {
            errMsg = '';
        }

		MsgActions.showError('hr-benefits', operation, errMsg);
	},

	onRetrieveHrBenefits: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr-benefits/retrieve_p');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object.hbu!==null || result.object.hbList!==null){	
					self.hbu = result.object.hbu;
					self.hbList = result.object.hbList;
					self.filter = filter;
					self.fireEvent('retrieve_p', '', self);
				}
				else{
					self.fireEvent('retrieve_p', "没有找到记录["+result.object.hbu+"]", self);
				}
			}
			else{
				self.fireEvent('retrieve_p', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve_p', "调用服务错误", self);
		});
	},

	onInitHrBenefits: function(filter) {
		if( this.hbu.uuid ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve_p', '', this);
				return;
			}
		}

		this.onRetrieveHrBenefits(filter);
	},
	
	

});

module.exports = BenefitsStore;
