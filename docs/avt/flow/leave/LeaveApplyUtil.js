'use strict';
import React from 'react';
import { Form, Input, Select, Col } from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

module.exports = {
    isHourLeave: function(leaveType){
        return (leaveType === 'annual' || leaveType === 'dayoff');
    },

    changeRemnantValue: function (obj, id, value) {
        if (value !== '') {
            value = '' + parseInt(value);
            var msg = Common.checkDataType(value, 'number');
            if (msg !== '' && msg !== undefined) {
                return msg;
            }
        }
        var id = id ? id : '' ;
        var pos = id.indexOf('_');
        if (pos > 0) {
            var name = id.substr(0, pos);
            var idx = id.substr(pos + 1);

            var dn = obj[name] ? obj[name] : '';
            var dn2 = '0';
            pos = dn.indexOf('.');
            if (pos >= 0) {
                dn2 = dn.substr(pos + 1);
                dn = dn.substr(0, pos);
            }
            else if (dn === '') {
                dn = '0';
            }

            if (idx === '1') {
                if (parseInt(value) > 365) {
                    return '输入0~365';
                }

                dn = value;
            }
            else {
                if (parseInt(value) > 7) {
                    return '请输入0~7';
                }

                dn2 = value;
            }

            if (dn2 === '' || dn2 === '0') {
                obj[name] = dn;
            }
            else {
                obj[name] = dn + '.' + dn2;
            }
        }
        else {
            if (parseInt(value) > 365) {
                return '输入0~365';
            }

            obj[id] = value;
        }

        return '';
    },
    isLeaveValid: function (page) {
        var leaveType = page.state.leaveType;
        var remnant1 = '0';
        var remnant2 = '0';
        if (page.state.leave && page.state.leave[leaveType]) {
            remnant1 = page.state.leave[leaveType];
        }

        if (this.isHourLeave(leaveType)) {
            var pos = remnant1.indexOf('.');
            if (pos > 0) {
                remnant2 = remnant1.substr(pos + 1);
                remnant1 = remnant1.substr(0, pos);
            }
        }

        var r1 = parseInt(remnant1);
        var r2 = parseInt(remnant2);

        var h = page.state.leaveApply.accruedHour;
        var d = page.state.leaveApply.accruedDay;
        var h1 = parseInt(h);
        var d1 = parseInt(d);

        if (r1 < d1) {
            return '申请休假时间超过剩余假期';
        }
        else if (r1 === d1 && r2 < h1) {
            return '申请休假时间超过剩余假期';
        }
    },

    getRemnantFields: function (page) {
        var leaveType = page.state.leaveType;
        var remnant1 = '0';
        var remnant2 = '0';
        if(page.state.leave && page.state.leave[leaveType]){
            remnant1 = page.state.leave[leaveType] ;
        }

        var bfFields = [];
        if (this.isHourLeave(leaveType)) {
            var bf1 = '0', bf2 = '0';
            var pos = remnant1.indexOf('.');
            if (pos > 0) {
                bf1 = remnant1.substr(0, pos);
                bf2 = remnant1.substr(pos + 1);
            }
            else {
                bf1 = remnant1;
            }

            bfFields.push(
                <Col className="gutter-row" span={10}>
                    <InputGroup compact>
                        <Input style={{ width: '60%' }} type="text" name="remnant1_1" id="remnant1_1" value={bf1} readOnly={true} />
                        <Input style={{ width: '40%', textAlign: 'center' }} className="gutter-row" defaultValue="天" readOnly={true} />
                    </InputGroup>
                </Col>
            );
            bfFields.push(
                <Col className="gutter-row" span={14}>
                    <InputGroup compact style={{ margin: '0 0 0 6px' }}>
                        <Input style={{ width: '60%' }} type="text" name="remnant1_2" id="remnant1_2" value={bf2} readOnly={true} />
                        <Input style={{ width: '40%', textAlign: 'center' }} className="gutter-row" defaultValue="小时" readOnly={true} />
                    </InputGroup>
                </Col>
            );
        }
        else {
            bfFields.push(<Input type="text" name="remnant" id="remnant" value={remnant1} disabled={true} />);
        }

        return { bfFields: bfFields };
    },

    //  计算时间差
    getTimeDiff: function (t1, t2, h1, h2) {
        if (h1 < 9) h1 = 9;
        if (h1 > 18) h1 = 18;
        if (h2 < 9) h2 = 9;
        if (h2 > 18) h2 = 18;

        //相差天数
        var st = t1.substr(0, 4) + '/' + t1.substr(4, 2) + '/' + t1.substr(6, 2) + ' 00:00';
        var et = t2.substr(0, 4) + '/' + t2.substr(4, 2) + '/' + t2.substr(6, 2) + ' 00:00';
        var date1 = new Date(st);
        var date2 = new Date(et);
        var date3 = date2.getTime() - date1.getTime()
        var days = Math.floor(date3 / (24 * 3600 * 1000)) - 1;

        // 时间
        var t1 = 18 - h1;
        if (h1 <= 12) t1 = t1 - 1;
        if (t1 >= 8) {
            t1 = 0;
            days = days + 1;
        }

        var t2 = h2 - 9;
        if (h2 > 12) t2 = t2 - 1;
        if (t2 >= 8) {
            t2 = 0;
            days = days + 1;
        }

        var hours = t1 + t2;
        if (hours >= 8) {
            hours = hours - 8;
            days = days + 1;
        }

        var obj = { days: days, hours: hours};
        return obj;
    },
    calcLeafDays: function (leaveApply) {
        var beginDate = leaveApply.beginDate ? leaveApply.beginDate : '';
        var endDate = leaveApply.endDate ? leaveApply.endDate : '';
        var beginHour = leaveApply.beginHour ? leaveApply.beginHour : '';
        var endHour = leaveApply.endHour ? leaveApply.endHour : '';
        if (beginDate !== '' && endDate !== '' && beginHour !== '' && endHour !== '') {
            var timeDiff = this.getTimeDiff(beginDate, endDate, parseInt(beginHour), parseInt(endHour));
            leaveApply.accruedDay = timeDiff.days + '';
            leaveApply.accruedHour = timeDiff.hours + '';
        }
    },
    // 休假日志
    getRemnantFields2: function (page) {
        var leaveType = page.state.leaveType;
        var remnant1 = page.state.leave? page.state.leave[leaveType]:'0';
        var hints = page.state.hints;

        var bfFields = [];
        var spendFields = [];
        var readOnlySpendFields = [];
        if (this.isHourLeave(leaveType)) {
            var bf1 = '0', bf2 = '0';
            var pos = remnant1? remnant1.indexOf('.'):'0';
            if (pos > 0) {
                bf1 = remnant1.substr(0, pos);
                bf2 = remnant1.substr(pos + 1);
            }
            else {
                bf1 = remnant1;
            }

            bfFields.push(
                <Col className="gutter-row" span={10}>
                    <InputGroup compact>
                        <Input style={{ width: '70%' }} type="text" name="remnant_day" id="remnant1_1" value={bf1} readOnly={true} />
                        <Input style={{ width: '30%', textAlign: 'center' }} className="gutter-row" defaultValue="天" readOnly={true} />
                    </InputGroup>
                </Col>
            );
            bfFields.push(
                <Col className="gutter-row" span={12}>
                    <InputGroup compact style={{ margin: '0 8px 0 8px' }}>
                        <Input style={{ width: '60%' }} type="text" name="remnant_hour" id="remnant1_2" value={bf2} readOnly={true} />
                        <Input style={{ width: '40%', textAlign: 'center' }} className="gutter-row" defaultValue="小时" readOnly={true} />
                    </InputGroup>
                </Col>
            );
        }
        else {
            bfFields.push(<Input type="text" name="remnant" id="remnant_" value={remnant1} readOnly={true} />);
        }

        if (this.isHourLeave(leaveType)) {
            spendFields.push(
                <Col className="gutter-row" span={13}>
                    <FormItem help={hints.accruedDayHint} validateStatus={hints.accruedDayStatus}>
                        <InputGroup compact>
                            <Input style={{ width: '70%' }} type="text" name="accruedDay" id="accruedDay" value={page.state.leaveApply.accruedDay} onChange={page.handleOnChange} readOnly={false}/>
                            <Input style={{ width: '30%', textAlign: 'center' }} className="gutter-row" defaultValue="天" readOnly={true} />
                        </InputGroup>
                    </FormItem>
                </Col>
            );
            spendFields.push(
                <Col span={11}>
                    <FormItem help={hints.accruedHourHint} validateStatus={hints.accruedHourStatus} style={{ margin: '0 0 0 8px' }}>
                        <InputGroup compact>
                            <Input style={{ width: '50%' }} type="text" name="accruedHour" id="accruedHour" value={page.state.leaveApply.accruedHour} onChange={page.handleOnChange} readOnly={false}/>
                            <Input style={{ width: '50%', textAlign: 'center' }} className="gutter-row" defaultValue="小时" readOnly={true} />
                        </InputGroup>
                    </FormItem>
                </Col>
            );

            readOnlySpendFields.push(
                <Col className="gutter-row" span={13}>
                    <FormItem help={hints.accruedDayHint} validateStatus={hints.accruedDayStatus}>
                        <InputGroup compact>
                            <Input style={{ width: '70%' }} type="text" name="accruedDay" id="accruedDay" value={page.state.leaveApply.accruedDay} readOnly={true} />
                            <Input style={{ width: '30%', textAlign: 'center' }} className="gutter-row" defaultValue="天" readOnly={true} />
                        </InputGroup>
                    </FormItem>
                </Col>
            );
            readOnlySpendFields.push(
                <Col span={11}>
                    <FormItem help={hints.accruedHourHint} validateStatus={hints.accruedHourStatus} style={{ margin: '0 0 0 8px' }}>
                        <InputGroup compact>
                            <Input style={{ width: '50%' }} type="text" name="accruedHour" id="accruedHour" value={page.state.leaveApply.accruedHour} readOnly={true} />
                            <Input style={{ width: '50%', textAlign: 'center' }} className="gutter-row" defaultValue="小时" readOnly={true} />
                        </InputGroup>
                    </FormItem>
                </Col>
            );
        }
        else {
            spendFields.push(
                <Col className="gutter-row" span={24}>
                    <FormItem help={hints.accruedDayHint} validateStatus={hints.accruedDayStatus}>
                        <InputGroup compact>
                            <Input style={{ width: '80%' }} type="text" name="accruedDay" id="accruedDay" value={page.state.leaveApply.accruedDay} onChange={page.handleOnChange} readOnly={false}/>
                            <Input style={{ width: '20%', textAlign: 'center' }} className="gutter-row" defaultValue="天" readOnly={true} />
                        </InputGroup>
                    </FormItem>
                </Col>
            );
            readOnlySpendFields.push(
                <Col className="gutter-row" span={24}>
                    <FormItem help={hints.accruedDayHint} validateStatus={hints.accruedDayStatus}>
                        <InputGroup compact>
                            <Input style={{ width: '80%' }} type="text" name="accruedDay" id="accruedDay" value={page.state.leaveApply.accruedDay} readOnly={true} />
                            <Input style={{ width: '20%', textAlign: 'center' }} className="gutter-row" defaultValue="天" readOnly={true} />
                        </InputGroup>
                    </FormItem>
                </Col>
            );
        }

        return { bfFields: bfFields, spendFields: spendFields, readOnlySpendFields: readOnlySpendFields };
    },

}
