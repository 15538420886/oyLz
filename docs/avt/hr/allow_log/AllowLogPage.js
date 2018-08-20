import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Row, Col, Modal, Button, Input, Select, Icon, DatePicker, Spin, Table} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

var AllowDetail = require('./Components/AllowDetail');
var AllowLogStore = require('./data/AllowLogStore.js');
var AllowLogActions = require('./action/AllowLogActions');

var AllowLogPage = React.createClass({
	getInitialState : function() {
		return {
			allowLogSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
			allowLog: {},
			loading: false,
		}
	},

	mixins: [Reflux.listenTo(AllowLogStore, "onServiceComplete"), ModalForm('allowLog')],
	onServiceComplete: function(data) {
	  if(data.operation === 'retrieve_p'){
		  var allowLog = (data.recordSet.length > 0) ? data.recordSet[0] : {};

			this.setState({
	            loading: false,
				allowLog: allowLog,
	            allowLogSet: data
	        });
		};
		
	},

	
	// 第一次加载
	componentDidMount : function(){
		this.initPage();
	},
	getPastHalfYear:function () {
	    var curDate = (new Date()).getTime();
	    var halfYear = 365 / 2 * 24 * 3600 * 1000;
	    var pastResult = curDate - halfYear;
	    var pastDate = new Date(pastResult),
	        pastYear = pastDate.getFullYear(),
	        pastMonth = pastDate.getMonth() + 1,
	        pastDay = pastDate.getDate();

    	return pastYear* 100 + pastMonth;
	},

	initPage: function(allowLog)
	{
		if(window.loginData.compUser){
			this.setState({loading: true});
			var filter = {};
			var mouth=Common.getMonth();
			var halfYear=this.getPastHalfYear();
			filter.corpUuid = window.loginData.compUser.corpUuid;
			filter.staffCode = window.loginData.compUser.userCode;
			filter.date1=halfYear+'01';
			filter.date2=mouth+'31';
			AllowLogActions.initHrAllowLog(filter);
		}
	},

	onClickDetail:function(allowLog){
		this.setState({allowLog: allowLog});
    },
    getFeeDate: function (record) {
        var str = '';
        if (record.beginDate) {
            if (record.endDate) {
                str = record.beginDate + ' ~ ' + record.endDate;
            }
            else {
                str = record.beginDate + ' ~ ';
            }
        }
        else if (record.endDate) {
            str = ' ~ ' + record.endDate;
        }

        return str;
    },

	render : function() {
        var corpUuid = window.loginData.compUser.corpUuid;
		const columns = [
                   {
                        title: '发放日期',
                        dataIndex: 'payDate',
                        key: 'payDate',
                        width: 140,
                        render: (text, record) => (Common.formatDate(text, Common.dateFormat)),
                    },
                   {
                        title: '报销类型',
                        dataIndex: 'allowType',
                        key: 'allowType',
                        width: 140,
                    },
                   {
                        title: '项目名称',
                        dataIndex: 'projName',
                        key: 'projName',
                        width: 200,
                    },
                   {
                        title: '费用日期',
                        dataIndex: 'beginDate',
                        key: 'beginDate',
                        width: 140,
                        render: (text, record) => (this.getFeeDate(record)),
                    },
                    {
                        title: '报销金额',
                        dataIndex: 'payAmount',
                        key: 'payAmount',
                        width: 140,
                    },
                    {
                        title: '',
                        key: 'action',
                        width: 60,
                        render: (text, record) => (
                            <span>
                            <a href="#" onClick={this.onClickDetail.bind(this, record)} title='详情'><Icon type={Common.iconDetail}/></a>
                            </span>
                        ),
                    }
        ];

		var recordSet = this.state.allowLogSet.recordSet;
		return (
            <div style={{padding: '24px 30px 30px 30px'}}>
            	<ServiceMsg ref='mxgBox' svcList={['hr-allow-log/retrieve_p']}/>
                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading}  pagination={false} size="middle" bordered={Common.tableBorder}/>
                <AllowDetail allowLog={this.state.allowLog}/>
            </div>
		);
	}
});

module.exports = AllowLogPage;
