import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
var Common = require('../../../../public/script/common');
var ProjContext = require('../../../ProjContext');
import { Form, Modal, Button, Input, Select, Row, Col, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var ProjReqFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
			hints: {},
			validRules: [],
			ProjReq: {
                projName:'',
                techCode:'',
                biziCode:'',
                manType:'',
                manLevel:'',
                induYears:'',
                reqType:'',
                beginDate1:'',
                status:'',
                beginDate2:'',
			},
		}
	},
    mixins: [ModalForm('ProjReq')],
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'projName', desc:'项目名称', required: false, max: '0'},
            {id: 'techCode', desc:'技术方向', required: false, max: '0'},
            {id: 'biziCode', desc:'业务方向', required: false, max: '0'},
            {id: 'manType', desc:'人员类型', required: false, max: '0'},
            {id: 'manLevel', desc:'人员级别', required: false, max: '0'},
            {id: 'induYears', desc:'从业经验', required: false, max: '0'},
            {id: 'reqType', desc:'变更类型', required: false, max: '0'},    
            {id: 'beginDate1', desc:'最早开始日期', required: false, max: '0'},
            {id: 'beginDate2', desc:'最晚开始日期', required: false, max: '0'},
            {id: 'status', desc:'状态', required: false, max: '0'},
        ];
	},
     componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },

	render : function() {
	   if( !this.state.modal ){
			return null;
		}

        var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
        var hints=this.state.hints;
	    return (
			<div style={{width:'100%', height:'156px', padding:'20px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '900px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'100%'}}>
                        <Row style={{textAlign:'right'}}>
                            <Col span="6"></Col>
                            <Col span="6">
                                <FormItem {...formItemLayout} label="项目名称" required={false} colon={true} className={layoutItem} help={hints.reqTypeHint} validateStatus={hints.reqTypeStatus}>
                                    <Input type="text" name="projName" id="projName" value={this.state.ProjReq.projName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem {...formItemLayout} label="技术方向" required={false} colon={true} className={layoutItem} help={hints.techCodeHint} validateStatus={hints.techCodeStatus}>
                                    <Input type="text" name="techCode" id="techCode" value={this.state.ProjReq.techCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem {...formItemLayout} label="业务方向" required={false} colon={true} className={layoutItem} help={hints.biziCodeHint} validateStatus={hints.biziCodeStatus}>
                                    <Input type="text" name="biziCode" id="biziCode" value={this.state.ProjReq.biziCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
						</Row>
                        <Row>
                        <Col span="6"></Col>
						  <Col span="6">
                            <FormItem {...formItemLayout} label="人员类型" required={false} colon={true} className={layoutItem} help={hints.manTypeHint} validateStatus={hints.manTypeStatus}>
                                <DictSelect name="manType" id="manType" value={this.state.ProjReq.manType} appName='项目管理' optName='人员需求类型' onSelect={this.handleOnSelected.bind(this, "manType")}/>
                            </FormItem>
						</Col>
						<Col span="6">
                            <FormItem {...formItemLayout} label="人员级别" required={false} colon={true} className={layoutItem} help={hints.manLevelHint} validateStatus={hints.manLevelStatus}>
                                <DictSelect name="manLevel" id="manLevel" value={this.state.ProjReq.manLevel } appName='项目管理' optName='人员级别' onSelect={this.handleOnSelected.bind(this, "manLevel")}/>
                            </FormItem>
						</Col>
                        <Col span="6">
                            <FormItem {...formItemLayout} label="从业经验" required={false} colon={true} className={layoutItem} help={hints.induYearsHint} validateStatus={hints.induYearsStatus}>
                                <Input type="text" name="induYears" id="induYears" value={this.state.ProjReq.induYears } onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        </Row>
                        <Row>
                        <Col span="6">
                            <FormItem {...formItemLayout} label="调动类型" required={false} colon={true} className={layoutItem} help={hints.reqTypeHint} validateStatus={hints.reqTypeStatus}>
                                <DictSelect name="reqType" id="reqType" value={this.state.ProjReq.reqType} appName='项目管理' optName='变更类型' onSelect={this.handleOnSelected.bind(this, "reqType")}/>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem {...formItemLayout} label="最早开始" required={false} colon={true} className={layoutItem} help={hints.beginDate1Hint} validateStatus={hints.beginDate1Status}>
                                <DatePicker style={{width:'100%'}} name="beginDate1" id="beginDate1" onChange={this.handleOnSelDate.bind(this,"beginDate1", Common.dateFormat)}  value={this.formatDate(this.state.ProjReq.beginDate1, Common.dateFormat)} />
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem {...formItemLayout} label="最晚开始" required={false} colon={true} className={layoutItem} help={hints.beginDate2Hint} validateStatus={hints.beginDate2Status}>
                                <DatePicker style={{width:'100%'}}  name="beginDate2" id="beginDate2" onChange={this.handleOnSelDate.bind(this,"beginDate2", Common.dateFormat)} value={this.formatDate(this.state.ProjReq.beginDate2, Common.dateFormat)}/>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem {...formItemLayout} label="执行状态" required={false} colon={true} className={layoutItem} help={hints.statusHint} validateStatus={hints.statusStatus}>
                                <DictSelect name="status" id="status" value={this.state.ProjReq.status } appName='项目管理' optName='人员需求状态' onSelect={this.handleOnSelected.bind(this, "status")}/>
                            </FormItem>
                        </Col>
                        </Row>
					</Form>
				</div>
			</div>
		);
	}
});

module.exports = ProjReqFilter;
