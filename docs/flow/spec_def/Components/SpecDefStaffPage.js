
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Form,Button, Table, Select,Icon, Modal, Input,Row, Col,Checkbox} from 'antd';
const Search = Input.Search;
const FormItem = Form.Item;
import ModalForm from '../../../lib/Components/ModalForm';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');


import DictSelect from '../../../lib/Components/DictSelect';
var SpecDefStore = require('../data/SpecDefStore.js');
var SpecDefActions = require('../action/SpecDefActions');
import CreateSpecDefStaffPage from '../Components/CreateSpecDefStaffPage';

var filterValue = '';
var UpdateSpecDefStaffPage = React.createClass({
    getInitialState : function() {
        return {
            specDefSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
            loadingStaff: false,
            action: 'query',
            specDef: null,
            specDefStaff:{},
            filter:{},
            hints: {},
            addDisale:true,
            refreshDisale:true,
            inputDisale:true,
            validRules: [],
        }
    },

    mixins: [Reflux.listenTo(SpecDefStore, "onServiceComplete"), ModalForm('specDefStaff')],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            loadingStaff: false,
            specDefSet: data
        });
    },
    
    // 刷新
    handleQueryClick : function(event) {
        this.setState({loadingStaff: true});
       SpecDefActions.updateSpecFlowDef2( this.state.specDefStaff );
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
			{ id: 'flowCode', desc: '流程编号', required: true, max: 64,},
			{ id: 'flowName', desc: '流程名称', required: true, max: 64,},
			{ id: 'flowLevel', desc: '组织级别', required: true, max: 24,},
			{ id: 'flowBook', desc: '规章制度', max: 512,},
		];
    },
    clear : function(){
		this.setState({specDefStaff:''});  
        this.setState({addDisale: true,refreshDisale:true,inputDisale:true});
	},
    handleOpenCreateWindow : function(event) {
        this.setState({action: 'create',specDefStaff:this.state.specDefStaff });
    },
    onGoBack: function(){
        this.setState({action: 'query'});
    },
    onClickDelete : function(specDef, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的特批流程 【'+specDef.perName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, specDef)
        });
    },
    onClickDelete2 : function(specDefStaff)
    {
        this.setState({loadingStaff: true});
         var role = this.state.specDefStaff.role;
        role.splice(role.indexOf(specDefStaff),1);
        var role = this.state.specDefStaff.role;
        SpecDefActions.updateSpecFlowDef2(this.state.specDefStaff);
    },
   initPage:function(record){
        this.setState({specDefStaff:record});  
        this.setState({addDisale: false,refreshDisale:false,inputDisale:false}); 
    },
  
    onClickSave : function(){ 
		if(Common.formValidator(this, this.state.specDefStaff)){
			this.setState({loading: true});
			SpecDefActions.updateSpecFlowDef2( this.state.specDefStaff );
            this.props.query();
		}
	},
    render : function() {
        var hints=this.state.hints;
        var recordSet = this.state.specDefStaff.role;
        var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		const formItemLayout = {
			labelCol: ((layout == 'vertical') ? null : { span: 8 }),
			wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
		};
         const columns = [
            {
            	title: '机构',
            	dataIndex: 'orgName',
            	key: 'orgName',
            	width: 140,
            },
            {
            	title: '工号',
            	dataIndex: 'staffCode',
            	key: 'staffCode',
            	width: 140,
            },
            {
            	title: '姓名',
            	dataIndex: 'perName',
            	key: 'perName',
            	width: 140,
            },
            {
            	title: '属地',
            	dataIndex: 'baseCity',
            	key: 'baseCity',
            	width: 140,
            },
            {
                title: '更多操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span style={{marginLeft:'15px'}}>
                    <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除特批流程'><Icon type={Common.iconRemove}/></a>
                    </span>
                ),
            }
        ];

        var cs = Common.getGridMargin(this);
        var visible = (this.state.action === 'query') ? '' : 'none';
        var tablePage = (
            <div className='grid-page' style={{padding: cs.padding, display:visible,marginLeft: '20px'}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['spec_flow_def/retrieve', 'spec_flow_def/remove']}/>

                    <div className='toolbar-table'>
                        <div style={{float:'left'}}>
                            <Button icon={Common.iconAdd} disabled={this.state.addDisale} type="primary" title="增加特批流程" onClick={this.handleOpenCreateWindow}/>
                            <Button icon={Common.iconRefresh} disabled={this.state.refreshDisale} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
                        </div>
                    </div>
                </div>
                <div className='grid-body' style={{width:'93%'}}>
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid}  pagination={false} size="middle" bordered={Common.tableBorder} loading={this.state.loadingStaff}/>
                </div>
            </div>
        );
        var model=(
            <Form layout={layout} style={{paddingTop: '18px'}} >
                    <Row> 
                        <Col span="11">
                            <FormItem {...formItemLayout} className={layoutItem} label='流程编号' required={true} colon={true} help={hints.flowCodeHint} validateStatus={hints.flowCodeStatus} >
                                    <Input type='text' name='flowCode' id='flowCode' value={this.state.specDefStaff.flowCode} onChange={this.handleOnChange} disabled={this.state.inputDisale} />
                            </FormItem>
                        </Col>
                        <Col span="11">        
                            <FormItem {...formItemLayout} className={layoutItem} label='流程名称' required={true} colon={true} help={hints.flowNameHint} validateStatus={hints.flowNameStatus}>
                                    <Input type='text' name='flowName' id='flowName' value={this.state.specDefStaff.flowName} onChange={this.handleOnChange} disabled={this.state.inputDisale}/>
                            </FormItem>
                         </Col>
                    </Row> 
                    <Row>                         
						<Col span="11"> 
                        
							<FormItem {...formItemLayout} className={layoutItem} label='组织级别' required={true} colon={true} help={hints.flowLevelHint} validateStatus={hints.flowLevelStatus}>
									<DictSelect name='flowLevel' id='flowLevel' appName='流程管理' optName='特批组织级别' value={this.state.specDefStaff.flowLevel} onSelect={this.handleOnSelected.bind(this, 'flowLevel')} disabled={this.state.inputDisale}/>
							</FormItem>
						</Col>
						<Col span="11">
							<FormItem {...formItemLayout} className={layoutItem}  label='地区相关' colon={true} help={hints.flowLocHint} validateStatus={hints.flowLocStatus}>
								<Checkbox name='flowLoc' id='flowLoc' checked={(this.state.specDefStaff.flowLoc !== '0') ? true : false} onChange={this.handleCheckBox} disabled={this.state.inputDisale}></Checkbox>
							</FormItem>
						</Col>
						</Row> 
                        <Row>                         
						 <Col span="22"> 
                            <FormItem {...formItemLayout2} className={layoutItem} label='规章制度' colon={true} help={hints.flowBookHint} validateStatus={hints.flowBookStatus}>
                                    <Input type='textarea' name='flowBook' id='flowBook' style={{height: '100px'}} value={this.state.specDefStaff.flowBook} onChange={this.handleOnChange} disabled={this.state.inputDisale}/>
                            </FormItem>  
                         </Col>
						</Row> 
                        <Row>                         
						 <Col span="22">  
                            <FormItem style={{textAlign:'right',margin:'4px 0'}} className={layoutItem}>
                                <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading} disabled={this.state.inputDisale}>保存</Button>{' '}
                                <Button key="btnClose" size="large" onClick={this.goBack} disabled={this.state.inputDisale}>取消</Button>
                            </FormItem> 
                        </Col>
						</Row>  
				</Form>
        )
        
		var formPage = null;
		if(this.state.action === 'create'){
		    formPage = <CreateSpecDefStaffPage onBack={this.onGoBack} specDefStaff={this.state.specDefStaff}/>;
        }

		return (
			<div style={{width: '100%', height:'100%', padding: '8px 0 0 0'}}>
                {model}
				{tablePage}
				{formPage}
			</div>
		);
    }
});

module.exports = UpdateSpecDefStaffPage;