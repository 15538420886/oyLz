var Reflux = require('reflux');
var InfoCheckActions = require('../action/InfoCheckActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var InfoCheckStore = Reflux.createStore({
    listenables: [InfoCheckActions],
    
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
            errMsg: errMsg,
        });
        MsgActions.showError('hr-attach', operation, errMsg);
    },
    
    onRetrieveInfoCheck: function(filter) {
        var self = this;
        var url = this.getServiceUrl('hr-attach/retrieve2');
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

});

module.exports = InfoCheckStore;