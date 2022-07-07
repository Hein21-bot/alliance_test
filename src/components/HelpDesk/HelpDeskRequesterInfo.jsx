import React, { Component } from 'react';
import { main_url } from '../../utils/CommonFunction';

export default class HelpDeskRequesterInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            info: {},
            user_id: this.props.user_id,
        }
    }

    componentDidMount() {
        this.getInformation(this.state.user_id);
    }

    getInformation(id) {
        fetch(`${main_url}helpDesk/getRequesterInformation/${id}`)
            .then(res => { if (res.ok) { return res.json() } })
            .then(info => {
                console.log(info)
                this.setState({
                    info: info
                })
            })
    }

    render() {
        let info = this.state.info;
        return (
            <div className="main-info">
                <div className="header-info col-sm-12">
                    <h4>Requester Information</h4>
                </div>
                <div className="row body-info">
                    <div className="col-md-3">
                        <div>
                            <label>Name</label>
                        </div>
                        <div>
                            <label>
                                {
                                    info.fullname ? info.fullname : '-'
                                }
                            </label>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div>
                            <label>Email</label>
                        </div>
                        <div>
                            <label>
                                {
                                    info.email ? info.email : '-'
                                }
                            </label>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div>
                            <label>Department</label>
                        </div>
                        <div>
                            <label>
                                {
                                    info.deptname ? info.deptname : '-'
                                }
                            </label>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div>
                            <label>Location</label>
                        </div>

                        <div>
                            <label>
                                {
                                    info.branch_name ? info.branch_name : '-'
                                }
                            </label>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div>
                            <label>Phone Number</label>
                        </div>

                        <div>
                            <label>
                                {
                                    info.phone ? info.phone : '-'
                                }
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}