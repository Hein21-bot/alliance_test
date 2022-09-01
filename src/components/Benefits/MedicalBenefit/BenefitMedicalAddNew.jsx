import React, { Component } from 'react';
import Select from 'react-select';
// import CustomFileInput from '../CustomFileInput';
import '../../Benefits/Benefits.css';
import { ToastContainer, toast } from 'react-toastify';
import ApprovalForm from '../../Common/ApprovalForm';
import DocumentList from '../../Common/DocumentList';
import moment from 'moment';
import {
    main_url, getCookieData, getWorkFlowStatus, validate, getActionStatus,
    alertText, havePermission, stopSaving, startSaving, isRequestedUser
} from "../../../utils/CommonFunction";

let form_validate = true;
class BenefitMedicalAddNew extends Component {
    constructor(props) {
        super(props);
        var user_info = getCookieData("user_info");
        this.state = {
            employee_name: user_info.fullname,
            designations: user_info.designations,
            user_id: user_info.user_id,
            one_benefit: this.props.data,
            selected_person: [],
            available_amount: 0,
            person_type: [],
            beneficiaryName: '',
            description: '',
            request_amount: '',
            status: 0,
            is_main_role: false,
            updatedBy: user_info.user_id,
            createdBy: user_info.user_id,
            doc: [],
            newDoc: [],
            status_title: '',
            attachment: [],
            work_flow_status: {},
            comment: ''
        }
    }

    componentDidMount() {
        this.getPersonType();
        this.setOneBenefit(this.state.one_benefit);
    }

    componentDidUpdate() {
        if (!form_validate) validate("check_form");
    }

    getDocument() {
        fetch(main_url + "medical_benefit/getDocument/" + this.state.one_benefit.medical_benefit_id)
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
            var work_flow = await getWorkFlowStatus(one.user_id, this.state.user_id, 'Medical Benefit', 'Benefit');
            this.getDocument();
            this.setState({
                work_flow_status: work_flow,
                employee_name: one.fullname,
                designations: one.designations,
                selected_person: { value: one.beneficary_for, label: one.type_name },
                request_amount: one.request_amount,
                available_amount: one.available_amount,
                description: one.description,
                beneficaryName: one.beneficary_name,
                status: one.status,
                createdBy: one.createdBy,
                is_main_role: havePermission(work_flow)
            })
        } else {
            this.getAvailableAmount();

        }
    }

    getAvailableAmount() {
        let { user_id, one_benefit } = this.state;
        if (!Array.isArray(one_benefit) && one_benefit !== null) {
            user_id = one_benefit.user_id;
        }
        fetch(`${main_url}benefit/getMedicalAvailableAmount/${user_id}/${moment().format('YYYY')}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    available_amount: data.amount
                })
            })
    }

    getPersonType() {
        fetch(`${main_url}benefit/getPersonType`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                list = list.filter(function (l) {
                    return l.label != 'Sibling';
                })
                this.setState({
                    person_type: list
                })
            })
    }

    handleBeneficiary = (event) => {
        let name = '';
        if (event.label.includes('Oneself')) name = this.state.employee_name;
        this.setState({
            selected_person: event,
            beneficaryName: name
        });
    };

    handleBeneficiaryName = (event) => {
        this.setState({
            beneficaryName: event.target.value
        });
    };

    handleDescription = (event) => {
        this.setState({
            description: event.target.value
        });
    };

    handleAmount = (event) => {
        this.setState({
            request_amount: event.target.value
        });
    };

    handlefileChanged(event) {

        event.preventDefault();

        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#attach_file").files.length;
        for (var i = 0; i < obj; i++) {
            var getfile = document.querySelector("#attach_file").files[i];
            newDoc.push(getfile)

        }

        this.setState({
            newDoc: newDoc
        })

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

    checkFiles(e) {
        var files = e.target.files;
        var attachment = [];
        if (files.length > 5) {
            toast.warning('You can only upload a maximum of 5 files!')
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
       
        if(this.state.attachment.length == 0 && this.state.doc.length == 0){
            toast.error("Please Choose Attachment File!")
        }else{
            let editData = !Array.isArray(this.state.one_benefit) == true ? (this.state.newDoc.length > 0 || this.state.attachment.length > 0 || this.state.doc.length > 0) && !Array.isArray(this.state.one_benefit) : !Array.isArray(this.state.one_benefit)
            if (validate('check_form') && (this.state.attachment.length > 0 || editData)) {
                
                var data = {
                    user_id: this.state.one_benefit.user_id ? this.state.one_benefit.user_id : this.state.user_id,
                    available_amount: this.state.available_amount,
                    beneficary_for: this.state.selected_person.value,
                    beneficary_name: this.state.beneficaryName,
                    description: this.state.description,
                    request_amount: this.state.request_amount,
                    status: this.state.status == 5 ? 0 : this.state.status,
                    updatedBy: this.state.updatedBy,
                    createdBy: this.state.one_benefit.user_id ? this.state.one_benefit.user_id : this.state.user_id,
                }
    
                const formdata = new FormData();
    
                var obj = document.querySelector("#attach_file").files.length;
                for (var i = 0; i < obj; i++) {
                    var imagedata = document.querySelector("#attach_file").files[i];
                    formdata.append('uploadfile', imagedata);
                }
    
                let status = 0;
                let path = 'saveMedicalBenefit'
    
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
                    path = `editMedicalBenefit/${this.state.one_benefit.medical_benefit_id}`
                }
                formdata.append('medical_benefit', JSON.stringify(data))
                formdata.append('oldDoc', JSON.stringify(this.state.doc))
    
                fetch(`${main_url}medical_benefit/${path}`, {
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

    // handleRemove = (event) => {
    //     let data = this.state.dataSource;
    //     data.splice(event, 1);
    //     this.setState({
    //         dataSource: data
    //     });
    // };


    render() {
        return (
            <div className="benefits benefit-medical">
                <div className='row'>
                    <div className="form-group" id="check_form">
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
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
                                        value={this.state.employee_name}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div><label htmlFor="training-type" className="col-sm-12"> Available Amount </label></div>
                                <div className="col-sm-10">
                                    <input type="number"
                                        className="form-control"
                                        value={this.state.available_amount}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="available-amount" className="col-sm-12">Please Choose The Beneficiary </label></div>
                                <div className="col-sm-10">
                                    {!Array.isArray(this.state.one_benefit) && this.state.is_main_role ?
                                        <input type="text"
                                            className="form-control checkValidate"
                                            value={this.state.selected_person.label}
                                            disabled
                                        />
                                        :
                                        <Select
                                            options={this.state.person_type}
                                            placeholder="Choose Your Beneficiary"
                                            onChange={this.handleBeneficiary}
                                            value={this.state.selected_person}
                                            className='react-select-container  checkValidate'
                                            classNamePrefix="react-select"
                                        />
                                    }
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div><label htmlFor="name-of-beneficiary" className="col-sm-12">Please Enter The Name of Beneficiary </label></div>
                                <div className="col-sm-10">
                                    <input type="text"
                                        className="form-control checkValidate"
                                        placeholder="Provide The Name Of Beneficiary"
                                        onChange={this.handleBeneficiaryName}
                                        value={this.state.beneficaryName}
                                        disabled={!Array.isArray(this.state.one_benefit) && this.state.is_main_role ? true : false}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="amount" className="col-sm-12">Please Enter The Amount </label></div>
                                <div className="col-sm-10">
                                    <input type="number"
                                        className="form-control checkValidate"
                                        placeholder="Enter The Amount"
                                        onChange={this.handleAmount}
                                        value={this.state.request_amount}
                                        disabled={!Array.isArray(this.state.one_benefit) && this.state.is_main_role ? true : false}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div><label htmlFor="description" className="col-sm-12">Please Enter The Description </label></div>
                                <div className="col-sm-10">
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        cols="10"
                                        rows="3"
                                        id="description"
                                        value={this.state.description}
                                        placeholder="Provice The Description"
                                        onChange={this.handleDescription}
                                    >
                                    </textarea>
                                </div>
                            </div>
                        </div>

                        {
                        !Array.isArray(this.state.one_benefit) ?
                            this.state.is_main_role ?
                                this.state.doc.length > 0 ?
                                    <div className="row document-main">
                                        <input className="full_width hidden" type="file" id="attach_file" ></input>

                                        <DocumentList title='Medical Benefit Document' doc={this.state.doc} path="medical_benefit" />
                                    </div> : <input className="full_width hidden" type="file" id="attach_file" ></input>
                                :

                                <div className="row">
                                    <div className="form-group col-md-12" style={{ overflowX: "auto" }}>
                                        <div className="ownspacing"></div>
                                        <h4>Medical Benefit Document</h4>
                                        <div className="col-md-12">
                                            <input type="file" accept="image/*" className="dropZone" id="attach_file" onChange={this.checkFiles.bind(this)} multiple /></div>

                                        <div className="ibox float-e-margins">
                                            <div className="p-md col-md-12" style={{ float: 'left', }}>

                                                {this.state.doc.map((data, index) =>
                                                    <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">
                                                        <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                            <div className="columns">
                                                                <div className="column-title">
                                                                    <a href={`${main_url}medical_benefit/getCRDocumentData/${data.name}`}
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
                        <div className="row save-btn">
                            {
                                !Array.isArray(this.state.one_benefit) && havePermission(this.state.work_flow_status , this.state.one_benefit.createdBy) ?
                                    <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.one_benefit.status} work_flow={this.state.work_flow_status} total_amount={this.state.request_amount} />
                                    :
                                    <div className="col-md-12 btn-rightend">
                                        {this.state.one_benefit.status == undefined || this.state.one_benefit.status == 5 ?
                                            <div>
                                                <button onClick={this.save.bind(this)} className="btn btn-primary" id="saving_button" type="button">Save</button>
                                            </div>
                                            :
                                            ''
                                        }
                                        {/* <button onClick={this.save.bind(this)} id="saving_button" className="btn btn-primary"><span>Save</span> </button> */}
                                    </div>
                            }
                        </div>
                    </div>
                </div>

                {/* <div className="row save-btn">
                    <div className="float-right">
                        <div>
                            <button className="btn btn-primary" type="button" onClick={this.save.bind(this)}>Save</button>
                        </div>

                    </div>
                </div> */}

            </div>
        )
    }
}

export default BenefitMedicalAddNew;