'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { browserHistory } from 'react-router'

var Context = require('../../AuthContext');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Input, Spin,Modal } from 'antd';
const Search = Input.Search;
var Utils = require('../../../public/script/utils');
var Common = require('../../../public/script/common');
var FntModActions = require('./action/FntModActions');
var FntModStore = require('./data/FntModStore');
import CreateFntModPage from './Components/CreateFntModPage';
import UpdateFntModPage from './Components/UpdateFntModPage';
import FntMenuPage from '../menu/FntMenuPage';

var filterValue = '';
var FntModPage = React.createClass({
    getInitialState : function() {
        return {
            fntModSet: {
                recordSet: [],
                operation : '',
                errMsg : ''
            },
            loading: false,
            selectedApp: null,
        }
    },

      mixins: [Reflux.listenTo(FntModStore, "onServiceComplete")],
      onServiceComplete: function(data) {
          this.setState({
            loading: false,
            fntModSet: data
        });
      },

    // 刷新
    handleQueryClick : function(event) {
		var appUuid = Context.fntApp.uuid;
        this.setState({loading: true});
		FntModActions.retrieveFntAppMod(appUuid);
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.fntModSet.operation = '';
        this.setState({loading: true});
		var appUuid = Context.fntApp.uuid;
        FntModActions.initFntAppMod(appUuid);
    },

    handleOpenCreateWindow : function(event) {
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

	handleUpdateClick:function(fntMod, event) {
		if(fntMod != null){
			this.refs.updateWindow.initPage(fntMod);
			this.refs.updateWindow.toggle();
		}
    	event.stopPropagation();
	},

    // 移除模块
    handleRemoveClick:function(fntMod,event)
    {
        Modal.confirm({
            title: '移除确认',
            content: '是否移除选中的应用 【'+fntMod.modCode+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickRemove2.bind(this, fntMod)
        });
    },

    // 跳转菜单维护
    handleAppClick:function(fntMod)
	{
        this.props.selectsMod(fntMod);
	},

    onClickRemove2 : function(fntMod)
    {
        this.setState({loading: true});
        FntModActions.deleteFntAppMod(fntMod.uuid);
    },

	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},

	render : function() {
        var recordSet = Common.filter(this.state.fntModSet.recordSet, filterValue);
        var cardList =
	      	recordSet.map((fntMod, i) => {
				return <div key={fntMod.uuid} className='card-div' style={{width: 300}}>
							<div className="ant-card ant-card-bordered" style={{width: '100%'}} onClick={this.handleAppClick.bind(this, fntMod)} title='点击进入菜单维护'>
								<div className="ant-card-head"><h3 className="ant-card-head-title">{fntMod.modCode}</h3></div>
								<div className="ant-card-extra">
									<a href="#" onClick={this.handleUpdateClick.bind(this, fntMod)} title='修改'><Icon type={Common.iconUpdate}/></a>
									<span className="ant-divider" />
									<a href="#" onClick={this.handleRemoveClick.bind(this, fntMod)} title='删除'><Icon type={Common.iconRemove}/></a>
								</div>
								<div className="ant-card-body" style={{cursor:'pointer', height:'66px', overflow:'hidden'}}>{fntMod.modName}</div>
							</div>
						</div>
	      	});

        var cs = Common.getCardMargin(this);
    	var contactTable = 
            <div className='card-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['fnt_app_mod/retrieve', 'fnt_app_mod/remove']}/>
          		    <div className='toolbar-card'>
          		    	<div style={{float:'left'}}>
          				    <div style={{paddingTop:'16px', paddingRight:'4px', display: 'inline'}}>{recordSet.length}个模块</div>
                  			<Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加模块' className='toolbar-icon' style={{color: '#108ee9'}}/>
                  			<Icon type="reload" onClick={this.handleQueryClick} title='刷新数据' className='toolbar-icon' style={{paddingLeft:'8px'}}/>
          				</div>
          				<div style={{textAlign:'right', width:'100%'}}>
                              <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                        </div>
          			</div>
                </div>

                 {
                    this.state.loading ?
                        <Spin tip="正在努力加载数据..." style={{minHeight: '200px'}}>{cardList}</Spin>
                        :
                        <div className='card-body'>{cardList}</div>
                }

				<CreateFntModPage ref="createWindow"/>
    			<UpdateFntModPage ref="updateWindow"/>
            </div>
        return (
            <div style={{width: '100%',height:'100%'}}>
                {contactTable}
            </div>
        );
      }
});
module.exports = FntModPage;
