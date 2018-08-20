'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
import {Button} from 'reactstrap';
import { withRouter } from 'react-router'
var Reflux = require('reflux');
import ErrorMsg from '../../lib/Components/ErrorMsg';
import { Table, Icon } from 'antd';
var CampusStore = require('./data/CampusStore.js');
var CampusActions = require('./action/CampusActions');


var CampusListPage2 = React.createClass({
  getInitialState : function() {
      return {
          campusSet: {
          	recordSet: [],
			startPage : 0,
			pageRow : 0,
			totalRow : 0,
			operation : '',
			errMsg : ''
          }
      }
  },

  // 刷新
  handleQueryClick : function(event) {
		CampusActions.retrieveAuthCampus();
  },

  // 第一次加载
  componentDidMount : function(){
		CampusActions.initAuthCampus();
  },

  onClick2CorpPage : function(event)
  {
	var campusName='';
	var uuid=event.target.id;
	var recordSet = this.state.campusSet.recordSet;
	for(var x=recordSet.length-1; x>=0; x--){
		if(recordSet[x].uuid === uuid){
			campusName = recordSet[x].campusName;
			break;
		}
	}

    this.props.router.push({
      pathname: '/auth/CorpPage/',
      query: {
      	campusUuid: uuid,
      	campusName: campusName
      },
  	  state: { fromDashboard: true }
    });
  },

  onDismiss : function(){
  	var campusSet = this.state.campusSet;
      campusSet.errMsg = '';
      campusSet.operation = '';
      this.setState({
        campusSet: campusSet
      });
  },

  render : function() {
  	var errMsg = '';
	var operation = this.state.campusSet.operation;
	if( operation != 'update' && operation != 'create' && operation != '' ){
	  	if(this.state.campusSet.errMsg != ''){
	  		errMsg = this.state.campusSet.errMsg;
		}
	}

  	var recordSet = this.state.campusSet.recordSet;

	const columns = [
	{
	  title: '园区名称',
	  dataIndex: 'campusName',
	  key: 'campusName',
	  width: 140,
	},
	{
	  title: '园区代码',
	  dataIndex: 'campusCode',
	  key: 'campusCode',
	  width: 140,
	},
	{
	  title: '园区描述',
	  dataIndex: 'campusDesc',
	  key: 'campusDesc',
	  width: 250,
	},
	{
	  title: '园区地址',
	  dataIndex: 'campusLoc',
	  key: 'campusLoc',
	  width: 250,
	},
	{
	  title: '',
	  key: 'action',
	  width: 100,
	  render: (text, record) => (
	    <span>
	      <a href="#" onClick={this.onClick2CorpPage} id={record.uuid}>公司维护</a>
	    </span>
	  ),
	}];

	return (
		<div style={{backgroundColor:'#FEFEFE', width:'100%', height:'100%'}}>
	    <ErrorMsg message={errMsg} toggle={this.onDismiss}/>

			<Button color="primary" onClick={this.handleQueryClick}>刷新</Button>{' '}
			<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} pagination={false} scroll={{y:600}} bordered />
      </div>);
  }
});

var CampusListPage = withRouter(CampusListPage2);

ReactMixin.onClass(CampusListPage2, Reflux.connect(CampusStore, 'campusSet'));
module.exports = CampusListPage;
