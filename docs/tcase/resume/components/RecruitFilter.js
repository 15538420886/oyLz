'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DeptTreeSelect from '../../../hr/lib/Components/DeptTreeSelect';
import DictSelect from '../../../lib/Components/DictSelect';


import DictRadio from '../../../lib/Components/DictRadio';

var Common = require('../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col ,DatePicker ,Cascader } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;;
const FormItem = Form.Item;
const Option = Select.Option;
const options = [{
  value: 'wos',
  label: 'wos',
  children: [{
    value: '1',
    label: '1',
    children: [{
      value: '2',
      label: '2 Lake',
    }, {
      value: '3',
      label: '3 Sha',
      disabled: true,
    }],
  }],
}, {
  value: 'wbp',
  label: 'wbp',
  children: [{
    value: 'bp1',
    label: 'bp1',
  }],
}];



var RecruitFilter = React.createClass({
	getInitialState : function(){
		return {
            modal: this.props.moreFilter,
			hints: {},
			validRules: [],
			recruit: {
				caseCode:'',
				caseName:'',
				caseType:'',
				caseStat:'',
				caseDate:''
               
			},
		}
	},
	
	 onChange:function(value, selectedOptions) {
	 	  var str1,str2;
	 	  str1 = selectedOptions[0];
	 	  str2 = selectedOptions[1];
	 	  console.log(str1,str2)
       this.state.recruit.caseDate = str1+str2
			 
		},


    mixins: [ModalForm('recruit')],
    // 第一次加载
	componentDidMount : function(){
		this.state.validRules = [
          {id: 'caseCode', desc:'用例编码', required: false, max: '80'},
					{id: 'caseName', desc:'用例名称', required: false, max: '1000'},
					{id: 'caseType', desc:'用例类型', required: false, max: '255'},
					{id: 'caseStat', desc:'用例状态', required: false, max: '255'},
					{id: 'caseDate', desc:'编写日期', required: false, max: '65535'},
            
		];
		this.clear()
	},
	clear:function(){
		
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
            <div style={{width:'100%', height:'104px', padding:'20px 18px 0px 150px'}}>
				<div style={{width:'100%', height:'100%', float: 'right'}}>
					<Form layout={layout} style={{width:'100%'}}>
                        <Row  gutter={18}>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout} label="显示编码" required={false} colon={true} className={layoutItem} help={hints.caseCodeHint} validateStatus={hints.caseCodeStatus}>
																	<Input type="text" name="caseCode" id="caseCode" value={this.state.recruit.caseCode } onChange={this.handleOnChange} />
																</FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                               <FormItem {...formItemLayout} label="用例名称" required={false} colon={true} className={layoutItem} help={hints.caseNameHint} validateStatus={hints.caseNameStatus}>
																	<Input type="text" name="caseName" id="caseName" value={this.state.recruit.caseName } onChange={this.handleOnChange} />
															 </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                               <FormItem {...formItemLayout} label="用例类型" required={false} colon={true} className={layoutItem} help={hints.caseTypeHint} validateStatus={hints.caseTypeStatus}>
																	<DictSelect name="caseType" id="caseType" value={this.state.recruit.caseType} appName='用例管理' optName='用例类型' onSelect={this.handleOnSelected.bind(this, "caseType")}/>
															 </FormItem>
                            </Col>
                        </Row>
                        <Row  gutter={18}>
                            <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout} label="用例状态" required={false} colon={true} className={layoutItem} help={hints.caseStatHint} validateStatus={hints.caseStatStatus}>
																	<DictSelect name="caseStat" id="caseStat" value={this.state.recruit.caseStat} appName='用例管理' optName='执行状态' onSelect={this.handleOnSelected.bind(this, "caseStat")}/>
																</FormItem>
                            </Col>
                             <Col className="gutter-row" span={8}>
                                <FormItem {...formItemLayout} label="开始日期" required={false} colon={true} className={layoutItem} help={hints.caseDateHint} validateStatus={hints.caseDateStatus}>
															    <RangePicker  onChange={this.onChange} />
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
