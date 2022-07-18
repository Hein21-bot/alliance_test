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
        return (
            <div className="main-info">
                <div className="header-info col-md-12">
                    <h4>Information</h4>
                </div>
                <div className="row body-info">
                    <div className="col-md-1">

                    </div>
                    <div className="col-md-2">
                       
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
                    <div className="col-md-2">
                        <div>
                            <label>Check</label>
                        </div>
                        {
                            info.checked || info.rejected ?
                                <div>
                                    <div>
                                        <label>
                                            {
                                                info.checked.checked_by ? info.checked.checked_by : '-'
                                            }
                                        </label>
                                        <label>
                                            {
                                                info.checked.employment_id != '-' &&
                                                    info.checked.employment_id == info.rejected.employment_id ? '[Rejected]' : ''
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
                                                info.checked.checked_date ? moment(info.checked.checked_date).format('YYYY-MM-DD') : 
                                                <div>{info.rejected.rejected_date ? info.rejected.rejected_date : '-'}</div>
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.checked.checked_comment ? info.checked.checked_comment : '-'
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
                    <div className="col-md-2">
                        <div>
                            <label>Verify</label>
                        </div>
                        {
                            info.verified || info.rejected ?
                                <div>
                                    <div>
                                        <label>
                                            {
                                                info.verified.verified_by ? info.verified.verified_by : '-'
                                            }
                                        </label>
                                        <label>
                                            {
                                                info.verified.employment_id != '-' &&
                                                    info.verified.employment_id === info.rejected.employment_id ? '[Rejected]' : ''
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
                                                info.verified.verified_date ? moment(info.verified.verified_date).format('YYYY-MM-DD') :
                                                <div>{info.rejected.rejected_date ? info.rejected.rejected_date : '-'}</div>
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.verified.verified_comment ? info.verified.verified_comment : '-'
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
                    <div className="col-md-2">
                        <div>
                            <label>Approve</label>
                        </div>
                        {
                            info.approved || info.rejected ?
                                <div>
                                    <div>
                                        <label>
                                            {
                                                info.approved.approved_by ? info.approved.approved_by : '-'
                                            }
                                        </label>
                                        <label>
                                            {
                                                info.approved.employment_id != '-' &&
                                                    info.approved.employment_id === info.rejected.employment_id ? '[Rejected]' : ''
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.approved.employment_id ? info.approved.employment_id : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.approved.designations ? info.approved.designations : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.approved.branch_name ? info.approved.branch_name : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.approved.approved_date ? moment(info.approved.approved_date).format('YYYY-MM-DD') : 
                                                <div>{info.rejected.rejected_date ? info.rejected.rejected_date : '-'}</div>
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.approved.approved_comment ? info.approved.approved_comment : '-'
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
                   <div className="col-md-2">
                        <div>
                            <label>ReferBack</label>
                        </div>
                        {
                            info.refered ?
                                <div>
                                    <div>
                                        <label>
                                            {
                                                info.refered.refered_by ? info.refered.refered_by : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.refered.employment_id ? info.refered.employment_id : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.refered.designations ? info.refered.designations : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.refered.branch_name ? info.refered.branch_name : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.refered.referback_date ? moment(info.refered.referback_date).format('YYYY-MM-DD') : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.refered.referback_comment ? info.refered.referback_comment : '-'
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