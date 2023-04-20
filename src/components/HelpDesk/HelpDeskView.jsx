import React, { Component } from 'react';
import DocumentList from '../Common/DocumentList';
import HelpDeskRequesterInfo from './HelpDeskRequesterInfo';
const user_status = [{ value: 0, label: 'Request' }, { value: 1, label: 'Accept' }, { value: 2, label: 'Reject' }];

export default class HelpDeskView
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data.helpDesk[0],
            document: props.data.doc,
            status_info: []
        }
    }

    getActionStatus(status) {
        if (status === 0) return { label: 'Request', value: 0 };
        else {
            var action = user_status.filter(function (one) { return Number(one.value) === Number(status) });
            return action[0];
        }
    }

    render() {
        return (
            <div>
                <div className="form-horizontal mt20" name="demo-form">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12" >Request Type </label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        placeholder="Please Choose Type"
                                        value={this.state.data.ticket_type}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }} >
                                <div><label className="col-sm-12" >Ticket Name </label></div>
                                <div className="col-sm-10" >
                                    <input
                                        className="form-control input-md"
                                        value={this.state.data.ticket_name}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12" >Requested Department</label></div>
                                <div className="col-sm-10">

                                    <input className="form-control input-md"
                                        placeholder="Please Choose Type"
                                        value={this.state.data.deptname}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12 mt20" >Ticket Main Category </label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        placeholder="Please Choose Type"
                                        value={this.state.data.category_name}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12 mt20">Ticket Sub Category </label></div>
                                <div className="col-sm-10">

                                    <input className="form-control input-md"
                                        placeholder="Please Choose Type"
                                        value={this.state.data.sub_category_name}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12 mt20" >Ticket Status </label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        placeholder="Please Choose Type"
                                        value={this.state.data.ticket_status}

                                        disabled
                                    />
                                </div>
                            </div>

                        </div>


                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12 mt20" >Severity<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input type="text" className="form-control full_width" value={this.state.data.severityName} disabled></input>

                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12 mt20" >Priority </label></div>
                                <div className="col-sm-10">

                                    <input className="form-control input-md"
                                        placeholder="Please Choose Type"
                                        value={this.state.data.priorityName}
                                        disabled
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12 mt20" >Location Branch </label></div>
                                <div className="col-sm-10">

                                    <input className="form-control input-md"
                                        placeholder="Please Choose Type"
                                        value={this.state.data.branch_name}
                                        disabled
                                    />
                                </div>
                            </div>

                        </div>


                    </div>
                    <div className="row">
                        {/* <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12 mt20" >Deparment </label></div>
                                <div className="col-sm-10">

                                    <input className="form-control input-md"
                                        placeholder="Please Choose Type"
                                        value={this.state.data.deptname}
                                        disabled
                                    />
                                </div>
                            </div>

                        </div> */}
                        <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12 mt20" >Assign Person </label></div>
                                <div className="col-sm-10">
                                    <input className="form-control input-md"
                                        placeholder="Please Choose Type"
                                        value={this.state.data.fullname}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group" >
                                <div><label className="col-sm-12 mt20" >Action Status</label></div>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control full_width" value={this.getActionStatus(this.state.data.action_status).label} disabled="true">
                                    </input>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group" style={{ marginBottom: 0 }} >
                                <div><label className="col-sm-12 mt20" >Ticket Description </label></div>
                                <div className="col-sm-10" >
                                    <textarea
                                        className="form-control"
                                        cols="20"
                                        rows="5"
                                        // className="form-control input-md"
                                        disabled
                                        value={this.state.data.ticket_desc}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div><label className="col-sm-12 mt20" >Requester Comment</label></div>
                            <div className="col-sm-10" >
                                <textarea className="form-control"
                                    cols="20"
                                    rows="5"
                                    value={this.state.data.request_comment}
                                    placeholder="Enter Comment"
                                    disabled
                                    onChange={this.changeComment}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {
                            this.state.document.length > 0 ?
                                <DocumentList title='Help Desk Document' doc={this.state.document} path='helpDesk' />
                                : ''
                        }
                    </div>
                    <div className="row margin-top-20">
                        <HelpDeskRequesterInfo user_id={this.state.data.user_id} />
                    </div>

                </div>
            </div >

        );
    }
}

