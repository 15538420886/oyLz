var Reflux = require('reflux');
var DailyWorkActions = require('../action/DailyWorkActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var CheckLogStore = Reflux.createStore({
	listenables: [DailyWorkActions],

	filter: {},
	projTaskfilter: {},
	recordSet: [],
	checkList:[],
	projList:[],
	taskList:[],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,

	init: function() {
	},
	getServiceUrl: function(action)
	{
		
		return Utils.projUrl+action;
	},

	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			filter: self.filter,
			recordSet: self.recordSet,
			checkList: self.checkList,
			projList: self.projList,
			taskList: self.taskList,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('work_daily', operation, errMsg);
	},

	onRetrieveProjTask: function(filter){
		var self = this;
		var url = this.getServiceUrl('work_daily/proj-task');
		Utils.doGetRecordService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object){
					self.checkList= result.object.checkList;
					self.projList= result.object.projList;
					self.taskList= result.object.taskList;
					self.projTaskfilter = filter;
					self.fireEvent('retrieve', '', self);
				}
				else{
					self.fireEvent('retrieve', "没有找到记录["+result.object+"]", self);
				}
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onInitProjTask: function(filter) {
		// if( this.taskList.length > 0){
			if( Utils.compareTo(this.projTaskfilter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		// }

		this.onRetrieveProjTask(filter);
	},

	onRetrieveWorkDaily: function(filter) {
		var self = this;
		var url = this.getServiceUrl('work_daily/retrieve2');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object){
					self.recordSet= result.object.list;
					self.filter = filter;
					self.fireEvent('retrieve', '', self);
				}
				else{
					self.fireEvent('retrieve', "没有找到记录["+result.object+"]", self);
				}
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onInitWorkDaily: function(filter) {
		if( this.recordSet.length > 0){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}

		this.onRetrieveWorkDaily(filter);
	},

	onCreateWorkDaily: function(workDaily) {
        var url = this.getServiceUrl('work_daily/create');
        Utils.recordCreate(this, workDaily, url);
    },
    
    onUpdateWorkDaily: function(workDaily) {
        var url = this.getServiceUrl('work_daily/update');
        Utils.recordUpdate(this, workDaily, url);
    },
    
    onDeleteWorkDaily: function(uuid) {
        var url = this.getServiceUrl('work_daily/remove');
        Utils.recordDelete(this, uuid, url);
    }
	
});

module.exports = CheckLogStore;