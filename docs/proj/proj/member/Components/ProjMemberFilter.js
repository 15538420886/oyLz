import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
import SelectProjTeam from '../../../lib/Components/SelectProjTeam';
var Common = require('../../../../public/script/common');
var ProjContext = require('../../../ProjContext');
import { Form, Modal, Button, Input, Select, Row, Col, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
var ProjMemberFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
			hints: {},
			validRules: [],
			projMember: {
                perName:'',
                staffCode:'',
                teamUuid:'',
                projLevel:'',
                userLevel:'',
                beginMonth:'',
			},
		}
	},
    mixins: [ModalForm('projMember')],
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'staffCode', desc:'员工编号', required: false, max: '64'},
            {id: 'perName', desc:'姓名', required: false, max: '32'},
            {id: 'teamUuid', desc:'小组UUID', required: true, max: '24'},
            {id: 'projLevel', desc:'客户定级', required: false, max: '0'},
	        {id: 'userLevel', desc:'人员级别', required: false, max: '0'},
	        {id: 'beginMonth', desc:'入组开始', required: false, max: '0'},
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
        var projUuid = ProjContext.selectedProj.uuid;
	    return (
			<div style={{width:'100%', height:'104px', padding:'20px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '900px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'100%'}}>
                        <Row>
                            <Col span="8">
                                <FormItem {...formItemLayout} label="小组" required={false} colon={true} className={layoutItem} help={hints.teamUuidHint} validateStatus={hints.teamUuidStatus}>
                                    <SelectProjTeam projUuid={projUuid} name="teamUuid" id="teamUuid" value={this.state.projMember.teamUuid} onSelect={this.handleOnSelected.bind(this, "teamUuid")}/>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem {...formItemLayout} label="客户定级" required={false} colon={true} className={layoutItem} help={hints.projLevelHint} validateStatus={hints.projLevelStatus}>
                                    <Input type="text" name="projLevel" id="projLevel" value={this.state.projMember.projLevel } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                             <Col span="8">
                                <FormItem {...formItemLayout} label="人员级别" required={false} colon={true} className={layoutItem} help={hints.userLevelHint} validateStatus={hints.userLevelStatus}>
                                    <Input type="text" name="userLevel" id="userLevel" value={this.state.projMember.userLevel } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8">
                                <FormItem {...formItemLayout} label="入组月份" required={false} colon={true} className={layoutItem} help={hints.beginMonthHint} validateStatus={hints.beginMonthStatus}>
                                    <MonthPicker style={{width:'100%'}} name="beginMonth" id="beginMonth"  value={this.formatMonth(this.state.projMember.beginMonth, Common.monthFormat)}  format={Common.monthFormat} onChange={this.handleOnSelDate.bind(this,"beginMonth", Common.monthFormat)}/>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                    <Input type="text" name="perName" id="perName" value={this.state.projMember.perName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem {...formItemLayout} label="员工号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                    <Input type="text" name="staffCode" id="staffCode" value={this.state.projMember.staffCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
						</Row>
					</Form>
				</div>
			</div>
		);
	}
});

module.exports = ProjMemberFilter;
