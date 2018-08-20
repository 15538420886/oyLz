import React from 'react';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');

import { Modal, Button, Table, Icon} from 'antd';
var SearchProjTaskStore = require('../data/SearchProjTaskStore');
var SearchProjTaskActions = require('../action/SearchProjTaskActions');

var SelectProjTask = React.createClass({
    getInitialState : function() {
        return {
            ProjTaskSet: {
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
            selectProjTask:{},
            modal:false
        }
    },
	mixins: [Reflux.listenTo(SearchProjTaskStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            ProjTaskSet: data,
            selectIndex:-1,
            selectProjTask:{},
        });
    },

  // 第一次加载
  componentDidMount : function(){
  },
  
  clear : function(ProjTaskSet){
    this.state.ProjTaskSet = ProjTaskSet;
    this.state.selectIndex=-1;
    this.state.selectProjTask={};
  },

  toggle : function(){
    this.setState({
      modal: !this.state.modal
    });
  },
  
  onSelect: function(record, index){
    this.props.onSelectProjTask(record);
    this.toggle();
  },

  onChangePage: function(pageNumber){
      this.setState({loading: true});
      this.state.ProjTaskSet.startPage = pageNumber;
      var filter = this.state.ProjTaskSet.filter;
      SearchProjTaskActions.retrieveProjTaskPage(filter, pageNumber, this.state.ProjTaskSet.pageRow);
  },

  render : function(){
    const columns = [
        {
            title: '订单编号',
            dataIndex: 'ordCode',
            key: 'ordCode',
            width: 140,
        },
        {
            title: '订单名称',
            dataIndex: 'ordName',
            key: 'ordName',
            width: 100,
        },
        {
            title: '任务编号',
            dataIndex: 'itemCode',
            key: 'itemCode',
            width: 140,
        },
        {
            title: '任务名称',
            dataIndex: 'itemName',
            key: 'itemName',
            width: 240,
        },
    ];

    var ProjTaskList = this.state.ProjTaskSet.recordSet;
    var pag = {showQuickJumper: true, total:this.state.ProjTaskSet.totalRow, pageSize:this.state.ProjTaskSet.pageRow, current:this.state.ProjTaskSet.startPage, size:'large', onChange: this.onChangePage};
    return (
        <Modal visible={this.state.modal} width='760px' title="选择订单任务" maskClosable={true} onOk={this.onClickSave} onCancel={this.toggle}
          footer={null}
          >
          <div style={{padding: '0 8px 0 8px'}}>
            <ServiceMsg ref='mxgBox' svcList={['proj-order/retrieve']}/>
            <Table columns={columns} onRowClick={this.onSelect}  dataSource={ProjTaskList} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
        </div>
      </Modal>
    );
  }
});

export default SelectProjTask;
