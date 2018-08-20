import React from 'react';
import TopBar from '../lib/Components/TopBar';
var Common = require('../public/script/common');


var AssetLayout = React.createClass({
    getInitialState: function () {
        return {
            navItems: [
                {
                    name: '固定资产',
                    to: '/asset/AssetQueryPage/'
                },
                {
                    name: '参数管理',
                    to: '/asset/AssetTypePage/'
                },
            ]
        }
    },

    render: function () {
        return <TopBar navItems={this.state.navItems} activeNode={Common.assetHome} home='@/index.html?from=asset' children={this.props.children} />
    }
});

module.exports = AssetLayout;
