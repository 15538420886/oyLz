var Reflux = require('reflux');
var BenefitsActions = require('../action/BenefitsActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var BenefitsStore = Reflux.createStore({
	listenables: [BenefitsActions],

	filter: {},
	recordSet: [],
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
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('hr-benefits', operation, errMsg);
	},

	onRetrieveHrBenefits: function(filter) {
		var self = this;
		var url = this.getServiceUrl('hr-benefits/retrieve1');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
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

	onRetrieveHrBenefitsPage: function(filter, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHrBenefits( filter );
	},
	onGetCacheData: function() {
		this.fireEvent('cache', '', this);
	},

	onInitHrBenefits: function(filter) {
		if( this.recordSet.length > 0 ){
			if( this.filter === filter ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveHrBenefits(filter);
	},

	onCreateHrBenefits: function(benefits) {
		var url = this.getServiceUrl('hr-benefits/create');
		// Utils.recordCreate(this, benefits, url);
		var self = this;
		var data = benefits;
		Utils.doCreateService(url, data).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
				result.object.perName = data.perName;
				result.object.staffCode = data.staffCode;
                result.object.deptName = data.deptName;
				self.recordSet.push(result.object);

				self.totalRow = self.totalRow + 1;
				self.fireEvent('create', '', self);
			}
			else{
				self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('create', "调用服务错误", self);
		});
	},

	onUpdateHrBenefits: function(benefits) {
		var url = this.getServiceUrl('hr-benefits/update');
		Utils.recordUpdate(this, benefits, url);
	},

	onDeleteHrBenefits: function(uuid) {
		var url = this.getServiceUrl('hr-benefits/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = BenefitsStore;
