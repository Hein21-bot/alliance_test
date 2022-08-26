import React, { Component } from 'react';
import ApprovalForm from '../../Common/ApprovalForm';
import {
    main_url, validate, getUserId, getActionStatus, havePermission, getWorkFlowStatus,alertText,
    stopSaving, startSaving
} from '../../../utils/CommonFunction';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import DocumentList from '../../Common/DocumentList';
var form_validate = true;

class FuneralBenefitEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            updatedBy: getUserId("user_info"),
            datasource: props.data.data[0],
            detail: props.data.detail,
            doc: props.data.doc,
            newDoc: [],
            newPerson: {
                selected_person: '',
                selected_personName: '',
                headNo: 0
            },
            status_title: '',
            is_main_role: false,
            person_type: [],
            work_flow_status: {},
            comment: ''
        }
    }

    getAvailableAmount() {
        fetch(`${main_url}funeral_benefit/getFuneralAvailableAmount`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    available_amount: list.amount
                })
            })
    }

    async componentDidMount() {
        this.getAvailableAmount();
        this.getPersonType();
        var work_flow = await getWorkFlowStatus(this.state.datasource.user_id, this.state.updatedBy, 'Funeral Benefit', 'Benefit');
        this.setState({
            work_flow_status: work_flow,
            is_main_role: havePermission(work_flow)
        })
    }

    getPersonType() {
        fetch(`${main_url}main/getPersonType`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    person_type: list
                })
            })
    }

    getPersonName(id) {
        let type = this.state.person_type.filter(function (person) { return person.value === id });

        return type;
    }

    changeHeadNo = (index, value) => {

        let array = this.state.detail;
        let data = this.state.detail[index];

        data.headNo = value.target.value
        array[index] = data

        this.setState({
            detail: array

        })

    }

    handleDeadPersonOptions = (event) => {
        let newPerson = this.state.newPerson;
        let all_person = this.state.detail;
        let check_person = all_person.filter(function (p) { return p.selected_personName === event.label })
        if (check_person.length > 0) {
            toast.error("Your selected person has already used!");
        } else {

            newPerson.selected_person = event
            newPerson.selected_personName = event.label

            this.setState({
                newPerson: newPerson
                //deadPerson: event.value
            });
        }
    };

    handleHeadNo = (event) => {
        let newPerson = this.state.newPerson;
        newPerson.headNo = event.target.value
        this.setState({
            newPerson: newPerson
            //deadPerson: event.value
        });
    };

    changeDeadPerson = (index, value) => {
        let array = this.state.detail;
        let data = this.state.detail[index];

        data.selected_person = value.value

        data.selected_personName = value.label
        array[index] = data

        this.setState({
            detail: array
        })
    }

    handlePersonRemove(e) {
        let newData = this.state.detail;
        newData.splice(e, 1);
        this.setState({
            detail: newData
        })
    }

    handlefileChanged(event) {

        event.preventDefault();

        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#dropFuneralEdit").files.length;
        for (var i = 0; i < obj; i++) {
            var getfile = document.querySelector("#dropFuneralEdit").files[i];
            newDoc.push(getfile)
        }
        this.setState({
            newDoc: newDoc

        })
    }

    changeHeadNo = (index, value) => {

        let array = this.state.detail;
        let data = this.state.detail[index];

        data.headNo = value.target.value
        array[index] = data

        this.setState({
            detail: array
        })

    }

    getTrainingVenueId(id) {
        let type = this.state.trainingVenue;
        let result = [];
        for (let i = 0; i < type.length; i++) {

            if (id === type[i].value) {
                result = type[i];
                break;
            }
        }
        return result;
    }

    addRow = (e) => {
        var data = this.state.detail;
        let new_person = this.state.newPerson;

        data.push({
            selected_person: new_person.selected_person.value,
            selected_personName: new_person.selected_personName,
            headNo: new_person.headNo
        })
        this.setState({
            detail: data,
            newPerson: {
                selected_person: '',
                selected_personName: '',
                headNo: 0
            },
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

    approvalStatus = (text, comment) => {
        this.setState({ status_title: text, comment: comment }, () => this.save())
    }


    save() {
        
        if (validate('check_form') && (this.state.newDoc.length > 0 || this.state.doc.length > 0)) {
            let { status_title, is_main_role } = this.state;
            const formdata = new FormData();

            var obj = document.querySelector("#dropFuneralEdit").files.length;
            for (var i = 0; i < obj; i++) {
                var imagedata = document.querySelector("#dropFuneralEdit").files[i];

                formdata.append('uploadfile', imagedata);
            }

            var data = [this.state.datasource].map(v => ({ ...v,  status: v.status == 5 ? 0 : v.status }))[0];
            data.updatedBy = this.state.updatedBy;

            if (status_title !== '' && is_main_role) {
                var action = getActionStatus(status_title, this.state.datasource, this.state.updatedBy, this.state.comment);
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

            formdata.append('detail', JSON.stringify(this.state.detail))
            formdata.append('data', JSON.stringify(data))
            formdata.append('oldDoc', JSON.stringify(this.state.doc))

            let status = 0
            fetch(main_url + 'funeral_benefit/editFuneralBenefit/' + data.funeral_benefit_id, {
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

    getTotalAmount(amount) {
        let arr = this.state.detail;

        let tot = 0;
        for (let i = 0; i < arr.length; i++) {
            tot += arr[i].headNo * amount;
        }
        return tot;
    }

    render() {
        let { is_main_role } = this.state;
        return (
            <div className="benefits benefit-funeral-add-new">
                <ToastContainer />
                <div className='row'>
                    <div className="form-group" id="check_form">

                        <div className="row">
                            <div className="col-md-5">
                                <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
                                <div className="col-sm-10">
                                    <input disabled type='text' className='form-control'
                                        value={this.state.datasource.fullname}
                                    />

                                </div>
                            </div>
                            <div className="col-md-5">
                                <div><label htmlFor="designation" className="col-sm-12">Designation</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        // placeholder="Please Provide The Designation"
                                        className="form-control"
                                        disabled
                                        // onChange={this.handleDesignation.bind(this)}
                                        value={this.state.datasource.designations}
                                    />
                                </div>
                            </div>
                        </div>
                        {
                            is_main_role ? ''
                                :
                                <div className="row">
                                    <div className="col-md-5">
                                        <div><label htmlFor="dead-person" className="col-sm-12">Please Choose Whose Funeral Is It ? </label></div>
                                        <div className="col-sm-10">
                                            {is_main_role ?
                                                <input
                                                    type="number"
                                                    placeholder="Please Provide The Head Number"
                                                    className="form-control"
                                                    value={this.state.newPerson.selected_person.label}
                                                    disabled={is_main_role ? true : false}
                                                />
                                                :
                                                <Select
                                                    placeholder="Please Choose An Option"
                                                    options={this.state.person_type}
                                                    onChange={this.handleDeadPersonOptions}
                                                    value={this.state.newPerson.selected_person}

                                                />}

                                        </div>
                                    </div>

                                    <div className="col-md-5">
                                        <div><label htmlFor="head-no" className="col-sm-12">Head Number</label></div>
                                        <div className="col-sm-10">
                                            <input
                                                type="number"
                                                placeholder="Please Provide The Head Number"
                                                className="form-control"
                                                onChange={this.handleHeadNo}
                                                value={this.state.newPerson.headNo}
                                                disabled={is_main_role ? true : false}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-1">
                                        <div className="form-group">

                                            <div className="col-sm-12" style={{ marginTop: 20 }}>

                                                <button className="btn btn-primary" onClick={this.addRow}><span>Add</span> </button>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                        }

                        <div className=" row">
                            <div className="col-md-10 funeral-detail">
                                <table className="table table-bordered table-responsive">
                                    <thead>
                                        <tr>
                                            <th>Person Type</th>
                                            <th>Head No</th>
                                            {!is_main_role ?
                                                <th>Action</th>
                                                : ''}

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {
                                            this.state.detail.length <= 0 ?

                                                (<td colSpan="3" class="text-center">No data</td>) :
                                                this.state.detail.map((data, index) =>

                                                    <tr key={index}>
                                                        <td>
                                                            {/* <Select
                                                                placeholder="Please Choose An Option"
                                                                options={this.state.person_type}
                                                                onChange={this.changeDeadPerson.bind(this, index)}
                                                                value={this.getPersonName(data.selected_person)}
                                                            /> */}
                                                            {data.selected_personName}
                                                        </td>
                                                        <td>
                                                            {data.headNo}
                                                            {/*<input
                                                            className="form-control input-md"
                                                            data-name='headNo'
                                                            value={data.headNo}
                                                            placeholder="Enter HeadNo"
                                                            onChange={this.changeHeadNo.bind(this, index)} />*/}
                                                        </td>
                                                        {
                                                            !is_main_role ? <td><button className="btn btn-primary btn-sm" onClick={this.handlePersonRemove.bind(this, index)}>Remove</button></td>
                                                                : ''
                                                        }
                                                    </tr>

                                                )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-5">
                                <div><label className="col-sm-12">Available Amount</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled
                                        value={this.state.available_amount}
                                    />
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div><label className="col-sm-12">Total Amount</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled
                                        value={this.getTotalAmount(this.state.available_amount)}
                                    />
                                </div>
                            </div>
                        </div>
                        {!Array.isArray(this.state.datasource) && is_main_role ?
                            this.state.doc.length > 0 ?
                                <div className="row document-main">
                                    <input className="full_width hidden" type="file" id="dropFuneralEdit" ></input>

                                    <DocumentList title='Funeral Benefit Document' doc={this.state.doc} path="funeral_benefit" />
                                </div> : <input className="full_width hidden" type="file" id="dropFuneralEdit" ></input>
                            :

                            <div className="row">
                                <div className="col-md-12" style={{ overflowX: "auto" }}>
                                    <div className="ownspacing"></div>
                                    <h4>Funeral Benefit Document</h4>
                                    <div className="col-md-12">
                                        <input type="file" className="dropZone" id="dropFuneralEdit" onChange={this.handlefileChanged.bind(this)} multiple /></div>

                                    <div className="ibox float-e-margins">
                                        <div className="p-md col-md-12" style={{ float: 'left', }}>

                                            {this.state.doc.map((data, index) =>
                                                <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">
                                                    <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                        <div className="columns">
                                                            <div className="column-title">
                                                                <a href={`${main_url}funeral_benefit/getCRDocumentData/${data.name}`}
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
                    </div>
                </div>

                <div className="row save-btn">
                    {
                        !Array.isArray(this.state.datasource) && havePermission(this.state.work_flow_status) ?
                            <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.datasource.status} work_flow={this.state.work_flow_status} total_amount={this.getTotalAmount(this.state.available_amount)} />

                            :
                            <div className="float-right">
                                <div>
                                    {this.state.datasource.status == undefined || this.state.datasource.status == 5 ?
                                        <div>
                                            <button onClick={this.save.bind(this)} className="btn btn-primary" id="saving_button" type="button">Save</button>
                                        </div>
                                        :
                                        ''
                                    }
                                    {/* <button className="btn btn-primary" id="saving_button" type="button" onClick={this.save.bind(this)}>Save</button> */}
                                </div>

                            </div>
                    }

                </div>
            </div >

        )
    }
}
export default FuneralBenefitEdit;