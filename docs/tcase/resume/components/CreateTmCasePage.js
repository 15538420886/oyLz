import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import DictSelect from '../../../lib/Components/DictSelect';
import { Form, Modal, Button, Input, Select, Spin, AutoComplete,Row, Col,message,Table,Popconfirm ,Icon} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const Option1 = AutoComplete.Option;

//import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
//import HTML5Backend from 'react-dnd-html5-backend';
//import update from 'immutability-helper';
var QueryStore = require('../data/TmCaseStore');
var QueryActions = require('../action/TmCaseActions');
import EditableCell from './EditableCellPage';
var CreateTmCasePage = React.createClass({
    getInitialState: function () {
        return {
            caselistSet: {
                employee: {},
                operation: '',
                errMsg: '',
                
            },
            disabled: false,
            loading: false,
            employeeLoading: false,
            modal: false,
            caselist: {
            	caseSteps:[],
            },
            hints: {},
            validRules: [],
            result: [],
            pid:'',
            table:'',
            columns2:[],
            hehe:'',
           
          

	dataSource: [{
    
        rsvStr2: '',
        caseExpect: '',
      }],
      count: '',
		    }
    },

    mixins: [Reflux.listenTo(QueryStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        console.log(data)
        this.setState({
        	pid:data.uuid,
        	caselistSet: data,
        	hehe:data
        })
//      if (this.state.modal && data.operation === 'create') {
//          if (data.errMsg === '') {
//              // 成功，关闭窗口
//              this.setState({
//                  modal: false
//              });
//              ResumeActions.getResumeByIdCode(data.recordSet[0].idCode);
//
//          }
//          else {
//              // 失败
//              this.setState({
//                  loading: false,
//                  caselistSet: data
//              });
//          }
//      } else if (this.state.modal && data.operation === 'retrieveEmployee') {
//          if (data.employee.length === 1) {
//              this.state.caselist.caseRisk = data.employee[0].caseRisk;
//              this.state.caselist.idData1 = data.employee[0].idCode;
//              this.state.disabled = true;
//          } else {
//              this.state.disabled = false;
//          }
//          this.setState({
//              employeeLoading: false,
//              caselistSet: data
//          });
//
//      }
    },

    // 第一次加载
    componentDidMount: function () {
       this.state.validRules = [
			{id: 'caseName', desc:'用例名称', required: true, max: '1000'},
			{id: 'caseStat', desc:'用例状态', required: true, max: '255'},
			{id: 'caseType', desc:'用例类型', required: false, max: '255'},
			{id: 'reqCode', desc:'需求编码', required: false, max: '255'},
			{id: 'caseRisk', desc:'风险级别', required: false, max: '255'},
			{id: 'casePriority', desc:'优先级', required: false, max: '255'},
			{id: 'caseExecType', desc:'执行类型', required: false, max: '65535'},
			{id: 'caseDirection', desc:'正反例', required: false, max: '255'},
			{id: 'casePrecondition', desc:'前置条件', required: false, max: '255'},
			{id: 'caseDataneeds', desc:'测试数据', required: false, max: '255'},
	{id: 'caseCode', desc:'用例编码', required: false, max: '255'},
			{id: 'caseExpect', desc:'预期结果', required: false, max: '255'},
			{id: 'remark', desc:'备注', required: false, max: '255'},
			{id: 'rsvStr1', desc:'用例描述', required: false, max: '255'},
	        {id: 'rsvStr2', desc:'', required: false, max: '80'},
		];
    },
     clear: function (staffCode) {
        this.state.hints = {};
		this.state.caselist.caseName='';
		this.state.caselist.caseStat='';
		this.state.caselist.caseType='';
		this.state.caselist.reqCode='';
		this.state.caselist.caseRisk='';
		this.state.caselist.casePriority='';
		this.state.caselist.caseDirection='';
		this.state.caselist.caseExecType='';
		this.state.caselist.casePrecondition='';
		this.state.caselist.caseDataneeds='';
		this.state.caselist.caseSteps=[];
		this.state.caselist.caseExpect='';
		this.state.caselist.remark='';
		this.state.caselist.caseCode ='';
		this.state.caselist.rsvStr1 ='',
		this.state.caselist.rsvStr2 =''

        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
        if (staffCode) {
            var filter = {};
            filter.staffCode = staffCode;
            filter.corpUuid = window.loginData.compUser.corpUuid;
            QueryActions.retrieveTmCase(filter);
        }
    },

//  initPage: function (caselist) {
//  	console.log(caselist)
//      this.state.hints = {};
//      Utils.copyValue(caselist, this.state.caselist);
//      var columns=[]
//       columns = [ 
//             {
//             	title:'',
//             	dataIndex:'hehe',
//             	width:'5%',
//              render:(text,record,index)=>(
//              	<p>{index+1}</p>
//              )
//             
//             },{
//			      title: '操作步骤',
//			      dataIndex: 'rsvStr2',
//			      width:'40%',
//			      render: (text, record, index) =>
//			      (
//			      	
//			      	 <EditableCell value={this.state.caselist.caseSteps[index].rsvStr2} onChange={this.handleOnChangeCell(index,'rsvStr2')} />
//			      ),
//			    }, {
//			      title: '预期结果',
//			      dataIndex: 'caseExpect',
//			      width:'40%',
//			      render:(text,record,index)=>(
//			      	   <EditableCell value={this.state.caselist.caseSteps[index].caseExpect} onChange={this.handleOnChangeCell(index,'caseExpect')} />
//			      ) 
//			    }, {
//			      title: '操作',
//			      dataIndex: 'operation',
//			      width:'15%',
//			      render: (text, record, index) => (	       
//			        	<div>
//				            <Popconfirm title="确定删除此条信息?" onConfirm={() => this.onDelete(index)}>
//				              <Icon type="delete" style={{cursor:"pointer"}} />
//				            </Popconfirm>
//				            <Icon type="arrow-up" onClick={this.onUp.bind(this,index)}  style={{marginLeft:'18px',cursor:"pointer"}}/>
//				            <Icon type="arrow-down" onClick={this.onDown.bind(this,index)} style={{marginLeft:'18px',cursor:"pointer"}}/>
//				        </div>
//				    
//			      )
//           }]
//      var tablehtml = <Table bordered dataSource={this.state.caselist.caseSteps} columns={columns} />      
//      this.setState({
//      	table:tablehtml,
//      })
//      this.state.loading = false;
//      if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
//          this.refs.mxgBox.clear();
//      }
//  },
    handleOnChange: function (e) {
    	
        var caselist = this.state.caselist;
        caselist[e.target.id] = e.target.value;
        
        Validator.validator(this, caselist, e.target.id);
        this.setState({
            caselist: caselist
        });
    },

    onClickSave: function () {
        if (Validator.validator(this, this.state.caselist)) {
	        console.log()
             QueryActions.createTmCase(this.state.caselist,this.props.text,this.state.caselistSet.startPage,this.state.caselistSet.pageRow)
//	       
//          this.state.caselistSet.operation = '';
            this.setState({
               modal: !this.state.modal
              
            });
//            message.success('修改数据成功！');
        }
        else {
            this.setState({
                hint: this.state.hint
            });
             message.error('发生了错误！');
        }
    },
    handleOnSelected: function (id, value) {
        console.log(id)
        var caselist = this.state.caselist;
        caselist[id] = value;
        Validator.validator(this, caselist, id);
        this.setState({
            caselist: caselist
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
    //删除
    onDelete:function(index){
    	 console.log(index)
		 console.log(this.state.caselist);
		var arr = this.state.caselist.caseSteps.splice(index,1);
		 console.log(this.state.caselist);
		 this.onServiceComplete(this.state.caselist )
    },
    //添加一行
    handleAdd:function(){
    	    const {dataSource} = this.state.caselist.caseSteps
    	    if(this.state.caselist.caseSteps == ''){
    	    	this.state.caselist.caseSteps = []
    	    }
    	    console.log(this.state.caselist.caseSteps.length)
		    const newData = {
		      key: this.state.caselist.caseSteps.length,
		      rsvStr2: '',
		      caseExpect:'',
		    }    
		    let State = this.state; 
		    console.log(State)
		    State.caselist.caseSteps.push(newData);
		    
		    this.setState(State)
		    
		    var columns2 = []
    		columns2=[
               {
               	title:'',
               	dataIndex:'hehe',
               	width:'5%',
                render:(text,record,index)=>(
                	<p>{index+1}</p>
                )
               
               },{
			      title: '操作步骤',
			      dataIndex: 'rsvStr2',
			      width:'40%',
			      render: (text, record, index) =>
			      (
			      	
			      	 <EditableCell value={this.state.caselist.caseSteps[index].rsvStr2} onChange={this.handleOnChangeCell(index,'rsvStr2')} />
			      ),
			    }, {
			      title: '预期结果',
			      dataIndex: 'caseExpect',
			      width:'40%',
			      render:(text,record,index)=>(
			      	   <EditableCell value={this.state.caselist.caseSteps[index].caseExpect} onChange={this.handleOnChangeCell(index,'caseExpect')} />
			      ) 
			    }, {
			      title: '操作',
			      dataIndex: 'operation',
			      width:'15%',
			      render: (text, record, index) => (	       
			        	<div>
				            <Popconfirm title="确定删除此条信息?" onConfirm={() => this.onDelete(index)}>
				              <Icon type="delete" style={{cursor:"pointer"}} />
				            </Popconfirm>
				            <Icon type="arrow-up" onClick={this.onUp.bind(this,index)}  style={{marginLeft:'18px',cursor:"pointer"}}/>
				            <Icon type="arrow-down" onClick={this.onDown.bind(this,index)} style={{marginLeft:'18px',cursor:"pointer"}}/>
				        </div>
				    
			      )
             }]
        var arr = this.state.caselist.caseSteps
        var tablehtml2 = <Table bordered dataSource={arr} columns={columns2} />
        this.setState({
        	table:tablehtml2
        })
		    
    },
   handleOnChangeCell:function(index,key) {
       return (value) => {
	      const dataSource = [...this.state.caselist.caseSteps];
	      dataSource[index][key] = value;
	     this.setState({  ...this.state,caselist:{ ...this.state.caselist.caseSteps, caseSteps : dataSource   } })
         var caselist = this.state.caselist;
         this.setState({
         	caselist
         })
    };
   },
    //上移
    onUp:function(index){
    	const dataSource = [...this.state.caselist.caseSteps];
    	if(index == 0){
    		  message.error('已经是第一条数据！');
    	}else{
    	  
    	  index--
    	  const hehe = dataSource[index]     
    	  dataSource[index] = dataSource[index+1]
    	  dataSource[index+1] = hehe
    	  console.log(dataSource)
    	  
    	  let State = this.state;
    	  State.caselist.caseSteps = dataSource;
    	 
    	  this.setState({
    	  	State
    	  }) 
    	  console.log(this.state)
    	  var columns2 = []
    		columns2=[
               {
               	title:'',
               	dataIndex:'hehe',
               	width:'5%',
                render:(text,record,index)=>(
                	<p>{index+1}</p>
                )
               
               },{
			      title: '操作步骤',
			      dataIndex: 'rsvStr2',
			      width:'40%',
			      render: (text, record, index) =>
			      (
			      	
			      	 <EditableCell value={this.state.caselist.caseSteps[index].rsvStr2} onChange={this.handleOnChangeCell(index,'rsvStr2')} />
			      ),
			    }, {
			      title: '预期结果',
			      dataIndex: 'caseExpect',
			      width:'40%',
			      render:(text,record,index)=>(
			      	   <EditableCell value={this.state.caselist.caseSteps[index].caseExpect} onChange={this.handleOnChangeCell(index,'caseExpect')} />
			      ) 
			    }, {
			      title: '操作',
			      dataIndex: 'operation',
			      width:'15%',
			      render: (text, record, index) => (	       
			        	<div>
				            <Popconfirm title="确定删除此条信息?" onConfirm={() => this.onDelete(index)}>
				              <Icon type="delete" style={{cursor:"pointer"}} />
				            </Popconfirm>
				            <Icon type="arrow-up" onClick={this.onUp.bind(this,index)}  style={{marginLeft:'18px',cursor:"pointer"}}/>
				            <Icon type="arrow-down" onClick={this.onDown.bind(this,index)} style={{marginLeft:'18px',cursor:"pointer"}}/>
				        </div>
				    
			      )
             }]
        var arr = this.state.caselist.caseSteps
        var tablehtml2 = <Table bordered dataSource={arr} columns={columns2} />
        this.setState({
        	table:tablehtml2
        })
          this.onServiceComplete(this.state.caselist )
    }
    	},
    //下移
    onDown:function(index){
    	 	const dataSource = [...this.state.caselist.caseSteps];
    	console.log(index)
    
    	if(index == this.state.caselist.caseSteps.length-1){
    		  message.error('已经是最后一条数据！');
    	}
    	else{
    		index++
    		const hehe = dataSource[index]
    		 dataSource[index] = dataSource[index-1]
	         dataSource[index-1] = hehe
	    	 let State = this.state;
    	    State.caselist.caseSteps = dataSource;
    	 
	    	  this.setState({
	    	  	State
	    	  }) 
	    	    console.log(this.state)
    	  var columns3 = []
    		columns3=[
               {
               	title:'',
               	dataIndex:'hehe',
               	width:'5%',
                render:(text,record,index)=>(
                	<p>{index+1}</p>
                )
               
               },{
			      title: '操作步骤',
			      dataIndex: 'rsvStr2',
			      width:'40%',
			      render: (text, record, index) =>
			      (
			      	
			      	 <EditableCell value={this.state.caselist.caseSteps[index].rsvStr2} onChange={this.handleOnChangeCell(index,'rsvStr2')} />
			      ),
			    }, {
			      title: '预期结果',
			      dataIndex: 'caseExpect',
			      width:'40%',
			      render:(text,record,index)=>(
			      	   <EditableCell value={this.state.caselist.caseSteps[index].caseExpect} onChange={this.handleOnChangeCell(index,'caseExpect')} />
			      ) 
			    }, {
			      title: '操作',
			      dataIndex: 'operation',
			      width:'15%',
			      render: (text, record, index) => (	       
			        	<div>
				            <Popconfirm title="确定删除此条信息?" onConfirm={() => this.onDelete(index)}>
				              <Icon type="delete" style={{cursor:"pointer"}} />
				            </Popconfirm>
				            <Icon type="arrow-up" onClick={this.onUp.bind(this,index)}  style={{marginLeft:'18px',cursor:"pointer"}}/>
				            <Icon type="arrow-down" onClick={this.onDown.bind(this,index)} style={{marginLeft:'18px',cursor:"pointer"}}/>
				        </div>
				    
			      )
             }]
        var arr = this.state.caselist.caseSteps
        var tablehtml2 = <Table bordered dataSource={arr} columns={columns3} />
        this.setState({
        	table:tablehtml2
        })
          this.onServiceComplete(this.state.caselist )
    	}
    	
    },
    emailOnChange: function (value) {
        var obj = this.state.caselist;
        obj.email = value;
        Validator.validator(this, obj, 'email');
        this.setState({
            loading: this.state.loading
        });
    },
  
    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 3 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 21 }),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 6 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 18 }),
        };
        const formItemLayout3 = {
            labelCol: ((layout == 'vertical') ? null : { span: 9 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 15 }),
        };
        let result = this.state.result;
        const children = result.map((email) => {
            return <Option1 key={email}>{email}</Option1>;
        });
 
        var hints = this.state.hints; 
        
        
        var form =
            <Form layout={layout}>
                <Row gutter={24}>
						<Col className="gutter-row" span={8}>
						  <FormItem {...formItemLayout3} label="用例名称" required={true} colon={true} className={layoutItem} help={hints.caseNameHint} validateStatus={hints.caseNameStatus}>
									<Input type="text" name="caseName" id="caseName" value={this.state.caselist.caseName } onChange={this.handleOnChange} />
						  </FormItem>
						</Col>
						<Col className="gutter-row" span={8}>
							<FormItem {...formItemLayout3} label="用例状态" required={true} colon={true} className={layoutItem} help={hints.caseStatHint} validateStatus={hints.caseStatStatus}>
									<DictSelect name="caseStat" id="caseStat" value={this.state.caselist.caseStat} appName='用例管理' optName='执行状态' onSelect={this.handleOnSelected.bind(this, "caseStat")}/>
						    </FormItem>	
						</Col>
						<Col className="gutter-row" span={8}>
						    <FormItem {...formItemLayout3} label="用例编码" required={true} colon={true} className={layoutItem} help={hints.caseCodeHint} validateStatus={hints.caseCodeStatus}>
								<Input type="text" name="caseCode" id="caseCode" value={this.state.caselist.caseCode } onChange={this.handleOnChange} />
							</FormItem>
						</Col>
				   </Row>
							<FormItem {...formItemLayout} label="用例描述" required={false} colon={true} className={layoutItem} help={hints.rsvStr1Hint} validateStatus={hints.rsvStr1Status}>
								<Input type="text" name="rsvStr1" id="rsvStr1" value={this.state.caselist.rsvStr1 } onChange={this.handleOnChange} />
							</FormItem>
							
					<Row gutter={24}>
						<Col className="gutter-row" span={12}>
							<FormItem {...formItemLayout2} label="执行类型" required={true} colon={true} className={layoutItem} help={hints.caseExecTypeHint} validateStatus={hints.caseExecTypeStatus}>
							    <DictSelect name="caseExecType" id="caseExecType" value={this.state.caselist.caseExecType} appName='用例管理' optName='执行类型' onSelect={this.handleOnSelected.bind(this, "caseExecType")}/>
							</FormItem>
						</Col>
						<Col className="gutter-row" span={12}>
							<FormItem {...formItemLayout2} label="需求编码" required={false} colon={true} className={layoutItem} help={hints.reqCodeHint} validateStatus={hints.reqCodeStatus}>
								<Input type="text" name="reqCode" id="reqCode" value={this.state.caselist.reqCode } onChange={this.handleOnChange} />
							</FormItem>
						</Col>
				   </Row>
				   <Row gutter={24}>
						<Col className="gutter-row" span={12}>
							<FormItem {...formItemLayout2} label="风险级别" required={true} colon={true} className={layoutItem} help={hints.caseRiskHint} validateStatus={hints.caseRiskStatus}>
								<DictSelect name="caseRisk" id="caseRisk" value={this.state.caselist.caseRisk} appName='用例管理' optName='风险级别' onSelect={this.handleOnSelected.bind(this, "caseRisk")}/>
							</FormItem>
						</Col>
						<Col className="gutter-row" span={12}>
							<FormItem {...formItemLayout2} label="优先级" required={true} colon={true} className={layoutItem} help={hints.casePriorityHint} validateStatus={hints.casePriorityStatus}>
								<DictSelect name="casePriority" id="casePriority" value={this.state.caselist.casePriority} appName='用例管理' optName='优先级' onSelect={this.handleOnSelected.bind(this, "casePriority")}/>
							</FormItem>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col className="gutter-row" span={12}>
							<FormItem {...formItemLayout2} label="用例类型" required={true} colon={true} className={layoutItem} help={hints.caseTypeHint} validateStatus={hints.caseTypeStatus}>
								<DictSelect name="caseType" id="caseType" value={this.state.caselist.caseType} appName='用例管理' optName='用例类型' onSelect={this.handleOnSelected.bind(this, "caseType")}/>
							</FormItem>
						</Col>
						<Col className="gutter-row" span={12}>
							<FormItem {...formItemLayout2} label="正反例" required={true} colon={true} className={layoutItem} help={hints.caseDirectionHint} validateStatus={hints.caseDirectionStatus}>
							    <DictSelect name="caseDirection" id="caseDirection" value={this.state.caselist.caseDirection} appName='用例管理' optName='正反例' onSelect={this.handleOnSelected.bind(this, "caseDirection")}/>
							</FormItem>
						</Col>
					</Row>
					
				   <Row gutter={24}>
							<FormItem {...formItemLayout} label="前置条件" required={false} colon={true} className={layoutItem} help={hints.casePreconditionHint} validateStatus={hints.casePreconditionStatus}>
								<Input type="text" name="casePrecondition" id="casePrecondition" value={this.state.caselist.casePrecondition } onChange={this.handleOnChange} />
							</FormItem>
					</Row>
				   <Row gutter={24}>
							<FormItem {...formItemLayout} label="测试数据" required={false} colon={true} className={layoutItem} help={hints.caseDataneedsHint} validateStatus={hints.caseDataneedsStatus}>
								<Input type="text" name="caseDataneeds" id="caseDataneeds" value={this.state.caselist.caseDataneeds } onChange={this.handleOnChange} />
							</FormItem>
					</Row>
				   <Row gutter={24}>
				          <FormItem {...formItemLayout} label="步骤" required={false} colon={true} className={layoutItem} help={hints.caseStepsHint} validateStatus={hints.caseStepsStatus}>
								<Icon type="plus-square-o" onClick={this.handleAdd} style={{cursor:'pointer'}}/>							
                                {this.state.table?this.state.table:""}
						  </FormItem>                            	
					</Row>
				  
				   <Row gutter={24}>
							<FormItem {...formItemLayout} label="备注" required={false} colon={true} className={layoutItem} help={hints.remarkHint} validateStatus={hints.remarkStatus}>
								<Input type="text" name="remark" id="remark" value={this.state.caselist.remark } onChange={this.handleOnChange} />
							</FormItem>
					</Row>
					
			  
			</Form>
        return (
            <Modal visible={this.state.modal} width='880px' title="修改用例信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['rescaselist/create']} />
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

export default CreateTmCasePage;
 