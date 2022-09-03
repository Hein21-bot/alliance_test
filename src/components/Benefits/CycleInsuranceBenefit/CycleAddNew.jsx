import React, { Component } from 'react';
import moment from "moment";
import DatePicker from 'react-datetime';
import DocumentList from '../../Common/DocumentList';
import $ from 'jquery';
import ApprovalForm from '../../Common/ApprovalForm';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';

import {
    main_url, getCookieData, getWorkFlowStatus, validate, getActionStatus,
    alertText, havePermission, stopSaving, startSaving, isRequestedUser, approveAmount, getBranch
} from "../../../utils/CommonFunction";
let form_validate = true;
class CycleAddNew extends Component {
    constructor(props) {
        super(props)
        var user_info = getCookieData("user_info");
        this.state = {
            one_benefit: this.props.data,
            user_info: user_info,
            employee_name: user_info.fullname,
            employee_id: user_info.employment_id,
            user_id: user_info.user_id,
            requested_date: new Date(),
            start_date: new Date(),
            selected_date: '',
            expire_date: new Date(),
            insurance_amount: '',
            is_main_role: false,
            doc: [],
            status: 0,
            status_title: '',
            updatedBy: user_info.user_id,
            createdBy: user_info.user_id,
            work_flow_status: {},
            attachment: [],
            newDoc: [],
            branch: [],
            selected_location: [],
            withdraw_location: 0,
            description: ''
        }
    }

    componentDidMount() {
        this.setOneBenefit(this.state.one_benefit);


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
    async setOneBenefit(one) {
        if (!Array.isArray(one) && one !== null) {
            var work_flow = await getWorkFlowStatus(one.user_id, this.state.user_id, 'Cycle Insurance', 'Benefit');
            this.getDocument();
            this.setState({
                work_flow_status: work_flow,
                edit_user_name: one.fullname,
                edit_employee_id: one.employment_id,
                requested_date: one.requested_date,
                start_date: one.start_date,
                expire_date: one.expire_date,
                insurance_amount: one.insurance_amount,
                edit_approve_amount: one.approve_amount,
                status: one.status,
                createdBy: one.createdBy,
                is_main_role: havePermission(work_flow),
                withdraw_location: one.withdraw_location,
                description: one.description
            })

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

    getDocument() {
        fetch(main_url + "cycleInsurance/getDocument/" + this.state.one_benefit.cycle_insurance_benefit_id)
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

    handle_start_date(value) {
        this.setState({
            start_date: value,
            expire_date: moment(value).add(1, 'y'),

        })
    };

    handle_expire_date(value) {
        this.setState({
            expire_date: value
        })
    };

    handle_Insurance_Amount = (event) => {
        this.setState({
            insurance_amount: event.target.value
        });
    };

    handle_description = (event) => {
        this.setState({
            description: event.target.value
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

    changeWithdrawLocation = (e) => {
        let data = this.state;
        data.withdraw_location = e.value;
        this.setState({
            selected_location: e,
            setupData: data
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
        document.querySelector("#attach_file").value=''

        this.setState({
            attachment: attachment,
            newDoc: newDoc
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

    approvalStatus = (text, comment) => {
        this.setState({ status_title: text, comment: comment }, () => this.save())
    }

    removeOldDocument(index, event) {
        var array = this.state.doc;
        array.splice(index, 1);
        this.setState({
            doc: array
        })
    }

    save() {
       if(this.state.newDoc.length ==0 && this.state.doc.length ==0){
        toast.error("Please Choose Attachment File!")
       }else{
        let editData = !Array.isArray(this.state.one_benefit) == true ? (this.state.newDoc.length > 0 || this.state.attachment.length > 0 || this.state.doc.length > 0) && !Array.isArray(this.state.one_benefit) : !Array.isArray(this.state.one_benefit)
        if (validate('check_form') && (this.state.attachment.length > 0 || editData)) {
            $('#saving_button').attr('disabled', true);
            var data = {
                requested_date: moment(this.state.requested_date).format('YYYY-MM-DD'),
                user_id: this.state.one_benefit.user_id ? this.state.one_benefit.user_id : this.state.user_id,
                start_date: moment(this.state.start_date).format('YYYY-MM-DD'),
                expire_date: moment(this.state.start_date).add(1, 'y').format('YYYY-MM-DD'),
                insurance_amount: this.state.insurance_amount,
                approve_amount: approveAmount(this.state.insurance_amount),
                status: this.state.status == 5 ? 0 : this.state.status,
                updatedBy: this.state.updatedBy,
                createdBy: this.state.createdBy,
                withdraw_location: this.state.withdraw_location,
                description: this.state.description
            }

            const formdata = new FormData();

            var obj = this.state.newDoc.length;
            for (var i = 0; i < obj; i++) {
                formdata.append('uploadfile', this.state.newDoc[i]);
            }

            let status = 0;
            let path = 'saveCycleInsurance'

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
                path = `editCycleInsurance/${this.state.one_benefit.cycle_insurance_benefit_id}`
            }
            formdata.append('cycle_insurance', JSON.stringify(data))
            formdata.append('oldDoc', JSON.stringify(this.state.doc))

            fetch(`${main_url}cycleInsurance/${path}`, {
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


    render() {
        return (
            <div className="benefits benefit-medical">
                <div className='row'>
                    <div className="form-group" id="check_form">
                        <div className="row">
                            <div className="col-md-6">
                                <div><label className="col-sm-10">Request Date</label></div>
                                <div className="col-sm-10" disabled>
                                    <input className="form-control input-md" type="text" value={moment(this.state.requested_date).format('DD-MM-YYYY')} disabled />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-10">Employee Name</label></div>
                                <div className="col-sm-10">
                                    <input type="text"
                                        className="form-control"
                                        placeholder="What is the available amount"
                                        value={this.state.is_main_role ? this.state.edit_user_name : this.state.employee_name}
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
                                        value={this.state.is_main_role ? this.state.edit_employee_id : this.state.employee_id}
                                        disabled />
                                </div>

                            </div>
                            <div className="col-md-6">
                                <div><label className="col-sm-10">Start Date</label></div>
                                <div className="col-sm-10">
                                    {
                                        this.state.is_main_role ?
                                            <input className="form-control input-md" type="text"
                                                value={moment(this.state.start_date).format('DD-MM-YYYY')}
                                                disabled /> :
                                            <DatePicker
                                                dateFormat="DD/MM/YYYY"
                                                value={moment(this.state.start_date).format('DD-MM-YYYY')}
                                                timeFormat={false}
                                                onChange={this.handle_start_date.bind(this)} />
                                    }
                                </div>

                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div><label className="col-sm-10">Expire Date</label></div>
                                <div className="col-sm-10">
                                    <input className="form-control input-md" type="text"
                                        value={!Array.isArray(this.state.one_benefit) ? moment(this.state.expire_date).format('DD-MM-YYYY') : moment(this.state.start_date).add(1, 'y').format('DD-MM-YYYY')}
                                        disabled />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="col-sm-10">Insurance Amount</label>
                                <div className="col-sm-10">
                                    <input className="form-control checkValidate"
                                        type="number"
                                        value={this.state.insurance_amount}
                                        onChange={this.handle_Insurance_Amount}
                                        disabled={this.state.is_main_role ? true : false}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div><label className="col-sm-10">Approve Amount</label></div>
                                <div className="col-sm-10">
                                    <input className="form-control input-md" type="text"
                                        value={approveAmount(this.state.insurance_amount)}
                                        disabled
                                    />
                                </div>

                            </div>

                            <div className="col-md-6">
                                <div><label className="col-sm-10">Description</label></div>
                                <div className="col-sm-10">
                                    <textarea className="form-control input-md" type="text"
                                        value={this.state.description}
                                        onChange={this.handle_description}
                                        disabled={this.state.is_main_role ? true : false}
                                    />
                                </div>

                            </div>

                        </div>
                        <div className='row'>
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
                </div>
                <div className="row">
                    {
                        !Array.isArray(this.state.one_benefit) ?
                            this.state.is_main_role ?
                                this.state.doc.length > 0 ?
                                    <div className="row document-main">
                                        <input className="full_width hidden" type="file" id="attach_file" ></input>

                                        <DocumentList title='Cycle Insurance Benefit Document' doc={this.state.doc} path="cycleInsurance" />
                                    </div> : <input className="full_width hidden" type="file" id="attach_file" ></input>
                                :

                                <div className="row">
                                    <div className="form-group col-md-12" style={{ overflowX: "auto" }}>
                                        <div className="ownspacing"></div>
                                        <div className="col-sm-10"><h4>Cycle Insurance Benefit Document</h4></div>
                                        <div className="col-md-12">
                                            <input type="file"  className="dropZone" id="attach_file" onChange={this.checkFiles.bind(this)} multiple /></div>

                                        <div className="ibox float-e-margins">
                                            <div className="p-md col-md-12" style={{ float: 'left', }}>

                                                {this.state.doc.map((data, index) =>
                                                    <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">
                                                        <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                            <div className="columns">
                                                                <div className="column-title">
                                                                    <a href={`${main_url}cycleInsurance/getCRDocumentData/${data.name}`}
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
                                    <label htmlFor="attachment" className="col-sm-12 custom-file-label">Provide At Least One Or More Attachment</label>
                                </div>
                                <div className="col-sm-10">
                                    <input className="dropZone"  type="file" id="attach_file" multiple onChange={this.checkFiles.bind(this)}></input>
                                </div>
                                <div>
                                    {
                                        Array.isArray(this.state.one_benefit) && this.state.newDoc.map((data, index) =>

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
                            <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.one_benefit.status} work_flow={this.state.work_flow_status} total_amount={this.state.insurance_amount} />
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

export default CycleAddNew