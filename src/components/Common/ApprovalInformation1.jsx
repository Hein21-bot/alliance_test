import React, { Component } from 'react';
import moment from 'moment';
export default class ApprovalInformation1 extends Component {

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
                                                info.requested.requested_date ? moment(info.requested.requested_date).utc().format('YYYY-MM-DD') : '-'
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
                            <label>Approve</label>
                        </div>
                        {
                            info.approved ?
                                <div>
                                    <div>
                                        <label>
                                            {
                                                info.approved.approved_by ? info.approved.approved_by : '-'
                                            }
                                        </label>
                                        <label>
                                            {
                                                info.approved.employment_id ? info.approved.employment_id : '-'
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
                                                info.approved.approved_date ? moment(info.approved.approved_date).format('YYYY-MM-DD') : '-'
                                                
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
                            <label>Reject</label>
                        </div>
                        {
                           info.rejected ?
                                <div>
                                    <div>
                                        <label>
                                            {
                                               info.rejected.rejected_by ? info.rejected.rejected_by : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                               info.rejected.employment_id ?info.rejected.employment_id : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                               info.rejected.designations ?info.rejected.designations : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                               info.rejected.branch_name ?info.rejected.branch_name : '-'
                                            }
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            {
                                                info.rejected.rejected_date ? moment(info.rejected.rejected_date).format('YYYY-MM-DD') : '-'
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