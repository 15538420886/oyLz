import React from 'react';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');

import { Modal, Button, Table, Icon} from 'antd';
var SearchEmployeeStore = require('../data/SearchEmployeeStore');
var SearchEmployeeActions = require('../action/SearchEmployeeActions');

var SelectEmployee = React.createClass({
  getInitialState : function() {
    return {
      employeeSet: {
        filter: {},
        recordSet: [],
        startPage : 1,
        pageRow : 10,
        totalRow : 0,
        operation : '',
        errMsg : ''
      },
      loading: false,
      selectIndex:-1,
      selectEmployee:{},
      modal:false
    }
  },
  mixins: [Reflux.listenTo(SearchEmployeeStore, "onServiceComplete")],
  onServiceComplete: function(data) {
    this.setState({
      loading: false,
      employeeSet: data,
      selectIndex:-1,
      selectEmployee:{},
    });
  },

  // 第一次加载
  componentDidMount : function(){
  },
  clear : function(employeeSet){
    this.state.employeeSet = employeeSet;
    this.state.selectIndex=-1;
    this.state.selectEmployee={};
  },
  toggle : function(){
    this.setState({
      modal: !this.state.modal
    });
  },
  onSelect: function(record, index){
    this.props.onSelectEmpLoyee(record);
    this.toggle();
  },
  onChangePage: function(pageNumber){
    this.setState({loading: true});
    this.state.employeeSet.startPage = pageNumber;
    var filter = this.state.employeeSet.filter;
    SearchEmployeeActions.retrieveHrEmployeePage(filter, pageNumber, this.state.employeeSet.pageRow);
  },

  render : function(){
    const columns = [
    {
      title: '员工编号',
      dataIndex: 'staffCode',
      key: 'staffCode',
      width: 140,
    },
    {
      title: '姓名',
      dataIndex: 'perName',
      key: 'perName',
      width: 100,
    },
    {
      title: '部门名称',
      dataIndex: 'deptName',
      key: 'deptName',
      width: 140,
    },
    {
      title: '入职时间',
      dataIndex: 'entryDate',
      key: 'entryDate',
      width: 140,
      render: (text, record) => (Common.formatDate(text, Common.dateFormat))
    },
    {
      title: '职位',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      width: 140,
    },
    {
      title: '归属地',
      dataIndex: 'baseCity',
      key: 'baseCity',
      width: 100,
    },
    ];

    var employeeList = this.state.employeeSet.recordSet;
    var pag = {showQuickJumper: true, total:this.state.employeeSet.totalRow, pageSize:this.state.employeeSet.pageRow, current:this.state.employeeSet.startPage, size:'large', onChange: this.onChangePage};
    return (
      <Modal visible={this.state.modal} width='760px' title="选择员工" maskClosable={true} onOk={this.onClickSave} onCancel={this.toggle}
      footer={null}
      >
      <div style={{padding: '0 8px 0 8px'}}>
      // <ServiceMsg ref='mxgBox' svcList={['hr-employee/retrieve']}/>
      <Table columns={columns} onRowClick={this.onSelect}  dataSource={employeeList} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
      </div>
      </Modal>
      );
    }
  });

  export default SelectEmployee;
