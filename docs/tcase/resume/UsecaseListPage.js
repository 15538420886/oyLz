'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input,Radio,message,Upload,} from 'antd';
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
var TmCaseStore = require('./data/TmCaseStore');
var TmCaseActions = require('./action/TmCaseActions');

import CreateTmCasePage from './components/CreateTmCasePage';
import UpdateTmCasePage from './components/UpdateTmCasePage';
import EnclosurePage from './components/EnclosurePage';
import TmBugPage from './components/TmBugPage';
import SeeTmCasePage from './components/SeeTmCase';




import RecruitFilter from './components/RecruitFilter';
import XlsDown from '../../lib/Components/XlsDown';
import XlsTempFile from '../../lib/Components/XlsTempFile';
import XlsConfig from '../lib/XlsConfig';
var pageRows = 10;
var UsecaseListPage = React.createClass({
    getInitialState : function() {
        return {
            recruitSet: {
                recordSet: [],
                errMsg : '',
                startPage : 1,
				pageRow : 10,
				totalRow : 0,
            },       
            loading: false,
            recruit: null,
            selectedRowKeys:[],
			moreFilter: false,
			filterValue: '',
			filter: {},
			arr:[],
			obj:{},
			uuid:''	,
			thisTmBug:[],
			
        }
    },

  mixins: [Reflux.listenTo(TmCaseStore, "onServiceComplete"),XlsTempFile()],
    onServiceComplete: function(data) {
    	console.log(data)
        this.setState({
            loading: false,
            recruitSet: data,
        });
       
        
    },
    changeThisTmBug:function(tmbug){
    	this.setState({
    		thisTmBug:tmbug
    	})
    },
	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
			{id: 'caseCode', desc:'用例编码', required: true, max: '80'},
			{id: 'reqCode', desc:'需求编码', required: false, max: '255'},
			{id: 'caseName', desc:'用例名称', required: true, max: '1000'},
			{id: 'mdlId', desc:'所属模块', required: false, max: '255'},
			{id: 'rsvStr1', desc:'标配字段', required: true, max: '255'},
			{id: 'caseRisk', desc:'风险级别', required: true, max: '255'},
			{id: 'casePriority', desc:'优先级', required: true, max: '255'},
			{id: 'casePrecondition', desc:'前置条件', required: false, max: '255'},
			{id: 'caseSteps', desc:'操作步骤', required: false, max: '255'},
			{id: 'caseExpect', desc:'预期结果', required: false, max: '255'},
			{id: 'caseType', desc:'用例类型', required: false, max: '255'},
			{id: 'caseDirection', desc:'正反例', required: false, max: '255'},
			{id: 'bugCode', desc:'缺陷编码', required: false, max: '255'},
			{id: 'regUser', desc:'创建人', required: true, max: '255'},
			{id: 'regDate', desc:'创建时间', required: false, max: '255'},
			{id: 'caseStat', desc:'用例状态', required: false, max: '255'},
		];
		
		
//		 this.setState({loading: false});
        // FIXME 查询条件
      
		var filter = this.state.recruitSet.uuid;
		
        TmCaseActions.retrieveTmCase(filter);
	},

    // 刷新
    handleQueryClick : function(event) {
		this.setState({loading: true});
		var filter=this.state.recruitSet.uuid;
		console.log(filter)
		TmCaseActions.retrieveTmCasePage(filter,this.state.recruitSet.startPage,pageRows );    
	},

	handleOpenCreateWindow : function(event) {
		
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
       
    },

	

    onClickUpdate : function(field)
    {
    	
        this.refs.updateWindow.initPage(field);
        this.refs.updateWindow.toggle();
    },
     onClickSee : function(field)
    {
    	console.log(field)
        this.refs.SeeTmCaseWindow.initPage(field);
        this.refs.SeeTmCaseWindow.toggle();
    },
    onClickEnclosure : function(field){
    	
    	this.refs.EnclosureWindow.initPage(field)
    	this.refs.EnclosureWindow.toggle();
    },
    onClickBugcode:function(filter,index){
    	var arr=filter.bugCode.split(","); 
    	console.log(index)
    	console.log(arr[index])
//  	this.refs.BugCodeWindow.initPage(filter.bugCode)
    	this.refs.BugCodeWindow.initPage(arr[index],filter.caseCode)
    	this.refs.BugCodeWindow.toggle()
    },
    onClickDelete : function(recruit, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的用例 【'+recruit.caseName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, recruit)
        });
    },

    onClickDelete2 : function(recruit)
    {
        this.setState({loading: true});
        TmCaseActions.deleteTmCase( recruit.uuid );
    },

    onFilterRecord: function(e){
        this.setState( {filterValue: e.target.value} );
    },

	filterToggle: function(event){
        this.setState({moreFilter: !this.state.moreFilter});
    },
     onSelectChange: function (selectedRowKeys) {
     	
        this.setState({ selectedRowKeys: selectedRowKeys });
       
    },
    //翻页
   onShowSizeChange: function(current, pageSize){
        pageRows = pageSize;
        this.handleQueryClick();
    },
    onChangePage: function(pageNumber){
        this.state.recruitSet.startPage = pageNumber;
        this.handleQueryClick();
    },
//快速查询
	onSearch:function(objList, filterValue){
		
		if(filterValue === null || typeof(filterValue) === 'undefined' || filterValue === ''){
				return objList;
		}
		
		var rs=[];
		
		objList.map(function(node) {
		 
			if((node.caseName.indexOf(filterValue)>=0)||(node.caseCode.indexOf(filterValue)>=0)){
				rs.push( node );
			}
		});
		return rs;
	},
	
	//下载/上传模板
	handleTempDown: function(e){
		this.downXlsTempFile(XlsConfig.usecaseFields);
    },
    uploadComplete: function(errMsg){
		this.setState({loading: false});
		if(errMsg !== ''){
			Common.infoMsg(errMsg);
		}
		this.handleQueryClick();
	},
	beforeUpload: function(file) {
		console.log(file)
//		if(this.state.recruitSet.deptUuid === ''){
//			MsgActions.showError('comp-user', 'retrieve','请先选择部门');
//			return false;
//		}
		this.setState({loading: true});
		var url = Utils.tcaseUrl+'tm-case/importtcase';
        var data = {uuid:this.state.recruitSet.uuid};
		this.uploadXlsFile(url, data, XlsConfig.usecaseFields, file, this.uploadComplete);
//      message.success('上传数据成功！');；；；；；；；；；/
      
		return false;
    },
//更多条件查询
	onSearch3:function(){
		var filter = this.refs.RecruitFilter.state.recruit;
		console.log(filter)
	  	TmCaseActions.search(filter,this.state.recruitSet.uuid);
    },
//
//onChangeFilter: function(e){
//		
//      this.setState( {filterValue: e.target.value} );
// },
	  //导出
	   xlsExport: function () {
	        var data = [];
	        console.log(this.state.arr)
	        var recordSet = Common.filter(this.state.arr,this.state.filterValue);
	        var checkMemberFields = [
	              {id:'A', name:'caseCode', title:'用例编码'},
	              {id:'B',name:"reqCode",title:'需求编码'}, 
		          {id:'C', name:'caseName', title:'用例名称'},
		          {id:'D',name:"mdlId",title:'模块'},
		          {id:'E',name:"rsvStr1",title:"用例描述"},
		          {id:'F',name:"caseRisk",title:"风险级别"},
                  {id:'G',name:"casePriority",title:"优先级"},
                  {id:'H',name:"casePrecondition",title:"前置条件"},
                  {id:'I', name:'caseSteps', title:'操作步骤'},
		          {id:'J', name:'caseExpect', title:'预期结果'},
		          {id:'K',name:"caseType",title:"用例类型"},
                  {id:'L',name:"caseDirection",title:"正反例"},         
                  {id:'M',name:"bugCode",title:"缺陷编号"},
                  {id:'N', name:'regUser', title:'创建人'},
                  {id:'O', name:'regDate', title:'创建时间'},
                  {id:'P', name:'caseStat', title:'用例状态'},     
	        ];
	        this.downXlsTempFile2(checkMemberFields, recordSet, this.refs.xls);
	   },
	   expandedRowRender:function(record,index) {
        const columns = [
            { title: '操作步骤', dataIndex: 'rsvStr2', key: 'rsvStr2', width:140, render: (text, record) => (Common.formatDate(text, Common.dateFormat))},
            { title: '预期结果', dataIndex: 'caseExpect', key: 'caseExpect', width:140}
          ];
          const data = this.state.recruitSet.recordSet[index].caseSteps;
          return (
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          );
    },
    deleteMore:function(){
    	
    	 var selRows = this.state.selectedRowKeys;
    	
    	 console.log(selRows)
        if (!selRows.length) {
            Common.infoMsg('请选择一些数据！');
        } else {
             TmCaseActions.deleteMore( selRows ,this.state.recruitSet.uuid); 
            
        }
        
    },
    onSelectChange: function (selectedRowKeys) {
    	
        this.setState({ selectedRowKeys: selectedRowKeys });
    },
//  getSelectedRows: function () {
//      var selRows = [];
//      var count = this.state.recruitSet.recordSet.length;
//      this.state.selectedRowKeys.map((data, i) => {
//          for (var i = 0; i < count; i++) {
//              if (this.state.recruitSet.recordSet[i].key === data) {
//                  selRows.push(this.state.recruitSet.recordSet[i]);
//                  break;
//              }
//          }
//      });
//
//      return selRows;
//     
//  },
//  
  
	
    render : function() {  	
		var recordSet = this.onSearch(this.state.recruitSet.recordSet, this.state.filterValue);
		var moreFilter = this.state.moreFilter;
		var corpUuid = window.loginData.compUser.corpUuid;

		var opCol = {
			title: '操作',
			key: 'action',
			width: 90,
			fixed:"right",
			render: (text, record) => (
				<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='更新'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove}/></a>
				</span>
			),
		};
//		 console.log(this.state.recruitSet.recordSet[1].bugCode.split(","))
		var columns = [];
		  columns = [
		 
		          {
		          	   title:"附件",
		          	   dataIndex:'',
		          	   key:'1111',
		               width:50,
		          	  
		          	   render: (text, record) => (
								<span>
									<a href="#" onClick={this.onClickEnclosure.bind(this, record)} ><Icon type="file" /></a>
								</span>
		              	),
		          	
		          },
        		 {
            		    title: '用例编码',
            		    dataIndex: 'caseCode',
            		    key: 'caseCode',
            		    width: 140,
            		    render: (text, record) => (
								<span>
									<a href="#" onClick={this.onClickSee.bind(this, record)} >{text}</a>
								</span>
		              	),
      		        },
      		       {
            		    title: '需求编码',
            		    dataIndex: 'reqCode',
            		    key: 'reqCode',
            		    width: 140,
            		  
      		        },
      		       {
            		    title: '用例名称',
            		    dataIndex: 'caseName',
            		    key: 'caseName',
            		    width: 140,
            		   
      		        },
      		       {
            		    title: '所属模块',
            		    dataIndex: 'mdlId',
            		    key: 'mdlId',
            		    width: 140,
      		        },
      		       {
            		    title: '用例描述',
            		    dataIndex: 'rsvStr1',
            		    key: 'rsvStr1',
            		    width: 140,
      		        },
      		       {
            		    title: '风险级别',
            		    dataIndex: 'caseRisk',
            		    key: 'caseRisk',
            		    width: 140,
      		        },
      		       {
            		    title: '优先级',
            		    dataIndex: 'casePriority',
            		    key: 'casePriority',
            		    width: 140,
      		        },
      		       {
            		    title: '前置条件',
            		    dataIndex: 'casePrecondition',
            		    key: 'casePrecondition',
            		    width: 140,
      		        },
//    		       {
//          		    title: '操作步骤',
//          		    dataIndex: 'caseSteps',
//          		    key: 'caseSteps',
//          		    width: 140,
//    		        },
//    		       {
//          		    title: '预期结果',
//          		    dataIndex: 'caseExpect',
//          		    key: 'caseExpect',
//          		    width: 140,
//    		        },
      		       {
            		    title: '用例类型',
            		    dataIndex: 'caseType',
            		    key: 'caseType',
            		    width: 140,
      		        },
      		       {
            		    title: '正反例',
            		    dataIndex: 'caseDirection',
            		    key: 'caseDirection',
            		    width: 140,
      		        },
      		       {
            		    title: '缺陷编码',
            		    dataIndex: 'bugCode',
            		    key: 'bugCode',
            		    width: 140,
            		    render: (text, record,index) => {
								var o = this;
                                if(this.state.recruitSet.recordSet[index].bugCode = ''){
                                	this.state.recruitSet.recordSet[index].bugCode = ','
                                }
								var list =  this.state.recruitSet.recordSet[index].bugCode.split(",").map(function(username,index){  
				                            return <li onClick={o.onClickBugcode.bind(this,record,index)}>{username}</li>
				                       })  
				                        
								return (
									<ul>
									{list}
									</ul>
								)
		              	}
      		        },
      		       {
            		    title: '创建人',
            		    dataIndex: 'regUser',
            		    key: 'regUser',
            		    width: 140,
      		        },
      		       {
            		    title: '创建时间',
            		    dataIndex: 'regDate',
            		    key: 'regDate',
            		    width: 140,
      		        },
      		       {
            		    title: '用例状态',
            		    dataIndex: 'caseStat',
            		    key: 'caseStat',
            		    width: 140,
      		        },
      		        opCol
      		        ]
	    this.state.arr = [];
        var usecaseSet = this.state.recruitSet.recordSet;
        if (usecaseSet !== null && usecaseSet.length > 0) {
            for (var i = 0; i < usecaseSet.length; i++) {
                var obj = {};
                var item = usecaseSet[i];
                for(var j = 0;j < item.caseSteps.length;j++){
                	if(obj.caseExpect == undefined || obj.caseSteps == undefined  ){
                		obj.caseExpect = '',
                		obj.caseSteps = ''
                	}
                	obj.caseExpect += j+1+':'+item.caseSteps[j].caseExpect+','
                	obj.caseSteps += j+1+':'+item.caseSteps[j].rsvStr2+','
                	
                }
                obj.caseCode = item.caseCode;
                obj.caseName = item.caseName;
                obj.bugName = item.bugName;
                obj.casePrecondition = item.casePrecondition;
                obj.casePriority = item.casePriority;                
                obj.regUser = item.regUser;
                obj.regDate = item.regDate;
                obj.caseStat = item.caseStat;                
                obj.reqCode = item.reqCode;
                obj.mdlId = item.mdlId;
                obj.rsvStr1 = item.rsvStr1;
                obj.caseRisk = item.caseRisk;
                obj.caseType = item.caseType;
                obj.caseDirection = item.caseDirection;
                obj.bugCode = item.bugCode;
               
                this.state.arr.push(obj);
            }
           
        }
        var cs = Common.getGridMargin(this);
        var pag = {showQuickJumper: true, total:this.state.recruitSet.totalRow, pageSize:this.state.recruitSet.pageRow, current:this.state.recruitSet.startPage, size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage};
       
//      var arrRecordSet = Common.filter(this.state.arr, this.state.filterValue);
        const { selectedRowKeys } = this.state;
       
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        var tablePage = (
            <div className='grid-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['recruit/retrieve', 'recruit/remove']}/>
					<RecruitFilter  ref="RecruitFilter" moreFilter={moreFilter} />
                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="增加用例" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
							<Button icon="cloud-download-o" title='下载模板'  style={{marginLeft:'4px'}} onClick={this.handleTempDown}/>
							<Button icon="arrow-down" title='导出数据' onClick={this.xlsExport} style={{marginLeft:'4px'}}/>
							<Button icon='delete' title='删除数据' onClick={this.deleteMore} style={{marginLeft:'4px'}}/>
							<Upload name='file' action='/posts/' beforeUpload={this.beforeUpload} style={{marginLeft: '4px'}}>
								<Button icon="upload" title='上传数据'/>
							</Upload>
							
						</div>
						{
								moreFilter ?
									<div style={{textAlign:'right', width:'100%'}}>
										<Button title="查询"
										    onClick={this.onSearch3}
										    loading={this.state.loading} 
										    style={{marginRight:'8px'}}>
										查询</Button>
										<Button title="快速条件" onClick={this.filterToggle}>快速条件</Button>
									</div>
									:
									<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
										<Search 
										    placeholder="编号/名称"
										    style={{width: Common.searchWidth}}
//										    value={this.state.filterValue}
										    onChange={this.onFilterRecord}
										    onSearch={this.onSearch}  />
										<Button title="更多条件" onClick={this.filterToggle} style={{marginLeft:'8px'}}>更多条件</Button>
									</div>
						}
                    </div>
                </div>
                <div className='grid-body'>
                    <Table scroll={{ x: 1500, y: 800 }} columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} 
                    size="middle" bordered={Common.tableBorder} expandedRowRender={this.expandedRowRender}
                    rowSelection={rowSelection}
                    />
                </div>
                  <CreateTmCasePage  ref="createWindow"/>
                  <UpdateTmCasePage ref='updateWindow' text={this.state.recruitSet.uuid}/>
                  <EnclosurePage ref='EnclosureWindow'/>
                  <TmBugPage ref='BugCodeWindow'/>
                  <SeeTmCasePage ref='SeeTmCaseWindow'/>
                <XlsDown ref='xls' />
            </div>
        );
		return (
			<div style={{width: '100%',height:'100%'}}>
				{tablePage}	
			</div>
		);
    }
});
module.exports = UsecaseListPage;
