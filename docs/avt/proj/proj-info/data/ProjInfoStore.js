var Reflux = require('reflux');
var ProjInfoActions = require('../action/ProjInfoActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProjInfoStore = Reflux.createStore({
    listenables: [ProjInfoActions],
    filter: {},
    projInfo: {},
    startPage: 0,
    pageRow: 0,
    totalRow: 0,

    init: function () {
    },
    getServiceUrl: function (action) {
        return Utils.projUrl + action;
    },

    fireEvent: function (operation, errMsg, self) {
        self.trigger({
            filter: self.filter,
            projInfo: self.projInfo,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            operation: operation,
            errMsg: errMsg
        });
        if (errMsg.indexOf('没有找到记录') >= 0) {
            errMsg = '';
        }
        MsgActions.showError('proj-member', operation, errMsg);
    },

    onRetrieveProjMember: function (filter) {
        var self = this;
        var url = this.getServiceUrl('proj-member/user-proj');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                if (result.object) {
                    self.projInfo = result.object.list[0];
                    self.filter = filter;
                    self.fireEvent('user-proj', '', self);
                }
                else {
                    self.fireEvent('user-proj', "没有找到记录[" + result.object + "]", self);
                }
            }
            else {
                self.fireEvent('user-proj', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent('user-proj', "调用服务错误", self);
        });
    },

    onInitProjMember: function (filter) {
        if (this.projInfo.uuid) {
            if (Utils.compareTo(this.filter, filter)) {
                this.fireEvent('user-proj', '', this);
                return;
            }
        }

        this.onRetrieveProjMember(filter);
    },

    onUpdateProjMember1: function (projInfo) {
        var url = this.getServiceUrl('proj-member/update');
        var self = this;
        
		// 数据没有变更
        if (Utils.compareTo(self.projInfo, projInfo)){
			console.log('数据没有变更');
			self.fireEvent('update', '', self);
			return;
		}
        
        Utils.doUpdateService(url, projInfo).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                Utils.copyValue(result.object, self.projInfo);
				self.fireEvent('update', '', self);
			}
			else{
				self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
            self.fireEvent('update', Utils.getResErrMsg(value), self);
		});
    },
});

module.exports = ProjInfoStore;

