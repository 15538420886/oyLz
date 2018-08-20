'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var $ = require('jquery');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';


var Common = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col ,DatePicker } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;;
const FormItem = Form.Item;
const Option = Select.Option;

var RecruitFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
			hints: {},
			validRules: [],
			recruit: {
               
            },
            filterData:[]//数据存储
		}
	},

    mixins: [ModalForm('recruit')],
    // 第一次加载
	componentDidMount : function(){
        var self = this;
        var url ='http://10.10.10.201:8082/tbug_s/tm-bug/quickSelectInit';
        var data = { flowNo: "1", object: {} }
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(data),
            contentType: "application/json",
        }).done(function (data) {
            self.setState({
                filterData:data.object
            })
        });
    
	},
    //属性变化
     componentWillReceiveProps:function(newProps){
         this.setState({
            modal: newProps.moreFilter,
        });
     },
    //解析成HTMl
    toHtml: function (obj, name) {
        var html = obj.map((obj, index) => {
            var text = '';
            var textIndex = '';
            if (name != undefined) {
                text = obj[name];
                textIndex = index;
            } else {
                text = obj;
                textIndex = index;
            }
            return <Option value={text} tabindex={textIndex}>{text}</Option>
        })
        return html;
    },
	render : function() {
	   if( !this.state.modal ){
			return null;
		}
        
        var filterData = this.state.filterData;

        
        var bmUser = this.toHtml(filterData.bmUser,"userName");//发现人
        var bugSeverity = this.toHtml(filterData.bugSeverity);//严重程度
        var bugStage = this.toHtml(filterData.bugStage);//新旧
        var bugType = this.toHtml(filterData.bugType);//类型
        var mdlId = this.toHtml(filterData.model);//模块
        var sysId = this.toHtml(filterData.system);//系统
        var sysver = this.toHtml(filterData.sysver);//版本

        var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
        var hints=this.state.hints;
	    return (
            <div style={{width:'100%', height:'104px', padding:'20px 18px 0px 2px'}}>
				<div style={{width:'100%', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'100%'}}>
                        <Row gutter={10} >
                            <Col className="gutter-row" span={5}>
                                <FormItem {...formItemLayout} label="缺陷编码" required={false} colon={true} className={layoutItem} help={hints.bugCodeHint} validateStatus={hints.bugCodeStatus}>
                                    <Input type="text" name="bugCode" id="bugCode" value={this.state.recruit.bugCode} onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <FormItem {...formItemLayout} label="缺陷名称" required={false} colon={true} className={layoutItem} help={hints.bugNameHint} validateStatus={hints.bugNameStatus}>
                                    <Input type="text" name="bugName" id="bugName" value={this.state.recruit.bugName} onChange={this.handleOnChange} />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                 <FormItem {...formItemLayout} label="缺陷状态"  required={false}  colon={true} className={layoutItem} help={hints.bugStatHint} validateStatus={hints.bugStatStatus}>
                                    <Select defaultValue="--" style={{ width: "100%" }} name="bugStat" id="bugStat" value={this.state.recruit.bugStat} onChange={(value) => { this.state.recruit.bugStat = value, this.setState({}) }}>
                                        {bugStage}
                                    </Select>
                                 </FormItem>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <FormItem {...formItemLayout} label="发现日期" required={false} colon={true} className={layoutItem} >
                                    <DatePicker   name="deteData" id="deteData"  format={Common.dateFormat} value={this.formatDate(this.state.recruit.deteData, Common.monthDate)} onChange={this.handleOnSelDate.bind(this,"deteData", Common.dateFormat)}/>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <FormItem {...formItemLayout} label="截止日期" required={false} colon={true} className={layoutItem} >
                                    <DatePicker   name="endData" id="endData"  format={Common.dateFormat} value={this.formatDate(this.state.recruit.endData, Common.monthDate)} onChange={this.handleOnSelDate.bind(this,"endData", Common.dateFormat)}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={10}>
                            <Col className="gutter-row" span={5}>
                                <FormItem {...formItemLayout} label="所属系统" required={false} colon={true} className={layoutItem} help={hints.sysIdHint} validateStatus={hints.sysIdStatus}>
                                    <Select defaultValue="--" style={{ width: "100%" }} name="sysId" id="sysId" value={this.state.recruit.sysId} onChange={(value) => { this.state.recruit.sysId = value, this.setState({}) }}>
                                        {sysId}
                                    </Select>
                                </FormItem>
                            </Col>
                             <Col className="gutter-row" span={5}>
                                <FormItem {...formItemLayout} label="所属模块" required={false} colon={true} className={layoutItem} help={hints.mdlIdHint} validateStatus={hints.mdlIdStatus}>
                                    <Select defaultValue="--" style={{ width: "100%" }} name="mdlId" id="mdlId" value={this.state.recruit.mdlId} onChange={(value) => { this.state.recruit.mdlId = value, this.setState({}) }}>
                                        {mdlId}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <FormItem {...formItemLayout} label="缺陷类型" required={false} colon={true} className={layoutItem} help={hints.bugTypeHint} validateStatus={hints.bugTypeStatus}>
                                    <Select defaultValue="--" style={{ width: "100%" }} name="bugType" id="bugType" value={this.state.recruit.bugType} onChange={(value) => { this.state.recruit.bugType = value, this.setState({}) }}>
                                        {bugType}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <FormItem {...formItemLayout} label="严重程度" required={false} colon={true} className={layoutItem} help={hints.applyMouthHint} validateStatus={hints.applyMouthStatus}>
                                    <Select defaultValue="--" style={{ width: "100%" }} name="bugSeverity" id="bugSeverity" value={this.state.recruit.bugSeverity} onChange={(value) => { this.state.recruit.bugSeverity = value, this.setState({}) }}>
                                        {bugSeverity}
                                    </Select>
                                </FormItem>
                                
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <FormItem {...formItemLayout} label="发现人" required={false} colon={true} className={layoutItem} help={hints.regUserHint} validateStatus={hints.regUserStatus}>
                                    <Select defaultValue="--" style={{ width: "100%" }} name="regUser" id="regUser" value={this.state.recruit.regUser} onChange={(value) => { this.state.recruit.regUser = value, this.setState({}) }}>
                                        {/* {bmUser} */}
                                    </Select>
                                </FormItem>
                            </Col>
                            
                        </Row>
                        
                    </Form>
                </div>
            </div>

	    );
	}
});


module.exports = RecruitFilter;
