var Reflux = require('reflux');
var ProjActions = require('../action/ProjActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ProjStore = Reflux.createStore({
	listenables: [ProjActions],
	
    filter: {},
    recordSet: [],
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.projUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
            recordSet: self.recordSet,
            filter: self.filter,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('proj', operation, errMsg);
	},
	
    onRetrieveProj: function (filter) {
        if (!(filter.corpUuid || filter.parentUuid)) {
            filter = {};
            recordSet = [];
            self.fireEvent('retrieve', '', self);
            return;
        }

		var self = this;
        var url = this.getServiceUrl('proj_info/retrieve');
        Utils.doRetrieveService(url, filter, 0, 0, 0).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.recordSet = result.object.list;
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
	
	onInitProj: function(filter) {
        if (this.recordSet.length > 0) {
            if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveProj(filter);
	}
});

module.exports = ProjStore;
