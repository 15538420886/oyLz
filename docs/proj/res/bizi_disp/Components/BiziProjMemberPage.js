'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input, Tabs} from 'antd';
const Search = Input.Search;
const TabPane = Tabs.TabPane;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
var BiziProjMemberStore = require('../data/BiziProjMemberStore.js');
var BiziDispActions = require('../action/BiziDispActions');
import CreateBiziProjMemberPage from './CreateBiziProjMemberPage';
import UpdateBiziProjMemberPage from './UpdateBiziProjMemberPage';
import BiziProjMemberFilter from './BiziProjMemberFilter';

var pageRows = 10;
var BiziProjMemberPage = React.createClass({
	getInitialState : function() {
		return {
			biziProjMemberSet: {
				recordSet: [],
				startPage : 1,
				pageRow : 10,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			action: 'query',
			loading: false,
			biziProjMember: null,
			moreFilter: false,
            filterValue: '',
            filter: {},
		}
	},

    mixins: [Reflux.listenTo(BiziProjMemberStore, "onServiceComplete")],
    onServiceComplete: function(data) {
    	if(data.operation === 'cache'){
            var ff = data.filter.staffCode;
            if(ff === null || typeof(ff) === 'undefined' || ff === ''){
                ff = data.filter.perName;
                if(ff === null || typeof(ff) === 'undefined'){
                    ff = '';
                }
            }

            this.state.filterValue = ff;
            this.state.filter = data.filter;
            this.state.moreFilter = (data.filter.more === '1');

            if(this.state.moreFilter){
                var mp = this.refs.BiziProjMemberFilter;
                if(mp !== null && typeof(mp) !== 'undefined'){
                    mp.state.biziProjMember = this.state.filter;
                }
            }
        }

        this.setState({
            loading: false,
            biziProjMemberSet: data
        });
    },
    
    // 第一次加载
	componentDidMount : function(){
        this.setState({ loading: true });
        this.state.filter.corpUuid = this.props.biziProj.corpUuid;
        this.state.filter.projUuid = this.props.biziProj.uuid;
        BiziDispActions.initBiziProjMember(this.state.filter);
	},

	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
        this.state.filter.corpUuid = this.props.biziProj.corpUuid;
        this.state.filter.projUuid = this.props.biziProj.uuid;
        this.state.filter.more = (this.state.moreFilter ? '1' : '0');
		BiziDispActions.retrieveBiziProjMemberPage( this.state.filter,this.state.biziProjMemberSet.startPage,pageRows);
	},
	
	showMoreFilter: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },
    onChangePage: function(pageNumber){
        this.state.biziProjMemberSet.startPage = pageNumber;
        this.handleQueryClick();
    },
	onShowSizeChange: function(current, pageSize){
		pageRows = pageSize;
		this.handleQueryClick();
	},
    onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
    },
    onSearch: function(e){
        this.state.filter={};
        var filterValue = this.state.filterValue;
        if (Common.isIncNumber(filterValue)){
            this.state.filter.staffCode = filterValue;
        }
        else{
            this.state.filter.perName = filterValue;
        }

        this.handleQueryClick();
    },
    onMoreSearch: function(){
        this.state.filter = this.refs.BiziProjMemberFilter.state.biziProjMember;
        this.handleQueryClick();
    },

	onClickDelete : function(biziProjMember, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的人员 【'+biziProjMember.perName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, biziProjMember)
		});
	},

	onClickDelete2 : function(biziProjMember)
	{
		this.setState({loading: true});
		this.state.biziProjMemberSet.operation = '';
		BiziDispActions.deleteBiziProjMember( biziProjMember.uuid );
	},

    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.props.onBack();
        }
    },

	handleCreate: function(e){
        this.setState({action: 'create'});
    },
    onClickUpdate : function(biziProjMember, event){
        this.setState({biziProjMember: biziProjMember, action: 'update'});
    },

    onGoBack: function (activeKey) {
        if (activeKey === '1') {
            this.props.onBack();
        }
        else {
            this.setState({ action: 'query' });
        }
    },

	render : function() {
		const columns = [
			{
            	title: '员工编号',
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
            	title: '电话',
            	dataIndex: 'phoneno',
            	key: 'phoneno',
            	width: 140,
      		},
      		{
            	title: '公司/部门名称',
            	dataIndex: 'corpName',
            	key: 'corpName',
            	width: 140,
                render:(text,record) =>( record.corpName ? record.corpName : record.deptName )
      		},
      		{
            	title: '归属地',
            	dataIndex: 'baseCity',
            	key: 'baseCity',
            	width: 140,
      		},
      		{
            	title: '入组日期',
            	dataIndex: 'beginDate',
            	key: 'beginDate',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))
      		},
      		{
            	title: '入组时间',
            	dataIndex: 'beginTime',
            	key: 'beginTime',
                width: 140,
                render: (text, record) => (Common.formatDate(text, Common.dateFormat))
      		},
			{
				title: '更多操作',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改人员'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除人员'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

        var recordSet = this.state.biziProjMemberSet.recordSet;
        var moreFilter = this.state.moreFilter;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var pag = {showQuickJumper: true, total:this.state.biziProjMemberSet.totalRow, pageSize:this.state.biziProjMemberSet.pageRow,
                current:this.state.biziProjMemberSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};

        var contactTable =
            <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px', display: visible }}>
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
                    <TabPane tab="项目组人员" key="2" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                        <div style={{ padding: "2px 0 16px 0" }}>
                            <ServiceMsg ref='mxgBox' svcList={['bizi-proj-member/retrieve', 'bizi-proj-member/remove']} />
                            <BiziProjMemberFilter ref="BiziProjMemberFilter" moreFilter={moreFilter} />

                            <div style={{ margin: '8px 0 0 0' }}>
                                <div className='toolbar-table'>
                                    <div style={{ float: 'left' }}>
                                        <Button icon={Common.iconAdd} type="primary" title="增加人员信息" onClick={this.handleCreate}/>
                                        <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                                    </div>
                                    {
                                        moreFilter ?
                                            <div style={{ textAlign: 'right', width: '100%' }}>
                                                <Button title="查询" onClick={this.onMoreSearch} loading={this.state.loading} style={{ marginRight: '5px' }}>查询</Button>
                                                <Button title="快速条件" onClick={this.showMoreFilter}>快速条件</Button>
                                            </div> :
                                            <div style={{ textAlign: 'right', width: '100%' }}>
                                                <Search placeholder="查询(员工编号/员工姓名)" style={{ width: Common.searchWidth }} value={this.state.filterValue} onChange={this.onChangeFilter} onSearch={this.onSearch} />
                                                <Button title="更多条件" onClick={this.showMoreFilter} style={{ marginLeft: '8px' }}>更多条件</Button>
                                            </div>
                                    }
                                </div>
                            </div>
                            <div style={{ width: '100%', padding: '0 18px 8px 20px' }}>
                                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder} />
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>;

          var page = null;
          if(this.state.action === 'create'){
              page = <CreateBiziProjMemberPage onBack={this.onGoBack} biziProj={this.props.biziProj}/>;
          }
          else if(this.state.action === 'update'){
              var biziProjMember = {};
              Utils.copyValue(this.state.biziProjMember, biziProjMember);
              page = <UpdateBiziProjMemberPage onBack={this.onGoBack} biziProjMember={ biziProjMember }/>
          }

          return (
              <div style={{width: '100%', height: '100%'}}>
                   {contactTable}
                   {page}
               </div>
          );
	}
});

module.exports = BiziProjMemberPage;

