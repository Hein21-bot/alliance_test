import React, { Component } from 'react';
import moment from "moment";
import ApprovalInformation1 from '../Common/ApprovalInformation1';

class AttendanceRequestView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            datasource: this.props.data,
            status_info: [],
            pathname:window.location.pathname
          
        }
    }

    componentDidMount() {
        // this.getStatusInfo();
        
    }

    // getStatusInfo() {
    //     fetch(`${main_url}wedding_benefit/getOneDetailInfo/${this.state.datasource.benefit_id}`)
    //         .then(res => res.json())
    //         .then(res => {
    //             this.setState({
    //                 status_info: res
    //             })
    //         })
    //         .catch(error => console.log(error))
    // }

    

    render() {
        console.log(this.state.datasource)
        return (
            <div className='border-bottom white-bg dashboard-header'>

                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        
                        <ol className="breadcrumb">
                            <li>
                                Attendance
                            </li>
                            <li className="active">
                                <a href="#">Attendance Request</a>
                            </li>

                        </ol>
                    </div>

                    <div className="col-lg-2">
                        {
                                <a href={this.state.pathname}>
                                    <button className="btn btn-primary" >
                                        Back To List</button></a>
                                
                        }

                    </div>

            </div>
            <br />
            <div className="container">
                
                <div className='row white-bg'>
                    <form>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
                                <div className="col-sm-10">
                                    <input type='text' disabled className='form-control' value={this.state.datasource.fullname} />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="designation" className="col-sm-12" >Designation</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.state.datasource.designations}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12" >Attendance Type</label></div>
                                <div className="col-sm-10">
                                    <input type='text' disabled value={this.state.datasource.late_checkin == 1 ? 'Late Check In' : this.state.datasource.field_checkin == 1 ? 'Field Check In' : this.state.datasource.early_checkout == 1 ? 'Early Check Out' : 'Field Check Out'} className='form-control' />

                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="spouse-name" className="col-sm-12" >Attendance Date</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        disabled
                                        className="form-control"
                                        value={this.state.datasource.createdAt ? moment(this.state.datasource.createdAt).format('YYYY-MM-DD') : ''}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12" >Attendance Time</label></div>
                                <div className="col-sm-10">
                                    <input type='text' disabled value={this.state.datasource.early_checkout == 1 || this.state.datasource.field_checkout ==1 ? moment(this.state.datasource.check_out_time).utc().format('hh:mm A') : moment(this.state.datasource.check_in_time).utc().format('hh:mm A')} className='form-control' />

                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="spouse-name" className="col-sm-12" >Location</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        disabled
                                        className="form-control"
                                        value={this.state.datasource.late_checkin == 1  ? this.state.late_checkin_reason : this.state.datasource.field_checkin == 1 ? this.state.datasource.visit_location : this.state.datasource.early_checkout == 1 ? this.state.early_checkout_reason : this.state.datasource.checkout_visit_location}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12" >Reason</label></div>
                                <div className="col-sm-10">
                                    <textarea name="" id="" cols="30" rows="10" disabled className='form-control'>{this.state.datasource.late_checkin == 1 ? (this.state.datasource.late_checkin_reason ? this.state.datasource.late_checkin_reason : '') : this.state.datasource.field_checkin == 1 ? this.state.datasource.visit_reason : this.state.datasource.early_checkout == 1 ? this.state.datasource.early_checkout_reason : this.state.datasource.checkout_visit_reason}</textarea>

                                </div>
                            </div>
                            
                        </div>
                        
                        {
                            !Array.isArray(this.state.status_info) ?

                                <div className="row approval-main margin-top-20">
                                    <ApprovalInformation1 status={this.state.status_info} />
                                </div>
                                : ''
                        }

                    </form>

                </div>

            </div>

            </div>
            
        )
    }
}

export default AttendanceRequestView;