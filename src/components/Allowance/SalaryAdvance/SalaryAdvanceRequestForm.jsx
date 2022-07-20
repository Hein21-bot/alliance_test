import React, { Component } from 'react'
import { main_url, getUserId, getCookieData, validate, stopSaving, startSaving, isRequestedUser } from '../../../utils/CommonFunction';
import { toast, ToastContainer } from 'react-toastify';
import DocumentList from '../../Common/DocumentList';
var form_validate = true;

export default class SalaryAdvanceRequestForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_info: getCookieData("user_info"),
            employee_list: [],
            one_advance: this.props.data,
            // getCookieData('salary_advance'),
            requested_amount: 0,
            available_amount: 0,
            purpose: '',
            created_user: getUserId("user_info"),
            // doc: [],
            attachment: [],
            newDoc: []
        }
    }
    

    componentDidMount() {
        this.getDocument()
        if (!Array.isArray(this.state.one_advance) && this.state.one_advance !== null) {
            this.setSalaryAdvance(this.state.one_advance);
        } else {
            this.getAvailableAmount(this.state.user_info.user_id);
        }
    }

    getDocument() {
        fetch(main_url + "salary_advance/getDocument/" + this.state.one_advance.salary_advance_id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({
                        newDoc: res
                    })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    getAvailableAmount(user_id) {
        fetch(`${main_url}salary_advance/getSalaryAdvanceAvailableAmount/${user_id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    available_amount: data.amount
                })
            })
    }

    setSalaryAdvance(one) {
        this.setState({
            requested_amount: one.requested_amount,
            purpose: one.purpose,
            available_amount: one.available_amount
        })
    }

    removeNewDocument(index, event) {
        var array = this.state.newDoc;
        var attch = this.state.attachment;
        attch.splice(index, 1);
        array.splice(index, 1);
        this.setState({
            newDoc: array,
            attachment: attch
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

    save() {
        stopSaving();
        if (validate('check_form')) {
            let createdBy = this.state.created_user;
            let updatedBy = this.state.created_user;
            let path = 'saveSalaryAdvance';
            const formdata = new FormData();

            for (var i = 0; i < this.state.attachment.length; i++) {
                formdata.append('uploadfile', this.state.attachment[i]);
            }

            if (!Array.isArray(this.state.one_advance)) {

                createdBy = this.state.one_advance.createdBy;
                path = `editSalaryAdvance/${this.state.one_advance.salary_advance_id}`
            }
            var data = {
                user_id: this.state.user_info.user_id,
                requested_amount: this.state.requested_amount,
                purpose: this.state.purpose,
                available_amount: this.state.available_amount,
                createdBy: createdBy,
                updatedBy: updatedBy,
                status: this.state.one_advance.status == 5 ? 0 : this.state.one_advance.status
            }
            formdata.append('advance', JSON.stringify(data))
            formdata.append('oldDoc', JSON.stringify(this.state.newDoc))
            let status = 0;
            fetch(`${main_url}salary_advance/${path}`, {
                method: 'POST',
                body: formdata
            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    this.props.showToast(status, text);
                })
        } else {
            form_validate = false;
            startSaving();
        }
    }
    
    render() {
        return (
            <div>

                <div className='wrapper wrapper-content animated fadeInRight'>

                    {/* <h2>New Salary Advance</h2> */}
                    <div className="content">
                        <div className='row'>
                            <div className='form-horizontal' name='demo-form' id="check_form">
                                <div className='ibox-content float-e-margin col-md-12 col-sm-12'>
                                    <div className='ibox-content p-md col-md-12 col-sm-12'>

                                        <div className="row">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Employee Name</label>
                                                <div className="col-sm-10">
                                                    <input type="text" className="form-control input-md" value={this.state.user_info.fullname} disabled />
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Employee ID</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md" type="text" value={this.state.user_info.employment_id} disabled></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Availabel Amount</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="number" min="0" step="0.01" value={this.state.available_amount} disabled></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Amount</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="number" min="0" step="0.01" value={this.state.requested_amount}
                                                        onChange={(e) => this.setState({ requested_amount: e.target.value })} disabled={isRequestedUser(this.state.created_user, this.state.one_advance.createdBy)}></input>
                                                </div>
                                            </div>
                                        </div>



                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Purpose</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="textarea"
                                                        value={this.state.purpose} onChange={(e) => this.setState({ purpose: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                {this.state.one_advance.status == undefined || this.state.one_advance.status == 5 ?
                                                    <div className="col-sm-10 btn-rightend margin-top-20">
                                                        <a href="/salary_advance"><button className="btn btn-success m-r-10">Cancel</button></a>
                                                        <button className="btn btn-primary" id="saving_button" onClick={this.save.bind(this)}>Save</button>
                                                    </div>
                                                    :
                                                    ''
                                                }
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            {/* {this.state.doc.length > 0 ?
                                                <div className="row document-main">
                                                    <input className="full_width hidden" type="file" id="attach_file" ></input>
                                                    <DocumentList title='Salary Advance Document' doc={this.state.doc} path="salary_advance" />
                                                </div> : <input className="full_width hidden" type="file" id="attach_file" ></input>} */}
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

