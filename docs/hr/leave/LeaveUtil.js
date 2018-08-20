'use strict';
import React from 'react';
import { Form, Input, Select, Col } from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');

module.exports = {
    isHourLeave: function(leaveType){
        return (leaveType === 'annual' || leaveType === 'dayoff');
    },
    getRemnant: function (oldValue, accrued, isSub) {
        if (accrued === '' || accrued === '0' || oldValue === undefined) {
            return oldValue;
        }
        var oldValue = oldValue ? oldValue : "0";
        var di = oldValue;
        var df = '0';
        var pos = oldValue.indexOf('.');
        if (pos >= 0) {
            di = oldValue.substr(0, pos);
            df = oldValue.substr(pos+1);
        }

        var di2 = accrued;
        var df2 = '0';
        pos = accrued.indexOf('.');
        if (pos >= 0) {
            di2 = accrued.substr(0, pos);
            df2 = accrued.substr(pos+1);
        }

        var dn1 = 0;
        var dn2 = 0;
        if (isSub) {
            dn1 = parseInt(di) - parseInt(di2);
            dn2 = parseInt(df) - parseInt(df2);
            if (dn2 < 0) {
                dn1 = dn1 - 1;
                dn2 = dn2 + 8;
            }
        }
        else {
            dn1 = parseInt(di) + parseInt(di2);
            dn2 = parseInt(df) + parseInt(df2);
            if (dn2 >= 8) {
                dn1 = dn1 + 1;
                dn2 = dn2 - 8;
            }
        }

        if (dn2 === 0) {
            return '' + dn1;
        }

        return '' + dn1 + '.' + dn2;
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
    remnantCompare: function (leaveType, remnant, spendDay, spendHour) {
        var remnant = remnant? remnant:'0';
        var di = remnant;
        var df = '0';
        var pos = remnant.indexOf('.');
        if (pos >= 0) {
            di = remnant.substr(0, pos);
            df = remnant.substr(pos + 1);
        }

        var dt = parseInt(di) - parseInt(spendDay);
        if (dt > 0) {
            return 1;
        }
        else if (dt < 0) {
            return -1;
        }

        if (this.isHourLeave(leaveType)) {
            var dt2 = parseInt(df) - parseInt(spendHour);
            if (dt2 > 0) {
                return 1;
            }
            else if (dt2 < 0) {
                return -1;
            }
        }

        return 0;
    },
    // 计算抵扣
    calcDetail: function (recordSet, leaveType, spendDay, spendHour) {
        // console.log('calcDetail', recordSet, leaveType, spendDay, spendHour);
        recordSet.map((record, i) => {
            record.spendDay.value = '0';
            record.spendDay.oldValue = '0';
            record.spendHour.value = '0';
            record.spendHour.oldValue = '0';
        });

        var len = recordSet.length;
        if (this.isHourLeave(leaveType)) {
            var sDay = parseInt(spendDay);
            var sHour = parseInt(spendHour);

            // 抵扣天和小时
            for (var i = 0; i < len; i++) {
                var record = recordSet[i];
                var remnant = record.remnant ? record.remnant: '0' ;   // 剩余天数

                var di = remnant;
                var df = '0';
                var pos = remnant.indexOf('.');
                if (pos >= 0) {
                    di = remnant.substr(0, pos);
                    df = remnant.substr(pos + 1);
                }

                var dt = parseInt(di) - sDay;
                var dt2 = parseInt(df) - sHour;

                if (dt > 0 || (dt === 0 && dt2 >= 0)) {
                    record.spendDay.value = '' + sDay;
                    record.spendDay.oldValue = '' + sDay;
                    record.spendHour.value = '' + sHour;
                    record.spendHour.oldValue = '' + sHour;
                    break;
                }

                // 不够抵扣
                record.spendDay.value = di;
                record.spendDay.oldValue = di;
                record.spendHour.value = df;
                record.spendHour.oldValue = df;

                sDay = -dt;
                sHour = -dt2;
                if (sHour < 0) {
                    sDay = sDay - 1;
                    sHour = 8 + sHour;
                }
            }
        }
        else {
            var sDay = parseInt(spendDay);

            // 抵扣天
            for (var i = 0; i < len; i++) {
                var record = recordSet[i];
                var remnant = record.remnant;   // 剩余天数
                var dt = parseInt(remnant) - sDay;
                if (dt >= 0) {
                    record.spendDay.value = '' + sDay;
                    record.spendDay.oldValue = '' + sDay;
                    break;
                }
                else {
                    // 不够抵扣
                    record.spendDay.value = remnant;
                    record.spendDay.oldValue = remnant;
                    sDay = -dt;
                }
            }
        }
    },
    // 取抵扣日志
    getModifyDetails: function (recordSet, leaveType) {
        var modList = [];
        var succ = true;

        if (this.isHourLeave(leaveType)) {
            recordSet.map((record, i) => {
                var spendDay = record.spendDay;
                var spendHour = record.spendHour;
                if (spendDay.value !== '0' || spendHour.value !== '0') {
                    var accrued = record.accrued;   // 应计天数
                    var spend = record.spend;       // 已修天数
                    var remnant = record.remnant ? record.remnant : '0' ;   // 剩余天数

                    var sDay = parseInt(spendDay.value);
                    var sHour = parseInt(spendHour.value);

                    // 计算剩余天数
                    var di = remnant;
                    var df = '0';
                    var pos = remnant.indexOf('.');
                    if (pos >= 0) {
                        di = remnant.substr(0, pos);
                        df = remnant.substr(pos + 1);
                    }

                    var dt = parseInt(di) - sDay;
                    var dt2 = parseInt(df) - sHour;
                    if (dt2 < 0) {
                        dt = dt - 1;
                        dt2 = 8 + dt2;
                    }

                    if (dt < 0) {
                        succ = false;
                        Common.infoMsg('抵扣天数[' + sDay + '][' + sHour + '][' + remnant + ']不足');
                        return null;
                    }

                    if (dt2 > 0) {
                        remnant = '' + dt + '.' + dt2;
                    }
                    else {
                        remnant = '' + dt;
                    }

                    // 计算已修天数
                    if (spend === null || spend === '') {
                        spend = '0';
                    }

                    var di2 = spend;
                    var df2 = '0';
                    pos = spend.indexOf('.');
                    if (pos >= 0) {
                        di2 = spend.substr(0, pos);
                        df2 = spend.substr(pos + 1);
                    }

                    var st = parseInt(di2) + sDay;
                    var st2 = parseInt(df2) + sHour;
                    if (st2 >= 8) {
                        st = st + 1;
                        st2 = st2 - 8;
                    }

                    if (st2 > 0) {
                        spend = '' + st + '.' + st2;
                    }
                    else {
                        spend = '' + st;
                    }

                    var r = {};
                    Utils.copyValue(record, r);
                    r.remnant = remnant;
                    r.spend = spend;

                    r.spendDay = r.uuid + '=' + spendDay.value + '.' + spendHour.value;
                    r.spendHour = null;
                    modList.push(r);
                }
            });
        }
        else {
            recordSet.map((record, i) => {
                var spendDay = record.spendDay;
                if (spendDay.value !== '0') {
                    var accrued = record.accrued;   // 应计天数
                    var spend = record.spend;       // 已修天数
                    var remnant = record.remnant;   // 剩余天数

                    var sDay = parseInt(spendDay.value);
                    var dt = parseInt(remnant) - sDay;
                    if (dt < 0) {
                        succ = false;
                        Common.infoMsg('抵扣天数[' + sDay+ '][' + remnant + ']不足');
                        return null;
                    }

                    // 计算已修天数
                    if (spend === null || spend === '') {
                        spend = '0';
                    }

                    var r = {};
                    Utils.copyValue(record, r);
                    r.remnant = '' + dt;
                    r.spend = '' + (parseInt(spend) + sDay);

                    r.spendDay = r.uuid + '=' + spendDay.value;
                    r.spendHour = null;
                    modList.push(r);
                }
            });
        }

        return (succ ? modList : null);
    },
    restoreUpdateValue: function (record, logValue) {
        // 恢复修改前的数据
        var value = null;
        var values = logValue? logValue.split(";"):'';
        var len = values.length;
        for (var i = 0; i < len; i++) {
            var pos = values[i].indexOf(record.uuid);
            if (pos === 0) {
                pos = values[i].indexOf('=');
                if (pos > 0) {
                    value = values[i].substr(pos + 1);
                    break;
                }
            }
        }

        if (value === null) {
            return;
        }

        // console.log('value', value, record)
        var spend = record.spend;       // 已修天数
        var remnant = record.remnant;   // 剩余天数
        record.spend = this.getRemnant(spend, value, true);
        record.remnant = this.getRemnant(remnant, value, false);

        var day = value;
        var hour = '0';
        var pos = value.indexOf('.');
        if (pos > 0) {
            day = value.substr(0, pos);
            hour = value.substr(1+pos);
        }

        record.spendDay.value = day;
        record.spendDay.oldValue = day;
        record.spendHour.value = hour;
        record.spendHour.oldValue = hour;
        // console.log('record', value, record)
    },

    getRemnantFields: function (page) {
        var leaveType = page.state.leaveType;
        var remnant1 = '0';
        var remnant2 = '0';
        if(page.state.leave && page.state.leave[leaveType]){
            remnant1 = page.state.leave[leaveType] ;
        }
        if(page.state.leave2 && page.state.leave2[leaveType]){
            remnant2 = page.state.leave2[leaveType] ;
        }
        // console.log('page.state.leave2', page.state.leave2);

        var bfFields = [];
        var afFields = [];
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
                <Col className="gutter-row" span={5}>
                    <InputGroup compact>
                        <Input style={{ width: '60%' }} type="text" name="remnant1_1" id="remnant1_1" value={bf1} readOnly={true} />
                        <Input style={{ width: '40%', textAlign: 'center' }} className="gutter-row" defaultValue="天" readOnly={true} />
                    </InputGroup>
                </Col>
            );
            bfFields.push(
                <Col className="gutter-row" span={5}>
                    <InputGroup compact style={{ margin: '0 0 0 6px' }}>
                        <Input style={{ width: '60%' }} type="text" name="remnant1_2" id="remnant1_2" value={bf2} readOnly={true} />
                        <Input style={{ width: '40%', textAlign: 'center' }} className="gutter-row" defaultValue="小时" readOnly={true} />
                    </InputGroup>
                </Col>
            );

            var af1 = '0', af2 = '0';
            var pos = remnant2? remnant2.indexOf('.'):'0';
            if (pos > 0) {
                af1 = remnant2.substr(0, pos);
                af2 = remnant2.substr(pos + 1);
            }
            else {
                af1 = remnant2;
            }

            afFields.push(
                <Col className="gutter-row" span={5}>
                    <InputGroup compact>
                        <Input style={{ width: '60%' }} type="text" name={leaveType + "_1"} id={leaveType + "_1"} value={af1} onChange={page.handleOnChange2} />
                        <Input style={{ width: '40%', textAlign: 'center' }} className="gutter-row" defaultValue="天" readOnly={true} />
                    </InputGroup>
                </Col>
            );
            afFields.push(
                <Col className="gutter-row" span={5}>
                    <InputGroup compact style={{ margin: '0 0 0 6px' }}>
                        <Input style={{ width: '60%' }} type="text" name={leaveType + "_2"} id={leaveType + "_2"} value={af2} onChange={page.handleOnChange2} />
                        <Input style={{ width: '40%', textAlign: 'center' }} className="gutter-row" defaultValue="小时" readOnly={true} />
                    </InputGroup>
                </Col>
            );
        }
        else {
            bfFields.push(<Input type="text" name="remnant" id="remnant" value={remnant1} disabled={true} />);
            afFields.push(<Input type="text" name={leaveType} id={leaveType} value={remnant2} onChange={page.handleOnChange2} />);
        }

        return { bfFields: bfFields, afFields: afFields };
    },
    // 休假日志
    getRemnantFields2: function (page) {
        var leaveType = page.state.leaveType;
        var remnant1 = page.state.leave? page.state.leave[leaveType]:'0';
        var hints = page.state.hints;

        var bfFields = [];
        var spendFields = [];
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
                <Col className="gutter-row" span={12}>
                    <InputGroup compact>
                        <Input style={{ width: '70%' }} type="text" name="remnant_day" id="remnant1_1" value={bf1} readOnly={true} />
                        <Input style={{ width: '30%', textAlign: 'center' }} className="gutter-row" defaultValue="天" readOnly={true} />
                    </InputGroup>
                </Col>
            );
            bfFields.push(
                <Col className="gutter-row" span={12}>
                    <InputGroup compact style={{ margin: '0 0 0 8px' }}>
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
                <Col className="gutter-row" span={5}>
                    <FormItem help={hints.spendHint} validateStatus={hints.spendStatus}>
                        <InputGroup compact>
                            <Input style={{ width: '70%' }} type="text" name="spend" id="spend" value={page.state.leaveLog.spend} onChange={page.handleOnChange3} />
                            <Input style={{ width: '30%', textAlign: 'center' }} className="gutter-row" defaultValue="天" readOnly={true} />
                        </InputGroup>
                    </FormItem>
                </Col>
            );
            spendFields.push(
                <Col span={5}>
                    <FormItem help={hints.accruedHint} validateStatus={hints.accruedStatus} style={{ margin: '0 8px 0 8px' }}>
                        <InputGroup compact>
                            <Input style={{ width: '55%' }} type="text" name="accrued" id="accrued" value={page.state.leaveLog.accrued} onChange={page.handleOnChange3} />
                            <Input style={{ width: '45%', textAlign: 'center' }} className="gutter-row" defaultValue="小时" readOnly={true} />
                        </InputGroup>
                    </FormItem>
                </Col>
            );
        }
        else {
            spendFields.push(
                <Col className="gutter-row" span={10}>
                    <FormItem help={hints.spendHint} validateStatus={hints.spendStatus} style={{ margin: '0 8px 0 0' }}>
                        <InputGroup compact>
                            <Input style={{ width: '80%' }} type="text" name="spend" id="spend" value={page.state.leaveLog.spend} onChange={page.handleOnChange3} />
                            <Input style={{ width: '20%', textAlign: 'center' }} className="gutter-row" defaultValue="天" readOnly={true} />
                        </InputGroup>
                    </FormItem>
                </Col>
            );
        }

        return { bfFields: bfFields, spendFields: spendFields };
    },
    // 剩余天数
    getAccruedFields: function (page, spans) {
        var leaveType = page.state.leaveType;
        var accrued = page.state.detail.accrued ? page.state.detail.accrued : '';

        var accruedFields = [];
        if (leaveType === 'dayoff') {
            var bf1 = '0', bf2 = '0';
            var pos = accrued.indexOf('.');
            if (pos >= 0) {
                bf1 = accrued.substr(0, pos);
                bf2 = accrued.substr(pos + 1);
            }
            else if (accrued !== ''){
                bf1 = accrued;
            }

            var span1 = 5;
            if(spans !== undefined){
                span1 = spans[0];
            }
            accruedFields.push(
                <Col className="gutter-row" span={span1}>
                    <Input type="text" name="accrued_1" id="accrued_1" value={bf1} onChange={page.handleOnChange3} />
                </Col>
            );

            var span2 = 2;
            if(spans !== undefined){
                span2 = spans[1];
            }
            accruedFields.push(
                <Col className="gutter-row" span={span2}>
                    <div style={{ margin: '0 0 0 6px' }}>天</div>
                </Col>
            );

            var span3 = 4;
            if(spans !== undefined){
                span3 = spans[2];
            }
            accruedFields.push(
                <Col className="gutter-row" span={span3}>
                    <Input type="text" name="accrued_2" id="accrued_2" value={bf2} onChange={page.handleOnChange3} />
                </Col>
            );

            var span4 = 2;
            if(spans !== undefined){
                span4 = spans[3];
            }
            accruedFields.push(
                <Col className="gutter-row" span={span4}>
                    <div style={{ margin: '0 0 0 6px' }}>小时</div>
                </Col>
            );
        }
        else {
            accruedFields.push(<Input type="text" name="accrued" id="accrued" value={accrued} onChange={page.handleOnChange3} />);
        }

        return { accruedFields: accruedFields };
    },
    // 修改页面
    getAccruedFields2: function (page) {
        var leaveType = page.state.leaveType;
        var accrued = page.state.detail.accrued ? page.state.detail.accrued : '0';
        var spend = page.state.detail.spend ? page.state.detail.spend : '0';
        var remnant = page.state.detail.remnant ? page.state.detail.remnant : '0';

        var accruedFields = [];
        var spendFields = [];
        var remnantFields = [];
        if (leaveType === 'dayoff') {
            var bf1 = '0', bf2 = '0';
            var pos = accrued.indexOf('.');
            if (pos >= 0) {
                bf1 = accrued.substr(0, pos);
                bf2 = accrued.substr(pos + 1);
            }
            else if (accrued !== '') {
                bf1 = accrued;
            }

            accruedFields.push(
                <Col className="gutter-row" span={5}>
                    <Input type="text" name="accrued_1" id="accrued_1" value={bf1} onChange={page.handleOnChange3} />
                </Col>
            );
            accruedFields.push(
                <Col className="gutter-row" span={2}>
                    <div style={{ margin: '0 0 0 6px' }}>天</div>
                </Col>
            );
            accruedFields.push(
                <Col className="gutter-row" span={4}>
                    <Input type="text" name="accrued_2" id="accrued_2" value={bf2} onChange={page.handleOnChange3} />
                </Col>
            );
            accruedFields.push(
                <Col className="gutter-row" span={2}>
                    <div style={{ margin: '0 0 0 6px' }}>小时</div>
                </Col>
            );
        }
        else {
            accruedFields.push(<Input type="text" name="accrued" id="accrued" value={accrued} onChange={page.handleOnChange3} />);
        }

        if (this.isHourLeave(leaveType)) {
            var bf1 = '0', bf2 = '0';
            var pos = spend.indexOf('.');
            if (pos >= 0) {
                bf1 = spend.substr(0, pos);
                bf2 = spend.substr(pos + 1);
            }
            else if (spend !== '') {
                bf1 = spend;
            }

            spendFields.push(
                <Col className="gutter-row" span={5}>
                    <Input type="text" name="spend_1" id="spend_1" value={bf1} onChange={page.handleOnChange3} />
                </Col>
            );
            spendFields.push(
                <Col className="gutter-row" span={2}>
                    <div style={{ margin: '0 0 0 6px' }}>天</div>
                </Col>
            );
            spendFields.push(
                <Col className="gutter-row" span={4}>
                    <Input type="text" name="spend_2" id="spend_2" value={bf2} onChange={page.handleOnChange3} />
                </Col>
            );
            spendFields.push(
                <Col className="gutter-row" span={2}>
                    <div style={{ margin: '0 0 0 6px' }}>小时</div>
                </Col>
            );
        }
        else {
            spendFields.push(<Input type="text" name="spend" id="spend" value={spend} onChange={page.handleOnChange3} />);
        }

        if (this.isHourLeave(leaveType)) {
            var bf1 = '0', bf2 = '0';
            var pos = remnant.indexOf('.');
            if (pos >= 0) {
                bf1 = remnant.substr(0, pos);
                bf2 = remnant.substr(pos + 1);
            }
            else if (remnant !== '') {
                bf1 = remnant;
            }

            remnantFields.push(
                <Col className="gutter-row" span={5}>
                    <Input type="text" name="remnant_1" id="remnant_1" value={bf1} onChange={page.handleOnChange3} />
                </Col>
            );
            remnantFields.push(
                <Col className="gutter-row" span={2}>
                    <div style={{ margin: '0 0 0 6px' }}>天</div>
                </Col>
            );
            remnantFields.push(
                <Col className="gutter-row" span={4}>
                    <Input type="text" name="remnant_2" id="remnant_2" value={bf2} onChange={page.handleOnChange3} />
                </Col>
            );
            remnantFields.push(
                <Col className="gutter-row" span={2}>
                    <div style={{ margin: '0 0 0 6px' }}>小时</div>
                </Col>
            );
        }
        else {
            remnantFields.push(<Input type="text" name="remnant" id="remnant" value={remnant} onChange={page.handleOnChange3} />);
        }

        return { accruedFields: accruedFields, spendFields: spendFields, remnantFields: remnantFields };
    },
}
