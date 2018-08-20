var Reflux = require('reflux');
var ParamsActions = require('../action/ParamsActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ParamsStore = Reflux.createStore({
    listenables: [ParamsActions],
    
    filter: '',
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,
    
    init: function() {
    },
    getServiceUrl: function(action)
    {
        return Utils.assetUrl+action;
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

        MsgActions.showError('params', operation, errMsg);
    },

    onInitParams: function(recordSet) {
        if(recordSet != null && recordSet.length > 0 ){
            this.recordSet = recordSet;
        }else{
            this.recordSet = [];
        }
        this.fireEvent('retrieve', '', this);
    },

    onCreateParams: function(object) {
        var url = this.getServiceUrl('params/create');
        Utils.recordCreate(this, object, url);
        
    },
    
    onUpdateParams: function(object) {
        var url = this.getServiceUrl('params/update');
        Utils.recordUpdate(this, object, url);
    },

    onDeleteParams: function(object) {
        var url = this.getServiceUrl('params/delete');
        var self = this;
		var idx = -1;
        var paramName = object.object;
        for(var x=self.recordSet.length-1; x>=0; x--){
			if(self.recordSet[x].paramName === paramName){
				idx = x;
                break;
			}
		}

		if(idx < 0){
			self.fireEvent('remove', '没有找到记录['+paramName+']', self);
			return;
		}

		Utils.doRemoveService(url, object).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet.splice(idx, 1);
				self.totalRow = self.totalRow - 1;
				self.fireEvent('remove', '', self);
			}
			else{
				self.fireEvent('remove', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
            self.fireEvent('remove', Utils.getResErrMsg(value), self);
		});
    }

});

module.exports = ParamsStore;