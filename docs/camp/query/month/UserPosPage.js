'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var MsgActions = require('../../../lib/action/MsgActions');
import { Button, Table, Icon, Modal, Radio, Pagination, DatePicker, Spin, Input } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var UserPosActions = require('./action/UserPosActions');
var UserPosStore = require('./data/UserPosStore');
var ResMemberStore = require('./data/ResMemberStore');
var ResMemberActions = require('./action/ResMemberActions');

import CodeMap from '../../../hr/lib/CodeMap';
var ProjContext = require('../../../proj/ProjContext');
import ProjCodeMap from '../../../proj/lib/ProjCodeMap';
import SelectMonth from '../../../lib/Components/SelectMonth';
import XlsDown from '../../../lib/Components/XlsDown';
import XlsTempFile from '../../../lib/Components/XlsTempFile';
var XlsConfig = require('../../../proj/lib/XlsConfig');

var tmonth = '' + Common.getMonth();
var filterValue = '';
var UserPosPage = React.createClass({
    getInitialState: function () {
        return {
            userPosSet: {
                recordSet: []
            },
            memberSet: {
                recordSet: []
            },
            loading: false,
            workMonth: tmonth,
            filter: '',
            arr: [],
        }
    },

    mixins: [Reflux.listenTo(ResMemberStore, "onServiceComplete"), Reflux.listenTo(UserPosStore, "onServiceComplete2"), ProjCodeMap(), CodeMap(), XlsTempFile()],
    onServiceComplete: function (data) {
        Common.sortTable(data.recordSet, 'staffCode');
        this.setState({
            loading: false,
            memberSet: data
        });
    },

    onServiceComplete2: function (data) {
        this.setState({
            loading: false,
            userPosSet: data
        });

    },
    // 第一次加载
    componentDidMount: function () {
        var date = new Date();
        this.setState({
            loading: true,
        });
        this.queryUserPos(tmonth);
    },

    // 选择日期
    onChangeDate: function (e) {
        var workMonth = e.target.value;
        this.queryUserPos(workMonth);

        this.setState({
            loading: true,
            workMonth: workMonth,
            selectedRowKeys: null,
        });
    },

    queryUserPos: function (chkDate) {
        var corpUuid = window.loginData.compUser.corpUuid;;
        ResMemberActions.initAllMember(corpUuid);
        UserPosActions.initMonthPos(chkDate);
    },

    onFilterRecord: function (e) {
        this.setState({ filterValue: e.target.value });
    },

    datePicker: function (date, dateString) {
        var chkDate = dateString.split('-').join('');
        this.setState({
            loading: true,
            workMonth: chkDate,
        });

        this.queryUserPos(chkDate);
    },

    showError: function (msg) {
        MsgActions.showError('month-pos', 'retrieve', msg);
    },

    // 导出考勤数据
    xlsExport: function () {
        var data = [];
        var recordSet = Common.filter(this.state.arr, this.state.filterValue);
        var checkMemberFields = [
            { id: 'A', name: 'staffCode', title: '员工号' },
            { id: 'B', name: 'perName', title: '姓名' },
            { id: 'C', name: 'deptName', title: '部门' },
        ];

        var days = this.getDays();
        var zm = "";
        for (var i = 1; i < days + 1; i++) {
            var r = {};
            var m = i + 67;
            zm = String.fromCharCode(m);
            switch (m) {
                case 91: zm = 'AA';
                    break;
                case 92: zm = 'AB';
                    break;
                case 93: zm = 'AC';
                    break;
                case 94: zm = 'AD';
                    break;
                case 95: zm = 'AE';
                    break;
                case 96: zm = 'AF';
                    break;
                case 97: zm = 'AG';
                    break;
                case 98: zm = 'AH';
                    break;
                default: break;
            }

            i = (i < 10) ? '0' + i : '' + i;
            r.id = zm;
            r.name = i;
            r.title = i;
            checkMemberFields.push(r);
        }

        this.downXlsTempFile2(checkMemberFields, recordSet, this.refs.xls);
    },

    // 获取当月天数
    getDays: function () {
        var year = this.state.workMonth.substr(0, 4);
        var month = this.state.workMonth.substr(4, 2);
        var d = new Date(year, month, 0);
        var days = d.getDate();
        return days;
    },
    prepareCheckList: function (obj, checkList) {
        if (checkList === undefined || checkList === null) {
            // console.log('obj.userId', obj.userId)
            return;
        }

        var lastID = null;
        var checkIn = null;
        for (var k = 0; k < checkList.posInfo.length; k++) {
            var posItem = checkList.posInfo[k];

            var posType = posItem.posType;
            if (posType !== 'check_in' && posType !== 'check_out' && posType !== 'trip_in' && posType !== 'trip_out') {
                continue;
            }

            var tm = posItem.posTime.substr(0, 5);
            var dt = posItem.posDate.substr(8, 2);
            if (lastID === dt) {
                obj[dt] = checkIn + '~' + tm;
            }
            else {
                lastID = dt;
                checkIn = tm;
                obj[dt] = tm;
            }
        }
    },

    render: function () {

        var columns = [];
        var days = this.getDays();
        var columns = [
            {
                title: '员工号',
                dataIndex: 'staffCode',
                key: 'staffCode',
                width: 100,
                fixed: 'left',
            },
            {
                title: '姓名',
                dataIndex: 'perName',
                key: 'perName',
                width: 100,
                fixed: 'left',
            },
            {
                title: '部门',
                dataIndex: 'deptName',
                key: 'deptName',
                width: 140,
            },
        ]

        var workMonth = this.state.workMonth;
        for (var i = 1; i < days + 1; i++) {
            i = (i < 10) ? '0' + i : '' + i;
            var flag = '';
            var t = this.getDateType(workMonth + i);
            if (t === '1' || t === '2') {
                flag = 'leaveWeek';
            }

            columns.push(
                {
                    title: i,
                    dataIndex: i,
                    key: i,
                    width: 120,
                    className: flag,
                },
            )
        }

        var cs = Common.getCardMargin(this);
        var colWidth = days * 120 + 340;

        this.state.arr = [];
        var posList = this.state.userPosSet.recordSet;
        var staffSet = this.state.memberSet.recordSet;
        if (staffSet !== null && staffSet.length > 0) {
            var posMap = {};
            var list = posList.list;
            var len = list ? list.length : 0;
            for (var i = 0; i < len; i++) {   //考勤
                var itemList = list[i];
                var userId = itemList.userId;
                if (userId === null || userId === '') {
                    continue;
                }

                posMap[userId] = itemList;
            }

            // console.log(posMap)
            for (var i = 0; i < staffSet.length; i++) {
                var obj = {};
                var item = staffSet[i];
                obj.userId = item.userId;
                obj.staffCode = item.staffCode;
                obj.perName = item.perName;
                obj.deptName = item.deptName;
                obj.baseCity = item.baseCity;
                obj.resName = item.resName;
                this.state.arr.push(obj);

                var checkList = posMap[obj.userId];
                this.prepareCheckList(obj, checkList);
                posMap[obj.userId] = null;
            }

            for (var name in posMap) {
                var pos = posMap[name];
                if (pos !== null && pos !== undefined) {
                    var obj = {};
                    obj.userId = pos.userId;
                    obj.staffCode = '';
                    obj.perName = pos.username;
                    obj.deptName = '';
                    this.state.arr.push(obj);
                    
                    this.prepareCheckList(obj, pos);
                }
            }
        }

        var arrRecordSet = Common.filter(this.state.arr, this.state.filterValue);
        return (
            <div className='grid-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['month-pos/retrieve-month']} />
                    <div className='toolbar-table'>
                        <SelectMonth value={this.state.workMonth} onChange={this.onChangeDate} />
                        <MonthPicker allowClear={false} style={{ marginLeft: '16px', width: '120px' }} format={Common.monthFormat} onChange={this.datePicker} />
                        <Button icon='download' title="导出考勤数据" onClick={this.xlsExport} style={{ marginLeft: '14px' }} />
                        <Search placeholder="查询" style={{ width: '120px', marginLeft: '16px', float: 'right' }} value={this.state.filterValue} onChange={this.onFilterRecord} />
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={arrRecordSet} scroll={{ x: colWidth, y: 600 }} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                </div>
                <XlsDown ref='xls' />
            </div>
        );
    }
});

module.exports = UserPosPage;
