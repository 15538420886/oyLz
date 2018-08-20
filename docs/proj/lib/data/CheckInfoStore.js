import React from 'react';
import ReactMixin from 'react-mixin';

var Reflux = require('reflux');
var CheckInfoActions = require('../action/CheckInfoActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var CheckInfoStore = Reflux.createStore({
	listenables: [CheckInfoActions],

    staffCode: '',
    userId: '',
    date: '',
    leaveSet: [],
    posSet: [],

    getServiceUrl: function(action) {
		return Utils.hrUrl+action;
	},

    fireEvent: function(operation, errMsg, self) {
        self.trigger({
            leaveSet: self.leaveSet,
            posSet: self.posSet,
            staffCode: self.staffCode,
            userId: self.userId,
            date: self.date,
			operation: operation,
			errMsg: errMsg
		});
        // console.log('self',self)
		MsgActions.showError('day-pos', operation, errMsg);
	},

    onGetLeaveList: function (corpUuid, staffCode, date,self) {
        var filter = {};
        filter.staffCode = staffCode;
        filter.date = date;
        filter.corpUuid = corpUuid;
        var url = self.getServiceUrl('hr-leaveLog/retrieve1');
        Utils.doRetrieveService(url, filter, 0, 0, 0).then(function(result) {
	 		if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.leaveSet = result.object.list;
				self.fireEvent('retrieve', '', self);
	 		}
	 		else{
			    self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
	 		self.fireEvent('retrieve', "调用服务错误", self);
	 	});;
    },
   

	onGetCheckInfo: function(corpUuid,staffCode,userId,date ) {

        var self = this;

        var filter = {};
        filter.userId = userId;
        filter.date = date;
     
		var url = Utils.campUrl+"day-pos/retrieve";
        Utils.doRetrieveService(url, filter).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
	 			self.posSet = result.object;
                self.staffCode = staffCode;
                self.userId = userId;
                self.date = date;
                
                self.onGetLeaveList(corpUuid, staffCode, date, self);
	 		}
	 		else{
			    self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
	 		self.fireEvent('retrieve', "调用服务错误", self);
	 	});
	 },
});

module.exports = CheckInfoStore;
