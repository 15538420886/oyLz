var Reflux = require('reflux');
var OrderDiscActions = require('../action/OrderDiscActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var OrderDiscStore = Reflux.createStore({
    listenables: [OrderDiscActions],

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

        MsgActions.showError('order-disc', operation, errMsg);
    },

    onRetrieveOrderDisc: function (filter) {
        var self = this;
        var url = this.getServiceUrl('order-disc/retrieve');
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

    onRetrieveOrderDiscPage: function (filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveOrderDisc(filter);
    },

    onInitOrderDisc: function (filter) {
        if (this.recordSet.length > 0) {
            if (Utils.compareTo(this.filter, filter)) {
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        this.onRetrieveOrderDisc(filter);
    },

    onCreateOrderDisc: function (orderDisc) {
        var url = this.getServiceUrl('order-disc/create');
        Utils.recordCreate(this, orderDisc, url);
    },

    onUpdateOrderDisc: function (orderDisc) {
        var url = this.getServiceUrl('order-disc/update');
        Utils.recordUpdate(this, orderDisc, url);
    },

    onDeleteOrderDisc: function (uuid) {
        var url = this.getServiceUrl('order-disc/remove');
        Utils.recordDelete(this, uuid, url);
    }
});

module.exports = OrderDiscStore;
