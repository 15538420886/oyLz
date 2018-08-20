'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DeptTreeSelect from '../../../../hr/lib/Components/DeptTreeSelect';
import DictSelect from '../../../../lib/Components/DictSelect';
import LevelSelect from '../../../../hr/lib/Components/LevelSelect';
import JobTreeSelect from '../../../../hr/lib/Components/JobTreeSelect';
var Common = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col ,DatePicker } from 'antd';
const {MonthPicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

var JobFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
			hints: {},
			validRules: [],
			filter: {
                perName:'',
                staffCode:'',
                baseCity:'',
                empLevel:'',
                techUuid:'',
                manUuid:''
			},
		}
	},

    mixins: [ModalForm('filter')],
    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'perName', desc:'姓名', required: false, max: '0'},
            {id: 'staffCode', desc:'员工号', required: false, max: '0'},
            {id: 'baseCity', desc:'归属地', required: false, max: '0'},
            {id: 'empLevel', desc:'级别', required: false, max: '0'},
            {id: 'techUuid', desc:'技术岗位', required: false, max: '0'},
            {id: 'manUuid', desc:'管理岗位', required: false, max: '0'}
		];
	},

    //属性变化
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
            <div style={{width:'100%', height:'104px', padding:'20px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '900px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'100%'}}>
                        <Row  gutter={18}>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout} label="姓名" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                    <Input type="text" name="perName" id="perName" value={this.state.filter.perName } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout} label="员工号" required={false} colon={true} className={layoutItem} help={hints.staffCodeHint} validateStatus={hints.staffCodeStatus}>
                                    <Input type="text" name="staffCode" id="staffCode" value={this.state.filter.staffCode } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
                                    <Input type="text" name="baseCity" id="baseCity" value={this.state.filter.baseCity } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={18}>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout} label="级别" required={false} colon={true} className={layoutItem} help={hints.empLevelHint} validateStatus={hints.empLevelStatus}>
                                    <LevelSelect name="empLevel" id="empLevel" value={this.state.filter.empLevel} onSelect={this.handleOnSelected.bind(this, "empLevel")} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout} label="技术岗位" required={false} colon={true} className={layoutItem} help={hints.techUuidHint} validateStatus={hints.techUuidStatus}>
                                    <JobTreeSelect name="techUuid" id="techUuid" value={this.state.filter.techUuid} onSelect={this.handleOnSelected.bind(this, "techUuid")}/>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout} label="管理岗位" required={false} colon={true} className={layoutItem} help={hints.manUuidHint} validateStatus={hints.manUuidStatus}>
									<JobTreeSelect  style={{width:'100%'}}  name="manUuid" id="manUuid" value={this.state.filter.manUuid} onSelect={this.handleOnSelected.bind(this,"manUuid")} />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
	    );
	}
});


module.exports = JobFilter;
