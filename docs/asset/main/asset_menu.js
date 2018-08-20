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
                    name: '资产查询',
                    to: '/asset/AssetQueryPage/'
                },
            ]
        }
    },

    render: function () {
        return (
            <LeftMenu navItems={this.state.navItems} activeNode="/asset/AssetQueryPage/" children={this.props.children} />
        );
    }
});

AtsPageIndex.propTypes = propTypes;
module.exports = AtsPageIndex;
