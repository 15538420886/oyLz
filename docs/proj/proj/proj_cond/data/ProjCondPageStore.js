var Reflux = require('reflux');
var ProjCondPageActions = require('../action/ProjCondPageActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProjCondPageStore = Reflux.createStore({
	listenables: [ProjCondPageActions],
	
	corpUuid: '',
	member:{},
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.projUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			corpUuid: self.corpUuid,
			member: self.member,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('proj_cond', operation, errMsg);
	},

	
	onRetrieveProjCond: function(filter) {
		var self = this;
		var url = this.getServiceUrl('proj_cond/retrieve');
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

    onRetrieveProjCondPage: function (filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveProjCond(filter);
    },

	onInitProjCond: function(filter) {
		
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		this.onRetrieveProjCond(filter);

	},

    onGetMember: function (staffCode) {
        var self = this;
        var filter = {};
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.staffCode = staffCode;
        var url = Utils.projUrl + 'res-member/retrieve';
        Utils.doRetrieveService(url, filter, 1, 1, 1).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.member = result.object.list[0];

                self.fireEvent('retrieveMember', '', self);
            }
            else {
                self.fireEvent('retrieveMember', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent('retrieveMember', "调用服务错误", self);
        });
    },

	onCreateProjCond: function(cond) {
		
		var url = this.getServiceUrl('proj_cond/create');
		Utils.recordCreate(this, cond, url);
	},
	
	onUpdateProjCond: function(cond) {
		var url = this.getServiceUrl('proj_cond/update');
		Utils.recordUpdate(this, cond, url);
	},
	
	onDeleteProjCond: function(uuid) {
		var url = this.getServiceUrl('proj_cond/remove');
		Utils.recordDelete(this, uuid, url);
	}
});

module.exports = ProjCondPageStore;