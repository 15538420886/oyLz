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

var ProjMemberStore = require('./data/ProjMemberStore');
var ProjMemberActions = require('./action/ProjMemberActions');

import XlsTempFile from '../../../lib/Components/XlsTempFile';
import XlsConfig from '../../lib/XlsConfig';
import XlsDown from '../../../lib/Components/XlsDown';

var filterValue = '';
var ProjMemberPage = React.createClass({
    getInitialState : function() {
        return {
            projMemberSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(ProjMemberStore, "onServiceComplete"), XlsTempFile()],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            projMemberSet: data
        });
    },
    
    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true});
        // FIXME 查询条件
		var corpUuid = window.loginData.compUser.corpUuid;
        ProjMemberActions.retrieveProjMember(corpUuid);
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        // FIXME 查询条件
		var corpUuid = window.loginData.compUser.corpUuid;
        ProjMemberActions.initProjMember(corpUuid);
    },

    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

	xlsExport: function() {
		var data = [];
        var recordSet = this.state.projMemberSet.recordSet;
		recordSet.map((projMember, i) => {
			var r = {};
			r.staffCode = projMember.staffCode;
			r.perName = projMember.perName;
			r.poolName = projMember.poolName;
			r.teamName = projMember.teamName;
			r.grpName = projMember.grpName;
			r.projName = projMember.projName;
			r.projLevel = projMember.projLevel;
			data.push(r);
		});
		this.downXlsTempFile2(XlsConfig.projMemberFields, data, this.refs.xls);
	},

    render : function() {
        var recordSet = Common.filter(this.state.projMemberSet.recordSet, filterValue);

        const columns = [
            {
            	title: '员工号',
            	dataIndex: 'staffCode',
            	key: 'staffCode',
            	width: 140,
            },
            {
            	title: '员工',
            	dataIndex: 'perName',
            	key: 'perName',
            	width: 140,
            },
            {
            	title: '资源池',
            	dataIndex: 'poolName',
            	key: 'poolName',
            	width: 140,
            },
            {
            	title: '小组名称',
            	dataIndex: 'teamName',
            	key: 'teamName',
            	width: 140,
            },
            {
            	title: '项目群',
            	dataIndex: 'grpName',
            	key: 'grpName',
            	width: 140,
            },
            {
            	title: '项目组',
            	dataIndex: 'projName',
            	key: 'projName',
            	width: 140,
            },
            {
            	title: '客户定级',
            	dataIndex: 'projLevel',
            	key: 'projLevel',
            	width: 140,
            },
        ];

        var cs = Common.getGridMargin(this);
        return (
            <div className='grid-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['proj-member/retrieve']} />
                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
							<Button icon='download' title="导出项目人员数据" onClick={this.xlsExport} style={{marginLeft: '4px'}}/>
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

module.exports = ProjMemberPage;