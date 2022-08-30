import React, { Component } from 'react';
import Sidebar from '../components/layouts/Sidebar';
import NavBar from '../components/layouts/NavBar';
import Main from '../components/Main';
import { getLoginUser, remote_url, main_url } from '../utils/CommonFunction'

export default class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            user_id: this.props.user_id,
            hrm_user_id: null
        }
    }
    async componentDidMount() {
        // this.getHRMUserId(this.props.user_id);
        let user = await getLoginUser(this.props.user_id);

        if (user !== null && !Array.isArray(user)) {
            this.setState({
                user: user
            })
        }
        else window.location = remote_url;
    }

    // async getHRMUserId(user_id) {

    //     await fetch(`${main_url}main/getHRMUser/${user_id}`)
    //         .then(response => {
    //             if (response.ok) return response.json()
    //         })
    //         .then(async res => {
    //             if (res) {
    //                 let user = await getLoginUser(res.account_users_hrmid);

    //                 if (user !== null && !Array.isArray(user)) {
    //                     this.setState({
    //                         user: user,
    //                         hrm_user_id: res.account_users_hrmid
    //                     })
    //                 }
    //                 else window.location = remote_url;
    //             }
    //         })
    //         .catch(error => console.error(`Fetch Error =\n`, error));

    // }


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