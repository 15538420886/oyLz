import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
    children: React.PropTypes.node
};

var AtsPageIndex = React.createClass({
    getInitialState: function () {
        return {
            navItems: [
                {
                    name: '资产类别管理',
                    to: '/asset/AssetTypePage/'
                },
                {
                    name: '供应商管理',
                    to: '/asset/AssetInfoPage/'
                },
                {
                    name: '库管员管理',
                    to: '/asset/StorKeeperPage/'
                },
                {
                    name: '库存地管理',
                    to: '/asset/StorLocPage/'
                },
            ]
        }
    },

    render: function () {
        return (
            <LeftMenu navItems={this.state.navItems} activeNode="/asset/AssetTypePage/" children={this.props.children} />
        );
    }
});

AtsPageIndex.propTypes = propTypes;
module.exports = AtsPageIndex;


