'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input,Radio,message,Upload,} from 'antd';
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var BmCompanyActions = require('./action/BmCompanyActions');
var BmUserStore = require('./data/BmCompanyStore');

import EnclosurePage from './component/EnclosurePage';
import UpdatePage from './component/UpdatePage';
import AddPage from './component/AddPage';
import DetailPage from './component/DetailPage';
import XlsDown from '../../../lib/Components/XlsDown';
import XlsTempFile from '../../../lib/Components/XlsTempFile';
import XlsConfig from './lib/XlsConfig';
var pageRows = 10;
var CompanyInfoPage = React.createClass({
    getInitialState : function() {
        return {
            recruitSet: {
                recordSet: [],
                errMsg : '',
                startPage : 1,
				pageRow : 10,
				totalRow : 0,
            },
            filter:{},
            loading:false,
            filterValue:'',
            selectedRowKeys:[],
            modal:false,
            arr:[]
        }
    },
     mixins: [Reflux.listenTo(BmUserStore, "onServiceComplete"),XlsTempFile()],
     onServiceComplete: function(data) {
     	console.log(data)
        this.setState({
            loading: false,
            recruitSet: data,
        });    
    },
    componentDidMount:function(){
    	this.state.validRules = [
			{id: 'cmpCode', desc:'公司编码', required: false, max: '32'},
			{id: 'cmpAbbr', desc:'公司简称', required: false, max: '255'},
			{id: 'cmpName', desc:'公司名称', required: false, max: '255'},
			{id: 'cmpEnname', desc:'英文名称', required: false, max: '255'},
			{id: 'cmpDomain', desc:'行业', required: false, max: '80'},
			{id: 'cmpContacts', desc:'联系人', required: false, max: '255'},
			{id: 'cmpAddr', desc:'公司地址', required: false, max: '255'},
		];
		var filter = this.state.filter;	
		BmCompanyActions.initBmCompany();
    },
     //刷新
    handleRefresh:function(event){
    	this.setState({loading: true});
		var filter=this.state.filter;
		BmCompanyActions.retrieveBmCompanyPage(filter,this.state.recruitSet.startPage,pageRows );
    },
    //详情
    
    onClickDetail:function(field){
    	this.refs.DetailWindow.initPage(field);
    	this.refs.DetailWindow.toggle()
    },
    //增加公司
    handleAdd:function(event){
    	this.refs.AddWindow.clear();
        this.refs.AddWindow.toggle();
    },
    //编辑公司
    handleUpdate:function(field){
    	this.refs.UpdateWindow.initPage(field);
        this.refs.UpdateWindow.toggle();
    },
    
    //删除公司
     onClickDelete  : function(recruit, event)
    {
    	console.log(recruit)
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的 公司【'+recruit.cmpName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, recruit)
        });
    },

    onClickDelete2 : function(recruit)
    {
    	console.log(recruit)
        this.setState({loading: true});
        BmCompanyActions.deleteBmCompany( recruit.uuid );
    },  
    //导入
   beforeUpload: function(file) {
		this.setState({loading: true});
		var url = Utils.tbugUrl+'bm-company/importFiles';  
		console.log(this.state.recruitSet)
        var data ={};
		this.uploadXlsFile(url, data, XlsConfig.bmCompanyFields, file, this.uploadComplete);
		return false;
    },
    uploadComplete: function(errMsg){
		this.setState({loading: false});
		if(errMsg !== ''){
			Common.infoMsg(errMsg);
		}
		this.handleRefresh();
	},
   
    onSearch:function(objList, filterValue){
		
		if(filterValue === null || typeof(filterValue) === 'undefined' || filterValue === ''){
				return objList;
		}
		var rs=[];
		objList.map(function(node) {
			if((node.cmpCode.indexOf(filterValue)>=0)||(node.cmpName.indexOf(filterValue)>=0)){
				rs.push( node );
			}
		});
		return rs;
	},
	//附件
	 onClickEnclosure : function(field){ 
	 	
    	this.refs.EnclosureWindow.initPage(field)
    	this.refs.EnclosureWindow.toggle();
    },
    //详细查看
      onClickLook:function(field){
      	this.refs.DetailWindow.initPage(field)
    	this.refs.DetailWindow.toggle();
      },
	
//  onSelectChange: function (selectedRowKeys){
//      this.setState({ selectedRowKeys: selectedRowKeys });
//     
//  },
     //添加
     handleAdd:function(event){
     	this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
     },
     //下载模板
     handleTempDown:function(){
     	this.downXlsTempFile(XlsConfig.bmCompanyFields);
     },
     //翻页相关
   onShowSizeChange: function(current, pageSize){
        pageRows = pageSize;
        this.handleRefresh();
    },
    onChangePage: function(pageNumber){
        this.state.recruitSet.startPage = pageNumber;
        this.handleRefresh();
    },
     onFilterRecord: function(e){
        this.setState( {filterValue: e.target.value} );
    },
 //导出
    handleArrowDown:function(){
	        var data = [];
	        var recordSet = Common.filter(this.state.arr,this.state.filterValue);
	        var checkMemberFields = [
	              {id:'A', name:'cmpCode', title:'公司编码'},
	              {id:'B',name:"cmpAbbr",title:'公司简称'}, 
		          {id:'C', name:'cmpName', title:'公司名称'},
		          {id:'D',name:"cmpEnname",title:'英文名称'},
		          {id:'E',name:"cmpDomain",title:"行业"},
		          {id:'F',name:"cmpAddr",title:"地址"},
                  {id:'G',name:"cmpContacts",title:"联系人"},  
                  {id:'H',name:"remark",title:"备注"},  
	        ];
	        this.downXlsTempFile2(checkMemberFields, recordSet, this.refs.xls)	
    },
    render : function() {
    	      var recordSet = this.onSearch(this.state.recruitSet.recordSet, this.state.filterValue);
    	      
		      console.log(this.state.recruitSet.recordSet)
		      var corpUuid = window.loginData.compUser.corpUuid;
    	     
    	      //  	      const { selectedRowKeys } = this.state;
//	    	  const rowSelection = {
//		            selectedRowKeys,
//		            onChange: this.onSelectChange
//		        };
               var opCol = {
					title: '操作',
					key: 'action',
					width: 90,
					render: (text, record) => (
						<span>
							<a href="#"  title='更新' onClick={this.handleUpdate.bind(this,record)}><Icon type={Common.iconUpdate}/></a>
							<span className="ant-divider" />
							<a href="#" title='删除' onClick={this.onClickDelete.bind(this, record)}><Icon type={Common.iconRemove}/></a>
						</span>
					),
				};
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
            		    title: '公司编码',
            		    dataIndex: 'cmpCode',
            		    key: 'cmpCode',
            		    width: 140,
            		    render:(text,record) => (
            		    	<a href="#" onClick={this.onClickDetail.bind(this,record)}>{text}</a>
            		    )
      		        },
      		       {
            		    title: '公司简称',
            		    dataIndex: 'cmpAbbr',
            		    key: 'cmpAbbr',
            		    width: 140,
            		    render:(text,record) => (
            		    	<a href="#" onClick={this.onClickDetail.bind(this,record)}>{text}</a>
            		    )
      		        },
      		       {
            		    title: '公司名称',
            		    dataIndex: 'cmpName',
            		    key: 'cmpName',
            		    width: 140,
            		    render:(text,record) => (
            		    	<a href="#" onClick={this.onClickDetail.bind(this,record)}>{text}</a>
            		    )
      		        },
      		       {
            		    title: '英文名称',
            		    dataIndex: 'cmpEnname',
            		    key: 'cmpEnname',
            		    width: 140,
      		        },
      		       {
            		    title: '行业',
            		    dataIndex: 'cmpDomain',
            		    key: 'cmpDomain',
            		    width: 140,
      		        },
      		       {
            		    title: '联系人',
            		    dataIndex: 'cmpContacts',
            		    key: 'cmpContacts',
            		    width: 140,
      		        },
      		       {
            		    title: '公司地址',
            		    dataIndex: 'cmpAddr',
            		    key: 'cmpAddr',
            		    width: 140,
      		        },
      		        opCol
      		        ];
      	   this.state.arr = [];
	       var uselistSet = this.state.recruitSet.recordSet;
	        if (uselistSet !== null && uselistSet.length > 0) {
	            for (var i = 0; i < uselistSet.length; i++) {
	                var obj = {};
	                var item = uselistSet[i];
	                obj.cmpCode = item.cmpCode;
	                obj.cmpAbbr = item.cmpAbbr;
	                obj.cmpName = item.cmpName;
	                obj.cmpEnname = item.cmpEnname;
	                obj.cmpDomain = item.cmpDomain;
	                obj.cmpContacts = item.cmpContacts;
	                obj.cmpAddr = item.cmpAddr;
	                obj.remark = item.remark;
	                this.state.arr.push(obj);
	            }
	        }
      	   var cs = Common.getGridMargin(this);
      	   var pag = {showQuickJumper: true, 
      	   	          total:this.state.recruitSet.totalRow,
      	   	          pageSize:this.state.recruitSet.pageRow, 
      	   	          current:this.state.recruitSet.startPage, 
      	   	          size:'large', 
      	   	          showSizeChanger:true,
      	   	          onShowSizeChange:this.onShowSizeChange, 
      	   	          onChange: this.onChangePage};
           var tablePage = (
            <div className='grid-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} type="primary" title="添加公司" onClick={this.handleAdd}/>
                            <Button icon="cloud-download-o" title='下载模板'  style={{marginLeft:'4px'}} onClick={this.handleTempDown}/>
                            <Button icon='arrow-down' title='导出' onClick={this.handleArrowDown} style={{marginLeft:'4px'}}/>
                            <Button icon='sync' title='刷新' onClick={this.handleRefresh} style={{marginLeft:'4px'}}/>
                            <Upload name='file' action='/posts/' beforeUpload={this.beforeUpload} style={{marginLeft: '4px'}}>
								<Button icon="upload" title='上传数据'/>
							</Upload>
					    </div>
					    <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
										<Search 
										    placeholder="公司编码/名称"
										    style={{width: Common.searchWidth}}
//										    value={this.state.filterValue}
										    onChange={this.onFilterRecord}
										    onSearch={this.onSearch}  />
									</div>
                    </div>
                </div>
                <div className='grid-body'>
                   <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid}  
                    size="middle" bordered={Common.tableBorder} 
                    pagination={pag}
//                  rowSelection={rowSelection}
                    />
                </div>
                <EnclosurePage ref='EnclosureWindow'/>
                <UpdatePage ref='UpdateWindow'/>
                <AddPage ref='createWindow'/>
                <DetailPage ref='DetailWindow'/>
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
module.exports = CompanyInfoPage;
