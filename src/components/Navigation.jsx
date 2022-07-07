import React, { Component } from 'react';
import Sidebar from '../components/layouts/Sidebar';
import NavBar from '../components/layouts/NavBar';
import Main from '../components/Main';
import { getLoginUser, remote_url } from '../utils/CommonFunction'

export default class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            user_id: this.props.user_id
        }
    }
    async componentDidMount() {
        let user = await getLoginUser(this.props.user_id);
        if (user !== null && !Array.isArray(user)) {
            this.setState({
                user: user
            })
        }
        else window.location = remote_url;
    }


    render() {
        return (
            this.state.user !== null ?
                <div>
                    <Sidebar />
                    <div id="page-wrapper" className="gray-bg dashbard-1 ownheight">
                        <NavBar /><Main /></div></div> : ''
        )
    }
}