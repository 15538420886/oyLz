import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col ,DatePicker } from 'antd';
const {MonthPicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
var ProjContext = require('../../../ProjContext');
import DictSelect from '../../../../lib/Components/DictSelect';
import LevelSelect from '../../../../hr/lib/Components/LevelSelect';
import JobTreeSelect from '../../../../hr/lib/Components/JobTreeSelect';

var ResMemberFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
			hints: {},
			validRules: [],
			filter: {
				corpUuid:window.loginData.compUser.corpUuid,
				poolUuid:ProjContext.selectedPool.uuid,
                value:'',
                resStatus:'',
                baseCity:'',
                eduDegree:'',
                induYearss:'',
                empLevel:'',
                techUuid:'',
                manUuid:'',
			},
		}
	},

    mixins: [ModalForm('filter')],
    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'value', desc:'姓名/工号', required: false, max: '64'},
            {id: 'resStatus', desc:'当前状态', required: false, max: '32'},
            {id: 'baseCity', desc:'归属地', required: false, max: '32'},
            {id: 'eduDegree', desc:'最高学历', required: false, max: '64'},
            {id: 'induYearss', desc:'行业经验', required: false, max: '32'},
            {id: 'empLevel', desc:'员工级别', required: false, max: '32'},
            {id: 'techUuid', desc:'技术岗位', required: false, max: '24'},
            {id: 'manUuid', desc:'管理岗位', required: false, max: '24'},
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
            <div style={{width:'100%', height:'104px', padding:'0px 18px 0px 24px'}}>
				<div style={{width:'100%', maxWidth: '1000px', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'1000px',padding:'20px 0px'}}>
                        <Row  gutter={18}>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="姓名/工号" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                    <Input type="text" name="value" id="value" value={this.state.filter.value } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="状态" required={false} colon={true} className={layoutItem} help={hints.statusHint} validateStatus={hints.statusStatus}>
                                    <DictSelect name="resStatus" id="resStatus" value={this.state.filter.resStatus} appName='项目管理' optName='资源池人员状态' onSelect={this.handleOnSelected.bind(this, "resStatus")}/>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
                                    <Input type="text" name="baseCity" id="baseCity" value={this.state.filter.baseCity } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="最高学历" required={false} colon={true} className={layoutItem} help={hints.eduDegreeHint} validateStatus={hints.eduDegreeStatus}>
                                    <DictSelect name="eduDegree" id="eduDegree" value={this.state.filter.eduDegree} appName='简历系统' optName='教育背景' onSelect={this.handleOnSelected.bind(this, "eduDegree")}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={18}>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="行业经验" required={false} colon={true} className={layoutItem} help={hints.induYearsHint} validateStatus={hints.induYearsStatus}>
                                    <Input type="text" name="induYears" id="induYears" value={this.state.filter.induYears } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="定级" required={false} colon={true} className={layoutItem} help={hints.empLevelHint} validateStatus={hints.empLevelStatus}>
                                    <LevelSelect ref="empLevelBox" name="empLevel" id="empLevel" value={this.state.filter.empLevel} onSelect={this.handleOnSelected.bind(this, "empLevel")} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="技术岗" required={false} colon={true} className={layoutItem} help={hints.techUuidHint} validateStatus={hints.techUuidStatus}>
                                    <JobTreeSelect ref="techUuidBox" name="techUuid" id="techUuid" value={this.state.filter.techUuid} onSelect={this.handleOnSelected.bind(this, "techUuid")} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="管理岗" required={false} colon={true} className={layoutItem} help={hints.manUuidHint} validateStatus={hints.manUuidStatus}>
									<JobTreeSelect ref="manUuidBox" name="manUuid" id="manUuid" value={this.state.filter.manUuid} onSelect={this.handleOnSelected.bind(this, "manUuid")} />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>

	    );
	}
});
module.exports = ResMemberFilter;