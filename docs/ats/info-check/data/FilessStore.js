var Reflux = require('reflux');
var FilessActions = require('../action/FilessActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var FilessStore = Reflux.createStore({
    listenables: [FilessActions],
    
    filter: '',
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
            errMsg: errMsg
        });

        MsgActions.showError('filess', operation, errMsg);
    },
    
    onUpdateFiless: function(filter) {
        var self = this;
        var url = this.getServiceUrl('filess/update-status');
        Utils.doUpdateService(url, filter).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                result.recordSet = result.object;
                self.filter = filter;     
				self.fireEvent('update', '', self);
			}
			else{
				self.fireEvent('update', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
            self.fireEvent('update', util.getResErrMsg(value), self);
		});
    },
    
});

module.exports = FilessStore;