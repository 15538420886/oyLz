var Reflux = require('reflux');
var OverWorkApplyActions = require('../action/OverWorkApplyActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var OverWorkApplyStore = Reflux.createStore({
    listenables: [OverWorkApplyActions],

    filter: '',
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,

    init: function() {
    },
    getServiceUrl: function(action)
    {
        return Utils.costUrl+action;
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

        MsgActions.showError('overWorkApply', operation, errMsg);
    },

    onRetrieveOverWorkApply: function(filter) {
        var self = this;
        var url = this.getServiceUrl('over_work_apply/retrieve');
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

    onRetrieveOverWorkApplyPage: function(filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveOverWorkApply( filter );
    },

    onInitOverWorkApply: function (filter, startPage, pageRow) {
        if (this.recordSet.length > 0) {
            if (Utils.compareTo(this.filter, filter) &&
                this.startPage === startPage &&
                this.pageRow === pageRow)
            {
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        // FIXME 翻页
        // this.startPage = 1;
        // this.pageRow = 10;
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveOverWorkApply(filter);
    },

    onCreateOverWorkApply: function(overWorkApply) {
        var url = this.getServiceUrl('over_work_apply/create');
        Utils.recordCreate(this, overWorkApply, url);
    },

    onUpdateOverWorkApply: function(overWorkApply) {
        var url = this.getServiceUrl('over_work_apply/update');
        Utils.recordUpdate(this, overWorkApply, url);
    },
    

    onRevokeOverWorkApply: function(overWorkApply){
        var url = this.getServiceUrl('over_work_apply/revoke');
        Utils.recordUpdate(this, overWorkApply, url);
    }
});

module.exports = OverWorkApplyStore;