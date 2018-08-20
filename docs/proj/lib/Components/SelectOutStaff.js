import React from 'react';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');

import { Modal, Button, Table, Icon} from 'antd';
var SearchOutStaffStore = require('../data/SearchOutStaffStore');
var SearchOutStaffActions = require('../action/SearchOutStaffActions');

var SelectOutStaff = React.createClass({
    getInitialState : function() {
        return {
            outStaffSet: {
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
            selectOutStaff:{},
            modal:false
        }
    },
	mixins: [Reflux.listenTo(SearchOutStaffStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            outStaffSet: data,
            selectIndex:-1,
            selectOutStaff:{},
        });
    },

  // 第一次加载
  componentDidMount : function(){
  },
  clear : function(outStaffSet){
    this.state.outStaffSet = outStaffSet;
    this.state.selectIndex=-1;
    this.state.selectOutStaff={};
  },
  toggle : function(){
    this.setState({
      modal: !this.state.modal
    });
  },
  onSelect: function(record, index){
    this.props.onSelectStaff(record);
    this.toggle();
  },
  onChangePage: function(pageNumber){
      this.setState({loading: true});
      this.state.outStaffSet.startPage = pageNumber;
      var filter = this.state.outStaffSet.filter;
      SearchOutStaffActions.retrieveOutStaffPage(filter, pageNumber, this.state.outStaffSet.pageRow);
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
            title: '公司名称',
            dataIndex: 'corpName',
            key: 'corpName',
            width: 140,
        },
        {
            title: '最高学历',
            dataIndex: 'eduDegree',
            key: 'eduDegree',
            width: 140,
        },
    ];

    var outStaffList = this.state.outStaffSet.recordSet;
    var pag = {showQuickJumper: true, total:this.state.outStaffSet.totalRow, pageSize:this.state.outStaffSet.pageRow, current:this.state.outStaffSet.startPage, size:'large', onChange: this.onChangePage};
    return (
        <Modal visible={this.state.modal} width='760px' title="选择外协人员" maskClosable={true} onOk={this.onClickSave} onCancel={this.toggle}
          footer={null}
          >
          <div style={{padding: '0 8px 0 8px'}}>
            <ServiceMsg ref='mxgBox' svcList={['hr-outStaff/retrieve']}/>
            <Table columns={columns} onRowClick={this.onSelect}  dataSource={outStaffList} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
        </div>
      </Modal>
    );
  }
});

export default SelectOutStaff;