'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');

import { Button, Table, Icon, Input, Modal } from 'antd';
const Search = Input.Search;
var Common = require('../../../public/script/common');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Utils = require('../../../public/script/utils');

import ProjTaskListPage from '../task/Components/ProjTaskListPage';
import ProjTaskTablePage from './Components/ProjTaskTablePage';

var filterValue = '';
var TaskMemberPage = React.createClass({
	getInitialState : function() {
		return {
			
		}
	},

	componentDidMount : function(){
    },
    onSelectProjTask:function(proj){ 
        this.refs.tablePage.initProjTask(proj);
    },
    render : function() {
		var cs = Common.getGridMargin(this, 0);
	    return (
    		<div className='grid-page' style={{padding: cs.padding}}>
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['proj-task-member/retrieve','proj-task-member/remove']} />
				</div>
		        <div style={{height:'100%', paddingLeft: '4px'}}>
		            <ProjTaskListPage ref='modList' caption='请选择订单' width='220px' onSelectProjTask={this.onSelectProjTask} >
		            	<ProjTaskTablePage ref="tablePage"/>
		            </ProjTaskListPage>
		        </div>
	        </div>
	    );
    }
});

module.exports = TaskMemberPage;

