import React, { Component } from 'react';
import moment from 'moment';
export default class ApprovalInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            info: this.props.status

        }
    }

    render() {
        let info = this.state.info;
        console.log('info is ============>', info)
        return (
            <div className="main-info">
                <div className="header-info col-md-12">
                    <h4>Information</h4>
                </div>
                <div className="row body-info">
                    <div className="col-md-3">

                        <div>
                            <label>Request</label>
                        </div>
                        {
                            info.requested ?
                                <div>
                                    <div>
                                        <label>
                                            {
                                                info.requested.requested_by ? info.requested.requested_by : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.requested.employment_id ? info.requested.employment_id : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.requested.designations ? info.requested.designations : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.requested.branch_name ? info.requested.branch_name : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.requested.requested_date ? moment(info.requested.requested_date).format('YYYY-MM-DD') : '-'
                                            }
                                        </label>
                                    </div>
                                </div>
                                : <div>
                                    <div>-</div>
                                    <div>-</div>
                                    <div>-</div>
                                    <div>-</div>
                                    <div>-</div>
                                </div>
                        }
                    </div>
                    <div className="col-md-3">
                        <div>
                            <label>Check</label>
                        </div>
                        {
                            info.checked && info.checked.checked_date ?
                                <div>
                                    <div>
                                        <label>
                                            {
                                                info.checked.check_by ? info.checked.check_by : '-'
                                            }
                                        </label>
                                        <label>
                                            {
                                                info.checked.employment_id != '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.checked.employment_id ? info.checked.employment_id : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.checked.designations ? info.checked.designations : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.checked.branch_name ? info.checked.branch_name : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.checked.checked_date ? info.checked.checked_date : '-'
                                            }
                                        </label>
                                    </div>

                                </div>
                                : <div>
                                    <div>-</div>
                                    <div>-</div>
                                    <div>-</div>
                                    <div>-</div>
                                    <div>-</div>
                                </div>
                        }
                    </div>
                    <div className="col-md-3">
                        <div>
                            <label>Confirm</label>
                        </div>
                        {
                            info.confirmed && info.confirmed.confirmed_date ?
                                <div>
                                    <div>
                                        <label>
                                            {
                                                info.confirmed.confirm_by ? info.confirmed.confirm_by : '-'
                                            }
                                        </label>
                                        <label>
                                            {
                                                info.confirmed.employment_id != '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.confirmed.employment_id ? info.confirmed.employment_id : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.confirmed.designations ? info.confirmed.designations : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.confirmed.branch_name ? info.confirmed.branch_name : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.confirmed.confirmed_date ? info.confirmed.confirmed_date : '-'
                                            }
                                        </label>
                                    </div>

                                </div>
                                : <div>
                                    <div>-</div>
                                    <div>-</div>
                                    <div>-</div>
                                    <div>-</div>
                                    <div>-</div>
                                </div>
                        }
                    </div>
                    <div className="col-md-3">
                        <div>
                            <label>Verify</label>
                        </div>
                        {
                            info.verified && info.verified.verified_date ?
                                <div>
                                    <div>
                                        <label>
                                            {
                                                info.verified.verified_by ? info.verified.verified_by : '-'
                                            }
                                        </label>
                                        <label>
                                            {
                                                info.verified.employment_id != '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.verified.employment_id ? info.verified.employment_id : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.verified.designations ? info.verified.designations : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.verified.branch_name ? info.verified.branch_name : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.verified.verified_date ? info.verified.verified_date : '-'
                                            }
                                        </label>
                                    </div>
                                </div>
                                : <div>
                                    <div>-</div>
                                    <div>-</div>
                                    <div>-</div>
                                    <div>-</div>
                                    <div>-</div>
                                </div>
                        }
                    </div>

                </div>
            </div>
        )
    }
}