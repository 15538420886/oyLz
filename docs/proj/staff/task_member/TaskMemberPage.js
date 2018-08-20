'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var ProjTaskMemberStore = require('./data/ProjTaskMemberStore');
var ProjTaskMemberActions = require('./action/ProjTaskMemberActions');

import XlsTempFile from '../../../lib/Components/XlsTempFile';
import XlsConfig from '../../lib/XlsConfig';
import XlsDown from '../../../lib/Components/XlsDown';

var filterValue = '';
var ProjTaskMemberPage = React.createClass({
    getInitialState : function() {
        return {
            projTaskMemberSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(ProjTaskMemberStore, "onServiceComplete"), XlsTempFile()],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            projTaskMemberSet: data
        });
    },
    
    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        // FIXME 查询条件
		var corpUuid = window.loginData.compUser.corpUuid;
        ProjTaskMemberActions.retrieveProjTaskMember(corpUuid);
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        // FIXME 查询条件
		var corpUuid = window.loginData.compUser.corpUuid;
        ProjTaskMemberActions.initProjTaskMember(corpUuid);
    },

    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

	xlsExport: function() {
		var data = [];
        var recordSet = this.state.projTaskMemberSet.recordSet;
		recordSet.map((projTaskMember, i) => {
			var r = {};
			r.ordCode = projTaskMember.ordCode;
			r.ordName = projTaskMember.ordName;
			r.grpName = projTaskMember.grpName;
			r.member = projTaskMember.member;
			data.push(r);
		});
		this.downXlsTempFile2(XlsConfig.projTaskMemberFields, data, this.refs.xls);
	},

    render : function() {
        var recordSet = Common.filter(this.state.projTaskMemberSet.recordSet, filterValue);

        const columns = [
            {
            	title: '订单编号',
            	dataIndex: 'ordCode',
            	key: 'ordCode',
            	width: 80,
            },
            {
            	title: '订单名称',
            	dataIndex: 'ordName',
            	key: 'ordName',
            	width: 80,
            },
            {
            	title: '项目群名称',
            	dataIndex: 'grpName',
            	key: 'grpName',
            	width: 80,
            },
            {
            	title: '成员',
            	dataIndex: 'member',
            	key: 'member',
            	width: 320,
                render: (text, record) => (text.replace(/,/g, ",  ")),
            },
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['proj-task-member/retrieve',]}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
							<Button icon='download' title="导出订单人员数据" onClick={this.xlsExport} style={{marginLeft: '4px'}}/>
						</div>
                        <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
                            <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body'>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
                </div>
				<XlsDown ref='xls' />
            </div>
        );
    }
});

module.exports = ProjTaskMemberPage;