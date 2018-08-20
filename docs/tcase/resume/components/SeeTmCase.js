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
var QueryStore = require('../data/TmCaseStore');
var QueryActions = require('../action/TmCaseActions');
import EditableCell from './EditableCellPage';
var SeeTmCase = React.createClass({
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
           
          

	dataSource: [{
        key: 0,
        rsvStr2: '',
        caseExpect: '',
      }],
      count: '',
		    }
    },

    mixins: [Reflux.listenTo(QueryStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        
        this.setState({
        	pid:data.uuid
        })
        console.log(this.state.pid)
        if (this.state.modal && data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({
                    modal: false
                });
                ResumeActions.getResumeByIdCode(data.recordSet[0].idCode);

            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    caselistSet: data
                });
            }
        } else if (this.state.modal && data.operation === 'retrieveEmployee') {
            if (data.employee.length === 1) {
                this.state.caselist.caseRisk = data.employee[0].caseRisk;
                this.state.caselist.idData1 = data.employee[0].idCode;
                this.state.disabled = true;
            } else {
                this.state.disabled = false;
            }
            this.setState({
                employeeLoading: false,
                caselistSet: data
            });

        }
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
	
			{id: 'caseExpect', desc:'预期结果', required: false, max: '255'},
			{id: 'remark', desc:'备注', required: false, max: '255'},
			{id: 'rsvStr1', desc:'用例描述', required: false, max: '255'},
	        {id: 'rsvStr2', desc:'', required: false, max: '80'},
		];
    },
    initPage: function (caselist) {
        this.state.hints = {};
        Utils.copyValue(caselist, this.state.caselist);

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    handleOnChange: function (e) {
        var caselist = this.state.caselist;
        caselist[e.target.id] = e.target.value;
        Validator.validator(this, caselist, e.target.id);
        this.setState({
            caselist: caselist
        });
    },

    onClickSave: function () {
    
//  	QueryActions.updateTmCase(this.state.caselist,this.state.pid)
    	
    	
        if (Validator.validator(this, this.state.caselist)) {
//	        console.log(this.state.caselist)
             QueryActions.updateTmCase(this.state.caselist,this.state.pid)
//	       
//          this.state.caselistSet.operation = '';
            this.setState({
               modal: !this.state.modal
              
            });
              message.success('修改数据成功！');
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
    	 const dataSource = [...this.state.caselist.caseSteps];
		 dataSource.splice(index, 1);
		 this.setState({...this.state,caselist:{...this.state.caselist,caseSteps:dataSource} })

    },
    //添加一行
    handleAdd:function(){
    	    const {dataSource} = this.state.caselist.caseSteps
    	    if(this.state.caselist.caseSteps == ''){
    	    	this.state.caselist.caseSteps = []
    	    }
    	    console.log(this.state.caselist.caseSteps)
		    const newData = {
//		      key: this.state.caselist.caseSteps.length,
		      rsvStr2: '',
		      caseExpect:'',
		    }    
		    let State = this.state; 
		    console.log(State)
		    State.caselist.caseSteps.push(newData);
		    
		    this.setState(State)
    },
   handleOnChangeCell:function(index,key) {
       return (value) => {
       	console.log(this.state)
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
    	console.log(index)
    	
    },
    //下移
    onDown:function(index){
    	console.log(index)
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
        let result = this.state.result;
        const children = result.map((email) => {
            return <Option1 key={email}>{email}</Option1>;
        });
       
        var hints = this.state.hints; 
        var opCol = {
			      title: '操作',
			      dataIndex: 'operation',
			      render: (text, record, index) => (	       
			        	<div>
				            <Popconfirm title="确定删除此条信息?" onConfirm={() => this.onDelete(index)}>
				              <Icon type="delete" style={{cursor:"pointer"}} />
				            </Popconfirm>
				            <Icon type="arrow-up" onClick={this.onUp(index)}  style={{marginLeft:'18px',cursor:"pointer"}}/>
				            <Icon type="arrow-down" onClick={this.onDown(index)} style={{marginLeft:'18px',cursor:"pointer"}}/>
				        </div>
				    
			      )
          };
        var columns = [];
          columns = [ {
			      title: '操作步骤',
			      dataIndex: 'rsvStr2',
			      width:'40%',
			      render: (text, record, index) =>
			      (
			      	 <Input readOnly={true} style={{border:'none'}} value={this.state.caselist.caseSteps[index].rsvStr2} onChange={this.handleOnChangeCell(index,'rsvStr2')} />
			      ),
			    }, {
			      title: '预期结果',
			      dataIndex: 'caseExpect',
			      width:'40%',
			      render:(text,record,index)=>(
			      	   <Input readOnly={true}  style={{border:'none'}}  value={this.state.caselist.caseSteps[index].caseExpect} onChange={this.handleOnChangeCell(index,'caseExpect')} />
			      ) 
			    }]
        
        
        
        var form =
            <Form layout={layout}>
                <Row gutter={24}>
						<Col className="gutter-row" span={12}>
						  <FormItem {...formItemLayout2} label="用例名称" required={true} colon={true} className={layoutItem} help={hints.caseNameHint} validateStatus={hints.caseNameStatus}>
									<Input readOnly={true}  type="text" name="caseName" id="caseName" value={this.state.caselist.caseName } onChange={this.handleOnChange} />
						  </FormItem>
						</Col>
						<Col className="gutter-row" span={12}>
							<FormItem {...formItemLayout2} label="用例状态" required={true} colon={true} className={layoutItem} help={hints.caseStatHint} validateStatus={hints.caseStatStatus}>
									<Input readOnly={true} name="caseStat" id="caseStat" value={this.state.caselist.caseStat} onChange={this.handleOnChange} />
						    </FormItem>	
						</Col>
				   </Row>
							<FormItem {...formItemLayout} label="用例描述" required={false} colon={true} className={layoutItem} help={hints.rsvStr1Hint} validateStatus={hints.rsvStr1Status}>
								<Input readOnly={true}  type="text" name="rsvStr1" id="rsvStr1" value={this.state.caselist.rsvStr1 } onChange={this.handleOnChange} />
							</FormItem>
					<Row gutter={24}>
						<Col className="gutter-row" span={12}>
							<FormItem {...formItemLayout2} label="执行类型" required={true} colon={true} className={layoutItem} help={hints.caseExecTypeHint} validateStatus={hints.caseExecTypeStatus}>
							    <Input readOnly={true} name="caseExecType" id="caseExecType" value={this.state.caselist.caseExecType} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col className="gutter-row" span={12}>
							<FormItem {...formItemLayout2} label="需求编码" required={false} colon={true} className={layoutItem} help={hints.reqCodeHint} validateStatus={hints.reqCodeStatus}>
								<Input readOnly={true}  type="text" name="reqCode" id="reqCode" value={this.state.caselist.reqCode } onChange={this.handleOnChange} />
							</FormItem>
						</Col>
				   </Row>
				   <Row gutter={24}>
						<Col className="gutter-row" span={12}>
							<FormItem {...formItemLayout2} label="风险级别" required={true} colon={true} className={layoutItem} help={hints.caseRiskHint} validateStatus={hints.caseRiskStatus}>
								<Input readOnly={true} name="caseRisk" id="caseRisk" value={this.state.caselist.caseRisk} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col className="gutter-row" span={12}>
							<FormItem {...formItemLayout2} label="优先级" required={true} colon={true} className={layoutItem} help={hints.casePriorityHint} validateStatus={hints.casePriorityStatus}>
								<Input readOnly={true} name="casePriority" id="casePriority" value={this.state.caselist.casePriority} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col className="gutter-row" span={12}>
							<FormItem {...formItemLayout2} label="用例类型" required={true} colon={true} className={layoutItem} help={hints.caseTypeHint} validateStatus={hints.caseTypeStatus}>
								<Input readOnly={true} name="caseType" id="caseType" value={this.state.caselist.caseType} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
						<Col className="gutter-row" span={12}>
							<FormItem {...formItemLayout2} label="正反例" required={true} colon={true} className={layoutItem} help={hints.caseDirectionHint} validateStatus={hints.caseDirectionStatus}>
							    <Input readOnly={true} name="caseDirection" id="caseDirection" value={this.state.caselist.caseDirection} onChange={this.handleOnChange} />
							</FormItem>
						</Col>
					</Row>
					
				   <Row gutter={24}>
							<FormItem {...formItemLayout} label="前置条件" required={false} colon={true} className={layoutItem} help={hints.casePreconditionHint} validateStatus={hints.casePreconditionStatus}>
								<Input readOnly={true}  type="text" name="casePrecondition" id="casePrecondition" value={this.state.caselist.casePrecondition } onChange={this.handleOnChange} />
							</FormItem>
					</Row>
				   <Row gutter={24}>
							<FormItem {...formItemLayout} label="测试数据" required={false} colon={true} className={layoutItem} help={hints.caseDataneedsHint} validateStatus={hints.caseDataneedsStatus}>
								<Input readOnly={true}  type="text" name="caseDataneeds" id="caseDataneeds" value={this.state.caselist.caseDataneeds } onChange={this.handleOnChange} />
							</FormItem>
					</Row>
				   <Row gutter={24}>
				          <FormItem {...formItemLayout} label="步骤" required={false} colon={true} className={layoutItem} help={hints.caseStepsHint} validateStatus={hints.caseStepsStatus}>
								
								<Table bordered dataSource={this.state.caselist.caseSteps} columns={columns} />
						  </FormItem>                            	
					</Row>
				  
				   <Row gutter={24}>
							<FormItem {...formItemLayout} label="备注" required={false} colon={true} className={layoutItem} help={hints.remarkHint} validateStatus={hints.remarkStatus}>
								<Input readOnly={true}  type="text" name="remark" id="remark" value={this.state.caselist.remark } onChange={this.handleOnChange} />
							</FormItem>
					</Row>
			  
			</Form>
        return (
            <Modal visible={this.state.modal} width='880px' title="查看用例信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
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

export default SeeTmCase;
 