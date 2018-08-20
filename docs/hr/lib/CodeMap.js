import React from 'react';
var Reflux = require('reflux');
var FindNameStore = require('../../lib/data/FindNameStore');

var LevelStore = require('../level/data/LevelStore');
var LevelActions = require('../level/action/LevelActions');

var InsuranceStore = require('../insurance/data/InsuranceStore');
var InsuranceActions = require('../insurance/action/InsuranceActions');

var AllowanceStore = require('../allowance/data/AllowanceStore');
var AllowanceActions = require('../allowance/action/AllowanceActions');

var BizTripStore = require('../biz_trip/data/BizTripStore');
var BizTripActions = require('../biz_trip/action/BizTripActions');

var HolidayStore = require('../holiday/data/HolidayStore');
var HolidayActions = require('../holiday/action/HolidayActions');

module.exports = function(){
	return {
		getInitialState : function() {
			return {
				waitPages2: {},
				obj2: null,
			}
		},
		_getNullValue : function(uuid, resName){
			this.state.obj2 = null;
			if(uuid === null || typeof(uuid) === 'undefined' || uuid === ''){
				return '';
			}

			var wPage = this.state.waitPages2[resName];
			if(wPage !== null && typeof(wPage) !== 'undefined'){
				return uuid;
			}

			return null;
		},
		_getResultValue : function(uuid, resName){
			var obj = this.state.obj2;
			if(obj !== null && obj.resName === resName){
				return obj.name;
			}

			// 等待查询结果
			this.state.waitPages2[resName] = this;
			return uuid;
		},
		_fireEvent: function(resName){
			var wPage = this.state.waitPages2[resName];
			if(wPage !== null && typeof(wPage) !== 'undefined'){
				this.state.waitPages2[resName] = null;
                wPage.setState({ loading: wPage.state.loading});
			}
		},

		mixins: [
			Reflux.listenTo(FindNameStore, "_onFindComplete"),
			Reflux.listenTo(LevelStore, "_onLevelComplete"),
			Reflux.listenTo(InsuranceStore, "_onInsuComplete"),
			Reflux.listenTo(AllowanceStore, "_onAllowComplete"),
			Reflux.listenTo(BizTripStore, "_onTripComplete"),
			Reflux.listenTo(HolidayStore, "_onDateComplete")
		],
		_onFindComplete: function(data) {
			this.state.obj2 = data;
		},

		// 员工级别
		_onLevelComplete: function(data) {
			this._fireEvent( 'hr_level' );
		},
		getLevelName: function(corpUuid, uuid){
			var value = this._getNullValue(uuid, 'hr_level')
			if(value === null){
				LevelActions.getLevelName( corpUuid, uuid );	// 下载数据
				value = this._getResultValue(uuid, 'hr_level');
			}

			return value;
		},
			// 社保名称
		_onInsuComplete: function(data) {
			this._fireEvent( 'hr-insurance' );
		},
		getInsuName: function(corpUuid, uuid){
			var value = this._getNullValue(uuid, 'hr-insurance')
			if(value === null){
				InsuranceActions.getInsuName( corpUuid, uuid );	// 下载数据
				value = this._getResultValue(uuid, 'hr-insurance');
			}
			// console.log("value",value)
			return value;
		},
		//补贴类型
		_onAllowComplete: function(data) {
			this._fireEvent( 'hr-allowance' );
		},
		getAllowName: function(corpUuid, uuid){
			var value = this._getNullValue(uuid, 'hr-allowance')
			if(value === null){
				AllowanceActions.getAllowName( corpUuid, uuid );	// 下载数据
				value = this._getResultValue(uuid, 'hr-allowance');
			}
			// console.log("value",value)
			return value;
		},
		// 差旅级别
		_onTripComplete: function(data) {
			this._fireEvent( 'hr_trip' );
		},
		getTripName: function(corpUuid, uuid){
			var value = this._getNullValue(uuid, 'hr_trip')
			if(value === null){
				BizTripActions.getTripName( corpUuid, uuid );	// 下载数据
				value = this._getResultValue(uuid, 'hr_trip');
			}
			return value;
		},
		// 假期类型
		_onDateComplete: function(data) {
			this._fireEvent( 'holiday' );
		},
		getDateType: function(date){
			var year = date.substr(0,4);
			var d =  date.substr(4);
			var flag = this._getNullValue(d, 'holiday')
			if(flag === null){
				HolidayActions.getDateType(year, d);	// 下载数据
				flag = this._getResultValue(d, 'holiday');
			}
			return flag;
		},
	};
};
