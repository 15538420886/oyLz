'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
import ModalForm from '../../../lib/Components/ModalForm';
import { Button, Form, Row, Rate, Col, Input, Icon ,Table, Tabs,Pagination } from 'antd';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
var Utils = require('../../../public/script/utils');


var ReviewStore = require('../data/ReviewStore');
var ReviewActions = require('../action/ReviewActions');

var ResumeStore = require('../data/ResumeStore');
var ResumeActions = require('../action/ResumeActions');
var CommunicateStore = require('../data/CommunicateStore');
var CommunicateActions = require('../action/CommunicateActions');
var EmployedStore = require('../data/EmployedStore');
var EmployedActions = require('../action/EmployedActions');
var InterviewStore = require('../data/InterviewStore');
var InterviewActions = require('../action/InterviewActions');

var UnsuitStore = require('../data/UnsuitStore');
var UnsuitActions = require('../action/UnsuitActions');

var pageRows = 10;
var OtherReviewPage = React.createClass({
    getInitialState : function() {
        return {
            resumeSet: {
                recordSet: [],
                startPage : 1,
                pageRow : 10,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            review:{},
            resumeMsg:{},
            table: [],
            hints: {},
            validRules: [],
            action: 'query',
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(ResumeStore, "onServiceComplete"),
            Reflux.listenTo(CommunicateStore, "onServiceComplete1"),
            Reflux.listenTo(EmployedStore, "onServiceComplete2"),
            Reflux.listenTo(InterviewStore, "onServiceComplete3"),
            Reflux.listenTo(UnsuitStore, "onServiceComplete4"),ModalForm('review')],
    onServiceComplete: function(data) {

        var self=this;
        this.onEventSever(data,self)
    },
    onServiceComplete1: function(data) {
         var self=this;
        this.onEventSever(data,self)
    },
    onServiceComplete2: function(data) {
          var self=this;
        this.onEventSever(data,self)
    },
    onServiceComplete3: function(data) {
         var self=this;
        this.onEventSever(data,self)
    },
    onServiceComplete4: function(data) {
         var self=this;
        this.onEventSever(data,self)
    },
    // 第一次加载
   componentDidMount : function(){
    this.state.validRules = [
        {id: 'rvType', desc:'类型：HR、心理、技术', required: true, max: '24'},
        {id: 'rvMemo', desc:'备注', required: true, max: '24'},
        {id: 'rvResult', desc:'结论', required: true, max: '24'},
    ];
        this.initPage( this.props.otherReview );
        this.clear();
    },
    handleChange:function(id,value){
        this.state.review[id]=value.toString();
         this.setState({
            loading: false,
        });
    },
    onEventSever:function(data,self){ 
        if (data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                self.goBack();
            }
            else {
                // 失败
                self.setState({
                    loading: false,
                    review: data
                });
            }
        }else if(data.operation === 'update'){
            if (data.errMsg === '') {
                // 成功，关闭窗口
                self.goBack();
            }
            else {
                // 失败
                self.setState({
                    loading: false,
                    review: data
                });
            }
        }
    },
    clear:function(){
        this.state.hints = {};
        this.state.review.rvType='';
        this.state.review.rvMemo='';
        this.state.review.rvResult='';
        this.state.review.score1='';
        this.state.review.score2='';
        this.state.review.score3='';
        this.state.review.score4='';
        this.state.review.score5='';
        this.state.review.score6='';
        this.state.review.score7='';
        this.state.review.score8='';
        this.state.review.score9='';
        this.state.review.score10='';
        this.state.review.score11='';
        this.state.review.score12='';
        this.state.review.score13='';
        this.state.review.score14='';
        this.state.review.score15='';
        this.state.review.score16='';
        this.state.review.score17='';
        this.state.review.score18='';
        this.state.review.score19='';
        this.state.review.score20='';
        this.state.loading = false;
   },

   onClickSave : function(){
         if(Common.formValidator(this, this.state.review)){
           this.setState({loading: true});
            var filterObj = {};
            var review = this.props.review;
            this.state.review.rvName=this.props.resumeMsg.perName;
            filterObj.filter = this.props.resumeMsg.uuid;
            filterObj.object = this.state.review;
                if(this.props.type === '待处理'){
                   if(review){
                        ResumeActions.updateReview(filterObj);
                    }else{
                        ResumeActions.createReview(filterObj);
                    }
                }else if(this.props.type === '待沟通'){
                    if(review){
                        CommunicateActions.updateReview(filterObj);
                    }else{
                        CommunicateActions.createReview(filterObj);
                    }
                }else if(this.props.type === '待面试'){ 
                     if(review){
                        InterviewActions.updateReview(filterObj);
                    }else{
                        InterviewActions.createReview(filterObj);
                    }
                }else if(this.props.type === '已录用'){
                     if(review){
                        EmployedActions.updateReview(filterObj);
                    }else{
                        EmployedActions.createReview(filterObj);
                    }
                }else if(this.props.type === '不合适'){
                    if(review){
                        UnsuitActions.updateReview(filterObj);
                    }else{
                        UnsuitActions.createReview(filterObj);
                    }
                }
           
        }
    },
    goBack:function(){
        this.props.onBack();
    },
    initPage: function(review)
    {   
        this.setState({
            review:review,
            loading: false,
        });  
    },

	render : function(){
        var hints=this.state.hints;
        var layout='horizontal';
        var layoutItem='form-item-'+layout;
        var rvType=this.state.review.rvType;
        const formItemLayout = {
            labelCol: ((layout=='vertical') ? null : {span: 4}),
            wrapperCol: ((layout=='vertical') ? null : {span: 20}),
        };
        const formItemLayout2 = {
            labelCol: ((layout=='vertical') ? null : {span: 8}),
            wrapperCol: ((layout=='vertical') ? null : {span: 16}),
        }; 
        var viewTable= (<div style={{ margin: '0 20px 0 30px', float: 'left', width: "570px", height: '300px' }}>
                        <table style={{ width: "100%", height: '300px' }}>
                             <tbody>
                            <tr key='row.0' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>职业性</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score1" onChange={this.handleChange.bind(this,"score1") } disabled={true} value={this.state.review.score1 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>稳定性</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate  id="score2" onChange={this.handleChange.bind(this,"score2")} disabled={true} value={this.state.review.score2 }/></td>
                               
                            </tr>
                             <tr key='row.2' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>公司认同</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score3" onChange={this.handleChange.bind(this,"score3")} disabled={true} value={this.state.review.score3 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>诚实性</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score4" onChange={this.handleChange.bind(this,"score4")} disabled={true} value={this.state.review.score4 }/></td>
                               
                            </tr>
                            <tr key='row.3' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>进取心</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score5" onChange={this.handleChange.bind(this,"score5")} disabled={true} value={this.state.review.score5 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>自信心</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score6" onChange={this.handleChange.bind(this,"score6")} disabled={true} value={this.state.review.score6 }/></td>
                               
                            </tr>
                             <tr key='row.4' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>逻辑思维</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score7" onChange={this.handleChange.bind(this,"score7")} disabled={true} value={this.state.review.score7 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>沟通表达</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score8" onChange={this.handleChange.bind(this,"score8")} disabled={true} value={this.state.review.score8 }/></td>
                               
                            </tr>
                             <tr key='row.5' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>理解能力</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score9"  onChange={this.handleChange.bind(this,"score9")} disabled={true} value={this.state.review.score9 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>反应能力</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score10" onChange={this.handleChange.bind(this,"score10")} disabled={true} value={this.state.review.score10 }/></td>
                               
                            </tr>
                             <tr key='row.6' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>职业潜力</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score11" onChange={this.handleChange.bind(this,"score11")} disabled={true} value={this.state.review.score11 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>职业兴趣</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score12" onChange={this.handleChange.bind(this,"score12")} disabled={true} value={this.state.review.score12 }/></td>
                               
                            </tr>
                            <tr key='row.7' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>加班</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score13" onChange={this.handleChange.bind(this,"score13")} disabled={true} value={this.state.review.score13 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>出差</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score14" onChange={this.handleChange.bind(this,"score14")} disabled={true} value={this.state.review.score14 }/></td>
                               
                            </tr>
                             <tr key='row.8' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>薪酬</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score15" onChange={this.handleChange.bind(this,"score15")} disabled={true} value={this.state.review.score15 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>协作</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score16" onChange={this.handleChange.bind(this,"score16")} disabled={true} value={this.state.review.score16 }/></td>
                               
                            </tr>
                            <tr key='row.9' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>总体素质</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score17" onChange={this.handleChange.bind(this,"score17")} disabled={true} value={this.state.review.score17 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}></td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}></td>
                               
                            </tr>
                               
                             </tbody>
                         </table>
                    </div> )  
         // 根据不同的面试类型，切换不同的评分table
        if(rvType==="技术"){
            viewTable=(<div style={{ margin: '0 20px 0 30px', float: 'left', width: "570px", height: '300px' }}>
                        <table style={{ width: "100%", height: '300px' }}>
                             <tbody>
                            <tr key='row.0' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>公司认同</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score1" onChange={this.handleChange.bind(this,"score1")} disabled={true} value={this.state.review.score1 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>协作</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate  id="score2" onChange={this.handleChange.bind(this,"score2")} disabled={true} value={this.state.review.score2 }/></td>
                               
                            </tr>
                             <tr key='row.2' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>反应能力</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score3" onChange={this.handleChange.bind(this,"score3")} disabled={true} value={this.state.review.score3 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>逻辑思维</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score4" onChange={this.handleChange.bind(this,"score4")} disabled={true} value={this.state.review.score4 }/></td>
                               
                            </tr>
                            <tr key='row.3' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>沟通表达</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score5" onChange={this.handleChange.bind(this,"score5")} disabled={true} value={this.state.review.score5 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>理解能力</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score6" onChange={this.handleChange.bind(this,"score6")} disabled={true} value={this.state.review.score6 }/></td>
                               
                            </tr>
                             <tr key='row.4' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>职业兴趣</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score7" onChange={this.handleChange.bind(this,"score7")} disabled={true} value={this.state.review.score7 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>分析能力</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score8" onChange={this.handleChange.bind(this,"score8")} disabled={true} value={this.state.review.score8 }/></td>
                               
                            </tr>
                             <tr key='row.5' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>技术深度</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score9"  onChange={this.handleChange.bind(this,"score9")} disabled={true} value={this.state.review.score9 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>技术宽度</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score10" onChange={this.handleChange.bind(this,"score10")} disabled={true} value={this.state.review.score10 }/></td>
                               
                            </tr>
                             <tr key='row.6' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>职位匹配</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score11" onChange={this.handleChange.bind(this,"score11")} disabled={true} value={this.state.review.score11 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>工作经验</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score12" onChange={this.handleChange.bind(this,"score12")} disabled={true} value={this.state.review.score12 }/></td>
                               
                            </tr>
                            <tr key='row.7' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>业务经验</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score13" onChange={this.handleChange.bind(this,"score13")} disabled={true} value={this.state.review.score13 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>工作能力</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score14" onChange={this.handleChange.bind(this,"score14")} disabled={true} value={this.state.review.score14 }/></td>
                               
                            </tr>
                             <tr key='row.8' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>职业潜力</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score15" onChange={this.handleChange.bind(this,"score15")} disabled={true} value={this.state.review.score15 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>基础知识</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score16" onChange={this.handleChange.bind(this,"score16")} disabled={true} value={this.state.review.score16 }/></td>
                               
                            </tr>  
                             </tbody>
                         </table>
                    </div> )
        }else if(rvType==="HR"){
           viewTable= (<div style={{ margin: '0 20px 0 30px', float: 'left', width: "570px", height: '300px' }}>
                        <table style={{ width: "100%", height: '300px' }}>
                             <tbody>
                            <tr key='row.0' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>职业性</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score1" onChange={this.handleChange.bind(this,"score1") } disabled={true} value={this.state.review.score1 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>稳定性</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate  id="score2" onChange={this.handleChange.bind(this,"score2")} disabled={true} value={this.state.review.score2 }/></td>
                               
                            </tr>
                             <tr key='row.2' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>公司认同</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score3" onChange={this.handleChange.bind(this,"score3")} disabled={true} value={this.state.review.score3 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>诚实性</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score4" onChange={this.handleChange.bind(this,"score4")} disabled={true} value={this.state.review.score4 }/></td>
                               
                            </tr>
                            <tr key='row.3' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>进取心</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score5" onChange={this.handleChange.bind(this,"score5")} disabled={true} value={this.state.review.score5 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>自信心</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score6" onChange={this.handleChange.bind(this,"score6")} disabled={true} value={this.state.review.score6 }/></td>
                               
                            </tr>
                             <tr key='row.4' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>逻辑思维</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score7" onChange={this.handleChange.bind(this,"score7")} disabled={true} value={this.state.review.score7 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>沟通表达</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score8" onChange={this.handleChange.bind(this,"score8")} disabled={true} value={this.state.review.score8 }/></td>
                               
                            </tr>
                             <tr key='row.5' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>理解能力</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score9"  onChange={this.handleChange.bind(this,"score9")} disabled={true} value={this.state.review.score9 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>反应能力</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score10" onChange={this.handleChange.bind(this,"score10")} disabled={true} value={this.state.review.score10 }/></td>
                               
                            </tr>
                             <tr key='row.6' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>职业潜力</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score11" onChange={this.handleChange.bind(this,"score11")} disabled={true} value={this.state.review.score11 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>职业兴趣</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score12" onChange={this.handleChange.bind(this,"score12")} disabled={true} value={this.state.review.score12 }/></td>
                               
                            </tr>
                            <tr key='row.7' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>加班</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score13" onChange={this.handleChange.bind(this,"score13")} disabled={true} value={this.state.review.score13 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>出差</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score14" onChange={this.handleChange.bind(this,"score14")} disabled={true} value={this.state.review.score14 }/></td>
                               
                            </tr>
                             <tr key='row.8' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>薪酬</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score15" onChange={this.handleChange.bind(this,"score15")} disabled={true} value={this.state.review.score15 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>协作</td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score16" onChange={this.handleChange.bind(this,"score16")} disabled={true} value={this.state.review.score16 }/></td>
                               
                            </tr>
                            <tr key='row.9' style={{ height: '5px' }}>
                                <td key='1' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}>总体素质</td>
                                <td key='2' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}><Rate id="score17" onChange={this.handleChange.bind(this,"score17")} disabled={true} value={this.state.review.score17 }/></td>
                                <td key='3' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}></td>
                                <td key='4' style={{ width: '25%', textAlign: 'center', border: '1px solid #ccc' }}></td>
                               
                            </tr>
                               
                             </tbody>
                         </table>
                    </div> )
        }
		return (
			<div style={{width:'100%', maxWidth:'600px'}}>

             <Form layout={layout} style={{margin:'12px 0 0 0'}}>
                <Row>
                    <Col span="12">
                    <FormItem {...formItemLayout2} label="姓名" required={false} colon={true} className={layoutItem} help={hints.rvNameHint} validateStatus={hints.rvNameStatus}>
                        <Input type="text" name="rvName" id="rvName" value={this.state.review.rvName } onChange={this.handleOnChange} readOnly={true} />
                    </FormItem>
                    </Col>
                     <Col span="12">
                       <FormItem {...formItemLayout2} label="工号" required={false} colon={true} className={layoutItem} help={hints.rvStaffHint} validateStatus={hints.rvStaffStatus}>
                        <Input type="text" name="rvStaff" id="rvStaff" value={this.state.review.rvStaff } onChange={this.handleOnChange} readOnly={true}/>
                    </FormItem>
                    
                    </Col>
                </Row>
                <Row>
                     <Col span="12">
                       <FormItem {...formItemLayout2} label="面试结论" required={false} colon={true} className={layoutItem} help={hints.rvResultHint} validateStatus={hints.rvResultStatus}>
                        <Input type="text" name="rvResult" id="rvResult" value={this.state.review.rvResult } onChange={this.handleOnChange} readOnly={true} />
                    </FormItem>
                    </Col>
                    <Col span="12">
                     <FormItem {...formItemLayout2} label="面试得分" required={false} colon={true} className={layoutItem} help={hints.rvMemoHint} validateStatus={hints.rvMemoStatus}>
                        <Input  name="rvMemo" id="rvMemo" value={this.state.review.rvMemo } onChange={this.handleOnChange} readOnly={true}/>
                    </FormItem>
                    </Col>
                    
                </Row>
                <Row>
                     <FormItem {...formItemLayout} label="面试评价" required={false} colon={true} className={layoutItem} help={hints.rvMemoHint} validateStatus={hints.rvMemoStatus}>
                        <Input type="textarea" name="rvMemo" id="rvMemo" value={this.state.review.rvMemo } onChange={this.handleOnChange} readOnly={true} />
                    </FormItem>
                </Row>
                <Row>
                    
                    {viewTable}  
                     
                </Row>
            </Form>
        </div>
		);
	}
});

module.exports = OtherReviewPage;