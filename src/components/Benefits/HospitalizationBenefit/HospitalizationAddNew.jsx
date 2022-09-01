import React, { Component } from 'react';
import DatePicker from 'react-datetime';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import ApprovalForm from '../../Common/ApprovalForm';
import moment from "moment";
import DocumentList from '../../Common/DocumentList';
import $ from 'jquery';
import {
    main_url, getCookieData, getWorkFlowStatus, validate, getActionStatus,
    alertText, havePermission, stopSaving, startSaving, isRequestedUser, getBranch
} from "../../../utils/CommonFunction";
let form_validate = true;
class HospitalizationAddNew extends Component {
    constructor(props) {
        super(props)
        var user_info = getCookieData("user_info");
        this.state = {
            actual_date: new Date(),
            case_date: new Date(),
            one_benefit: this.props.data,
            branch: '',
            position: '',
            user_id: user_info.user_id,
            nrc_no: '',
            injury_name: '',
            request_amount: '',
            available_amount: 0,
            case_place: '',
            hospital_name: '',
            hospital_type: [],
            selected_hospital_type: [],
            selectedOptionInjury: 0,
            selectedOptionWork: 0,
            case_details: '',
            status: -1,
            is_main_role: false,
            status_title: '',
            user_detail: [],
            updatedBy: user_info.user_id,
            createdBy: user_info.user_id,
            work_flow_status: {},
            comment: '',
            max_fund_amount: 0,
            doc: [],
            attachment: [],
            newDoc: [],
            branch: [],
            selected_location: [],
            withdraw_location: 0,
            start_date: new Date(),
            end_date: new Date()

        }
    }
    componentDidMount() {
        this.setOneBenefit(this.state.one_benefit);
        this.getUserDetail();
        this.getHospitalizationType();

    }
    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                one_benefit: this.props.data
            }, () => {
                //this._setTableData(this.state.dataSource);

            })
        }
    }
    getHospitalizationType() {
        fetch(`${main_url}hospitalization_benefit/getHospitalizationFundAmount`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    hospital_type: list
                })
            })

    }
    getHospitalizationTypeMaxAmount(hospital_value) {
        fetch(`${main_url}hospitalization_benefit/getMaxHospitalizationFundAmount/` + hospital_value.value + '/' + this.state.user_id + '/' + moment(this.state.case_date).format('YYYY-MM-DD'))
            .then(res => { if (res.ok) return res.json() })
            .then(amount => {
                this.setState({
                    max_fund_amount: amount
                })
            })
    }
    handleHospitalType = (e) => {
        this.getHospitalizationTypeMaxAmount(e);
        this.setState({
            selected_hospital_type: e,
        })


    }
    getDocument() {
        fetch(main_url + "hospitalization_benefit/getDocument/" + this.state.one_benefit.hospitalization_benefit_id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({
                        doc: res
                    })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    async setOneBenefit(one) {
        if (!Array.isArray(one) && one !== null) {

            var work_flow = await getWorkFlowStatus(one.employee_id, this.state.user_id, 'Hospitalization Benefit', 'Benefit');
            this.getDocument();
            this.setState({
                work_flow_status: work_flow,
                employee_name: one.fullname,
                nrc: one.nrc,
                branch_name: one.branch_name,
                position: one.designations,
                employee_id: one.employment_id,
                case_date: moment(one.case_date).format('YYYY-MM-DD'),
                actual_date: moment(one.requested_date).format('YYYY-MM-DD'),
                request_amount: one.request_amount,
                available_amount: one.available_amount,
                injury_name: one.name_of_disease_or_injury,
                hospital_name: one.hospital_name,
                case_place: one.case_place,
                case_details: one.case_detail,
                selectedOptionInjury: one.injury_or_not,
                selectedOptionWork: one.related_with_work_or_not,
                status: one.status,
                selected_hospital_type: { value: one.hospitalization_type, label: one.hospitalization_type_name },
                createdBy: one.createdBy,
                is_main_role: havePermission(work_flow),
                start_date: moment(one.start_date).format('YYYY-MM-DD'),
                end_date: moment(one.end_date).format('YYYY-MM-DD')
            })
        } else {
            //this.getAvailableAmount();

        }
        let branch = await getBranch();
        let selected_location = this.getSelectedLocation(branch, one.withdraw_location);
        this.setState({
            branch: branch,
            selected_location: selected_location
        })
    }

    getSelectedLocation(branch, location) {
        let selected = branch.filter(function (b) { return b.value == location })
        return selected;
    }

    handle_actual_date(value) {
        this.setState({
            actual_date: value
        })
    }

    handle_case_date(value) {
        this.setState({
            case_date: value
        })
    }


    removeOldDocument(index, event) {
        var array = this.state.doc;
        array.splice(index, 1);
        this.setState({
            doc: array
        })
    }

    getUserDetail() {
        fetch(`${main_url}hospitalization_benefit/getUserDetail/${this.state.one_benefit.employee_id == undefined ? this.state.user_id : this.state.one_benefit.employee_id}`)
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

    changeWithdrawLocation = (e) => {
        let data = this.state;
        data.withdraw_location = e.value;
        this.setState({
            selected_location: e,
            setupData: data
        })

    }
    // handlefileChanged(event) {

    //     event.preventDefault();

    //     let newDoc = this.state.newDoc;
    //     var obj = document.querySelector("#attach_file").files.length;
    //     for (var i = 0; i < obj; i++) {
    //         var getfile = document.querySelector("#attach_file").files[i];
    //         newDoc.push(getfile)

    //     }

    //     this.setState({
    //         newDoc: newDoc
    //     })

    // }

    injuryChangeText = (e) => {
        this.setState({
            injury_name: e.target.value
        })
    }
    handleRequest = (event) => {
        this.setState({
            request_amount: event.target.value
        });
    };
    handleCasePlace = (e) => {
        this.setState({
            case_place: e.target.value
        })
    }

    handleDescription = (event) => {
        this.setState({
            case_details: event.target.value
        });
    };
    handleStartDate = (value) => {
        this.setState({
            start_date: value
        })
    };
    handleEndDate = (value) => {
        this.setState({
            end_date: value
        })
    };
    handleHospital = (e) => {
        this.setState({
            hospital_name: e.target.value
        });
    }

    // removeNewDocument(index, event) {
    //     var array = this.state.newDoc;
    //     var attch = this.state.attachment;
    //     attch.splice(index, 1);
    //     array.splice(index, 1);
    //     this.setState({
    //         newDoc: array,
    //         attachment: attch
    //     })
    // }
    removeNewDocument(index, event) {
        var array = this.state.newDoc;
        array.splice(index, 1);
        this.setState({
            newDoc: array
        })
    }
    checkFiles(e) {
        var files = document.getElementById("attach_file").files;
        var attachment = this.state.attachment;
        if (files.length > 5) {
            toast.warning('You can only upload a maximum of 2 files!')
        }
        else {
            for (let i = 0; i < files.length; i++) {
                var getfile = document.querySelector("#attach_file").files[i];
                attachment.push(getfile)
            }
        }
        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#attach_file").files.length;
        for (var i = 0; i < obj; i++) {
            var getfile = document.querySelector("#attach_file").files[i];
            newDoc.push(getfile)
        }


        this.setState({
            attachment: attachment,
            newDoc: newDoc
        })
    }
    approvalStatus = (text, comment) => {
        this.setState({ status_title: text, comment: comment }, () => this.save())
    }
    save() {
        if (this.state.attachment.length == 0 && this.state.doc.length == 0) {
            toast.error("Please Choose Attachment File!")
        } else {
            if (validate('check_form') && (this.state.attachment.length > 0 || !Array.isArray(this.state.one_benefit))) {
                $('#saving_button').attr('disabled', true);
                var data = {
                    employee_id: this.state.one_benefit.employee_id ? this.state.one_benefit.employee_id : this.state.user_id,
                    actual_date: moment(this.state.actual_date).format('YYYY-MM-DD'),
                    case_date: moment(this.state.case_date).format('YYYY-MM-DD'),
                    request_amount: this.state.request_amount,
                    case_detail: this.state.case_details,
                    name_of_disease_or_injury: this.state.injury_name,
                    case_place: this.state.case_place,
                    hospitalization_type: parseInt(this.state.selected_hospital_type.value),
                    available_amount: this.state.max_fund_amount.amount,
                    hospital_name: this.state.hospital_name,
                    injury_or_not: parseInt(this.state.selectedOptionInjury),
                    related_with_work_or_not: parseInt(this.state.selectedOptionWork),
                    status: this.state.status == 5 || this.state.status == -1 ? 0 : this.state.status,
                    updatedBy: this.state.updatedBy,
                    createdBy: this.state.createdBy,
                    withdraw_location: this.state.withdraw_location,
                    start_date: this.state.start_date,
                    end_date: this.state.end_date

                }

                const formdata = new FormData();

                // var obj = document.querySelector("#attach_file").files.length;
                for (var i = 0; i < this.state.newDoc.length; i++) {
                    formdata.append('uploadfile', this.state.newDoc[i]);
                }

                let status = 0;
                let path = 'saveHospitalizationBenefit'

                if (!Array.isArray(this.state.one_benefit) && this.state.one_benefit !== null) {
                    if (this.state.status_title !== '' && this.state.is_main_role) {
                        var action = getActionStatus(this.state.status_title, this.state.one_benefit, this.state.updatedBy, this.state.comment);
                        data.referback_by = action.referback_by;
                        data.checked_by = action.checked_by;
                        data.verified_by = action.verified_by;
                        data.approved_by = action.approved_by;
                        data.rejected_by = action.rejected_by;
                        data.referback_date = action.referback_date;
                        data.checked_date = action.checked_date;
                        data.verified_date = action.verified_date;
                        data.approved_date = action.approved_date;
                        data.rejected_date = action.rejected_date;
                        data.referback_comment = action.referback_comment;
                        data.checked_comment = action.checked_comment;
                        data.verified_comment = action.verified_comment;
                        data.approved_comment = action.approved_comment;
                        data.status = action.status;
                    }
                    path = `editHospitalizationBenefit/${this.state.one_benefit.hospitalization_benefit_id}`
                }
                formdata.append('hospitalization_fund', JSON.stringify(data))
                formdata.append('oldDoc', JSON.stringify(this.state.doc))
                fetch(`${main_url}hospitalization_benefit/${path}`, {
                    method: "POST",
                    body: formdata
                })
                    .then(res => {
                        status = res.status;
                        return res.text()
                    })
                    .then(text => {
                        if (status !== 200) {
                            this.setState({
                                status: this.state.status
                            })
                        }
                        this.props.showToast(status, text)

                    })
            }
            else {
                startSaving();
                form_validate = false;
                toast.error(alertText, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }
        }

    }
    onChangeInjury(event) {
        this.setState({
            selectedOptionInjury: event.target.value
        });
    }
    onChangeWork(event) {
        this.setState({
            selectedOptionWork: event.target.value
        });
    }


    render() {
        return (
            <div className="benefits benefit-medical">
                <div className='row'>
                    <div className="form-group" id="check_form">
                        <div className="row">
                            <div className="col-md-6">
                                <div><label className="col-sm-10">Request Date</label></div>
                                <div className="col-sm-10" disabled>
                                    {/* <DatePicker
                                dateFormat="DD/MM/YYYY"
                                value={(this.state.actual_date)}
                                timeFormat={false}
                                onChange={this.handle_actual_date.bind(this)} 
                                /> */}
                                    <input className="form-control input-md" type="text" value={moment(this.state.actual_date).format('YYYY-MM-DD')} disabled />
                                </div>

                            </div>

                            <div className="col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-10">Employee Name</label></div>
                                {
                                    this.state.user_detail.length > 0 ?
                                        <div className="col-sm-10">
                                            {/* <Select
                                        options={this.state.employeeNameList}
                                        placeholder="Please Choose The Employee Name"
                                        onChange={this.handleEmployeeName}
                                        value={this.state.employeeName}
                                    /> */}

                                            <input type="text"
                                                className="form-control"
                                                placeholder="What is the available amount"
                                                value={this.state.is_main_role ? this.state.employee_name : this.state.user_detail[0].fullname}
                                                disabled
                                            />

                                        </div>
                                        : ''
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label className="col-sm-10">Employee ID</label>
                                {
                                    this.state.user_detail.length > 0 ?
                                        <div className="col-sm-10">
                                            <input className="form-control input-md" type="text"
                                                value={this.state.is_main_role ? this.state.employee_id : this.state.user_detail[0].employment_id} disabled></input>
                                        </div>
                                        : ''
                                }
                            </div>

                            <div className="col-md-6">
                                <div><label className="col-sm-10">NRC</label></div>
                                {
                                    this.state.user_detail.length > 0 ?
                                        <div className="col-sm-10">
                                            <input
                                                value={this.state.is_main_role ? this.state.nrc : this.state.user_detail[0].nrc}
                                                className='form-control input-md'
                                                type="text"
                                                disabled
                                            />
                                        </div>
                                        : ''
                                }

                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <label className="col-sm-10">Position</label>
                                {
                                    this.state.user_detail.length > 0 ?
                                        <div className="col-sm-10">
                                            <input className="form-control input-md" type="text"
                                                value={this.state.is_main_role ? this.state.position : this.state.user_detail[0].designations} disabled></input>
                                        </div>
                                        : ''
                                }


                            </div>

                            <div className="col-md-6">
                                <label className="col-sm-10">Branch</label>
                                {
                                    this.state.user_detail.length > 0 ?
                                        <div className="col-sm-10">
                                            <input className="form-control input-md" type="text"
                                                value={this.state.is_main_role ? this.state.branch_name : this.state.user_detail[0].branch_name} disabled></input>
                                        </div>
                                        : ''
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div><label className="col-sm-10">Hospitalization Type</label></div>
                                <div className="col-sm-10">
                                    {
                                        this.state.is_main_role ?
                                            <input type="text"
                                                className="form-control checkValidate"
                                                value={this.state.selected_hospital_type.label}
                                                disabled
                                            />
                                            :

                                            <Select
                                                isDisabled={this.state.is_main_role ? true : false}
                                                options={this.state.hospital_type}
                                                placeholder="Please Choose Type"
                                                onChange={this.handleHospitalType.bind(this)}
                                                value={this.state.selected_hospital_type}
                                                className='react-select-container checkValidate'
                                                classNamePrefix="react-select"

                                            />
                                    }

                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="col-md-6">
                                    <div className="col-sm-10"><label>Related with Work or Not</label></div>
                                    {
                                        !Array.isArray(this.state.one_benefit) ?
                                            <div className="col-sm-10">
                                                <div onChange={this.onChangeWork.bind(this)}>
                                                    <input type="radio" value={1} name="work" checked={this.state.selectedOptionWork == 1 ? true : false} disabled={this.state.is_main_role ? true : false} /> Yes
                                                    <input type="radio" value={0} name="work" checked={this.state.selectedOptionWork == 0 ? true : false} disabled={this.state.is_main_role ? true : false} /> NO
                                                </div>
                                            </div> :
                                            <div onChange={this.onChangeWork.bind(this)} className="col-sm-10 checkValidate">
                                                <input type="radio" value={1} name="work" /> Yes
                                                <input type="radio" value={0} name="work" defaultChecked /> No
                                            </div>
                                    }
                                </div>
                                <div className="col-md-4">
                                    <div className="col-sm-10"><label>Injury or Not</label></div>
                                    {
                                        !Array.isArray(this.state.one_benefit) ?

                                            <div className="col-sm-10">
                                                <div onChange={this.onChangeInjury.bind(this)} >
                                                    <input type="radio" value={1} name="injury" checked={this.state.selectedOptionInjury == 1 ? true : false} disabled={this.state.is_main_role ? true : false} /> Yes
                                                    <input type="radio" value={0} name="injury" checked={this.state.selectedOptionInjury == 0 ? true : false} disabled={this.state.is_main_role ? true : false} /> NO
                                                </div>
                                            </div> :

                                            <div onChange={this.onChangeInjury.bind(this)} className="col-sm-10">
                                                <input type="radio" value={1} name="injury" /> Yes
                                                <input type="radio" value={0} name="injury" defaultChecked /> No
                                            </div>
                                    }
                                </div>
                            </div>


                        </div>
                        <div className="row">

                            <div className="col-md-6">
                                <label className="col-sm-10">Name of Disease or injury</label>
                                <div className="col-sm-10">
                                    <input
                                        className="form-control checkValidate input-md"
                                        type="text"
                                        value={this.state.injury_name}
                                        placeholder="Enter Disease or injury"
                                        onChange={this.injuryChangeText}
                                        disabled={this.state.is_main_role ? true : false}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="col-sm-10">Available amount</label>
                                <div className="col-sm-10">
                                    <input className="form-control input-md" type="text" value={this.state.max_fund_amount.amount == undefined ? this.state.one_benefit.available_amount : this.state.max_fund_amount.amount} disabled></input>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label className="col-sm-10">Request Amount</label>
                                <div className="col-sm-10">
                                    <input className="form-control checkValidate"
                                        type="number" value={this.state.request_amount}
                                        onChange={this.handleRequest} disabled={this.state.status == 2 || this.state.status == -1 ? false : true} />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div><label className="col-sm-10">Case Date</label></div>
                                <div className="col-sm-10">
                                    {
                                        this.state.is_main_role ?
                                            <input type="text"
                                                className="form-control checkValidate"
                                                value={this.state.case_date}
                                                disabled
                                            /> :
                                            <DatePicker
                                                dateFormat="DD/MM/YYYY"
                                                value={(this.state.case_date)}
                                                timeFormat={false}
                                                onChange={this.handle_case_date.bind(this)}
                                            />

                                    }

                                </div>

                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <label className="col-sm-10">Hospital Name</label>
                                <div className="col-sm-10">
                                    <input className="form-control checkValidate input-md" type="text"
                                        value={this.state.hospital_name}
                                        onChange={this.handleHospital}
                                        disabled={this.state.is_main_role ? true : false}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="col-sm-10">Case Place</label>
                                <div className="col-sm-10" >
                                    <input className="form-control checkValidate checkinput-md"
                                        type="text"
                                        value={this.state.case_place} onChange={this.handleCasePlace}
                                        disabled={this.state.is_main_role ? true : false}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 form-group" id="check_form">
                                <div><label className="col-sm-12">Start Date </label></div>
                                <div className="col-sm-10">
                                    <DatePicker
                                        dateFormat="DD/MM/YYYY"
                                        value={(this.state.start_date)}
                                        timeFormat={false}
                                        onChange={this.handleStartDate.bind(this)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6 form-group" id="check_form">
                                <div><label className="col-sm-12">End Date </label></div>
                                <div className="col-sm-10">
                                    <DatePicker
                                        dateFormat="DD/MM/YYYY"
                                        value={(this.state.end_date)}
                                        timeFormat={false}
                                        onChange={this.handleEndDate.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 form-group" id="check_form">
                                <div><label className="col-sm-12">Please Enter the Case Details </label></div>
                                <div className="col-sm-10">
                                    <textarea
                                        name="description"
                                        cols="30"
                                        rows="10"
                                        id="description"
                                        value={this.state.case_details}
                                        placeholder="Provice The Case Details"
                                        onChange={this.handleDescription}
                                        className="form-control checkValidate"
                                        disabled={this.state.is_main_role ? true : false}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6 form-group">
                                <div><label className="col-sm-12" >WithDraw Location<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <Select
                                        data-name='withdraw_loction'
                                        value={this.state.selected_location}
                                        onChange={this.changeWithdrawLocation}
                                        options={this.state.branch}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    />

                                </div>
                            </div>
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
                <div className="row">
                    {
                        !Array.isArray(this.state.one_benefit) ?
                            this.state.is_main_role ?
                                this.state.doc.length > 0 ?
                                    <div className="row document-main">
                                        <input className="full_width hidden" type="file" id="attach_file" ></input>

                                        <DocumentList title='Hospitalization Benefit Document' doc={this.state.doc} path="hospitalization_benefit" />
                                    </div> : <input className="full_width hidden" type="file" id="attach_file" ></input>
                                :

                                <div className="row">
                                    <div className="form-group col-md-12" style={{ overflowX: "auto" }}>
                                        <div className="ownspacing"></div>
                                        <h4>Hospitalization Benefit Document</h4>
                                        <div className="col-md-12">
                                            <input type="file" accept="image/*" className="dropZone" id="attach_file" onChange={this.checkFiles.bind(this)} multiple /></div>

                                        <div className="ibox float-e-margins">
                                            <div className="p-md col-md-12" style={{ float: 'left', }}>

                                                {this.state.doc.map((data, index) =>
                                                    <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">
                                                        <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                            <div className="columns">
                                                                <div className="column-title">
                                                                    <a href={`${main_url}hospitalization_benefit/getCRDocumentData/${data.name}`}
                                                                        download target='_blank'
                                                                        className="btn btn-primary document-body-bt document-width">
                                                                        {data.name.split("&@")[1]}
                                                                    </a>
                                                                </div>
                                                                <div className="column-actions">
                                                                    <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeOldDocument(index, event)}> <i></i></a>
                                                                </div>
                                                            </div></li></ul>

                                                    </div>
                                                )
                                                }

                                                {this.state.newDoc.map((data, index) =>

                                                    <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">

                                                        <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                            <div className="columns">
                                                                <div className="column-title">
                                                                    <a href='#'
                                                                        className="btn btn-primary document-body-bt document-width">
                                                                        {data.name}
                                                                    </a>
                                                                </div>
                                                                <div className="column-actions">
                                                                    <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeNewDocument(index, event)}> <i></i></a>
                                                                </div>
                                                            </div>
                                                        </li></ul>
                                                    </div>
                                                )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            :
                            <div className="form-group col-md-6">
                                <div>
                                    <label htmlFor="attachment" className="col-sm-12 custom-file-label">Provide  One Or More
                                        Attachment</label>
                                </div>
                                <div className="col-sm-10">
                                    <input className="dropZone" accept="image/*" type="file" id="attach_file" multiple onChange={this.checkFiles.bind(this)}></input>
                                </div>
                                <div>
                                    {
                                        this.state.newDoc.map((data, index) =>

                                            <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">

                                                <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                    <div className="columns"><div className="column-thumbnail">
                                                        <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                                            <div className="fileuploader-item-icon" style={{ backgroundColor: '#3f4fd3' }}><i>{data.name.split(".")[1]}</i>
                                                            </div></div><span className="fileuploader-action-popup"></span></div>
                                                        <div className="column-title">
                                                            <span className="own-text">
                                                                {data.name}</span></div>
                                                        <div className="column-actions">
                                                            <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeNewDocument(index, event)}> <i></i></a>
                                                        </div></div></li></ul>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                    }
                </div>

                <div className="row save-btn">
                    {
                        !Array.isArray(this.state.one_benefit) && havePermission(this.state.work_flow_status) ?
                            <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.one_benefit.status} work_flow={this.state.work_flow_status} total_amount={this.state.request_amount} />
                            :
                            <div className="float-right">
                                {this.state.one_benefit.status == undefined || this.state.one_benefit.status == 5 ?
                                    <div>
                                        <button onClick={this.save.bind(this)} className="btn btn-primary" id="saving_button" type="button">Save</button>
                                    </div>
                                    :
                                    ''
                                }

                            </div>
                    }
                </div>
            </div>
        )
    }
}
export default HospitalizationAddNew