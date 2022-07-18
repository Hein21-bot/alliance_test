import React, { Component } from 'react';
import DatePicker from 'react-datetime';
import Select from 'react-select';
import DocumentList from '../../Common/DocumentList';
import { main_url, getBranch } from "../../../utils/CommonFunction";
import ApprovalInformation from '../../Common/ApprovalInformation';
import moment from "moment";

class HospitalizationView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            document: [],
            status_info: [],
            user_detail: [],
            selected_location: [],
            withdraw_location: 0,
            start_date: new Date(),
            end_date: new Date()
        }
    }

    async componentDidMount() {
        this.getDocument();
        this.getStatusInfo();
        this.getUserDetail();
        let branch = await getBranch();
        let selected_location = this.getSelectedLocation(branch, this.state.data.withdraw_location);
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
        fetch(`${main_url}hospitalization_benefit/getOneDetailInfo/${this.state.data.hospitalization_benefit_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    status_info: res
                })
            })
            .catch(error => console.log(error))
    }

    getDocument() {
        fetch(main_url + "hospitalization_benefit/getDocument/" + this.state.data.hospitalization_benefit_id)
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

    getUserDetail() {
        fetch(`${main_url}hospitalization_benefit/getUserDetail/${this.state.data.employee_id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(benefit => {
                // list = list.filter(function (l) {
                //     return l.label !== 'Sibling';
                // })
                this.setState({
                    user_detail: benefit
                })

            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    render() {
        return (
            <div className="benefits benefit-medical">
                <div className='row'>
                    <div className="form-group">
                        <div className="col-md-4">
                            <div><label className="col-sm-10">Request Date</label></div>
                            <div className="col-sm-10">
                                {/* <DatePicker
                                    dateFormat="DD/MM/YYYY"
                                    value={moment(this.state.data.requested_date).format('YYYY-MM-DD')}
                                    timeFormat={false}
                                    disabled
                                /> */}
                                <input className="form-control input-md"
                                    type="text"
                                    value={moment(this.state.data.requested_date).format('YYYY-MM-DD')}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="col-md-4">
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

                        <div className="col-md-4">
                            <label className="col-sm-10">Employee ID</label>

                            <div className="col-sm-10">
                                <input className="form-control input-md" type="text"
                                    value={this.state.data.employment_id}
                                    disabled />
                            </div>

                        </div>

                        <div className="col-md-4">
                            <div><label className="col-sm-10">NRC</label></div>
                            {
                                this.state.user_detail.length > 0 ?
                                    <div className="col-sm-10">
                                        <input
                                            value={this.state.user_detail[0].nrc}
                                            className='form-control input-md'
                                            type="text"
                                            disabled
                                        />
                                    </div> : ''
                            }
                        </div>

                        <div className="col-md-4">
                            <label className="col-sm-10">Position</label>

                            <div className="col-sm-10">
                                <input className="form-control input-md" type="text"
                                    value={this.state.data.designations}
                                    disabled />
                            </div>

                        </div>

                        <div className="col-md-4">
                            <label className="col-sm-10">Branch</label>
                            <div className="col-sm-10">
                                <input className="form-control input-md"
                                    type="text"
                                    value={this.state.data.branch_name}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div><label className="col-sm-10">Hospitalization Type</label></div>
                            <div className="col-sm-10">
                                <input className="form-control input-md" type="text"
                                    value={this.state.data.hospitalization_type_name}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <br />
                            <div className="col-sm-10"><label>Related with Work or Not</label></div>
                            <div className="col-sm-10">
                                {
                                    this.state.data.related_with_work_or_not === 1 ?
                                        <div >
                                            <input type="radio" value={1} name="work" checked disabled /> Yes
                                            <input type="radio" value={0} name="work" disabled /> NO
                                        </div>
                                        : <div >
                                            <input type="radio" value={1} name="work" disabled /> Yes
                                            <input type="radio" value={0} name="work" checked disabled /> NO
                                        </div>
                                }
                            </div>
                        </div>
                        <div className="col-md-4">
                            <br />
                            <div className="col-sm-10"><label>Injury or Not</label></div>
                            <div className="col-sm-10">

                                {
                                    this.state.data.injury_or_not === 1 ?
                                        <div >
                                            <input type="radio" value={1} checked name="injury" disabled /> Yes
                                            <input type="radio" value={0} name="injury" disabled /> NO
                                        </div>
                                        : <div >
                                            <input type="radio" value={1} name="injury" disabled /> Yes
                                            <input type="radio" value={0} checked name="injury" disabled /> NO
                                        </div>
                                }
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="col-sm-10">Name of Disease or injury</label>
                            <div className="col-sm-10">
                                <input
                                    className="form-control input-md"
                                    type="text"
                                    value={this.state.data.name_of_disease_or_injury}
                                    placeholder="Enter Disease or injury"
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="col-sm-10">Available amount</label>
                            <div className="col-sm-10">
                                <input className="form-control input-md" type="text" disabled value={this.state.data.available_amount}></input>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="col-sm-10">Request Amount</label>
                            <div className="col-sm-10">
                                <input className="form-control checkValidate"
                                    type="number"
                                    value={this.state.data.request_amount}
                                    onChange={this.handleRequest}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div><label className="col-sm-10">Case Date</label></div>
                            <div className="col-sm-10">
                                <input
                                    className="form-control input-md"
                                    type="text"
                                    value={moment(this.state.data.case_date).format('YYYY-MM-DD')}
                                    disabled
                                />

                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="col-sm-10">Case Place</label>
                            <div className="col-sm-10">
                                <input className="form-control input-md" type="text"
                                    value={this.state.data.case_place}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="col-sm-10">Hospital Name</label>
                            <div className="col-sm-10">
                                <input className="form-control input-md" type="text"
                                    value={this.state.data.hospital_name}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="col-sm-10">Start Date</label>
                            <div className="col-sm-10">
                                <input className="form-control input-md" type="text"
                                    value={moment(this.state.data.start_date).format('YYYY-MM-DD')}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="col-sm-10">End Date</label>
                            <div className="col-sm-10">
                                <input className="form-control input-md" type="text"
                                    value={moment(this.state.data.end_date).format('YYYY-MM-DD')}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div><label htmlFor="description" className="col-sm-12">Please Enter the Case Details </label></div>
                            <div className="col-sm-10">
                                <textarea
                                    name="description"
                                    className="form-control"
                                    cols="30"
                                    rows="3"
                                    id="description"
                                    value={this.state.data.case_detail}
                                    disabled
                                >
                                </textarea>
                            </div>
                        </div>

                        <div className="col-md-4 form-group">
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

                        {/* <div className="col-md-4">
                                <div><label className="col-sm-10">Select Location</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        //options={this.state.branchlist}
                                        placeholder="Please Choose Branch"
                                        //onChange={this.handleSelectedLocation.bind(this)}
                                       // value={this.state.selected_location}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    />
        

                                </div>
                            </div>
                            <div className="col-md-4">
                                <div><label className="col-sm-10">Select Position</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        //options={this.state.branchlist}
                                        placeholder="Please Choose Position"
                                        //onChange={this.handleSelectedLocation.bind(this)}
                                       // value={this.state.selected_location}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div> */}
                    </div>
                </div>
                <div className='row'>
                    <div className="row-md-12 document-main">
                        {
                            this.state.document.length > 0 ?
                                <DocumentList title='Hospitalization Benefit Document' doc={this.state.document} path='hospitalization_benefit' />
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
export default HospitalizationView