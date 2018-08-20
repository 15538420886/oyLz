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

var MemberEvalFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
			hints: {},
			validRules: [],
			memberEval: {
                perName:'',
                staffCode:'',
                teamUuid:'',
                manStatus:'',
                endDate:'',
			},
		}
	},
    mixins: [ModalForm('memberEval')],
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'staffCode', desc:'员工编号', required: false, max: '64'},
            {id: 'perName', desc:'姓名', required: false, max: '32'},
            {id: 'endDate', desc:'离组日期', required: false, max: '24'},
            {id: 'manStatus', desc:'状态', required: false, max: '16'},
            {id: 'teamUuid', desc:'小组UUID', required: true, max: '24'},
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
                        <Row style={{textAlign:'right'}}>
                            <Col span="8"></Col>
                            <Col span="8">
                                <FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                    <Input type="text" name="perName" id="perName" value={this.state.memberEval.perName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem {...formItemLayout} label="员工号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                    <Input type="text" name="staffCode" id="staffCode" value={this.state.memberEval.staffCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
						</Row>
						<Col span="8">
                            <FormItem {...formItemLayout} label="小组" required={false} colon={true} className={layoutItem} help={hints.teamUuidHint} validateStatus={hints.teamUuidStatus}>
                                <SelectProjTeam projUuid={projUuid} name="teamUuid" id="teamUuid" value={this.state.memberEval.teamUuid} onSelect={this.handleOnSelected.bind(this, "teamUuid")}/>
                            </FormItem>
						</Col>
						<Col span="8">
                            <FormItem {...formItemLayout} label="状态" required={false} colon={true} className={layoutItem} help={hints.manStatusHint} validateStatus={hints.manStatusStatus}>
                                <DictSelect name="manStatus" id="manStatus" value={this.state.memberEval.manStatus } appName='项目管理' optName='项目组人员状态' onSelect={this.handleOnSelected.bind(this, "manStatus")}/>
                            </FormItem>
						</Col>
						<Col span="8">
                            <FormItem {...formItemLayout} label="离组日期" required={false} colon={true} className={layoutItem} help={hints.endDateHint} validateStatus={hints.endDateStatus}>
                                <DatePicker style={{width:'100%'}} name="endDate" id="endDate"  value={this.formatDate(this.state.memberEval.endDate, Common.dateFormat)}  format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this,"endDate", Common.dateFormat)}/>
                            </FormItem>
						</Col>
					</Form>
				</div>
			</div>
		);
	}
});

module.exports = MemberEvalFilter;
