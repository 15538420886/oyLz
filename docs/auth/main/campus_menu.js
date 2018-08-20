import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
    children: React.PropTypes.node
};

var AuthPageIndex = React.createClass({
    getInitialState: function () {
        return {
            navItems: [
                {
                    name: '公司维护',
                    to: '/auth/CampusPage/'
                },
                {
                    name: '工位维护',
                    to: '/camp/CampusPage/'
                },
            ]
        }
    },

    render: function () {
        return (
            <LeftMenu navItems={this.state.navItems} activeNode="/auth/CampusPage/" children={this.props.children} />
        );
    }
});

AuthPageIndex.propTypes = propTypes;
module.exports = AuthPageIndex;
