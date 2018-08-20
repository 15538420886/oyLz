var Reflux = require('reflux');
var ProjTempMemberActions = require('../action/ProjTempMemberActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProjTempMemberStore = Reflux.createStore({
    listenables: [ProjTempMemberActions],

    filter: {},
    recordSet: [],
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
            recordSet: self.recordSet,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            operation: operation,
            errMsg: errMsg
        });

        MsgActions.showError('proj_temp_member', operation, errMsg);
    },

    onRetrieveProjTempMember: function (filter) {
        var self = this;
        var url = this.getServiceUrl('proj_temp_member/retrieve');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSet = result.object.list;
                self.startPage = result.object.startPage;
                self.pageRow = result.object.pageRow;
                self.totalRow = result.object.totalRow;
                self.filter = filter;

                self.fireEvent('retrieve', '', self);
            }
            else {
                self.fireEvent('retrieve', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent('retrieve', "调用服务错误", self);
        });
    },

    onRetrieveProjTempMemberPage: function (filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveProjTempMember(filter);
    },

    onInitProjTempMember: function (filter) {
        if (this.recordSet.length > 0) {
            if (Utils.compareTo(this.filter, filter)) {
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        // FIXME 翻页
        // this.startPage = 1;
        // this.pageRow = 10;
        this.onRetrieveProjTempMember(filter);
    },

    onCreateProjTempMember: function (projTempMember) {
        var url = this.getServiceUrl('proj_temp_member/create');
        Utils.recordCreate(this, projTempMember, url);
    },

    onUpdateProjTempMember: function (projTempMember) {
        var url = this.getServiceUrl('proj_temp_member/update');
        Utils.recordUpdate(this, projTempMember, url);
    },

    onDeleteProjTempMember: function (uuid) {
        var url = this.getServiceUrl('proj_temp_member/remove');
        Utils.recordDelete(this, uuid, url);
    },

    onChgProjMemberLevel: function (tempMember) {
        var url = this.getServiceUrl('proj_temp_member/update3');
        Utils.recordUpdate(this, tempMember, url);
    }
});

module.exports = ProjTempMemberStore;
