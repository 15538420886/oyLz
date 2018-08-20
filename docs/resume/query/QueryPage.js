'use strict';

import React from 'react'; 
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import Context from '../resumeContext';
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal} from 'antd';
import { withRouter } from 'react-router';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var QueryStore = require('./data/QueryStore');
var QueryActions = require('./action/QueryActions');
import CreateQueryPage from './Components/CreateQueryPage';
//import UpdateQueryPage from './Components/UpdateQueryPage';

var QueryPage1 = React.createClass({
  getInitialState : function() { 
    return {
      personSet: {
        recordSet: [],
        startPage : 0,
        pageRow : 0,
        totalRow : 0,
        operation : '',
        errMsg : ''
      },
      loading: false,
    }
  },

    mixins: [Reflux.listenTo(QueryStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            personSet: data
        });
    },
    
  // 刷新
  handleQueryClick : function(event) {
    this.setState({loading: true});
    this.state.personSet.operation = '';
    QueryActions.retrieveResPerson();
  },

  // 第一次加载
  componentDidMount : function(){
    this.setState({loading: true});
    QueryActions.initResPerson();
  },

  handleOpenCreateWindow : function(event) {
    this.refs.createWindow.clear();
    this.refs.createWindow.toggle();
  },

  onClickUpdate : function(person, event)
  {
    if(person != null){
      Context.resumeApp = person;
       this.props.router.push({
            pathname: '/resume2/PreviewPage/',
            query: {
              personId: person.id,
              
            },
            state: { fromDashboard: true }
        });
      
    }
  },

  onClickDelete : function(person, event)
  {
    Modal.confirm({

      title: '删除确认',
      content: '是否删除选中【'+person.peName+'】的个人简历',
      okText: '确定',
      cancelText: '取消',
      onOk: this.onClickDelete2.bind(this, person)
    });
    event.stopPropagation();
  },

  onClickDelete2 : function(person)
  {
    this.setState({loading: true});
    this.state.personSet.operation = '';
   
    QueryActions.deleteResPerson( person.id );
  },

  render : function() {
    var recordSet = this.state.personSet.recordSet;
    const columns = [   
      {
        title: '姓名',
        dataIndex: 'peName',
        key: 'peName',
        width: 50,
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        width: 50,
        render: (text, record) => (Utils.getOptionName('简历系统', '性别', record.gender, false, this)),
      },
      {
        title: '电子邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 100,
      },
      {
        title: '手机号',
        dataIndex: 'phoneNo',
        key: 'phoneNo',
        width: 80,
      },
      {
        title: '',
        key: 'action',
        width: 50,
        render: (text, record) => (
          <span>
            <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='更新简历'><Icon type={Common.iconUpdate}/></a>
            <span className="ant-divider" />
            <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除简历'><Icon type={Common.iconRemove}/></a>
          </span>
        ),
      }
    ];
    var cs = Common.getGridMargin(this, 0);
    return (
      <div className='grid-page' style={{padding: '58px 0 0 0'}}>								
        <div style={{margin: '-58px 0 0 0'}}>
          <div className='toolbar-table'>
            <div style={{float:'left'}}>
              <Button icon={Common.iconAdd} type="primary" title="增加人员" onClick={this.handleOpenCreateWindow}/>
              <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
            </div>
          </div>
        </div>
        <div style={{margin: cs.margin}}>
          <ServiceMsg ref='mxgBox' svcList={['resPerson/retrieve', 'resPerson/del-resume']}/>
        </div>
        <div className='grid-body'>
          <Table columns={columns} dataSource={recordSet} rowKey={record => record.id} loading={this.state.loading} pagination={false}  size="middle" bordered={Common.tableBorder}/>
        </div>
        <CreateQueryPage ref="createWindow"/>
      </div>
    );
  }
});

var QueryPage=withRouter(QueryPage1);
module.exports = QueryPage;

