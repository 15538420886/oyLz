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
var CheckQueryStore = require('./data/CheckQueryStore');
var CheckQueryActions = require('./action/CheckQueryActions');

import CodeMap from '../../../hr/lib/CodeMap';
var ProjContext = require('../../ProjContext');
import ProjCodeMap from '../../lib/ProjCodeMap';
import SelectMonth from '../../../lib/Components/SelectMonth';
import XlsDown from '../../../lib/Components/XlsDown';
import XlsTempFile from '../../../lib/Components/XlsTempFile';
var XlsConfig = require('../../lib/XlsConfig');

var tmonth = '' + Common.getMonth();
var filterValue = '';
var CheckQueryPage = React.createClass({
    getInitialState: function () {
        return {
            checkQuerySet: {
                recordSet: [],
                errMsg: ''
            },
            loading: false,
            viewType: '1',
            workMonth: tmonth,
            filter: '',
        }
    },

    mixins: [Reflux.listenTo(CheckQueryStore, "onServiceComplete"), ProjCodeMap(), CodeMap(), XlsTempFile()],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            checkQuerySet: data
        });
    },

    // 第一次加载
    componentDidMount: function () {
        var date = new Date();

        this.setState({
            loading: true,
            viewType: '1',
        });

        this.queryCheckQuery(tmonth);
    },

    // 选择日期
    onChangeDate: function (e) {
        var workMonth = e.target.value;
        this.queryCheckQuery(workMonth);

        this.setState({
            loading: true,
            workMonth: workMonth,
            selectedRowKeys: null,
        });
    },

    queryCheckQuery: function (chkDate) {
        var filter = {};
        if (chkDate !== null && chkDate !== '') {
            filter.fromDate = chkDate + '01';
            filter.toDate = chkDate + '31';
        } else {
            filter.fromDate = '';
            filter.toDate = '';
        }
        filter.chkProj = ProjContext.selectedProj.uuid;
        CheckQueryActions.retrieveCheckQuery(filter);
    },

    onChangeViewType: function (e) {
        CheckQueryActions.getCacheData()
        this.setState({
            loading: true,
            viewType: e.target.value
        });
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

        this.queryCheckQuery(chkDate);
    },

    showError: function (msg) {
        MsgActions.showError('user-chk-book', 'retrieve', msg);
    },

    // 表1工时
    getWorkHours: function (record) {
        var workhours = 0;
        for (var i = 0; i < record.chkList.length; i++) {
            var item = record.chkList[i];
            workhours = workhours + parseFloat(item.workHour);
        }
        return workhours;
    },

    // 表1加班工时
    getOverHours: function (record) {
        var overHours = 0;
        for (var i = 0; i < record.chkList.length; i++) {
            var item = record.chkList[i];
            if (item.dateType == '0') {
                overHours = overHours + parseFloat(item.overHour);
            }
        }
        return overHours;
    },

    // 表1节假日
    getOverHours3: function (record) {
        var overHours = 0;
        for (var i = 0; i < record.chkList.length; i++) {
            var item = record.chkList[i];
            if (item.dateType == '2') {
                overHours = overHours + parseFloat(item.overHour);
            }
        }
        return overHours;
    },

    // 表1周末
    getOverHours2: function (record) {
        var overHours = 0;
        for (var i = 0; i < record.chkList.length; i++) {
            var item = record.chkList[i];
            if (item.dateType == '1') {
                overHours = overHours + parseFloat(item.overHour);
            }
        }
        return overHours;
    },

    // 表1带薪假
    getLeaveHour: function (record) {
        var leaveHours = 0;
        for (var i = 0; i < record.chkList.length; i++) {
            var item = record.chkList[i];
            if (item.leaveType !== '事假' && item.leaveType !== '病假' && item.leaveType !== '其他无薪假期') {
                leaveHours = leaveHours + parseFloat(item.leaveHour);
            }
        }
        return leaveHours;
    },

    // 表1无薪假
    getLeaveHour2: function (record) {
        var leaveHours = 0;
        for (var i = 0; i < record.chkList.length; i++) {
            var item = record.chkList[i];
            if (item.leaveType == '事假' || item.leaveType == '病假' || item.leaveType == '其他无薪假期') {
                leaveHours = leaveHours + parseFloat(item.leaveHour);
            }
        }
        return leaveHours;
    },

    // 导出考勤数据
    xlsExport: function () {
        var data = [];
        var recordSet = this.state.checkQuerySet.recordSet;
        if(this.state.viewType === '1') {
            recordSet.map((check, ii) => {
                var r = {};
                r.staffCode = check.staffCode;
                r.perName = check.perName;
                r.posTime = check.posTime;
                r.deptName = check.deptName;
                r.manType = check.manType;
                r.workHours = this.getWorkHours(check);
                r.overHours = this.getOverHours(check);
                r.overHour2 = this.getOverHours2(check);
                r.overHour3 = this.getOverHours3(check);
                r.leaveHour = this.getLeaveHour(check);
                r.leaveHour2 = this.getLeaveHour2(check);
                data.push(r);
            });
            this.downXlsTempFile2(XlsConfig.checkMemberFields, data, this.refs.xls);

        } else  {
            var checkMemberFields = [
                { id: 'A', name: 'staffCode', title: '员工号'},
                { id: 'B', name: 'perName', title: '姓名' },
                { id: 'C', name: 'deptName', title: '部门'},
            ];
            var days = this.getDays();
            var zm="";
            for(var i=1;i<days+1;i++) {
                var r={};
                var m = i+67;
                zm=String.fromCharCode(m);
                switch (m){ 
                    case 91 : zm='AA';
                                break; 
                    case 92 : zm='AB'; 
                                break; 
                    case 93 : zm='AC'; 
                                break; 
                    case 94 : zm='AD'; 
                                break; 
                    case 95 : zm='AE';
                                break;
                    case 96 : zm='AF';
                                break;
                    case 97 : zm='AG';
                                break;
                    case 98 : zm='AH';
                                break;
                    default :  break; 
                } 
                i = (i < 10) ? '0' + i : '' + i;
                r.id = zm;
                r.name = i;
                r.title = i;
                checkMemberFields.push(r);
            }
            this.downXlsTempFile2(checkMemberFields, recordSet, this.refs.xls);
        }      
    },

    // 获取当月天数
    getDays:function(){
        var year = this.state.workMonth.substr(0, 4);
        var month = this.state.workMonth.substr(4, 2);
        var d = new Date(year, month, 0);
        var days = d.getDate();
        return days;
    },

    render: function () {
        var recordSet = Common.filter(this.state.checkQuerySet.recordSet, this.state.filterValue);
        var columns = [];
        var days = this.getDays();
        if (this.state.viewType === '1') {
            columns = [
                {
                    title: '员工号',
                    dataIndex: 'staffCode',
                    key: 'staffCode',
                    width: 140,
                },
                {
                    title: '姓名',
                    dataIndex: 'perName',
                    key: 'perName',
                    width: 140,
                },
                {
                    title: '部门',
                    dataIndex: 'deptName',
                    key: 'deptName',
                    width: 140,
                },
                {
                    title: '类型',
                    dataIndex: 'manType',
                    key: 'manType',
                    width: 140,
                },
                {
                    title: '工时',
                    dataIndex: 'workHours',
                    key: 'workHours',
                    width: 140,
                    render: (text, record) => (this.getWorkHours(record)),
                },
                {
                    title: '加班',
                    dataIndex: 'overHours',
                    key: 'overHours',
                    width: 140,
                    render: (text, record) => (this.getOverHours(record)),
                },
                {
                    title: '周末',
                    dataIndex: 'overHour2',
                    key: 'overHour2',
                    width: 140,
                    render: (text, record) => (this.getOverHours2(record)),
                },
                {
                    title: '节假日',
                    dataIndex: 'overHour3',
                    key: 'overHour3',
                    width: 140,
                    render: (text, record) => (this.getOverHours3(record)),
                },
                {
                    title: '带薪假',
                    dataIndex: 'leaveHour',
                    key: 'leaveHour',
                    width: 140,
                    render: (text, record) => (this.getLeaveHour(record)),
                },
                {
                    title: '无薪假',
                    dataIndex: 'leaveHour2',
                    key: 'leaveHour2',
                    width: 140,
                    render: (text, record) => (this.getLeaveHour2(record)),
                },
            ];
        } else if (this.state.viewType === '2') {
            columns = [
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

        } else if (this.state.viewType === '3') {
            columns = [
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
        }
        var cs = Common.getCardMargin(this);
        var colWidth = days * 120 + 340;
        if (this.state.viewType === '1') {
            colWidth = 0;
        }

        if (this.state.viewType === '2') {
            for (var i = 0; i < recordSet.length; i++) {
                var item = recordSet[i];
                for (var j = 0; j < item.chkList.length; j++) {
                    var itemList = item.chkList[j];
                    var k = itemList.chkDate.substr(6, 2);
                    var workHour = itemList.workHour;
                    if (workHour === '0') {
                        workHour = '';
                    }

                    if (itemList.overHour != '0') {
                        if (workHour === '') {
                            workHour = '【加】' + parseFloat(itemList.overHour);
                        }
                        else {
                            workHour = workHour + ';' + '【加】' + parseFloat(itemList.overHour);
                        }
                    }

                    if (itemList.leaveHour != '0') {
                        if (workHour === '') {
                            workHour = '【休】' + parseFloat(itemList.leaveHour);
                        }
                        else {
                            workHour = workHour + ';' + '【休】' + parseFloat(itemList.leaveHour);
                        }
                    }

                    item[k] = workHour;
                }
            }
        } else if (this.state.viewType === '3') {
            for (var i = 0; i < recordSet.length; i++) {
                var item = recordSet[i];
                for (var j = 0; j < item.chkList.length; j++) {
                    var itemList = item.chkList[j];
                    var k = itemList.chkDate.substr(6, 2);

                    var check = '';
                    var checkIn = itemList.checkIn;
                    var checkOut = itemList.checkOut;
                    if (checkIn !== undefined && checkIn !== null && checkIn !== '') {
                        check = checkIn.substr(0, 5);
                    }

                    if (checkOut !== undefined && checkOut !== null && checkOut !== '') {
                        check = check + '~' + checkOut.substr(0, 5);
                    }

                    item[k] = check;
                }
            }
        }

        return (
            <div className='grid-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['user-chk-book/retrieve']} />
                    <div className='toolbar-table'>
                        <SelectMonth value={this.state.workMonth} onChange={this.onChangeDate} />
                        <MonthPicker allowClear={false} style={{ marginLeft: '16px', width: '120px' }} format={Common.monthFormat} onChange={this.datePicker} />
                        <Button icon='download' title="导出考勤数据" onClick={this.xlsExport} style={{marginLeft: '14px'}}/>
                        <div style={{ float: 'right' }}>
                            <RadioGroup value={this.state.viewType} style={{ marginLeft: '16px' }} onChange={this.onChangeViewType}>
                                <RadioButton value="1"><Icon type='bars' /></RadioButton>
                                <RadioButton value="2"><Icon type='credit-card' /></RadioButton>
                                <RadioButton value="3"><Icon type='check-square-o' /></RadioButton>
                            </RadioGroup>
                        </div>
                        <Search placeholder="查询" style={{ width: '120px', marginLeft: '16px', float: 'right' }} value={this.state.filterValue} onChange={this.onFilterRecord} />
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} scroll={{ x: colWidth, y: 600 }} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                </div>
                <XlsDown ref='xls' />
            </div>
        );
    }
});

module.exports = CheckQueryPage;

