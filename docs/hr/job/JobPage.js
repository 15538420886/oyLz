'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { browserHistory } from 'react-router'

import WorkListPage from './Components/WorkListPage';
import JobTablePage from './Components/JobTablePage';
import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Spin} from 'antd';
var Utils = require('../../public/script/utils');

var JobPage = React.createClass({
    getInitialState : function() {
        return {
            loading: false,
            workUuid:'',
        }
    },

    // 第一次加载
    componentDidMount : function(){
    },

    handleWorkClick : function(work,index){
        this.state.workUuid = '';
        if( work !== null ){
            this.setState({
                workUuid: work.uuid
            })

            var workSet = this.refs.workList.state.workSet.recordSet;
            this.refs.JobTablePage.loadJobInfor(work, workSet);
        }
    },
    
    render : function() {
        return (
	      <div className='grid-page'>
            <WorkListPage ref='workList' width='220px' caption='请选择工种' onSelectWork={record => {this.handleWorkClick(record)}} corpUuid={window.loginData.compUser.corpUuid}>
                <div style={{paddingLeft: '16px', paddingRight: '16px'}}>
                    <JobTablePage workUuid={this.state.workUuid} ref='JobTablePage'/>
                </div>
            </WorkListPage>
	      </div>
        );
    }
});

module.exports = JobPage;