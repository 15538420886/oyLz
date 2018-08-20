var Reflux = require('reflux');
var InfoCheckLeftActions = require('../action/InfoCheckLeftActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var InfoCheckLeftStore = Reflux.createStore({
    listenables: [InfoCheckLeftActions],
    
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
    
    onRetrieveInfoCheck1: function(filter) {
        var self = this;
        var url = this.getServiceUrl('hr-attach/retrieve');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if(result.errCode == null || result.errCode == '' || result.errCode == '000000'){
                result.object.files.push({'title':'汇总','uuid':''})
                self.recordSet = result.object.files;
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

    onUpdateHrAttach: function(hrAttach) {
        var self = this;
        var url = this.getServiceUrl('hr-attach/update-status');
        Utils.doUpdateService(url, hrAttach).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                result.recordSet = result.object;
				self.fireEvent('update', '', self);
			}
			else{
				self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
            self.fireEvent('update', "调用服务错误", self);
		});
    },
    
});

module.exports = InfoCheckLeftStore;