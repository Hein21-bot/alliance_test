import React, { Component } from 'react';
import moment from "moment";
import DocumentList from '../../Common/DocumentList';
import ApprovalInformation from '../../Common/ApprovalInformation';
import { main_url, getBranch } from "../../../utils/CommonFunction";
import Select from 'react-select';

class CycleView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            document: [],
            status_info: [],
            selected_location: [],
            withdraw_location: 0,
        }
    }
    async componentDidMount() {
        this.getDocument();
        this.getStatusInfo();
        let branch = await getBranch();
        let selected_location = this.getSelectedLocation(branch, this.props.data.withdraw_location);
        this.setState({
            branch: branch,
            selected_location: selected_location
        })
    }

    getSelectedLocation(branch, location) {
        let selected = branch.filter(function (b) { return b.value == location })
        return selected;
    }

    getStatusInfo() {
        fetch(`${main_url}cycleInsurance/getOneDetailInfo/${this.state.data.cycle_insurance_benefit_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    status_info: res
                })
            })
            .catch(error => console.log(error))
    }
    getDocument() {
        fetch(main_url + "cycleInsurance/getDocument/" + this.state.data.cycle_insurance_benefit_id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({
                        document: res
                    })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    render() {
        return (
            <div className="benefits benefit-medical">
                <div className='row'>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-6">
                                <div><label className="col-sm-10">Request Date</label></div>
                                <div className="col-sm-10" disabled>
                                    <input className="form-control input-md" type="text" value={moment(this.state.data.requested_date).format('YYYY-MM-DD')} disabled />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-10">Employee Name</label></div>
                                <div className="col-sm-10">
                                    <input type="text"
                                        className="form-control"
                                        placeholder="What is the available amount"
                                        value={this.state.data.fullname}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div><label className="col-sm-10">Employee ID</label></div>
                                <div className="col-sm-10">
                                    <input className="form-control input-md" type="text"
                                        value={this.state.data.employment_id}
                                        disabled />
                                </div>

                            </div>
                            <div className="col-md-6">
                                <div><label className="col-sm-10">Start Date</label></div>
                                <div className="col-sm-10">
                                    <input className="form-control input-md" type="text"
                                        value={moment(this.state.data.start_date).format('YYYY-MM-DD')}
                                        disabled />
                                </div>

                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div><label className="col-sm-10">Expire Date</label></div>
                                <div className="col-sm-10">
                                    <input className="form-control input-md" type="text"
                                        value={moment(this.state.data.expire_date).format('YYYY-MM-DD')}
                                        disabled />
                                </div>

                            </div>
                            <div className="col-md-6">
                                <div><label className="col-sm-10">Insurance Amount</label></div>
                                <div className="col-sm-10">
                                    <input className="form-control input-md" type="text"
                                        value={this.state.data.insurance_amount}
                                        disabled />
                                </div>

                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div><label className="col-sm-10">Approve Amount</label></div>
                                <div className="col-sm-10">
                                    <input className="form-control input-md" type="text"
                                        value={this.state.data.approve_amount}
                                        disabled />
                                </div>

                            </div>
                            <div className="col-md-6 form-group">
                                <div><label className="col-sm-12" >WithDraw Location<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <Select
                                        data-name='withdraw_loction'
                                        value={this.state.selected_location}
                                        isDisabled={true}
                                        // onChange={this.changeWithdrawLocation}
                                        // options={this.state.branch}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    />

                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                <div className='row'>
                    <div className="row-md-12 document-main">
                        {
                            this.state.document.length > 0 ?
                                <DocumentList title='Cycle Insurance Document' doc={this.state.document} path='cycleInsurance' />
                                : ''
                        }
                    </div>
                    <div className="row-md-12 approval-main">
                        {
                            !Array.isArray(this.state.status_info) ?

                                <div className="margin-top-20">
                                    <ApprovalInformation status={this.state.status_info} />
                                </div>
                                : ''
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default CycleView