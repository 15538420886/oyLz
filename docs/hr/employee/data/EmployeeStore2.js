var Reflux = require('reflux');
var EmployeeActions = require('../action/EmployeeActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var EmployeeStore = Reflux.createStore({
    listenables: [EmployeeActions],

    init: function () {
    },
    getServiceUrl: function (action) {
        return Utils.hrUrl + action;
    },

    fireEvent2: function (operation, errMsg, self) {
        self.trigger({
            operation: operation,
            errMsg: errMsg
        });
    },

    onSendEntryMail: function (mail) {
        var url = this.getServiceUrl('hr-employee/entry-mail');

        var self = this;
        Utils.doGetRecordService(url, mail).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.fireEvent2('mail', result.object, self);
            }
            else {
                self.fireEvent2('mail', "处理错误[" + result.errCode + "][" + result.errDesc + "]", self);
            }
        }, function (value) {
            self.fireEvent2('mail', "调用服务错误", self);
        });
    }
});

module.exports = EmployeeStore;
