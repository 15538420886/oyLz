var Reflux = require('reflux');
var WorkLogActions = require('../action/WorkLogActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var EmployeeStore2 = Reflux.createStore({
    listenables: [WorkLogActions],

    corpUuid: '',
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
            corpUuid: self.corpUuid,
            recordSet: self.recordSet,
            operation: operation,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            errMsg: errMsg
        });

        MsgActions.showError('hr-employee', operation, errMsg);
    },


    onRetrieveEmpLoyee: function(filter) {
        var self = this;
        var url = this.getServiceUrl('hr-employee/get-by-uuid');
        Utils.doCreateService(url, filter).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.recordSet = result.object;

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

module.exports = EmployeeStore2;
