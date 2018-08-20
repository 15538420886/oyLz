import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Icon, Input, Spin} from 'antd';
const Search = Input.Search;
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var SearchContractStore = require('../data/SearchContractStore');
var SearchContractActions = require('../action/SearchContractActions');
import SelectContract from './SelectContract';

const propTypes = {
  children: React.PropTypes.node,
  corpUuid: React.PropTypes.string,
  render: React.PropTypes.func,
  showError: React.PropTypes.func,
  onSelectContract: React.PropTypes.func,
};

var SearchContract = React.createClass({
	getInitialState : function(){
		return {
			contractSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},

            filterValue: '',
            hint: '',
			corpUuid: window.loginData.compUser.corpUuid,
			showError: this.props.showError,
			onSelectContract: this.props.onSelectContract,
            loading: false,
		}
	},

	mixins: [Reflux.listenTo(SearchContractStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        var sp = this.refs.SelectContractPage;
        if( !sp.state.modal ){
    		var len = data.recordSet.length;
            console.log(len);
            if (len === 0) {
                var errMsg = (data.errMsg === '') ? '没有找到合同' : data.errMsg;
                this.state.hint = errMsg;
                if(this.state.showError !== undefined){
		             this.state.showError(errMsg);
                 }
    		}
            else if(len === 1){
    			this.state.onSelectContract(data.recordSet[0]);
    		}
            else if(len > 1){
    			this.refs.SelectContractPage.clear( data );
    			this.refs.SelectContractPage.toggle();
    		}

            this.setState({
                loading: false,
                ContractSet: data
            });
        }
    },

	handleClick: function(mod, key, e) {
		if(this.state.onClick !== null && typeof(this.state.onClick) !== 'undefined'){
			this.setState({current: key});
			this.state.onClick( mod );
		}
	},

	onSearch:function(value){
		var filter={};
		filter.corpUuid = this.state.corpUuid;
        if (Common.isIncNumber(value)){
			filter.contCode = value;
		}else{
			filter.contName = value;
		}

		 this.setState({
            filterValue: value,
            loading: true,
            hint: '',
        });

		SearchContractActions.retrieveContEventPage(filter);
	},

	render : function() {
	    const {
			corpUuid,
			showError,
            onSelectContract,
            style,
	        ...attributes,
        } = this.props;

        var style2 = {};
        var style3 = style;
        if (this.state.hint !== '') {
            style3 = {};
            Utils.copyValue(style, style2);
            Utils.copyValue(style, style3);
            style2.paddingTop = '4px';
            style3.paddingBottom = '0';
        }

        var searchBox = null;
        if (this.state.loading) {
            searchBox = <div style={{ display: '-webkit-box' }}>
                <div style={{ height: '100%', overflowX: 'hidden' }}>
                    <Search placeholder="(合同名称/编号查询)" defaultValue={this.state.filterValue} style={style3} {...attributes} onSearch={this.onSearch} />
                </div>
                <div style={{ flex: '0 0 40px', width: '40px', paddingTop: '16px' }}>
                    <Spin style={{ width: '100%', height: '100%' }}></Spin>
                </div>
            </div>
        }
        else {
            searchBox = <Search placeholder="(合同名称/编号查询)" defaultValue={this.state.filterValue} style={style3} {...attributes} onSearch={this.onSearch} />
        }

        return (
            <div>
                {searchBox}
                {this.state.hint === '' ? null : <div style={style2} className="ant-form-explain"><span className="errorHint">{this.state.hint}</span></div>}
                <SelectContract ref="SelectContractPage" onSelectContract={this.state.onSelectContract} />
            </div>
        );
	}
});

SearchContract.propTypes = propTypes;
module.exports = SearchContract;
