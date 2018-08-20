import React from 'react';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');

import { Modal, Button, Table, Icon} from 'antd';
var SearchCustStore = require('../data/SearchCustStore');
var SearchCustActions = require('../action/SearchCustActions');
var pageRows = 10;
var SelectCust = React.createClass({
    getInitialState : function() {
        return {
            custSet: {
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
            SelectCust:{},
            modal:false
        }
    },
	mixins: [Reflux.listenTo(SearchCustStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            custSet: data,
            selectIndex:-1,
            SelectCust:{},
        });
    },

  // 第一次加载
  componentDidMount : function(){
  },
  clear : function(custSet){
    this.state.custSet = custSet;
    this.state.selectIndex=-1;
    this.state.SelectCust={};
  },
  toggle : function(){
    this.setState({
      modal: !this.state.modal
    });
  },
  onSelect: function(record, index){
    this.props.onSelectCust(record);
    this.toggle();
  },
  onChangePage: function(pageNumber){
      this.setState({loading: true});
      this.state.custSet.startPage = pageNumber;
      var filter = this.state.custSet.filter;
      SearchCustActions.retrieveProjCustPage(filter, pageNumber, pageRows);
  },

  render : function(){
    const columns = [
        {
            title: '客户编号',
            dataIndex: 'custCode',
            key: 'custCode',
            width: 140,
      	},
      	{
            title: '客户名称',
            dataIndex: 'custName',
            key: 'custName',
            width: 140,
      	},
      	{
            title: '销售区域',
            dataIndex: 'marketArea',
            key: 'marketArea',
            width: 140,
      	},
      	{
            title: '交付区域',
            dataIndex: 'delivArea',
            key: 'delivArea',
            width: 140,
      	},
      	{
            title: '客户经理',
            dataIndex: 'custManager',
            key: 'custManager',
            width: 140,
      	},
    ]

    var custList = this.state.custSet.recordSet;
    var pag = {showQuickJumper: true, total:this.state.custSet.totalRow, pageSize:this.state.custSet.pageRow, current:this.state.custSet.startPage, size:'large', onChange: this.onChangePage};
    return (
        <Modal visible={this.state.modal} width='760px' title="选择公司" maskClosable={true} onOk={this.onClickSave} onCancel={this.toggle}
          footer={null}
          >
          <div style={{padding: '0 8px 0 8px'}}>
            <ServiceMsg ref='mxgBox' svcList={['proj-cust/retrieve']}/>
            <Table columns={columns} onRowClick={this.onSelect}  dataSource={custList} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
        </div>
      </Modal>
    );
  }
});

export default SelectCust;
