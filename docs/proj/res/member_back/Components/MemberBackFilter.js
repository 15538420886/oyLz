import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import DictSelect from '../../../../lib/Components/DictSelect';
import {Input, Form, Modal, Col, Row, DatePicker,} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
var ProjContext = require('../../../ProjContext');
var Common = require('../../../../public/script/common');
import ModalForm from '../../../../lib/Components/ModalForm';
import LevelSelect from '../../../../hr/lib/Components/LevelSelect';
import JobTreeSelect from '../../../../hr/lib/Components/JobTreeSelect';

const propTypes = {
  moreFilter: React.PropTypes.bool,
};

var MemberBackFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
            hints: {},
            validRules: [],
            filter: null,

			memberBack: {
                corpUuid:window.loginData.compUser.corpUuid,
                poolUuid:ProjContext.selectedPool.uuid,
				value : '',
				resStatus : '',
				baseCity : '',
				eduDegree : '',
                empLevel : '',
                techUuid : '',
                manUuid : '',
                induBegin : '',
			},
		}
	},

    mixins: [ModalForm('memberBack')],
    componentWillReceiveProps: function (newProps) {
        if (newProps.filter) {
            if (!this.state.filter) {
                this.state.filter = newProps.filter;

                var f = this.state.memberBack;
                f.value = newProps.filterValue;
                f.resStatus = newProps.filter.resStatus;
                f.baseCity = newProps.filter.baseCity;
                f.eduDegree = newProps.filter.eduDegree;
                f.empLevel = newProps.filter.empLevel;
                f.techUuid = newProps.filter.techUuid;
                f.manUuid = newProps.filter.manUuid;
                f.induBegin = newProps.filter.induBegin;
            }
        }
        else {
            this.state.filter = null;
        }

         this.setState({
            modal: newProps.moreFilter,
        });
     },

    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
            {id: 'value', desc:'姓名/工号', required: false, max: '0'},
            {id: 'resStatus', desc:'状态', required: false, max: '0'},
            {id: 'baseCity', desc:'归属地', required: false, max: '0'},
            {id: 'eduDegree', desc:'最高学历', required: false, max: '0'},
            {id: 'empLevel', desc:'员工级别', required: false, max: '0'},
            {id: 'techUuid', desc:'技术岗位', required: false, max: '0'},
            {id: 'manUuid', desc:'管理岗位', required: false, max: '0'},
            {id: 'induBegin', desc:'行业经验', required: false, max: '0'},
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
				<div style={{width:'100%', maxWidth: '1000px', height:'100%', float: 'right'}}>
                    <Form layout={layout} style={{width:'1000px',padding:'20px 0px'}}>
                        <Row  gutter={18}>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="姓名/工号" required={false} colon={true} className={layoutItem} help={hints.perNameHint} validateStatus={hints.perNameStatus}>
                                    <Input type="text" name="value" id="value" value={this.state.memberBack.value } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="状态" required={false} colon={true} className={layoutItem} help={hints.resStatusHint} validateStatus={hints.resStatusStatus}>
                                    <DictSelect name="resStatus" id="resStatus" value={this.state.memberBack.resStatus} appName='项目管理' optName='资源池人员状态' onSelect={this.handleOnSelected.bind(this, "resStatus")}/>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="归属地" required={false} colon={true} className={layoutItem} help={hints.baseCityHint} validateStatus={hints.baseCityStatus}>
                                    <Input type="text" name="baseCity" id="baseCity" value={this.state.memberBack.baseCity } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="最高学历" required={false} colon={true} className={layoutItem} help={hints.eduDegreeHint} validateStatus={hints.eduDegreeStatus}>
                                    <DictSelect name="eduDegree" id="eduDegree" value={this.state.memberBack.eduDegree} appName='简历系统' optName='教育背景' onSelect={this.handleOnSelected.bind(this, "eduDegree")}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={18}>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="行业经验" required={false} colon={true} className={layoutItem} help={hints.induBeginHint} validateStatus={hints.induBeginStatus}>
                                    <Input type="text" name="induBegin" id="induBegin" value={this.state.memberBack.induBegin } onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="定级" required={false} colon={true} className={layoutItem} help={hints.empLevelHint} validateStatus={hints.empLevelStatus}>
                                    <LevelSelect ref="empLevelBox" name="empLevel" id="empLevel" value={this.state.memberBack.empLevel} onSelect={this.handleOnSelected.bind(this, "empLevel")} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="技术岗" required={false} colon={true} className={layoutItem} help={hints.techUuidHint} validateStatus={hints.techUuidStatus}>
                                    <JobTreeSelect ref="techUuidBox" name="techUuid" id="techUuid" value={this.state.memberBack.techUuid} onSelect={this.handleOnSelected.bind(this, "techUuid")} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="管理岗" required={false} colon={true} className={layoutItem} help={hints.manUuidHint} validateStatus={hints.manUuidStatus}>
                                    <JobTreeSelect ref="manUuidBox" name="manUuid" id="manUuid" value={this.state.memberBack.manUuid} onSelect={this.handleOnSelected.bind(this, "manUuid")} />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
	    );
	}
});

MemberBackFilter.propTypes = propTypes;
module.exports = MemberBackFilter;
