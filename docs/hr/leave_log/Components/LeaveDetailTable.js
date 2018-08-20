import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Input, Table, Col, Row, Button, Icon, Form, Select, Popconfirm } from 'antd';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import EditableCell from'../../../param/para-value/Components/EditableCell';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var LeaveUtil = require('../../leave/LeaveUtil');
var LeaveDetailStore = require('../../leave_detail/data/LeaveDetailStore.js');
var LeaveDetailActions = require('../../leave_detail/action/LeaveDetailActions');

const propTypes = {
    type: React.PropTypes.string,
    leaveType: React.PropTypes.string,
    spendDay: React.PropTypes.string,
    spendHour: React.PropTypes.string,
    leave: React.PropTypes.object,
    onDetailSave:React.PropTypes.func
};

var LeaveDetailTable = React.createClass({
	getInitialState : function(){
		return {
			leaveDetailSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
            },
            loading: false,
            leave: this.props.leave,
            leaveType: '',
            spendDay: '0',
            spendHour: '0',
            leaveDetails: [],
            filterDetails: []
		}
    },
    clear: function () {
        this.state.leaveType = '';
        this.state.spendDay = '0';
        this.state.spendHour = '0';
    },

    mixins: [Reflux.listenTo(LeaveDetailStore, "onServiceComplete")],
    onServiceComplete: function (data) {
        var filterDetails = [];
	  if(data.operation === 'retrieve'){
          if (data.errMsg === '') {
              var leaveType = this.props.leaveType;
              var opType = this.props.type;

              var memo2 = '';
              if (opType === 'update') {
                  memo2 = this.props.leaveLog.memo2;
              }

		    // 生成结果数据
			var leaveDetails = [];
			var recordSet = data.recordSet;
            recordSet.map((item, i) => {
                if (leaveType === item.leaveType) {
                    var detail = {};
                    Utils.copyValue(item, detail);
                    leaveDetails.push(detail);

                    detail.spendDay = { editable: false, status: '', value: '0', oldValue: '0' };
                    detail.spendHour = { editable: false, status: '', value: '0', oldValue: '0' };

                    if (opType === 'update') {
                        LeaveUtil.restoreUpdateValue(detail, memo2);
                    }

                    if (detail.remnant !== '0') {
                        filterDetails.push(detail);
                    }
                }
            });

            // 排序
            Common.sortTable(filterDetails, 'expiryDate');

            // 自动抵扣
            var spendDay = this.props.spendDay;
            var spendHour = this.props.spendHour;
            if (opType === 'create') {
                LeaveUtil.calcDetail(filterDetails, leaveType, spendDay, spendHour)
                this.props.onDetailSave(filterDetails);
            }

			// 成功，关闭窗口
			this.setState({
                loading: false,
                leaveType: leaveType,
                spendDay: spendDay,
                spendHour: spendHour,
				leaveDetailSet: data,
                leaveDetails: leaveDetails,
                filterDetails: filterDetails
			});
	      }
	      else{
			// 失败
			this.setState({
				loading: false,
                leaveDetailSet: data,
                leaveDetails: [],
                filterDetails: []
			});
	      }
	  }
	},
    // 第一次加载
	componentDidMount : function(){
        var userUuid = this.state.leave.uuid;
		this.setState({loading: true});
		LeaveDetailActions.initHrLeaveDetail(userUuid);
    },
    componentWillReceiveProps: function (nextProps) {
        if (this.state.leaveType !== nextProps.leaveType || this.state.leave.uuid !== nextProps.leave.uuid) {
            var userUuid = nextProps.leave.uuid;
            this.setState({ loading: true , leave: nextProps.leave});
            LeaveDetailActions.initHrLeaveDetail(userUuid);
        }
        else {
            // 自动抵扣
            if (nextProps.type === 'create') {
                var spendDay = nextProps.spendDay;
                var spendHour = nextProps.spendHour;
                if (spendDay !== this.state.spendDay || spendHour !== this.state.spendHour) {
                    this.state.spendDay = spendDay;
                    this.state.spendHour = spendHour;
                    LeaveUtil.calcDetail(this.state.filterDetails, this.state.leaveType, spendDay, spendHour)
                    this.props.onDetailSave(this.state.filterDetails);
                }
            }
        }
    },

	//生成edit表单
	renderColumns:function(text, record, isRefresh, dataIndex, index) {
		//isRefresh是做什么的？？
        const { editable, status, value } = record[dataIndex];
		return (<EditableCell
			key={record.paraUuid}
			editable={editable}
			value={value}
			onChange={(value, status) => this.handleChange(value, record, status, dataIndex, index)}
			status={status}
			isRefresh={isRefresh}
		/>);
	},

    handleChange: function (value, record, status, dataIndex, index) {
        var filterDetails = this.state.filterDetails;
        var record = filterDetails[index][dataIndex];

        if (status === 'cancel') {
            record.value = record.oldValue;
            return;
        };

		//改变filterDetails的数据
        record.value = value;
        record.oldValue = value;
		this.setState({
            filterDetails: filterDetails
        })

        this.props.onDetailSave(filterDetails);
	},

    edit: function (filterDetails, index) {
        filterDetails[index].spendDay.editable = true;
        filterDetails[index].spendDay.status = '';
        filterDetails[index].spendHour.editable = true;
        filterDetails[index].spendHour.status = '';
		this.setState({
            filterDetails: filterDetails
		})
	},

    editDone: function (filterDetails, index, type,record) {
        filterDetails[index].spendDay.editable = false;
        filterDetails[index].spendDay.status = type;
        filterDetails[index].spendHour.editable = false;
        filterDetails[index].spendHour.status = type;
		this.setState({
            filterDetails: filterDetails
		})
	},

    getRemainDay: function (remnant, flag) {
        if (remnant === null || remnant === undefined) {
            return '0';
        }

        var pos = remnant.indexOf('.');
        if (flag === 1) {
            if (pos < 0) {
                return remnant;
            }
            else if (pos === 0) {
                return '0';
            }
            else {
                return remnant.substr(0, pos);
            }
        }

        if (pos < 0) {
            return '0';
        }
        else {
            return remnant.substr(1+pos);
        }
	},

	render : function() {
		var isRefresh = true;
        var filterDetails = this.state.filterDetails;
	    const {
            leave,
            type,
            leaveType,
            spendDay,
            spendHour,
            onDetailSave,
	        ...attributes,
        } = this.props;

        var opt = {
            title: '',
            key: 'action',
            width: 100,
            render: (text, record, index) => (
                <div className="editable-row-operations">
                    {
                        record.spendDay.editable ?
                            <span>
                                <a style={{ marginRight: '6px' }} onClick={() => this.editDone(filterDetails, index, 'save', record)}>保存</a>
                                <Popconfirm title="确定取消 ?" onConfirm={() => this.editDone(filterDetails, index, 'cancel')}>
                                    <a> 取消</a>
                                </Popconfirm>
                            </span>
                            :
                            <span>
                                <a href="#" onClick={() => this.edit(filterDetails, index)} title='调整'><Icon type={Common.iconUpdate} /></a>
                            </span>
                    }
                </div>
            ),
        };

        var columns = [];
        if (LeaveUtil.isHourLeave(leaveType)) {
            columns = [
                {
                    title: '失效日期',
                    dataIndex: 'expiryDate',
                    key: 'expiryDate',
                    width: 160,
                },
                {
                    title: '剩余天数',
                    dataIndex: 'remnant',
                    key: 'remnant',
                    width: 120,
                    render: (text, record, index) => (this.getRemainDay(text, 1)),
                },
                {
                    title: '剩余小时',
                    dataIndex: 'remnant',
                    key: 'remnant2',
                    width: 120,
                    render: (text, record, index) => (this.getRemainDay(text, 0)),
                },
                {
                    title: '抵扣天数',
                    dataIndex: 'spendDay',
                    key: 'spendDay',
                    width: 120,
                    render: (text, record, index) => (this.renderColumns(text, record, isRefresh, 'spendDay', index)),
                },
                {
                    title: '抵扣小时',
                    dataIndex: 'spendHour',
                    key: 'spendHour',
                    width: 120,
                    render: (text, record, index) => (this.renderColumns(text, record, isRefresh, 'spendHour', index)),
                },
                opt
            ];
        }
        else {
            columns = [
                {
                    title: '失效日期',
                    dataIndex: 'expiryDate',
                    key: 'expiryDate',
                    width: 160,
                },
                {
                    title: '剩余天数',
                    dataIndex: 'remnant',
                    key: 'remnant',
                    width: 120,
                },
                {
                    title: '抵扣天数',
                    dataIndex: 'spendDay',
                    key: 'spendDay',
                    width: 120,
                    render: (text, record, index) => (this.renderColumns(text, record, isRefresh, 'spendDay', index)),
                },
                opt
            ];
        }

	    return (
            <div className='grid-body' {...attributes}>
                <Table columns={columns} dataSource={filterDetails} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" scroll={{ y: 180 }} bordered={Common.tableBorder}/>
            </div>
	    );
	}
});

LeaveDetailTable.propTypes = propTypes;
module.exports = LeaveDetailTable;
