import React from 'react';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');

import { Modal, Button, Table, Icon} from 'antd';
var SearchContractStore = require('../data/SearchContractStore');
var SearchContractActions = require('../action/SearchContractActions');

var SelectContract = React.createClass({
    getInitialState : function() {
        return {
            contractSet: {
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
            SelectContract:{},
            modal:false
        }
    },
	mixins: [Reflux.listenTo(SearchContractStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            contractSet: data,
            selectIndex:-1,
            SelectContract:{},
        });
    },

  // 第一次加载
  componentDidMount : function(){
  },
  clear : function(contractSet){
    this.state.contractSet = contractSet;
    this.state.selectIndex=-1;
    this.state.SelectContract={};
  },
  toggle : function(){
    this.setState({
      modal: !this.state.modal
    });
  },
  onSelect: function(record, index){
    this.props.onSelectContract(record);
    this.toggle();
  },
  onChangePage: function(pageNumber){
      this.setState({loading: true});
      this.state.contractSet.startPage = pageNumber;
      var filter = this.state.contractSet.filter;
      SearchContractActions.retrieveContEventPage(filter, pageNumber, this.state.contractSet.pageRow);
  },

  render : function(){
    const columns = [
        {
            title: '合同编号',
            dataIndex: 'contCode',
            key: 'contCode',
            width: 140,
      	},
      	{
            title: '合同名称',
            dataIndex: 'contName',
            key: 'contName',
            width: 140,
      	},
      	{
            title: '合同类型',
            dataIndex: 'contType',
            key: 'contType',
            width: 140,
      	},
      	{
            title: '销售姓名',
            dataIndex: 'salName',
            key: 'salName',
            width: 140,
      	},
    ]

    var contractList = this.state.contractSet.recordSet;
    var pag = {showQuickJumper: true, total:this.state.contractSet.totalRow, pageSize:this.state.contractSet.pageRow, current:this.state.contractSet.startPage, size:'large', onChange: this.onChangePage};
    return (
        <Modal visible={this.state.modal} width='760px' title="选择合同事件" maskClosable={true} onOk={this.onClickSave} onCancel={this.toggle}
          footer={null}
          >
          <div style={{padding: '0 8px 0 8px'}}>
            <ServiceMsg ref='mxgBox' svcList={['proj_contract/retrieve']}/>
            <Table columns={columns} onRowClick={this.onSelect}  dataSource={contractList} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
        </div>
      </Modal>
    );
  }
});

export default SelectContract;
