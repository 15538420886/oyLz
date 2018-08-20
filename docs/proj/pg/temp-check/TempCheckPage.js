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
const dateFormat = 'YYYY-MM-DD';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var TempCheckStore = require('./data/TempCheckStore');
var TempCheckActions = require('./action/TempCheckActions');
import CreateTempCheckPage from './Components/CreateTempCheckPage';

var ProjContext = require('../../ProjContext');
import ProjCodeMap from '../../lib/ProjCodeMap';
import SelectDate from '../../../lib/Components/SelectDate';

var today = '' + Common.getToday();
var filterValue = '';
var TempCheckPage = React.createClass({
    getInitialState: function () {
        return {
            tempCheckSet: {
                recordSet: [],
                startPage: 0,
                pageRow: 0,
                totalRow: 0,
                errMsg: ''
            },
            loading: false,
            viewType: '1',
            workDate: today,
            filter: ''
        }
    },

    mixins: [Reflux.listenTo(TempCheckStore, "onServiceComplete"), ProjCodeMap()],
    onServiceComplete: function (data) {
        this.setState({
            loading: false,
            tempCheckSet: data
        });
    },

    // 第一次加载
    componentDidMount: function () {
        var date = new Date();

        this.setState({
            loading: true,
            viewType: '1',
        });

        this.queryUserChkBook(today);
    },

    // 选择日期
    onChangeDate: function (e) {
        var workDate = e.target.value;
        this.queryUserChkBook(workDate);

        this.setState({
            loading: true,
            workDate: workDate,
            selectedRowKeys: null,
        });
    },
    queryUserChkBook: function (chkDate) {
        var filter = {};
        filter.corpUuid = window.loginData.compUser.corpUuid;
        filter.grpUuid = ProjContext.selectedGroup.uuid;
        filter.chkCode = window.loginData.compUser.userCode;
        filter.workDate = chkDate;
        TempCheckActions.retrieveUserChkBook(filter);
    },

    onFilterRecord: function (e) {
        this.setState({ filterValue: e.target.value });
    },

    datePicker: function (date, dateString) {
        var chkDate = dateString.split('-').join('');
        this.setState({
            loading: true,
            workDate: chkDate,
        });

        this.queryUserChkBook(chkDate);
    },

    showError: function (msg) {
        MsgActions.showError('res-member-snap', 'create-proj-chk', msg);
    },

    onClickUpdate: function (tempCheck, event) {
        var chkDate = this.state.workDate;
        this.refs.createWindow.clear(tempCheck, chkDate);
        this.refs.createWindow.toggle();
        event.stopPropagation();
    },
    getTitleStyle: function (chkDate) {
        return (chkDate.checkUuid === null) ? { color: 'red' } : null;
    },

    onClickDelete: function (tempCheck, event) {
        var userChkObj = {};
        userChkObj.uuid = tempCheck.uuid;
        userChkObj.corpUuid = window.loginData.compUser.corpUuid;
        userChkObj.staffCode = tempCheck.staffCode;
        userChkObj.chkDate = this.state.workDate;
        userChkObj.chkProj = tempCheck.chkProj;

        Modal.confirm({
            title: '删除确认',
            content: '是否删除【' + tempCheck.perName + '】的考勤数据',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, userChkObj)
        });

        event.stopPropagation();
    },
    onClickDelete2: function (userChkObj) {
        this.setState({ loading: true });
        TempCheckActions.deleteUserChkBook(userChkObj);
    },

    render: function () {
        var recordSet = Common.filter(this.state.tempCheckSet.recordSet, this.state.filterValue);
        const { selectedRowKeys } = this.state;

		var cardList =
			recordSet.map((chkDate, i) => {
				return <div key={chkDate.uuid} className='card-div' style={{ width: 260 }}>
                    <div className="ant-card ant-card-bordered" style={{ width: '100%' }} onClick={this.onClickUpdate.bind(this, chkDate)}>
						<div className="ant-card-head"><h3 className="ant-card-head-title" style={this.getTitleStyle(chkDate)}>{chkDate.staffCode}（{chkDate.perName}）</h3></div>
						<div className="ant-card-extra">
							<a href="#" onClick={this.onClickUpdate.bind(this, chkDate)} title='修改'><Icon type={Common.iconUpdate} /></a>
							<span className="ant-divider" />
                            <a href="#" onClick={this.onClickDelete.bind(this, chkDate)} title='删除考勤数据'><Icon type={Common.iconRemove} /></a>
						</div>
                        <div className="ant-card-body" style={{ cursor: 'pointer', height: '80px', overflow: 'hidden' }} >
							<p>签到：{chkDate.checkIn}， 签退：{chkDate.checkOut}</p>
							<p>工时：{chkDate.workHour}， 加班：{chkDate.overHour}， 经理：{chkDate.pmName}</p>
						</div>
					</div>
				</div>
			});

        var cs = Common.getCardMargin(this);
        return (
            <div className='grid-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['user-chk-book/retrieve', 'user-chk-book/remove', 'res-member-snap/create-proj-chk']} />

                    <div className='toolbar-table'>
						<div style={{float:'left'}}>
                        	<SelectDate value={this.state.workDate} onChange={this.onChangeDate} />
                        	<DatePicker style={{ width: '100px', marginLeft: '16px' }} format={dateFormat} onChange={this.datePicker} allowClear={false} />
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
							<Search placeholder="查询"  style={{width: Common.searchWidth}} value={this.state.filterValue} onChange={this.onFilterRecord} />
						</div>
					</div>
                </div>
                <div className='card-body' style={{ paddingTop: '6px' }}>
                    {
                        this.state.loading ?
                            <Spin tip="正在努力加载数据...">{cardList}</Spin>
                            :
                            <div>{cardList}</div>
                    }
                </div>
                <CreateTempCheckPage ref="createWindow" />
            </div>

        );
    }
});

module.exports = TempCheckPage;

