'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
import ModalForm from '../../../lib/Components/ModalForm';
var Utils = require('../../../public/script/utils');
import { Form, Row, Col, Input, Icon, Table, DatePicker, Button, Radio, Spin } from 'antd';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
var CheckQueryStore = require('./data/CheckQueryStore');
var CheckQueryActions = require('./action/CheckQueryActions');

var HolidayStore = require('../../../hr/holiday/data/HolidayStore');
var HolidayActions = require('../../../hr/holiday/action/HolidayActions');
var newDateArr = [];

var CheckQueryPage = React.createClass({
    getInitialState: function () {
        return {
            checkQuerySet: {
                checkQuery: {},
                operation: '',
                errMsg: ''
            },
            loading: false,
            noneDate: false,
            year: '',
            month: "",
            monthTime: '',
            date: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            table: [],
            holidayMap: {},
            filter: {},


        }
    },

    mixins: [Reflux.listenTo(CheckQueryStore, "onServiceComplete"),
    Reflux.listenTo(HolidayStore, "onServiceComplete1"), ModalForm('user-chk-book')],
    onServiceComplete: function (data) {
        var date = this.state.date;
        var year = this.state.year;
        date[1] = (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0) ? 29 : 28;

        if (data.operation === 'retrieve' && data.errMsg === "") {
            this.setState({
                loading: true,
                noneDate: false,
                checkQuerySet: data
            });

            var year = this.state.year;
            HolidayActions.initHoliday(year);

        } else {
            this.setState({
                noneDate: true,
            });
        };
    },

    onServiceComplete1: function (data) {
        var holidayMap = {};
        if (data.recordSet.length != 0) {
            data.recordSet.map((nd, i) => {
                holidayMap[nd.date] = nd.flag;
            });
        }

        this.createTable(holidayMap);
        this.setState({
            loading: false,
            holidayMap: holidayMap
        });
    },
    // 第一次加载
    componentDidMount: function () {
        var filter = {};

        var dateString = newDateArr[0];
        var year = dateString.substr(0, 4);

        var tenStation = dateString.substr(4, 1)
        if (tenStation == 1) {
            var month = dateString.substr(4, 2)
        } else if (tenStation == 0) {
            var month = dateString.substr(5, 1)
        };

        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.staffCode = window.loginData.compUser.userCode;
        filter.fromDate = dateString + "01";
        filter.toDate = dateString + "31";
        CheckQueryActions.retrieveCheckQuery(filter);

        this.setState({
            loading: true,
            filter: filter,
            year: year,
            month: month,
            monthTime: dateString
        });

    },


    onChangeView: function (e) {
        var filter = {};

        var dateString = e.target.value;
        var year = dateString.substr(0, 4);

        var tenStation = dateString.substr(4, 1)
        if (tenStation == 1) {
            var month = dateString.substr(4, 2)
        } else if (tenStation == 0) {
            var month = dateString.substr(5, 1)
        }

        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.staffCode = window.loginData.compUser.userCode;

        filter.fromDate = dateString + "01";
        filter.toDate = dateString + "31";

        CheckQueryActions.initCheckQuery(filter);

        this.setState({
            loading: true,
            filter: filter,
            year: year,
            month: month,
            monthTime: dateString
        });

    },

    createTable: function (holidayMap) {
        var checkQuery = this.state.checkQuerySet.checkQuery;
        var date = this.state.date;
        var year = this.state.year;
        var month = parseInt(this.state.month);
        var tables = [];
        // s数据
        var checkLogList = checkQuery.list;
        var posMap = {};

        // --排序日期--
        checkLogList.sort(function (a, b) {
            return parseInt(a.chkDate.replace(/-/g, ''), 10) - parseInt(b.chkDate
                .replace(/-/g, ''), 10);
        });

        for (var i = 0; i < checkLogList.length; i++) {
            var chkDate = checkLogList[i].chkDate;

            if (chkDate.length == 8) {
                var ym = chkDate.substr(4, 2) + chkDate.substr(6, 2);

            } else if (chkDate.length == 10) {
                var ym = chkDate.substr(5, 2) + chkDate.substr(8, 2);
            };

            if (!posMap[ym]) {
                posMap[ym] = [checkLogList[i]]
            } else {
                var list = checkLogList[i];
                posMap[ym].push(list);
            };

        };

        if (month != null) {
            var key = month - 1;
            date = date[key]
        };

        let week = this.weekFunc(year, month, 1) === 0 ? 7 : this.weekFunc(year, month, 1);
        let row = Math.ceil((date + week - 1) / 7);
        var list = [];
        for (var ri = 0; ri < row; ri++) {
            var cells = [];
            for (let i = 1; i < 8; i++) {
                let td = ''
                let day = ri * 7 + i - week + 1;
                if (day > date || day < 1) {
                    td = <td style={{ textAlign: 'left', border: '1px solid #ccc', margin: '0 4px 4px 4px' }} ></td>;
                }
                else {
                    // 生成天数，确定颜色 
                    var color = '';
                    var border = '';
                    let date = "" + (month > 9 ? month : "0" + month) + (day > 9 ? day : "0" + day);
                    var flag = holidayMap[date];
                    if (flag === '1') {
                        color = 'red';
                    }
                    else if (flag === '2') {
                        color = 'rgb(255, 187, 0)';
                        border = '1px solid rgb(255, 187, 0)';
                    };

                    // 取数据
                    //单元格显示：
                    // projName(checkIn ~ checkOut)
                    // 工时(workHour)，leaveType(leaveHour)，加班(overHour)
                    // 注：workHour，leaveHour，overHour为空时不显示
                    var obj = posMap[date];
                    var time1 = [];
                    if (typeof (obj) != "undefined") {
                        obj.map((item, i) => {
                            var projChk = (
                                <div style={{ width: '100%' }}>
                                    <div>{item.projName}</div>
                                    <div> {
                                        (item.checkIn == null && item.checkOut == null) ? (" (" + '' + ")") :
                                            ("(" +
                                                (item.checkIn == null ? '' : item.checkIn) + "~" + (item.checkOut == null ? '' : item.checkOut)
                                                + ")"
                                            )}</div>
                                </div>
                            );

                            var splitChar = null;
                            var workHour = null;
                            if (item.workHour && item.workHour !== '0') {
                                workHour = (
                                    <span>
                                        工时&nbsp;({item.workHour})
                                    </span>
                                );
                                splitChar = '；';
                            }

                            var leaveHour = null;
                            if (item.leaveHour && item.leaveHour !== '0') {
                                leaveHour = (
                                    <span style={{ color: 'blue' }}>
                                        {splitChar}{item.leaveType}&nbsp;({item.leaveHour})
                                    </span>
                                );
                                splitChar = '；';
                            }

                            var overHour = null;
                            if (item.overHour && item.overHour !== '0') {
                                overHour = (
                                    <span style={{color:'red' }}>
                                        {splitChar}加班&nbsp;({item.overHour})
                                    </span>
                                );
                                splitChar = '；';
                            }

                            time1.push(<p style={{ paddingTop: "8px", paddingRight: "8px", width: '100%', color: "rgba(0,0,0,.65)" }} >
                                {projChk}
                                {workHour}
                                {leaveHour}
                                {overHour}
                            </p>)
                        })

                    };

                    td = <td key={date} style={{ position: 'relative', color: color, border: '1px solid #ccc' }}>
                        <span style={{ position: 'absolute', top: '2px', left: '4px', width: '20px', height: '20px' }}><p style={{ color: color, border: border }}>{day}</p></span>
                        <div style={{ maxHeight: '100px', overflow: 'hidden', margin: '-10px 6px -10px 6px' }}>
                            {time1}
                        </div>
                    </td>;
                }
                cells.push(td)
            };
            list.push(<tr key={ri} style={{ height: '50px' }}>
                {cells}
            </tr>)
        };
        tables.push(<div style={{ margin: '0 20px 0 0', float: 'left', width: "100%", height: '500px' }}><table style={{ width: "100%", height: '500px' }}><tbody>
            <tr key='row.0' style={{ height: '30px' }}>
                <td key='1' style={{ width: '14.28%', textAlign: 'center', border: '1px solid #ccc' }}>一</td>
                <td key='2' style={{ width: '14.28%', textAlign: 'center', border: '1px solid #ccc' }}>二</td>
                <td key='3' style={{ width: '14.28%', textAlign: 'center', border: '1px solid #ccc' }}>三</td>
                <td key='4' style={{ width: '14.28%', textAlign: 'center', border: '1px solid #ccc' }}>四</td>
                <td key='5' style={{ width: '14.28%', textAlign: 'center', border: '1px solid #ccc' }}>五</td>
                <td key='6' style={{ width: '14.28%', textAlign: 'center', border: '1px solid #ccc' }}>六</td>
                <td key='7' style={{ width: '14.28%', textAlign: 'center', border: '1px solid #ccc' }}>日</td>
            </tr>
            {list}
        </tbody></table></div>);

        this.setState({ table: tables });
    },

    //计算周几函数
    weekFunc: function (y, m, d) {
        //w=y+[y/4]+[c/4]-2c+[26(m+1)/10]+d-1 
        let year = y % 100;
        let century = Math.ceil(y / 100) - 1;
        let month = m;
        if (m < 3) {
            month = month + 12;
            year = (y - 1) % 100;
            century = Math.ceil((y - 1) / 100) - 1;
        }
        let week = (year + Math.floor(year / 4)
            + Math.floor(century / 4)
            - 2 * century
            + Math.floor(26 * (month + 1) / 10)
            + d - 1) % 7;
        if (week < 0) {
            week = week + 7;
        }

        return week;
    },

    render: function () {
        var d = new Date();
        var year = d.getFullYear();
        var mon = d.getMonth() + 1;
        if (mon < 10) {
            mon = "0" + mon;
        }
        for (var n = 0; n <= 5; n++) {

            var totalMon = mon - n;
            var newYear;
            var newMon;

            if (totalMon < 1) {
                newYear = year - 1;
                newMon = 12 + totalMon;
            } else {
                newYear = year - Math.floor(totalMon / 12);
                newMon = totalMon % 12;

            }

            var newDate = newYear + "" + (newMon >= 10 ? newMon : ('0' + newMon));
            newDateArr.push(newDate)

        }

        var table = this.state.noneDate ? null : <Spin>{this.state.table}</Spin>;
        return (
            <div className='grid-page' style={{ width: '100%', padding: '20px 32px 20px 28px', overflowY: 'scroll' }}>
                <ServiceMsg ref='mxgBox' svcList={['user-chk-book/retrieve_p']} />
                <RadioGroup value={this.state.monthTime} onChange={this.onChangeView}>
                    <RadioButton value={newDateArr[5]}>{newDateArr[5]}</RadioButton>
                    <RadioButton value={newDateArr[4]}>{newDateArr[4]}</RadioButton>
                    <RadioButton value={newDateArr[3]}>{newDateArr[3]}</RadioButton>
                    <RadioButton value={newDateArr[2]}>{newDateArr[2]}</RadioButton>
                    <RadioButton value={newDateArr[1]}>{newDateArr[1]}</RadioButton>
                    <RadioButton value={newDateArr[0]}>{newDateArr[0]}</RadioButton>
                </RadioGroup>
                <div style={{ marginTop: '20px', width: '100%' }}>
                    {this.state.loading ? table : this.state.table}
                </div>
            </div>
        );
    }
});

module.exports = CheckQueryPage;

