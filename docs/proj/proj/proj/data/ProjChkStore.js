var Reflux = require('reflux');
var ProjChkActions = require('../action/ProjChkActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProjChkStore = Reflux.createStore({
	listenables: [ProjChkActions],
	
    proj: {},
	filter:'',
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.projUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			proj: self.proj,
            filter: self.filter,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('proj', operation, errMsg);
	},
	
	onRetrieveProj: function(filter) {
		var self = this;
		var url = this.getServiceUrl('proj/retrieve');
		Utils.doGetRecordService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.proj = result.object;
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
        if( JSON.stringify(this.proj) !== '{}' ){
            if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveProj(filter);
	}
});

module.exports = ProjChkStore;
