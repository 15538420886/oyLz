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
var BmUserActions = require('./action/BmUserActions');
var BmUserStore = require('./data/BmUserStore');
import CreateUserPage from './component/CreateUserPage';
import UpdateUserPage from './component/UpdateUserPage';
import EnclosurePage from './component/EnclosurePage';
import DetailUserPage from './component/DetailUserPage';
import XlsDown from '../../../lib/Components/XlsDown';
import XlsTempFile from '../../../lib/Components/XlsTempFile';
import XlsConfig from './lib/XlsConfig';
var pageRows = 10;
var UserPage = React.createClass({
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
            arr:[],
            oid:''
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
			{id: 'userCode', desc:'用户代码', required: true, max: '32'},
			{id: 'userName', desc:'用户名称', required: true, max: '80'},
			{id: 'nikeName', desc:'用户昵称', required: false, max: '80'},
			{id: 'empCode', desc:'员工工号', required: false, max: '32'},
			{id: 'disUse', desc:'用户角色', required: false, max: '255'},
			{id: 'mobileNo', desc:'手机号码', required: false, max: '80'},
			{id: 'rsvStr3', desc:'备注', required: false, max: '512'},
		];
		var filter = this.state.filter;	
		BmUserActions.initBmUser();
    },
     //刷新
    handleRefresh:function(event){
    	this.setState({loading: true});
		var filter=this.state.filter;
		BmUserActions.retrieveBmUserPage(filter,this.state.recruitSet.startPage,pageRows );
    },
    //增加用户
    handleAdd:function(event){
    	let oid = this.uuid0(32,16)
    	this.refs.AddWindow.initPage(oid);
        this.refs.AddWindow.toggle();
    },
    //编辑用户
    handleUpdate:function(field){
    	this.refs.UpdateWindow.initPage(field);
        this.refs.UpdateWindow.toggle();
    },
    //创建uuid
     uuid0:function(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
 
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;
 
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
 
      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
 
    return uuid.join('');
},

    
    //删除用户
     onClickDelete  : function(recruit, event)
    {
    	console.log(recruit)
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的 用户【'+recruit.userName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, recruit)
        });
    },

    onClickDelete2 : function(recruit)
    {
    	console.log(recruit)
        this.setState({loading: true});
        BmUserActions.deleteBmUser( recruit.uuid );
    },
   
    //重置密码
    onClickKey:function(recruit,event){
    	Modal.confirm({
            title: '修改确认',
            content: '是否重置用户【'+recruit.userName+'】的密码',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickKey2.bind(this, recruit)
        });
    	
    },
    onClickKey2:function(recruit){
    	console.log(recruit.uuid)
    	this.setState({loading: true});
        BmUserActions.updateBmUserKey( recruit.uuid );
    },
    
    //导入
   beforeUpload: function(file) {
		this.setState({loading: true});
		var url = Utils.tbugUrl+'bmUser/importFiles';  
		console.log(this.state.recruitSet)
        var data ={};
		this.uploadXlsFile(url, data, XlsConfig.bmUserFields, file, this.uploadComplete);
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
			if((node.userName.indexOf(filterValue)>=0)||(node.userCode.indexOf(filterValue)>=0)){
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
     //下载模板
     handleTempDown:function(){
     	this.downXlsTempFile(XlsConfig.bmUserFields);
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
	              {id:'A', name:'userCode', title:'用户编码'},
	              {id:'B',name:"userName",title:'用户名称'}, 
		          {id:'C', name:'nikeName', title:'用户昵称'},
		          {id:'D',name:"empCode",title:'员工工号'},
		          {id:'E',name:"disUse",title:"用户角色"},
		          {id:'F',name:"mobileNo",title:"手机号码"},
                  {id:'G',name:"rsvStr3",title:"备注"},    
	        ];
	        this.downXlsTempFile2(checkMemberFields, recordSet, this.refs.xls)	
    },
    render : function() {
    	      var recordSet = this.onSearch(this.state.recruitSet.recordSet, this.state.filterValue);
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
							<span className="ant-divider" />
							<a href="#" title='重置密码' onClick={this.onClickKey.bind(this,record)}><Icon type='key'/></a>
						</span>
					),
				};
		       var columns = [];
                columns = [
                   {
		          	   title:"附件",
		          	   dataIndex:'',
		          	   width: 50,
		          	   key:'1111',
		          	   render: (text, record) => (
								<span>
									<Icon type="file" onClick={this.onClickEnclosure.bind(this, record)}  style={{cursor:'pointer'}} />
								</span>
		              	),
		          	
		           },
                    
        	    	{
            		    title: '用户编码',
            		    dataIndex: 'userCode',
            		    key: 'userCode',
            		    width: 140,
            		    render: (text, record) => (
								<span>
									<a href='#'  onClick={this.onClickLook.bind(this, record)} > {text}</a>
								</span>
		              	)
      		        },
      		       {
            		    title: '用户名称',
            		    dataIndex: 'userName',
            		    key: 'userName',
            		    width: 140,
            		    render: (text, record) => (
								<span>
									<a href='#'  onClick={this.onClickLook.bind(this, record)} > {text}</a>
								</span>
		              	)
      		        },
      		       {
            		    title: '用户昵称',
            		    dataIndex: 'nikeName',
            		    key: 'nikeName',
            		    width: 140,
            		    render: (text, record) => (
								<span>
									<a href='#'  onClick={this.onClickLook.bind(this, record)} > {text}</a>
								</span>
		              	)
      		        },
      		       {
            		    title: '员工工号',
            		    dataIndex: 'empCode',
            		    key: 'empCode',
            		    width: 140,
      		        },
      		       {
            		    title: '用户角色',
            		    dataIndex: 'disUse',
            		    key: 'disUse',
            		    width: 140,
      		        },
      		       {
            		    title: '手机号码',
            		    dataIndex: 'mobileNo',
            		    key: 'mobileNo',
            		    width: 140,
      		        },
      		       {
            		    title: '备注',
            		    dataIndex: 'rsvStr3',
            		    key: 'rsvStr3',
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
	                obj.userCode = item.userCode;
	                obj.userName = item.userName;
	                obj.nikeName = item.nikeName;
	                obj.empCode = item.empCode;
	                obj.disUse = item.disUse;
	                obj.mobileNo = item.mobileNo;
	                obj.rsvStr3 = item.rsvStr3;
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
                            <Button icon={Common.iconAdd} type="primary" title="增加用户" onClick={this.handleAdd}/>
                            <Button icon="cloud-download-o" title='下载模板'  style={{marginLeft:'4px'}} onClick={this.handleTempDown}/>
                            <Button icon='arrow-down' title='导出' onClick={this.handleArrowDown} style={{marginLeft:'4px'}}/>
                            <Button icon='sync' title='刷新' onClick={this.handleRefresh} style={{marginLeft:'4px'}}/>
                            <Upload name='file' action='/posts/' beforeUpload={this.beforeUpload} style={{marginLeft: '4px'}}>
								<Button icon="upload" title='上传数据'/>
							</Upload>
					    </div>
					    <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
										<Search 
										    placeholder="用户编码/名称"
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
                <CreateUserPage ref='AddWindow'/>
                <UpdateUserPage ref='UpdateWindow'/>
                <EnclosurePage ref='EnclosureWindow'/>
                <DetailUserPage ref='DetailWindow'/>
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
module.exports = UserPage;
