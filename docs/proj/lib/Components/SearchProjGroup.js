import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Icon, Input, Spin} from 'antd';
const Search = Input.Search;
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var SearchProjGroupStore = require('../data/SearchProjGroupStore');
var SearchProjGroupActions = require('../action/SearchProjGroupActions');
import SelectProjGroup from './SelectProjGroup';

const propTypes = {
  children: React.PropTypes.node,
  corpUuid: React.PropTypes.string,
  render: React.PropTypes.func,
  showError: React.PropTypes.func,
  onSelectGroup: React.PropTypes.func,
};

var SearchProjGroup = React.createClass({
    getInitialState: function () {
        var value = this.props.value;
        if (value === undefined) {
            value = '';
        }

		return {
			projGroupSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},

            filterValue: value,
            hint: '',
            corpUuid:this.props.corpUuid,
			showError: this.props.showError,
			onSelectGroup: this.props.onSelectGroup,
            loading: false,
		}
	},

	mixins: [Reflux.listenTo(SearchProjGroupStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        var sp = this.refs.SelectProjGroupPage;
        if (!sp.state.modal && this.state.loading ){
    		var len = data.recordSet.length;
            if (len === 0) {
                var errMsg = (data.errMsg === '') ? '没有找到项目群' : data.errMsg;
                this.state.hint = errMsg;
                if(this.state.showError !== undefined){
		             this.state.showError(errMsg);
                 }
    		}
            else if(len === 1){
    			this.state.onSelectGroup(data.recordSet[0]);
    		}
            else if(len > 1){
    			this.refs.SelectProjGroupPage.clear( data );
    			this.refs.SelectProjGroupPage.toggle();
    		}

            this.setState({
                loading: false,
                projGroupSet: data
            });
        }
    },

    componentDidMount: function () {
    },
    setValue: function (value) {
        this.setState({ filterValue: value });
    },
    handleOnChange: function (e) {
        this.setState({
            filterValue: e.target.value
        });
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
        filter.grpName = value;

		 this.setState({
            filterValue: value,
            loading: true,
            hint: '',
        });

		SearchProjGroupActions.retrieveProjGroupPage(filter, 1, 10);
	},

	render : function() {
	    const {
			projUuid,
			showError,
            onSelectGroup,
            style,
            value,
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
                    <Search placeholder="项目群查询" value={this.state.filterValue} style={style3} {...attributes} onChange={this.handleOnChange} onSearch={this.onSearch} />
                </div>
                <div style={{ flex: '0 0 40px', width: '40px' }}>
                    <Spin style={{ width: '100%', height: '100%' }}></Spin>
                </div>
            </div>
        }
        else {
            searchBox = <Search placeholder="项目群查询" value={this.state.filterValue} style={style3} {...attributes} onChange={this.handleOnChange} onSearch={this.onSearch} />
        }

        return (
            <div>
                {searchBox}
                {this.state.hint === '' ? null : <div style={style2} className="ant-form-explain"><span className="errorHint">{this.state.hint}</span></div>}
                <SelectProjGroup ref="SelectProjGroupPage" onSelectGroup={this.state.onSelectGroup} />
            </div>
        );
	}
});

SearchProjGroup.propTypes = propTypes;
module.exports = SearchProjGroup;
