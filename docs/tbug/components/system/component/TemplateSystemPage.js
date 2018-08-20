import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Validator = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import DictSelect from '../../../../lib/Components/DictSelect';
import { Form, Modal, Button, Input, Select, Spin, AutoComplete,Row,Upload, Col,message,Table,Popconfirm ,Icon} from 'antd';
const FormItem = Form.Item;
const Dragger = Upload.Dragger;
const Option = Select.Option;
const Option1 = AutoComplete.Option;
import EditableCell from './EditableCellPage'

var BmSystemMdlActions = require('../action/BmSystemActions');
var BmSystemStore = require('../data/BmSystemStore');

var TemplateSystemPage = React.createClass({
    getInitialState: function () {
        return {
            companyListSet: {
                employee: {},
                operation: '',
                errMsg: ''
            },
            disabled: false,
            loading: false,
            employeeLoading: false,
            modal: false,
            companyListSet: {},
            hints: {},
            validRules: [],
            result: [],
//          columns: [{
//			      title: '模块编码',
//			      dataIndex: 'name',
//			      width: '30%',
//			      render: (text, record, index) => (
//			        <EditableCell
//			          value={text}
//			          onChange={this.onCellChange(index, 'name')}
//			        />
//			        
//			      ),
//			    }, {
//			      title: '模块名称',
//			      dataIndex: 'age',
//			      render: (text, record, index) => (
//			        <EditableCell
//			          value={text}
//			          onChange={this.onCellChange(index, 'age')}
//			        />
//			      ),
//			    }, {
//			      title: '开发人员',
//			      dataIndex: 'address',
//			      render: (text, record, index) => (
//			        <EditableCell
//			          value={text}
//			          onChange={this.onCellChange(index, 'address')}
//			        />
//			      ),
//			      
//			    },
//			     {
//			      title: '上级模块',
//			      dataIndex: 'address1',
//			      render: (text, record, index) => (
//			        <EditableCell
//			          value={text}
//			          onChange={this.onCellChange(index, 'address1')}
//			        />
//			      ),
//			    },
//			     {
//			      title: '最新版本号',
//			      dataIndex: 'address2',
//			      render: (text, record, index) => (
//			        <EditableCell
//			          value={text}
//			          onChange={this.onCellChange(index, 'address2')}
//			        />
//			      ),
//			      
//			    },
//			    {
//			      title: '模块描述',
//			      dataIndex: 'address3',
//			    },{
//			      title: '操作',
//			      dataIndex: 'operation',
//			      render: (text, record, index) => {
//			        return (
//			          this.state.dataSource.length > 1 ?
//			          (
//			            <Popconfirm title="确定删除这条记录?" onConfirm={() => this.onDelete(index)}>
//			              <a href="#"><Icon type='delete'/></a>
//			            </Popconfirm>
//			          ) : null
//			        );
//			      },
//			    }],

				      dataSource: [{
				        key: '0',
				        name: 'Edward King 0',
				        age: '32',
				        address: 'London, Park Lane no. 0',
				      }, {
				        key: '1',
				        name: 'Edward King 1',
				        age: '32',
				        address: 'London, Park Lane no. 1',
				      }],
				      count: 2,

			    
		    }
    },

    mixins: [Reflux.listenTo(BmSystemStore, "onServiceComplete")],
    onServiceComplete: function (data) {
    	console.log(data.systemmdl)
    	 this.setState({
                employeeLoading: false,
                companyListSet: data.systemmdl
          });
        if (this.state.modal && data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({
                    modal: false
                });
//              ResumeActions.getResumeByIdCode(data.recordSet[0].idCode);

            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    companyListSet: data.systemmdl
                });
            }
        } else if (this.state.modal && data.operation === 'retrieveEmployee') {
            if (data.employee.length === 1) {
                this.state.companyListSet.caseRisk = data.employee[0].caseRisk;
                this.state.companyListSet.idData1 = data.employee[0].idCode;
                this.state.disabled = true;
            } else {
                this.state.disabled = false;
            }
            this.setState({
                employeeLoading: false,
                companyListSet: data.systemmdl
            });

        }
    },

    // 第一次加载
    componentDidMount: function () {
       this.state.validRules = [
			{id: 'sysCode', desc:'系统编码', required: true, max: '255'},
			{id: 'rsvStr1', desc:'系统简称', required: true, max: '255'},
			{id: 'sysDevmanager', desc:'开发负责人', required: false, max: '32'},
			{id: 'sysTestmanager', desc:'测试负责人', required: false, max: '32'},
			{id: 'sysName', desc:'系统名称', required: true, max: '255'},
			{id: 'orgId', desc:'所属部门UUID', required: false, max: '255'},
			{id: 'sysVersion', desc:'最新版本号', required: false, max: '255'},
			{id: 'remark', desc:'备注', required: false, max: '512'},
		];
    },
   

//  clear: function (staffCode) {
//      this.state.hints = {};
//		this.state.companyListSet.sysCode='';
//		this.state.companyListSet.rsvStr1='';
//		this.state.companyListSet.sysDevmanager='';
//		this.state.companyListSet.sysTestmanager='';
//		this.state.companyListSet.sysName='';
//		this.state.companyListSet.orgId='';
//		this.state.companyListSet.sysVersion='';
//		this.state.companyListSet.remark='';
//
//
//      if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
//          this.refs.mxgBox.clear();
//      }
//      if (staffCode) {
//          var filter = {};
//          filter.staffCode = staffCode;
//          filter.corpUuid = window.loginData.compUser.corpUuid;
////          BmCompanyActions.retrieveTmCase(filter);
//      }
//  },
    initPage: function (parentsuuid) {
     	console.log(parentsuuid)
        this.state.hints = {};
        BmSystemMdlActions.bmSystemMdl(parentsuuid);
        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
        
    },

    handleOnChange: function (e) {
        var companyListSet = this.state.companyListSet;
        companyListSet[e.target.id] = e.target.value;
        Validator.validator(this, companyListSet, e.target.id);
        this.setState({
            companyListSet: companyListSet
        });
    },

    onClickSave: function () {
    	console.log(this.state.companyListSet)
    	BmSystemMdlActions.addBmSystemMdl(this.state.companyListSet);
    	 this.setState({
               modal: !this.state.modal
             });
    	
//      if (Validator.validator(this, this.state.companyListSet)) {
//          this.state.companyListSet.operation = '';
//          console.log(this.state.companyListSet)
//          BmSystemActions.addBmSystemMdl(this.state.companyListSet);
//           this.setState({
//             modal: !this.state.modal
//           });
//      }
//      else {
//          this.setState({
//              hint: this.state.hint
//          });
//           message.error('发生了错误！');
//      }
    },
    handleOnSelected: function (id, value) {
        
        var companyListSet = this.state.companyListSet;
        companyListSet[id] = value;
        Validator.validator(this, companyListSet, id);
        this.setState({
            companyListSet: companyListSet
        });
    },
     handleOnChange: function (e) {
        var companyListSet = this.state.companyListSet;
        companyListSet[e.target.id] = e.target.value;
        Validator.validator(this, companyListSet, e.target.id);
        this.setState({
            companyListSet: companyListSet
        });
    },

    toggle: function () {
        this.setState({
            modal: !this.state.modal
        });
    },

    handleSearch: function (value) {
        let result;
        if (!value || value.indexOf('@') >= 0) {
            result = [];
        } else {
            result = Validator.eMailList.map(domain => `${value}@${domain}`);
        }
        this.setState({ result });
    },
    
    
    onCellChange:function(index, key) {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      this.setState({ dataSource });
    };
  },
  onDelete:function(index) {
    const dataSource = [...this.state.dataSource];
    dataSource.splice(index, 1);
    this.setState({ dataSource });
  },
  //添加一行
  handleAdd:function() {
    const newData = {
      sysCode: '',
      sysName: '',
      sysDeverr:'',
      parentId:'',
      sysVersion:'',
      sysDesp:''
    };
    let State = this.state;
    State.companyListSet.push(newData)
    this.setState(State)
  },
    //删除
    onDelete:function(index){
    	 const dataSource = [...this.state.companyListSet];
		 dataSource.splice(index, 1);
         this.setState({
         	companyListSet:dataSource
         })
    },
   handleOnChangeCell:function(index,key) {
       return (value) => {
       	console.log(this.state)
	      const dataSource = [...this.state.companyListSet];
	      console.log(dataSource)
	      dataSource[index][key] = value;
	      console.log(dataSource[index][key])
	      console.log(dataSource)
	      this.setState({
	      	companyListSet:dataSource
	      })
	      console.log(this.state.companyListSet)
//	     this.setState({  ...this.state,caselist:{ ...this.state.caselist.caseSteps, caseSteps : dataSource   } })
      
    }
       
     },
    render: function () {
//  	      console.log(this.state.companyListSet[0].sysCode)
        		const columns = [
        		{
            		    title: '模块编码',
            		    dataIndex: 'sysCode',
            		    key: 'sysCode',
            		    width: 140,
            		    render: (text, record, index) => (
					      	 <EditableCell value={this.state.companyListSet[index].sysCode} onChange={this.handleOnChangeCell(index,'sysCode')} />
					      ),
      		        },
      		       {
            		    title: '模块名称',
            		    dataIndex: 'sysName',
            		    key: 'sysName',
            		    width: 140,
            		     render: (text, record, index) => (
					      	 <EditableCell value={this.state.companyListSet[index].sysName} onChange={this.handleOnChangeCell(index,'sysName')} />
					      ),
      		        },
      		       {
            		    title: '开发人员',
            		    dataIndex: 'sysDeverr',
            		    key: 'sysDeverr',
            		    width: 140,
            		     render: (text, record, index) => (
					      	 <EditableCell value={this.state.companyListSet[index].sysDeverr} onChange={this.handleOnChangeCell(index,'sysDeverr')}  />
					      ),
      		        },
      		       {
            		    title: '上级模块',
            		    dataIndex: 'parentId',
            		    key: 'parentId',
            		    width: 140,
            		     render: (text, record, index) => (
					      	 <EditableCell value={this.state.companyListSet[index].parentId} onChange={this.handleOnChangeCell(index,'parentId')} />
					      ),
      		        },
      		       {
            		    title: '最新版本号',
            		    dataIndex: 'sysVersion',
            		    key: 'sysVersion',
            		    width: 140,
            		     render: (text, record, index) => (
					      	 <EditableCell value={this.state.companyListSet[index].sysVersion} onChange={this.handleOnChangeCell(index,'sysVersion')} />
					      ),
      		        },
      		       {
            		    title: '模块描述',
            		    dataIndex: 'sysDesp',
            		    key: 'sysDesp',
            		    width: 140,
            		     render: (text, record, index) => (
					      	 <EditableCell value={this.state.companyListSet[index].sysDesp} onChange={this.handleOnChangeCell(index,'sysDesp')} />
					      ),
      		        },
      		         {
					      title: '操作',
					      dataIndex: 'operation',
					      key:'operation',
					      width: 30,
					      render: (text, record, index) => (			        
					        	<div>
						            <Popconfirm title="确定删除此条信息?" onConfirm={() => this.onDelete(index)}>
						              <Icon type="delete" style={{cursor:"pointer"}} />
						            </Popconfirm>         
						        </div>
				 
					      )
		             }
      		        ]
        var hints = this.state.hints;
        var form =
		       <div> 
		           
		           <Button className="editable-add-btn" onClick={this.handleAdd}>Add</Button>
		           <Table bordered dataSource={this.state.companyListSet} columns={columns} />
		       </div>     
        return (
            <Modal visible={this.state.modal} width='880px' title="模块管理" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                {this.state.employeeLoading ? <Spin>{form}</Spin> : form}
            </Modal>
        );
    }
});
export default TemplateSystemPage;