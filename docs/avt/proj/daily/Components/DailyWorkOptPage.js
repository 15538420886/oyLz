import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Button, Input, Select, Tabs, Row, Col, Modal, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import ProjCodeMap from '../../../../proj/lib/ProjCodeMap';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var DailyWorkStore = require('../data/DailyWorkStore.js');
var DailyWorkActions = require('../action/DailyWorkActions');

var CheckInfoStore = require('../../../../proj/lib/data/CheckInfoStore');
var CheckInfoActions = require('../../../../proj/lib/action/CheckInfoActions');

var DailyWorkOptPage = React.createClass({
    getInitialState: function () {
        return {
            workDailySet: {
                checkList: [],
                projList: [],
                taskList: [],
                errMsg: ''
            },
            loading: false,
            orderList: [],
            workDaily: {},
            hints: {},
            validRules: [],
            activeKey: '2',
            fromTime: '',
            toTime: '',

            teamList: [],
            projSelectOptions: <Option key='-' value=''>--</Option>,
            orderSelectOptions: <Option key='-' value=''>--</Option>,
        }
    },

    mixins: [Reflux.listenTo(DailyWorkStore, "onServiceComplete"),
    Reflux.listenTo(CheckInfoStore, "onServiceComplete2"), ModalForm('workDaily'), ProjCodeMap()],
    onServiceComplete: function (data) {
        if (data.operation === 'create' || data.operation === 'remove' || data.operation === 'update') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.goBack();
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    workDailySet: data
                });
            }
        }
        else if (data.operation === 'retrieve') {
            //生成三个option
            var teamList = [];
            var workDaily = this.state.workDaily;
            if (data.checkList && data.checkList.length > 0) {
                data.checkList.map((d, i) => {
                    if (d.projName !== undefined && d.projName !== null && d.projName !== '') {
                        teamList.push({
                            projUuid: d.projUuid, teamUuid: d.teamUuid, projName: d.projName, teamName: d.teamName, projLoc: d.projLoc,
                            workHour: d.workHour, overHour: d.overHour, fromTime: d.checkIn, toTime: d.checkOut
                        });
                    }
                });

                workDaily.projUuid = data.checkList[0].projUuid;
                workDaily.teamUuid = data.checkList[0].teamUuid;
            }
            else if (data.projList && data.projList.length > 0) {
                data.projList.map((d, i) => {
                    if (d.resName !== undefined && d.resName !== null && d.resName !== '') {
                        // 计算开始和结束时间
                        var beginTime = d.beginTime;
                        var endTime = d.endTime;
                        if (d.beginDate !== workDaily.workDate) {
                            beginTime = '00:00';
                        }

                        if (d.endDate !== workDaily.workDate) {
                            endTime = '24:00';
                        }

                        teamList.push({
                            projUuid: d.resUuid, teamUuid: d.teamUuid, projName: d.resName, teamName: d.teamName, projLoc: d.resLoc,
                            beginTime: beginTime, endTime: endTime
                        });
                    }
                });

                workDaily.projUuid = data.projList[0].resUuid;
                workDaily.teamUuid = data.projList[0].teamUuid;
            }

            this.state.teamList = teamList;
            this.prepareWorkHour(workDaily.teamUuid);
            this.state.projSelectOptions = teamList.map(d => <Option key={d.projUuid} value={d.projUuid}>{d.projName}</Option>);

            if (data.taskList && data.taskList.length > 0) {
                this.state.orderSelectOptions = data.taskList.map(d => {
                    if (d.tastStatus === "当前任务") {
                        workDaily.orderUuid = d.ordUuid;
                        workDaily.orderName = d.ordName;
                        workDaily.itemUuid = d.itemUuid;
                        workDaily.itemName = d.itemName;
                    }

                    return <Option key={d.ordUuid} value={d.ordUuid}>{d.ordName}</Option>
                });
            }

            //判断考勤 并查询考勤记录
            if (!data.checkList || data.checkList.length === 0) {
                var corpUuid = window.loginData.compUser.corpUuid;
                var staffCode = window.loginData.compUser.userCode;
                var userId = window.loginData.authUser.userId;
                var chkDate = this.props.obj.workDaily.workDate;
                CheckInfoActions.getCheckInfo(corpUuid, staffCode, userId, chkDate);
            }

            this.setState({
                loading: false,
                workDailySet: data
            });

        }
    },
    onServiceComplete2: function (data) {
        var fromTime = '';
        var toTime = '';
        // console.log('考勤信息：：：', data.posSet)
        data.posSet.map(pos => {
            if (pos.posType !== 'booking' && pos.posType !== 'free') {
                if (pos.posTime <= fromTime || fromTime === '') {
                    fromTime = pos.posTime;
                }

                if (pos.posTime >= toTime) {
                    toTime = pos.posTime;
                }
            }
        });

        this.state.fromTime = fromTime;
        this.state.toTime = toTime;
        this.state.workDaily.fromTime = fromTime;
        this.state.workDaily.toTime = toTime;
        this.prepareWorkHour(this.state.workDaily.teamUuid);
        this.setState({
            loading: this.state.loading
        });
    },
    prepareWorkHour: function (teamUuid) {
        var workDaily = this.state.workDaily;
        workDaily.overHour = '0';
        workDaily.workHour = '8';
        workDaily.checkHour = '8';

        var team = null;
        var teamList = this.state.teamList;
        var len = teamList.length;
        for (var i = 0; i < len; i++) {
            if (teamList[i].teamUuid === teamUuid) {
                team = teamList[i];
                break;
            }
        }

        // console.log('teamUuid', teamUuid, team, this.state.teamList)
        if (team === null) {
            return;
        }

        if (team.workHour !== undefined && team.workHour !== null && team.workHour !== '') {
            workDaily.fromTime = team.fromTime;
            workDaily.toTime = team.toTime;
            workDaily.overHour = team.overHour;
            workDaily.checkHour = team.workHour;
            var w = parseInt(team.overHour) + parseInt(team.workHour);
            workDaily.workHour = '' + w;
            return;
        }

        // 签到时间
        var fromTime = this.state.fromTime;
        var toTime = this.state.toTime;
        if (fromTime !== '' && fromTime !== null && toTime !== '' && toTime !== null && fromTime !== toTime) {
            if (fromTime < team.beginTime) {
                fromTime = team.beginTime;
            }

            if (toTime >= team.endTime) {
                toTime = team.endTime;
            }

            workDaily.fromTime = fromTime;
            workDaily.toTime = toTime;

            var cTime = this.getWorkHour(fromTime, toTime);
            if (cTime.m > 45) {
                cTime.h = cTime.h + 1;
            }
            
            if (cTime.h > 0 && cTime.h < 8) {
                if (team.beginTime >= '09:00' || team.endTime <= '18:00') {
                    var t1 = (team.beginTime >= '09:00') ? team.beginTime : '09:00';
                    var t2 = (team.endTime <= '18:00') ? team.endTime : '18:00';
                    var wTime = this.getWorkHour(t1, t2);
                    if (wTime.m > 45) {
                        wTime.h = wTime.h + 1;
                    }

                    workDaily.workHour = '' + wTime.h;
                }
            }

            workDaily.checkHour = '' + cTime.h;
        }
        else {
            workDaily.workHour = '';
            workDaily.checkHour = '';
        }
    },

    getWorkHour: function (fromTime, toTime)
    {
        if (fromTime === toTime ||
            fromTime === undefined || fromTime === null || fromTime === '' ||
            toTime === undefined || toTime === null || toTime === '')
        {
            return { h: 0, m: 0 };
        }

        var checkFrom = parseInt(fromTime.substr(0, 2));
        var checkTo = parseInt(toTime.substr(0, 2));
        var checkFrom2 = parseInt(fromTime.substr(3, 2));
        var checkTo2 = parseInt(toTime.substr(3, 2));

        var checkHour = checkTo - checkFrom;
        if (checkFrom <= 12 && checkTo > 12) {
            checkHour = checkHour - 1;
        }

        if (checkFrom <= 18 && checkTo > 19) {
            checkHour = checkHour - 1;
        }

        var checkMinute = checkTo2 - checkFrom2;
        if (checkMinute < 0) {
            checkHour = checkHour - 1;
            checkMinute = 60 + checkMinute;
        }

        return { h: checkHour, m: checkMinute };
    },
    compareTime: function (time1, time2) {
        var arr = [time1];
        var arr1 = time1.split(':');
        var arr2 = time2.split(':');
        for (var i = 0; i < 3; i++) {
            if (arr1[i] < arr2[i]) {
                arr.push(time2);
                return arr;
            }
            if (arr1[i] > arr2[i]) {
                arr.unshift(time2);
                return arr;
            }
        }
        arr.push(time2);
        return arr;
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'workDate', desc: '报告日期', required: false, max: '16' },
            { id: 'workMonth', desc: '考勤月', required: false, max: '16' },
            { id: 'projUuid', desc: '项目组', required: true, max: '24' },
            { id: 'teamUuid', desc: '项目小组', required: false, max: '24' },
            { id: 'orderUuid', desc: '订单名称', required: false, max: '128' },
            { id: 'itemName', desc: '任务名称', required: false, max: '128' },
            { id: 'fromTime', desc: '开始时间', required: false, validator: this.checkTime, max: '16' },
            { id: 'toTime', desc: '结束时间', required: false, validator: this.checkTime, max: '16' },
            { id: 'checkHour', desc: '考勤工时', required: false, max: '16' },
            { id: 'workHour', desc: '有效工时', required: true, max: '16' },
            { id: 'overHour', desc: '加班工时', required: false, max: '16' },
            { id: 'workCity', desc: '所在城市', required: false, max: '128' },
            { id: 'workType', desc: '工作类型', required: false, max: '32' },
            { id: 'repBody', desc: '工作内容', required: false, max: '3600' },
        ];
        this.clear();
        //请求当日基本信息
        var filter = {}
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.staffCode = window.loginData.compUser.userCode;
        filter.chkDate = this.props.obj.workDaily.workDate;
        this.setState({ loading: true });
        DailyWorkActions.initProjTask(filter);
    },

    checkTime: function (value, rule, page) {
        if (!value) {
            return;
        }

        let len = value.length;
        if (len === 5) {
            let pattern = /^(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/
            if (pattern.test(value) == false) {
                return '请输入正确的时间【hh:mm】';
            }
        }
        else if (len === 8) {
            let pattern = /^(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])$/
            if (pattern.test(value) == false) {
                return '请输入正确的时间【hh:mm:ss】';
            }
        }
        else {
            return '请输入正确的时间【hh:mm】';
        }
    },

    clear: function () {
        this.state.hints = {};
        this.state.workDaily = {};
        if (this.props.obj.orderList.length > 0) {
            this.state.activeKey = '3';
            this.props.obj.orderList.map((order, i) => {
                var order2 = {};
                Utils.copyValue(order, order2);
                this.state.orderList.push(order2);
            });
        }

        this.state.workDaily.staffCode = window.loginData.compUser.userCode;
        this.state.workDaily.corpUuid = window.loginData.compUser.corpUuid;
        this.state.workDaily.workDate = this.props.obj.workDaily.workDate;
        this.state.workDaily.workMonth = this.props.obj.workDaily.workDate.substr(0, 6);
        this.state.workDaily.workType = '工作';

        this.setState({ loading: false });
        if (typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    getProjName: function (workDaily) {
        var teamList = this.state.teamList;
        var len = teamList.length;
        for (var i = 0; i < len; i++) {
            if (teamList[i].projUuid === workDaily.projUuid){
                workDaily.projName = teamList[i].projName;
                return workDaily.projName;
            }
        }

        workDaily.projName = '';
        return workDaily.projName;
    },

    onClickSave: function () {
        if (Common.formValidator(this, this.state.workDaily)) {
            this.setState({ loading: true });
            this.getProjName(this.state.workDaily);
            DailyWorkActions.createWorkDaily(this.state.workDaily);
        }
    },

    onClickUpdate: function (i) {
        if (Common.formValidator(this, this.state.orderList[i])) {
            this.setState({ loading: true });
            this.getProjName(this.state.orderList[i]);
            DailyWorkActions.updateWorkDaily(this.state.orderList[i]);
        }
    },

    onClickDelete: function (workDaily) {
        var strName = order.orderName;
        if (!strName) strName = order.projName;

        Modal.confirm({
            title: '删除确认',
            content: `是否删除工作日报【${strName}】`,
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, workDaily)
        });
    },

    onClickDelete2: function (workDaily) {
        this.setState({ loading: true });
        DailyWorkActions.deleteWorkDaily(workDaily.uuid);
    },

    goBack: function () {
        this.props.onBack();
    },

    onTabChange: function (activeKey) {
        this.setState({ activeKey: activeKey });
        if (activeKey === '1') {
            this.props.onBack();
        }
    },

    handleOnChange2: function (i, e) {
        var obj = this.state.orderList[i];
        obj[e.target.id] = e.target.value;
        Common.validator(this, obj, e.target.id);

        this.setState({
            loading: this.state.loading
        });
    },

    handleOnSelected2: function (i, id, value, option) {
        var obj = (i == -1) ? obj = this.state.workDaily : this.state.orderList[i];
        if (obj[id] === value) {
            return;
        }

        obj[id] = value;

        if (id === 'orderUuid') {
            obj.orderName = option.props.children;
            var taskList = this.state.workDailySet.taskList;
            for (var i = 0; i < taskList.length; i++) {
                var d = taskList[i];
                if (d.ordUuid === value) {
                    obj.orderName = d.ordName;
                    obj.itemUuid = d.itemUuid;
                    obj.itemName = d.itemName;
                }
            }
        }
        else if (id === 'teamUuid') {
            if (i === -1) {
                this.prepareWorkHour(value);
            }
        }

        Common.validator(this, obj, id);
        this.setState({
            loading: this.state.loading
        });
    },

    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };

        var hints = this.state.hints;
        var taskList = this.state.workDailySet.taskList;
        if (taskList === undefined || taskList === null) {
            taskList = [];
        }

        var tabList = [];
        this.state.orderList.map((order, i) => {
            // 项目小组
            var projUuid = this.state.orderList[i].projUuid;
            var teamSelectOptions = []
            this.state.teamList.map((d, i) => {
                if (d.projUuid === projUuid && d.teamUuid !== '') {
                    teamSelectOptions.push(<Option key={d.teamUuid} value={d.teamUuid}>{d.teamName}</Option>);
                }
            });

            // 根据projUuid 过滤订单
            var orderSelectOptions = [];
            taskList.map((d, i) => {
                if (d.projUuid === projUuid && d.ordUuid !== '') {
                    orderSelectOptions.push(<Option key={d.ordUuid} value={d.ordUuid}>{d.ordName}</Option>);
                }
            });

            var tabName = order.orderName;
            if (!tabName) tabName = order.projName;
            tabList.push(<TabPane tab={tabName} key={3 + i} style={{ width: '100%', height: '100%' }}>
                <div style={{ padding: "24px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                    <ServiceMsg ref='mxgBox' svcList={['work_daily/update', 'work_daily/retrieve']} />
                    <Form layout={layout} style={{ width: '100%', maxWidth: '800px' }}>
                        <Row>
                            <Col span="12">
                                <FormItem {...formItemLayout2} className={layoutItem} label='日期' colon={true} help={hints.workDateHint} validateStatus={hints.workDateStatus}>
                                    <Input type="text" name="workDate" id="workDate" value={this.state.orderList[i].workDate} disabled={true} />
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem {...formItemLayout2} className={layoutItem} label='考勤月份' colon={true} help={hints.workMonthHint} validateStatus={hints.workMonthStatus}>
                                    <Input type="text" name="workMonth" id="workMonth" value={this.state.orderList[i].workMonth} onChange={this.handleOnChange2.bind(this, i)} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem {...formItemLayout2} className={layoutItem} label='项目组' required={true} colon={true} help={hints.projUuidHint} validateStatus={hints.projUuidStatus}>
                                    <Select name="projUuid" id="projUuid" value={this.state.orderList[i].projUuid} onSelect={this.handleOnSelected2.bind(this, i, 'projUuid')}>
                                        {this.state.projSelectOptions}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem {...formItemLayout2} className={layoutItem} label='项目小组' colon={true} help={hints.teamUuidHint} validateStatus={hints.teamUuidStatus}>
                                    <Select name="teamUuid" id="teamUuid" value={this.state.orderList[i].teamUuid} onSelect={this.handleOnSelected2.bind(this, i, 'teamUuid')} >
                                        {teamSelectOptions}
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem {...formItemLayout2} className={layoutItem} label='订单名称' required={false} colon={true} help={hints.orderUuidHint} validateStatus={hints.orderUuidStatus}>
                                    <Select name="orderUuid" id="orderUuid" value={this.state.orderList[i].orderUuid} onSelect={this.handleOnSelected2.bind(this, i, 'orderUuid')} >
                                        {orderSelectOptions}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem {...formItemLayout2} className={layoutItem} label='任务名称' colon={true} help={hints.itemNameHint} validateStatus={hints.itemNameStatus}>
                                    <Input type="text" name="itemName" id="itemName" value={this.state.orderList[i].itemName} onChange={this.handleOnChange2.bind(this, i)} disabled={true} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem {...formItemLayout2} className={layoutItem} label='开始时间' colon={true} help={hints.fromTimeHint} validateStatus={hints.fromTimeStatus}>
                                    <Input type="text" name="fromTime" id="fromTime" value={this.state.orderList[i].fromTime} onChange={this.handleOnChange2.bind(this, i)} />
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem {...formItemLayout2} className={layoutItem} label='结束时间' colon={true} help={hints.toTimeHint} validateStatus={hints.toTimeStatus}>
                                    <Input type="text" name="toTime" id="toTime" value={this.state.orderList[i].toTime} onChange={this.handleOnChange2.bind(this, i)} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem {...formItemLayout2} className={layoutItem} label='考勤工时' colon={true} help={hints.checkHourHint} validateStatus={hints.checkHourStatus}>
                                    <Input type="text" name="checkHour" id="checkHour" value={this.state.orderList[i].checkHour} onChange={this.handleOnChange2.bind(this, i)} />
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem {...formItemLayout2} className={layoutItem} label='有效工时' required={true} colon={true} help={hints.workHourHint} validateStatus={hints.workHourStatus}>
                                    <Input type="text" name="workHour" id="workHour" value={this.state.orderList[i].workHour} onChange={this.handleOnChange2.bind(this, i)} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem {...formItemLayout2} className={layoutItem} label='加班工时' colon={true} help={hints.overHourHint} validateStatus={hints.overHourStatus}>
                                    <Input type="text" name="overHour" id="overHour" value={this.state.orderList[i].overHour} onChange={this.handleOnChange2.bind(this, i)} />
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem {...formItemLayout2} className={layoutItem} label='所在城市' colon={true} help={hints.workCityHint} validateStatus={hints.workCityStatus}>
                                    <Input type="text" name="workCity" id="workCity" value={this.state.orderList[i].workCity} onChange={this.handleOnChange2.bind(this, i)} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem {...formItemLayout2} className={layoutItem} label='工作类型' colon={true} help={hints.workTypeHint} validateStatus={hints.workTypeStatus}>
                                    <DictSelect name="workType" id="workType" value={this.state.orderList[i].workType} appName='项目管理' optName='工作类型' onSelect={this.handleOnSelected2.bind(this, i, 'workType')}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem {...formItemLayout} label="工作内容" colon={true} className={layoutItem} help={hints.repBodyHint} validateStatus={hints.repBodyStatus}>
                            <Input type="textarea" name="repBody" id="repBody" value={this.state.orderList[i].repBody} onChange={this.handleOnChange2.bind(this, i)} style={{ height: '200px' }} />
                        </FormItem>

                        <FormItem style={{ textAlign: 'right', margin: '4px 0' }} className={layoutItem}>
                            <Button key="btnOK" type="primary" size="large" onClick={this.onClickUpdate.bind(this, i)} loading={this.state.loading}>保存</Button>{' '}
                            <Button key="btnDelete" size="large" onClick={this.onClickDelete.bind(this, order)} style={{ color: 'red' }}>删除</Button>{' '}
                            <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                        </FormItem>
                    </Form>
                </div>
            </TabPane>);
        });

        var workDaily = this.state.workDaily;

        // 项目小组
        var isFinded = false;
        var team = null;
        var projUuid = workDaily.projUuid;
        var teamSelectOptions = []
        this.state.teamList.map((d, i) => {
            if (d.projUuid === projUuid) {
                if (d.projLoc !== undefined && d.projLoc !== null && d.projLoc !== '') {
                    workDaily.workCity = d.projLoc;
                }
            }

            if (d.projUuid === projUuid && d.teamUuid !== '') {
                if (workDaily.teamUuid === d.teamUuid) {
                    isFinded = true;
                }

                if (team === null) team = d;
                teamSelectOptions.push(<Option key={d.teamUuid} value={d.teamUuid}>{d.teamName}</Option>);
            }
        });

        if (!isFinded && team !== null) {
            var teamUuid = (team === null) ? '' : team.teamUuid;
            workDaily.teamUuid = teamUuid;

            // 加班时间
            this.prepareWorkHour(teamUuid);
        }

        // 根据projUuid 过滤订单
        isFinded = false;
        var task = null;
        var orderSelectOptions = [];
        taskList.map((d, i) => {
            if (d.projUuid === projUuid && d.ordUuid !== '') {
                if (workDaily.orderUuid === d.ordUuid) {
                    isFinded = true;
                }

                if (task === null) task = d;
                orderSelectOptions.push(<Option key={d.ordUuid} value={d.ordUuid}>{d.ordName}</Option>);
            }
        });

        if (!isFinded) {
            if (task !== null) {
                workDaily.orderUuid = task.ordUuid;
                workDaily.orderName = task.ordName;
                workDaily.itemUuid = task.itemUuid;
                workDaily.itemName = task.itemName;
            }
            else {
                workDaily.orderUuid = '';
                workDaily.orderName = '';
                workDaily.itemUuid = '';
                workDaily.itemName = '';
            }
        }

        return (
            <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                <Tabs activeKey={this.state.activeKey} onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
                    {tabList}
                    <TabPane tab="新报工单" key="2" style={{ width: '100%', height: '100%' }}>
                        <div style={{ padding: "24px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                            <ServiceMsg ref='mxgBox' svcList={['work_daily/create', 'work_daily/retrieve']} />
                            <Form layout={layout} style={{ width: '100%', maxWidth: '800px' }}>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='日期' colon={true} help={hints.workDateHint} validateStatus={hints.workDateStatus}>
                                            <Input type="text" name="workDate" id="workDate" value={this.state.workDaily.workDate} onChange={this.handleOnChange} disabled={true} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='考勤月份' colon={true} help={hints.workMonthHint} validateStatus={hints.workMonthStatus}>
                                            <Input type="text" name="workMonth" id="workMonth" value={this.state.workDaily.workMonth} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='项目组' required={true} colon={true} help={hints.projUuidHint} validateStatus={hints.projUuidStatus}>
                                            <Select name="projUuid" id="projUuid" value={this.state.workDaily.projUuid} onSelect={this.handleOnSelected.bind(this, 'projUuid')}>
                                                {this.state.projSelectOptions}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='项目小组' colon={true} help={hints.teamUuidHint} validateStatus={hints.teamUuidStatus}>
                                            <Select name="teamUuid" id="teamUuid" value={this.state.workDaily.teamUuid} onSelect={this.handleOnSelected2.bind(this, -1, 'teamUuid')} >
                                                {teamSelectOptions}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='订单名称' required={false} colon={true} help={hints.orderUuidHint} validateStatus={hints.orderUuidStatus}>
                                            <Select name="orderUuid" id="orderUuid" value={this.state.workDaily.orderUuid} onSelect={this.handleOnSelected2.bind(this, -1, 'orderUuid')} >
                                                {orderSelectOptions}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='任务名称' colon={true} help={hints.itemNameHint} validateStatus={hints.itemNameStatus}>
                                            <Input type="text" name="itemName" id="itemName" value={this.state.workDaily.itemName} onChange={this.handleOnChange} disabled={true} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='开始时间' colon={true} help={hints.fromTimeHint} validateStatus={hints.fromTimeStatus}>
                                            <Input type="text" name="fromTime" id="fromTime" value={this.state.workDaily.fromTime} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='结束时间' colon={true} help={hints.toTimeHint} validateStatus={hints.toTimeStatus}>
                                            <Input type="text" name="toTime" id="toTime" value={this.state.workDaily.toTime} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='考勤工时' colon={true} help={hints.checkHourHint} validateStatus={hints.checkHourStatus}>
                                            <Input type="text" name="checkHour" id="checkHour" value={this.state.workDaily.checkHour} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='有效工时' required={true} colon={true} help={hints.workHourHint} validateStatus={hints.workHourStatus}>
                                            <Input type="text" name="workHour" id="workHour" value={this.state.workDaily.workHour} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='加班工时' colon={true} help={hints.overHourHint} validateStatus={hints.overHourStatus}>
                                            <Input type="text" name="overHour" id="overHour" value={this.state.workDaily.overHour} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='所在城市' colon={true} help={hints.workCityHint} validateStatus={hints.workCityStatus}>
                                            <Input type="text" name="workCity" id="workCity" value={this.state.workDaily.workCity} onChange={this.handleOnChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} className={layoutItem} label='工作类型' colon={true} help={hints.workTypeHint} validateStatus={hints.workTypeStatus}>
                                            <DictSelect name="workType" id="workType" value={this.state.workDaily.workType} appName='项目管理' optName='工作类型' onSelect={this.handleOnSelected.bind(this, 'workType')}/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem {...formItemLayout} label="工作内容" colon={true} className={layoutItem} help={hints.repBodyHint} validateStatus={hints.repBodyStatus}>
                                    <Input type="textarea" name="repBody" id="repBody" value={this.state.workDaily.repBody} onChange={this.handleOnChange} style={{ height: '200px' }} />
                                </FormItem>

                                <FormItem style={{ textAlign: 'right', margin: '4px 0' }} className={layoutItem}>
                                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                                    <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});

export default DailyWorkOptPage;