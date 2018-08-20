import React from 'react';
var Reflux = require('reflux');
var FindNameStore = require('../../lib/data/FindNameStore');

var HrExecutStore = require('../../ats/param/hr_person/data/HrExecutStore');
var HrExecutActions = require('../../ats/param/hr_person/action/HrExecutActions');

var StdJobStore = require('../../ats/param/std_job/data/StdJobStore');
var StdJobActions = require('../../ats/param/std_job/action/StdJobActions');



module.exports = function () {
    return {
        getInitialState: function () {
            return {
                waitPages: {},
                obj: null,
            }
        },
        _getNullValue_2: function (uuid, resName) {
            this.state.obj = null;
            if (uuid === null || typeof (uuid) === 'undefined' || uuid === '') {
                return '';
            }

            var wPage = this.state.waitPages[resName];
            if (wPage !== null && typeof (wPage) !== 'undefined') {
                return uuid;
            }

            return null;
        },
        _getResultValue_2: function (uuid, resName) {
            var obj = this.state.obj;
            if (obj !== null && obj.resName === resName) {
                return obj.name;
            }

            // 等待查询结果
            this.state.waitPages[resName] = this;
            return uuid;
        },
        _fireEvent_2: function (resName) {
            var wPage = this.state.waitPages[resName];
            if (wPage !== null && typeof (wPage) !== 'undefined') {
                this.state.waitPages[resName] = null;
                wPage.setState({ loading: wPage.state.loading });
            }
        },

        mixins: [
            Reflux.listenTo(FindNameStore, "_onFindComplete_2"),
            Reflux.listenTo(HrExecutStore, "_onHrPersonComplete"),
            Reflux.listenTo(StdJobStore, "_onJobCodeComplete"),
        ],
        
        _onFindComplete_2: function (data) {
            this.state.obj = data;
        },
       
        // 人力专员转换
        _onHrPersonComplete: function (data) {
            this._fireEvent_2('hr_execut');
        },

        getHrPersonName: function (corpUuid, uuid) {
            if (corpUuid === undefined || corpUuid === null || corpUuid === '') {
                return uuid;
            }
            var value = this._getNullValue_2(uuid, 'hr_execut')
            if (value === null) {
                HrExecutActions.getHrPersonName(corpUuid, uuid);	// 下载数据
                value = this._getResultValue_2(uuid, 'hr_execut');
            }
            return value;
        },

        // 标准岗位代码转换
        _onJobCodeComplete: function (data) {
            this._fireEvent_2('stdJob');
        },

        getJobCodeName: function (corpUuid, uuid) {
            if (corpUuid === undefined || corpUuid === null || corpUuid === '') {
                return uuid;
            }
            var value = this._getNullValue_2(uuid, 'stdJob')
            if (value === null) {
                StdJobActions.getJobCodeName(corpUuid, uuid);	// 下载数据
                value = this._getResultValue_2(uuid, 'stdJob');
            }
            return value;
        },

    };
};
