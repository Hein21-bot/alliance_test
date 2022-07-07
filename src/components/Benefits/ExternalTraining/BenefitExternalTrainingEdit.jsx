import React, { Component } from 'react';
import '../../Benefits/Benefits.css';
import { ToastContainer, toast } from 'react-toastify';
import {
    main_url, validate, getActionStatus, getUserId, havePermission, getWorkFlowStatus,
    stopSaving, startSaving, isRequestedUser
} from "../../../utils/CommonFunction";
import ApprovalForm from '../../Common/ApprovalForm';
import DocumentList from '../../Common/DocumentList';
import moment from 'moment';
let form_validate = true;

class BenefitFuneralAddNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedBy: getUserId("user_info"),
            data: props.data,
            newDoc: [],
            doc: [],
            is_main_role: false,
            status_title: '',
            work_flow_status: {},
            comment: ''
        }
    }

    async componentDidMount() {
        this.getEmployeeList();
        this.getDocument();
        this.getAvailableAmount();
        var work_flow = await getWorkFlowStatus(this.state.data.user_id, this.state.updatedBy, 'External Training Benefit', 'Benefit');
        this.setState({
            work_flow_status: work_flow,
            is_main_role: havePermission(work_flow)
        })
    }

    getAvailableAmount() {
        fetch(`${main_url}external_benefit/getExternalAvailableAmount/${this.state.data.user_id}/${moment().format('YYYY')}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    available_amount: list.amount
                })
            })
    }

    getEmployeeList() {
        fetch(`${main_url}benefit/getEmployeeList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    employeeName: list
                })
            })
    }

    getDocument() {
        fetch(main_url + "external_benefit/getDocument/" + this.props.data.external_training_id)
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

    approvalStatus = (text, comment) => {
        this.setState({ status_title: text, comment: comment }, () => this.edit())
    }

    edit() {
        stopSaving();
        if (validate("check_form")) {
            var { status_title, is_main_role } = this.state;
            const formdata = new FormData();

            var obj = document.querySelector("#dropExternalEdit").files.length;
            for (var i = 0; i < obj; i++) {
                var imagedata = document.querySelector("#dropExternalEdit").files[i];

                formdata.append('uploadfile', imagedata);
            }
            // var data = this.state.data;
            var data = {
                training_date: this.state.data.training_date,
                training_period: this.state.data.training_period,
                request_amount: this.state.data.request_amount,
                training_purpose: this.state.data.training_purpose ,
                training_name: this.state.data.training_name ,
                available_amount: this.state.data.available_amount,
                approve_amount: this.state.data.approve_amount,
                status: this.state.data.status == 5 ? 0 : this.state.data.status
            }
            data.updatedBy = this.state.updatedBy;
            if (status_title !== '' && is_main_role) {
                var action = getActionStatus(status_title, this.state.data, this.state.updatedBy, this.state.comment);
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
            formdata.append('benefit', JSON.stringify(this.state.data))
            formdata.append('data', JSON.stringify(data))
            formdata.append('oldDoc', JSON.stringify(this.state.doc))

            let status = 0;
            fetch(main_url + 'external_benefit/edit/' + this.props.data.external_training_id, {
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
        } else {
            startSaving();
            form_validate = false;
        }
    }
    removeOldDocument(index, event) {
        var array = this.state.doc;
        array.splice(index, 1);
        this.setState({
            doc: array
        })
    }

    removeNewDocument(index, event) {
        var array = this.state.newDoc;
        array.splice(index, 1);
        this.setState({
            newDoc: array
        })
    }

    handleEmployeeName = (event) => {
        this.setState({
            selected_employee: event,
            user_id: event.value
        });
    };

    handleTrainingType = (event) => {
        let data = this.state.data
        data.training_name = event.target.value
        this.setState({
            data: data
        })
    }

    handleAvailableAmount = (event) => {
        let data = this.state.data
        data.available_amount = event.target.value
        this.setState({
            data: data
        })
    }

    handleTrainingDate = (event) => {
        let data = this.state.data
        data.training_date = event.target.value
        this.setState({
            data: data
        })

    }

    handleAmount = (event) => {
        let data = this.state.data
        data.request_amount = event.target.value
        this.setState({
            data: data
        })

    }

    handleApproveAmount = (event) => {
        let data = this.state.data
        data.approve_amount = event.target.value
        this.setState({
            data: data
        })

    }

    handlePurpose = (event) => {
        let data = this.state.data
        data.training_purpose = event.target.value
        this.setState({
            data: data
        })

    }

    handlePeriod = (event) => {
        let data = this.state.data
        data.training_period = event.target.value
        this.setState({
            data: data
        })

    }


    checkFiles(e) {
        var files = e.target.files;
        var attachment = [];
        if (files.length > 2) {
            toast.warning('You can only upload a maximum of 2 files!')
        }
        else {
            for (let i = 0; i < files.length; i++) {
                attachment.push(files[i])
            }
        }
        this.setState({
            newDoc: attachment
        })
    }

    render() {
        let { is_main_role } = this.state;
        return (
            <div className="benefits benefit-external-training">
                <ToastContainer />
                <div className='row'>
                    <form className="form-group" id="check_form">
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
                                <div className="col-sm-10">
                                    <input
                                        className="form-control"
                                        options={this.state.employeeName}
                                        disabled
                                        value={this.state.data.fullname}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div><label htmlFor="training-type" className="col-sm-12">Please Enter The Training Type ? </label></div>
                                <div className="col-sm-10">
                                    <input type="text"
                                        className="form-control"
                                        placeholder="What is your training type checkValidate"
                                        onChange={this.handleTrainingType}
                                        value={this.state.data.training_name}
                                        disabled={is_main_role ? true : false}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="date-of-training" className="col-sm-12">Please Enter The Date of Training ? </label></div>
                                <div className="col-sm-10">
                                    <input type="date"
                                        className="form-control checkValidate"
                                        placeholder="Provide The Date Of Training"
                                        onChange={this.handleTrainingDate}
                                        value={this.state.data.training_date}
                                        disabled={is_main_role ? true : false}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div><label htmlFor="available-amount" className="col-sm-12">Available Amount </label></div>
                                <div className="col-sm-10">
                                    <input type="number"
                                        className="form-control"
                                        placeholder="Enter The Available Amount"
                                        onChange={this.handleAvailableAmount}
                                        value={this.state.available_amount}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="training-period" className="col-sm-12">Please Enter The Training Period ? </label></div>
                                <div className="col-sm-10">
                                    <input type="text"
                                        className="form-control checkValidate"
                                        placeholder="Enter The Training Period"
                                        onChange={this.handlePeriod}
                                        value={this.state.data.training_period}
                                        disabled={is_main_role ? true : false}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div><label htmlFor="amount" className="col-sm-12">Please Enter The Request Amount ? </label></div>
                                <div className="col-sm-10">
                                    <input type="number"
                                        className="form-control checkValidate"
                                        placeholder="Enter The Amount"
                                        onChange={this.handleAmount}
                                        value={this.state.data.request_amount}
                                        disabled={isRequestedUser(this.state.updatedBy, this.state.data.user_id) ? true : false}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="training-purpose" className="col-sm-12">Please Enter The Training Purpose ? </label></div>
                                <div className="col-sm-10">
                                    <input type="text"
                                        className="form-control"
                                        placeholder="Enter The Training Purpose"
                                        onChange={this.handlePurpose}
                                        value={this.state.data.training_purpose}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div><label htmlFor="training-purpose" className="col-sm-12">Please Enter The Approve Amount ? </label></div>
                                <div className="col-sm-10">
                                    <input type="text"
                                        className="form-control"
                                        placeholder="Enter The Approve Amount"
                                        onChange={this.handleApproveAmount}
                                        value={this.state.data.approve_amount}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="row">
                            {
                                !is_main_role ?
                                    <div className="col-md-6" >
                                        <h4>Training Document</h4>
                                        <div className="col-md-12">
                                            <input type="file" id="dropExternalEdit" className="dropZone" onChange={this.checkFiles.bind(this)} multiple />
                                        </div>
                                    </div>
                                    : ''}
                        </div>
                        {is_main_role ?
                            this.state.doc.length > 0 ?
                                <div className="row document-main">
                                    <input className="full_width hidden" type="file" id="dropExternalEdit" ></input>

                                    <DocumentList title='External Training Document' doc={this.state.doc} path="external_benefit" />
                                </div> : <input className="full_width hidden" type="file" id="dropExternalEdit" ></input>
                            :

                            <div className="row">
                                <div className="col-md-12" style={{ overflowX: "auto" }}>

                                    <div className="ibox float-e-margins">
                                        <div className="p-md col-md-12" style={{ float: 'left', }}>

                                            {this.state.doc.map((data, index) =>
                                                <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">
                                                    <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                        <div className="columns">
                                                            <div className="column-title">
                                                                <a href={`${main_url}external_benefit/getCRDocumentData/${data.name}`}
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
                                                        </div></li></ul>
                                                </div>
                                            )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                    </form>
                </div>

                <div className="row save-btn">
                    {
                        havePermission(this.state.work_flow_status) ?
                            <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.data.status} work_flow={this.state.work_flow_status} total_amount={this.state.data.approve_amount} />
                            :
                            <div className="col-md-12 btn-rightend">
                                 {this.state.data.status == undefined || this.state.data.status == 5 ?
                                    <div>
                                        <button onClick={this.edit.bind(this)} className="btn btn-primary" id="saving_button" type="button">Save</button>
                                    </div>
                                    :
                                    ''
                                }
                                {/* <button onClick={this.edit.bind(this)} id="saving_button" 
                                className="btn btn-primary"><span>Save</span> </button> */}
                            </div>
                    }
                </div>
            </div>
        )
    }
}

export default BenefitFuneralAddNew;