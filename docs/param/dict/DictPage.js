'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;
import ServiceMsg from '../../lib/Components/ServiceMsg';

var Context = require('../ParamContext');
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');

import DictTable from './Components/DictTable';
import DictarrTable from './Components/DictarrTable';
import DictIndexTree from './Components/DictIndexTree';
import DictDefTable from '../dict-def/DictDefPage';

var DictPage = React.createClass({
    getInitialState : function() {
        return {
            hiberarchy:'',
            indexCode: '',
            indexName: '',
            modUuid: '',
        }
    },
  
    // 页面跳转
    componentWillReceiveProps: function(nextProps){
      var q = nextProps.location.query;
      if(q != null && typeof(q) != 'undefined'){
          if(q.app != null && typeof(q.app) != 'undefined'){
              Context.createContext( q.app );
              this.refs.dictIndexTree.refresh(q.app);
          }
      }
    },
    componentWillMount : function() {
      var q = this.props.location.query;
      if(q != null && typeof(q) != 'undefined'){
          if(q.app != null && typeof(q.app) != 'undefined'){
              Context.createContext( q.app );
          }
      }
  },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
    },

    onSelectDictIndex: function(indexCode ,hiberarchy, indexName, modUuid, selectedMod){
        this.setState({
            hiberarchy: hiberarchy,
            indexCode: indexCode,
            indexName: indexName,
            modUuid: modUuid,
        });

        if (hiberarchy==2) {
            if(typeof(this.refs.dictarrTable) != 'undefined'){
                this.refs.dictarrTable.loadData( indexCode );
            }
        }
        else if(hiberarchy==1){
            if(typeof(this.refs.dictTable) != 'undefined'){
                this.refs.dictTable.loadData( indexCode );
            }
        }else if(hiberarchy==0){
            if(typeof(this.refs.dictDefTable) != 'undefined'){
                this.refs.dictDefTable.onSelectMod( selectedMod );
            }
        };
    },

    render : function() {
    	return (
			<div className='grid-page' style={{height:'100%'}}>
				<ServiceMsg ref='mxgBox' svcList={['app-group/retrieve', 'SysCodeIndex/retrieve', 'SysCodeData/retrieve', 'SysCodeData/remove']}/>

        		<div style={{overflow:'hidden',height:'100%'}}>
                    <div style={{borderRight: '1px solid #e2e2e2', width:'220px', height:'100%', float:'left', overflowY:'auto'}}>
                        <DictIndexTree ref='dictIndexTree' onSelectNode={this.onSelectDictIndex} />
                    </div>

                    <div style={{height:'100%',overflow:'hidden', paddingLeft:'20px'}}>
                        <DictDefTable ref="dictDefTable"  hiberarchy={this.state.hiberarchy} />
                        <DictarrTable ref="dictarrTable" hiberarchy={this.state.hiberarchy} indexCode={this.state.indexCode} indexName={this.state.indexName}/>
                        <DictTable ref="dictTable" hiberarchy={this.state.hiberarchy} indexCode={this.state.indexCode} indexName={this.state.indexName}/>
                </div>

                </div>
          </div>);
      }
});

module.exports = DictPage;
