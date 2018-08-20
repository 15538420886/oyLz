import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import { Modal, Button, Input, Card, Table, Row, Col, Spin } from 'antd';
var AssetQueryImageStore = require('../data/AssetQueryImageStore');
var AssetQueryActions = require('../action/AssetQueryActions');

var AssetImagePage = React.createClass({
	getInitialState : function() {
		return {
			assetQuerySet: {
                recordSet:[],
				operation : '',
				errMsg : ''
			},
			loading: false,
			hints: {},
			validRules: [],
            images: {},
		}
	},

	mixins: [Reflux.listenTo(AssetQueryImageStore, "onServiceComplete")],
	onServiceComplete: function(data) {
		if(data.operation === 'retrieve'){
            this.setState({
	            loading: false,
	            assetQuerySet: data
	        });
		}
	},

	// 第一次加载
	componentDidMount : function(){
		this.initPage();
	},

	initPage: function()
	{
		if(window.loginData.compUser){
			this.setState({loading: true});
			var filter = {};
			filter.assetUuid = this.props.asset.uuid;
			AssetQueryActions.retrieveAssetInfoImage( filter );
		}
	},
    
    goBack: function () {
        if (this.props.goBack) {
            this.props.goBack();
        }
    },

    handleImageClick: function(e){
        var url = Utils.assetUrl+'asset-picture/map-down?uuid='+e.uuid;
        window.location.href = Utils.fmtGetUrl(url);
    },
    
	render : function() {
        var recordSet = this.state.assetQuerySet.recordSet;
        var card =
        recordSet.map((images, i) => {
            return <div key={images.uuid} className='card-div' style={{ width: 300 }}>
                <Card style={{ width: 240, margin:'0 auto' }} onClick={this.handleImageClick.bind(this, images)} bodyStyle={{ padding: 0 }}>
                    <div className="custom-image" style={{textAlign:'center', padding:'10px 0'}} title='下载图片'>
                        <img width="100%" />
                    </div>
                    <div className="custom-card">
                        <p style={{padding:'0px 4px 4px'}}>{images.pictureName}</p>
                    </div>
                </Card>  
            </div>
        });

		return (
			<div style={{padding:"20px 0 16px 8px",width:'960px', height: '100%',overflowY: 'auto'}}>
	        	<ServiceMsg ref='mxgBox' svcList={['asset-picture/asset-image']}/>
                {this.state.loading ? <Spin>{card}</Spin> : card}
                <div key="footerDiv" style={{ width:'918px', overflow:'hidden', textAlign: 'right',marginTop:'50px' }}>
                    <Button key="btnClose" size="middle" onClick={this.goBack}>返回</Button>
                </div>
	        </div>
		);
	}
});

module.exports=AssetImagePage;
