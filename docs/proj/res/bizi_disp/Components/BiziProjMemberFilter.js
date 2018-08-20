import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import DictSelect from '../../../../lib/Components/DictSelect';
import {Input, Form, Modal, Col, Row, DatePicker,} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
var Common = require('../../../../public/script/common');
import ModalForm from '../../../../lib/Components/ModalForm';

const propTypes = {
  moreFilter: React.PropTypes.bool,
};

var BiziProjMemberFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
            hints: {},
            validRules: [],

			biziProjMember: {
				perName : '',
				staffCode : '',
				corpName : '',
				deptName : '',
			},
		}
	},

    mixins: [ModalForm('biziProjMember')],
	componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },

    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'perName', desc:'姓名', required: false, max: '32'},
            {id: 'staffCode', desc:'员工编号', required: false, max: '64'},
            {id: 'corpName', desc:'公司名称', required: false, max: '128'},
            {id: 'deptName', desc:'部门名称', required: false, max: '128'},
		];
	},

	render : function() {
		if( !this.state.modal ){
			return null;
		}

        var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 7}),
			wrapperCol: ((layout=='vertical') ? null : {span: 17}),
		};
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 6}),
			wrapperCol: ((layout=='vertical') ? null : {span: 18}),
		};

        var hints=this.state.hints;
	    return (
			<div style={{width:'100%', padding:'20px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '500px', float: 'right'}}>
					<Form layout={layout}>
                        <Row  gutter={16}>
                            <Col className="gutter-row" span={12}>
                                <FormItem {...formItemLayout2} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                    <Input type="text" name="perName" id="perName" value={this.state.biziProjMember.perName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <FormItem {...formItemLayout2} label="工号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                    <Input type="text" name="staffCode" id="staffCode" value={this.state.biziProjMember.staffCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={16}>
                            <Col className="gutter-row" span={12}>
                                <FormItem {...formItemLayout2} label="公司" required={false} colon={true} className={layoutItem} help={hints.corpNameHint} validateStatus={hints.corpNameStatus}>
                                    <Input type="text" name="corpName" id="corpName" value={this.state.biziProjMember.corpName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <FormItem {...formItemLayout2} label="部门" required={false} colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
                                    <Input type="text" name="deptName" id="deptName" value={this.state.biziProjMember.deptName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>


                </div>
            </div>
	    );
	}
});

BiziProjMemberFilter.propTypes = propTypes;
module.exports = BiziProjMemberFilter;
