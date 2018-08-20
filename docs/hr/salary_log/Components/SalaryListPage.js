import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import { Form, Modal, Button, Input, Select, DatePicker, Tabs, Col, Row, Spin} from 'antd';
const FormItem = Form.Item;
const { MonthPicker} = DatePicker;
const Option = Select.Option;
const TabPane = Tabs.TabPane;


var SalaryItemStore = require('../../salary_item/data/SalaryItemStore');
var SalaryItemActions = require('../../salary_item/action/SalaryItemActions');

var SalaryListPage = React.createClass({
	getInitialState : function() {
		return {
			salaryItemSet: {
				recordSet: [],
				errMsg : ''
			},
			loading: false,
			salaryLoading:false,
			salary: {},
			user:{},
			salaryList:{},
			objList:{},
			salaryBody:{},
			hints: {},
			validRules: []
		}
	},

	mixins: [Reflux.listenTo(SalaryItemStore, "onServiceComplete")],
	onServiceComplete: function(data) {
		data.recordSet = Common.sortTable(data.recordSet, 'itemIndex');
		this.setState({
			salaryItemSet: data
		});
        this.fillterList();
	},

	fillterList : function()
    {
		var salaryList = [];
        var salaryItemList = this.state.salaryItemSet.recordSet;
        salaryItemList.map((item, i) => {
			var obj = {
				"groupName":item.groupName,
				"itemIndex":item.itemIndex,
				"itemName":item.itemName,
				"itemCode":item.itemCode,
				"uuid":item.uuid,
			}
			salaryList.push(obj);
        });

        //按名称分类
		var objList= {};
		for(var i=0; i<salaryList.length;i++){
			var groupName=salaryList[i].groupName;
			if(!objList[groupName]){
				objList[groupName]=[salaryList[i]]
			}else{
				var salaryLog=salaryList[i];
				objList[groupName].push(salaryLog);
			}

		};

		if(this.props.action  === 'create'){
			var salaryBody={};
			for(var i=0; i<salaryList.length;i++){
				var itemCode=salaryList[i].itemCode;
				if(!salaryBody[itemCode]){
					salaryBody[itemCode]="";
				}
			};
		    this.state.salaryBody=salaryBody;
		}
  		this.setState({
			salaryList: salaryList,
			objList:objList,

		});

    },
    onValueChange : function(item,index, e)
    {
        var salaryBody = this.state.salaryBody;
        salaryBody[item.itemCode]= e.target.value;
        this.setState({
            salaryBody: salaryBody
        });
    },

	// 第一次加载
	componentDidMount : function(){
		this.state.validRules = [];
		SalaryItemActions.initHrSalaryItem(window.loginData.compUser.corpUuid);
		if(this.props.action  !='create'){
			this.initPage( this.props.salary );
		}
	},
	componentWillReceiveProps:function(newProps){
		if(this.props.action  != 'create'){
			this.initPage( newProps.salary );
		}
	},
	initPage: function(salary)
	{
		Utils.copyValue(salary, this.state.salary);

		var JsonStr = this.state.salary.salaryBody;
		var salaryBody = eval('(' + JsonStr + ')');
		if( typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		};
		this.setState({salaryBody:salaryBody});
	},
	clear:function(){

	},
	onClickSave : function(){
		var salaryBody=this.state.salaryBody;
		this.props.onSave(salaryBody);
	},
	goBack:function(){
        this.props.onBack();
    },

	render : function(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout2 = {
			labelCol: ((layout=='vertical') ? null : {span: 8}),
			wrapperCol: ((layout=='vertical') ? null : {span: 16}),
		};
		var hints=this.state.hints;
		var boo = this.props.salary.userUuid? false : true ;
		var corpUuid = window.loginData.compUser.corpUuid;
		var objList=this.state.objList;

		var objList2 = [];
		for(var i in objList){
			var firstCol = null;
			objList[i].map((item,index)=>{
				if(firstCol === null){
					firstCol = <Col span="12">
							<FormItem {...formItemLayout2} label={item.itemName} required={false} colon={true} className={layoutItem} help={hints.jobCodeHint} validateStatus={hints.jobCodeStatus}>
		                		<Input style={{zIndex:"2"}} type="text" name={item.uuid} id={item.uuid} value={this.state.salaryBody[item.itemCode] } onChange={this.onValueChange.bind(this,item,index)}/>
		            		</FormItem>
						</Col>;
				}
				else{
					objList2.push(<Row>
							{firstCol}
							<Col span="12">
								<FormItem {...formItemLayout2} label={item.itemName} required={false} colon={true} className={layoutItem} help={hints.jobCodeHint} validateStatus={hints.jobCodeStatus}>
			                		<Input style={{zIndex:"2"}} type="text" name={item.uuid} id={item.uuid} value={this.state.salaryBody[item.itemCode] } onChange={this.onValueChange.bind(this,item,index)}/>
			            		</FormItem>
							</Col>
						</Row>
					);

					firstCol = null;
				}
			})

			if(firstCol !== null){
				objList2.push(<Row>{firstCol}</Row>);
			}
		};

		var obj = <Form layout={layout}>
				{objList2}
               <FormItem style={{textAlign:'right'}} required={false} colon={true} className={layoutItem}>
                    <Button key="btnOK" type="primary" size="large"  onClick={this.onClickSave} loading={this.state.loading} disabled={boo}>保存</Button>{' '}
                    <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                </FormItem>
			</Form>;

		return (
	        <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
              {this.state.loading ? <Spin>{obj}</Spin> : obj}
			</div>

		);
	}
});

module.exports = SalaryListPage;
