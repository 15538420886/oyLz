'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input, Radio, DatePicker } from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
var TempProjStore = require('../data/TempProjStore');
var TempProjActions = require('../action/TempProjActions');

var TempProjPage = React.createClass({
	getInitialState : function() {
		return {
			projSet: {
				recordSet: [],
            },
            staffCode: '',
			loading: false,
		}
	},

    mixins: [Reflux.listenTo(TempProjStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            projSet: data
        });
    },
	handleQueryClick : function() {
		this.setState({loading: true});
        var staffCode = this.state.staffCode;
		var corpUuid = window.loginData.compUser.corpUuid;
        TempProjActions.retrieveTempProj(corpUuid, staffCode);
	},
    componentDidMount: function () {
        var member = this.props.resMember;
        if (member === null || member.staffCode === '' || member.staffCode === this.state.staffCode) {
            return;
        }

        this.state.staffCode = member.staffCode;
        this.handleQueryClick();
    },
    componentWillReceiveProps: function (nextProps) {
        var member = nextProps.resMember;
        if (member !== null && member.staffCode === this.state.staffCode) {
            return;
        }

        if (member === null || member.staffCode === '' || member.staffCode === this.state.staffCode) {
            var data = { recordSet: [] };
            this.setState({
                loading: false,
                projSet: data
            });

            return;
        }

        this.state.staffCode = member.staffCode;
        this.handleQueryClick();
    },

	render : function() {
		var recordSet = this.state.projSet.recordSet;

		const columns = [
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
				title: '日期',
				dataIndex: 'beginDate',
				key: 'beginDate',
				width: 160,
                render: (text, record) => (record.beginDate + "--" + ((record.endDate === '#') ? '' : record.endDate)),
			},
			{
				title: '项目名称',
				dataIndex: 'projName',
				key: 'projName',
				width: 140,
			},
			{
				title: '项目地址',
				dataIndex: 'projLoc',
				key: 'projLoc',
				width: 140,
			},
			{
				title: '客户定级',
				dataIndex: 'projLevel',
				key: 'projLevel',
				width: 140,
			},
			{
				title: '结算价',
				dataIndex: 'userPrice',
				key: 'userPrice',
				width: 140,
			},
			{
				title: '承担角色',
				dataIndex: 'roleName',
                key: 'roleName',
				width: 200,
			},
		];
		
		return (
			<div className='grid-page'>
                <ServiceMsg ref='mxgBox' svcList={['temp-member/retrieve']} />
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>
			</div>
		);
	}
});

module.exports = TempProjPage;

