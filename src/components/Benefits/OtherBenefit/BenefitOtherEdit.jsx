import React, { Component } from 'react';
import '../../Benefits/Benefits.css';
import ApprovalForm from '../../Common/ApprovalForm';
import DocumentList from '../../Common/DocumentList';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import {
    main_url, getUserId, getActionStatus, validate, havePermission,
    getWorkFlowStatus, alertText, stopSaving, startSaving, isRequestedUser, getBranch
} from "../../../utils/CommonFunction";

let form_validate = true;
class BenefitOtherEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedBy: getUserId("user_info"),
            data: props.data,
            status: props.data.status,
            doc: [],
            newDoc: [],
            status_title: '',
            is_main_role: false,
            work_flow_status: {},
            comment: '',
            branch: [],
            selected_location: [],
            withdraw_location: 0,
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate("check_form")
    }

    async componentDidMount() {
        let branch = await getBranch();
        let selected_location = this.getSelectedLocation(branch, this.props.data.withdraw_location);
        this.setState({
            branch: branch,
            selected_location: selected_location
        })
        var work_flow = await getWorkFlowStatus(this.state.data.createdBy, this.state.updatedBy, 'Other Benefit', 'Benefit');
        this.setState({
            work_flow_status: work_flow,
            is_main_role: havePermission(work_flow)
        })
        fetch(`${main_url}benefit/getDocument/` + this.state.data.other_benefit_id)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    doc: list
                })
            })
    }

    getSelectedLocation(branch, location) {
        let selected = branch.filter(function (b) { return b.value == location })
        return selected;
    }

    changeWithdrawLocation = e => {
        let data = this.state;
        data.withdraw_location = e.value;
        this.setState({
            selected_location: e,
            claimData: data
        })
    }

    handleDescription = (event) => {
        let data = this.state.data;
        data.description = event.target.value
        this.setState({
            data: data
        });
    };

    handleAmount = (event) => {
        let data = this.state.data;
        data.amount = event.target.value
        this.setState({
            data: data
        });
    };

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
            newDoc: attachment,
        })
    }

    handlefileChanged(event) {

        event.preventDefault();

        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#dropOther").files.length;
        for (var i = 0; i < obj; i++) {
            var getfile = document.querySelector("#dropOther").files[i];
            newDoc.push(getfile)
        }

        this.setState({
            newDoc: newDoc

        })

    }

    approvalStatus = (text, comment) => {
        this.setState({ status_title: text, comment: comment }, () => this.edit())
    }

    edit() {
        
        if (validate('check_form') && (this.state.newDoc.length > 0 || this.state.doc.length > 0)) {

            let { status_title, is_main_role } = this.state;
            var data = {
                amount: this.state.data.amount,
                description: this.state.data.description,
                status: this.state.data.status == 5 ? 0 : this.state.data.status,
                withdraw_location: this.state.withdraw_location
            }
            const formdata = new FormData();

            var obj = document.querySelector("#dropOther").files.length;
            for (var i = 0; i < obj; i++) {
                var imagedata = document.querySelector("#dropOther").files[i];

                formdata.append('uploadfile', imagedata);
            }


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

            formdata.append('benefit', JSON.stringify(data))
            formdata.append('updatedBy', JSON.stringify(this.state.updatedBy))
            formdata.append('oldDoc', JSON.stringify(this.state.doc))

            let status = 0;
            fetch(main_url + 'benefit/edit/' + this.props.data.other_benefit_id, {
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
                            data: {
                                status: this.state.status
                            }
                        })
                    }
                    this.props.showToast(status, text);
                })
        } else {
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

    render() {
        let { is_main_role } = this.state;
        return (
            <div className="benefits benefits-other">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />

                <div className='row'>
                    <form className="form-group" id="check_form">
                        <div className="col-md-6">
                            <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
                            <div className="col-sm-10">
                                <input
                                    className="form-control"
                                    value={this.state.data.fullname}
                                    disabled
                                ></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div><label htmlFor="amount" className="col-sm-12">Please Enter The Amount </label></div>
                            <div className="col-sm-10">
                                <input type="number"
                                    className="form-control checkValidate"
                                    placeholder="Enter The Amount"
                                    value={this.state.data.amount}
                                    onChange={this.handleAmount}
                                    disabled={isRequestedUser(this.state.updatedBy, this.state.data.createdBy) ? true : false}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div><label htmlFor="description" className="col-sm-12">Please Enter The Description</label></div>
                            <div className="col-sm-10">
                                <textarea
                                    name="description"
                                    id="description"
                                    cols="30"
                                    rows="6"
                                    value={this.state.data.description}
                                    className="form-control"
                                    onChange={this.handleDescription}
                                >

                                </textarea>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div><label className='col-sm-12'>Withdraw Location</label></div>
                            <div className='col-sm-10'>
                                <Select
                                    data-name='withdraw_loction'
                                    value={this.state.selected_location}
                                    onChange={this.changeWithdrawLocation}
                                    options={this.state.branch}
                                    className='react-select-container checkValidate'
                                    classNamePrefix="react-select"
                                /></div>
                        </div>
                        {
                            is_main_role && this.state.updatedBy !== this.state.data.employeeId ?
                                '' :
                                <div className="col-md-6" style={{ overflowX: "auto" }}>
                                    <div className="ownspacing"></div>
                                    <h4>Other Benefit Document</h4>
                                    <div className="col-md-12">
                                        <input type="file" className="dropZone" id="dropOther" onChange={this.handlefileChanged.bind(this)} multiple />
                                    </div>
                                </div>
                        }

                    </form>

                </div>
                {is_main_role && this.state.updatedBy !== this.state.data.employeeId ?
                    this.state.doc.length > 0 ?
                        <div className="row document-main">
                            <input className="full_width hidden" type="file" id="dropOther" ></input>

                            <DocumentList title='Other Benefit Document' doc={this.state.doc} path="other_benefit" />
                        </div> : <input className="full_width hidden" type="file" id="dropOther" ></input>
                    :

                    <div>
                        <div className="row">
                            <div className="ibox float-e-margins">
                                <div className="p-md col-md-12" style={{ float: 'left', }}>

                                    {this.state.doc.map((data, index) =>
                                        <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">
                                            <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                <div className="columns">
                                                    <div className="column-title">
                                                        <a href={`${main_url}other_benefit/getCRDocumentData/${data.name}`}
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

                <div className="row save-btn">
                    {
                        havePermission(this.state.work_flow_status) && this.state.updatedBy !== this.state.data.employeeId ?
                            <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.data.status} work_flow={this.state.work_flow_status} total_amount={this.state.data.amount} />
                            :
                            <div className="col-md-12 btn-rightend">
                                {this.state.status == undefined || this.state.status == 5 ?
                                    <div>
                                        <button onClick={this.edit.bind(this)} className="btn btn-primary" id="saving_button" type="button">Save</button>
                                    </div>
                                    :
                                    ''
                                }
                                {/* <button onClick={this.edit.bind(this)} id="saving_button" className="btn btn-primary"><span>Save</span> </button> */}
                            </div>
                    }
                </div>

            </div>
        )
    }
}

export default BenefitOtherEdit;