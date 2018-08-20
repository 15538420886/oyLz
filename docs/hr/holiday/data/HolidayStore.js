var Reflux = require('reflux');
var HolidayActions = require('../action/HolidayActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');
var FindNameActions = require('../../../lib/action/FindNameActions');

var HolidayStore = Reflux.createStore({
	listenables: [HolidayActions],
	
	year: '',
	recordSet: [],
	// date <--> flag
	yearMap: {},
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.hrUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		// 生成日期对照表
        if (this.year !== undefined && this.year !== '') {
            var yMap = {};
            self.recordSet.map((node, i) => {
                yMap[node.date] = node.flag;
            });
            this.yearMap[this.year] = yMap;
        }

		self.trigger({
			year: self.year,
			recordSet: self.recordSet,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('holiday', operation, errMsg);
	},
	
	onRetrieveHoliday: function(year) {
		var self = this;
		var filter = {};
		filter.year = year;
		var url = this.getServiceUrl('holiday/get-by-year');
        Utils.doGetRecordService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				if(result.object){
					self.recordSet = result.object.holidayList ;
				}else{
					self.recordSet = [];
				}
				self.year = year;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveHolidayPage: function(year, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveHoliday( year );
	},
	
	onInitHoliday: function(year) {
		if( this.recordSet.length > 0 ){
			if( this.year === year ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveHoliday(year);
	},
	
	onCreateHoliday: function(obj) {
        var self = this;
		var filter = obj;
		var url = this.getServiceUrl('holiday/create');
		Utils.doGetRecordService(url, filter).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.holidayList;
				self.fireEvent('create', '', self);
			}
			else{
				self.fireEvent('create', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('create', "调用服务错误", self);
		});
	},

	onGetDateType: function (year, date) {
        var yMap = this.yearMap[year];
        if (yMap) {
            var flag = yMap[date];
            if (flag === undefined || flag === null) {
                flag = '0';
            }
            FindNameActions.findName('holiday', date, flag);
            return;
        }

        this.onRetrieveHoliday(year);
    }

});

module.exports = HolidayStore;