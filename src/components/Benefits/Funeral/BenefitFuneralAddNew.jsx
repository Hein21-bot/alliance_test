import React, { Component } from 'react';
import Select from 'react-select';
import '../../Benefits/Benefits.css';
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery';
import { main_url, getCookieData, validate, alertText, stopSaving, startSaving } from "../../../utils/CommonFunction";

var form_validate = true;

class BenefitFuneralAddNew extends Component {
    constructor(props) {
        super(props);
        var user_info = getCookieData("user_info");
        this.state = {
            one_benefit: this.props.data,
            employee_name: user_info.fullname,
            designations: user_info.designations,
            person_type: [],
            data: {
                user_id: user_info.user_id,
                status: 0,
                available_amount: 0,
                total_amount: 0,
                createdBy: user_info.user_id
            },
            deadPerson: {
                selected_person: '',
                headNo: '',
                selected_personName: ''
            },
            person: [],
            status: 0,
            createdBy: user_info.user_id,
            updatedBy: user_info.user_id,
            available_amount: 0,
            attachment: [],
            newDoc: []
        }
    }

    componentDidUpdate() {
        if (!form_validate) { validate("person_check_form") }
    }

    componentDidMount() {
        this.getAvailableAmount();
        fetch(`${main_url}main/getPersonType`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    person_type: list
                })
            })
    }

    getAvailableAmount() {
        fetch(`${main_url}funeral_benefit/getFuneralAvailableAmount`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                var data = this.state.data;
                data.total_amount = list.amount;
                this.setState({
                    data: data,
                    available_amount: list.amount
                })
            })
    }

    handleDeadPersonOptions = (event) => {
        let deadPerson = this.state.deadPerson;
        let all_person = this.state.person;
        let check_person = all_person.filter(function (p) { return p.selected_personName === event.label })
        if (check_person.length > 0) {
            toast.error("Your selected person has already used!");
        } else {
            deadPerson.selected_person = event
            deadPerson.selected_personName = event.label
            this.setState({
                deadPerson: deadPerson
            });
        }
    };

    handleHeadNo = (event) => {
        let data = this.state.deadPerson
        data.headNo = event.target.value
        this.setState({
            deadPerson: data
        });
    };

    //@kpk
    removeNewDocument(index, event) {
        var array = this.state.newDoc;
        array.splice(index, 1);
        this.setState({
            newDoc: array
        })
    }

    checkFiles(e) {
        var files = document.getElementById("attach_file").files;
        var attachment = [];
        if (files.length > 2) {
            toast.warning('You can only upload a maximum of 2 files!')
        }
        else {
            for (let i = 0; i < files.length; i++) {
                attachment.push(files[i])
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
       if(this.state.attachment.length == 0){
        toast.error("Please Choose Attachment File!")
       }else{
        if (this.state.attachment.length > 0 && this.state.person.length > 0) {
            $('#saving_button').attr('disabled', true);
            const formdata = new FormData();
            var obj = this.state.newDoc.length;
            for (var i = 0; i < obj; i++) {
                var imagedata =this.state.newDoc[i];
                formdata.append('uploadfile', imagedata);
            }

            formdata.append('funeral_benefit', JSON.stringify(this.state.data))
            formdata.append('detail', JSON.stringify(this.state.person));

            let status = 0;

            fetch(`${main_url}funeral_benefit/saveFuneralBenefit`, {
                method: "POST",
                body: formdata
            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    if (status === 200) {
                        toast.success(text);
                        this.props.goToTable();
                    }
                    else toast.error(text);
                })
        }
        else {
            startSaving();
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

    addRow = (e) => {
        if (validate("person_check_form")) {
            var arr = this.state.person;
            arr.push(this.state.deadPerson);
            let tot = 0;
            let amount = this.state.available_amount;
            var data = this.state.data;
            for (let i = 0; i < arr.length; i++) {
                tot += arr[i].headNo * amount;
            }
            data.total_amount = tot;
            this.setState({
                person: arr,
                data: data,
                deadPerson: {
                    selected_person: '',
                    selected_personName: '',
                    headNo: ''
                }
            })
        }
    }

    handleRemove(e) {
        let newData = this.state.person;
        newData.splice(e, 1);
        this.setState({
            person: newData
        })
    }

    getTotalAmount(amount) {
        let arr = this.state.person;
        let tot = 0;
        for (let i = 0; i < arr.length; i++) {
            tot += arr[i].headNo * amount;
        }
        return tot;
    }
    render() {
        return (
            <div className="benefits benefit-funeral-add-new">
                <ToastContainer />
                <div className='row'>
                    <div className="form-group" id="check_form">
                        <div className="row">
                            <div className="col-md-5">
                                <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled
                                        value={this.state.employee_name}
                                    />
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div><label htmlFor="designation" className="col-sm-12">Designation</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled
                                        value={this.state.designations}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row" id="person_check_form">
                            <div className="col-md-5">
                                <div><label htmlFor="dead-person" className="col-sm-12">Please Choose Whose Funeral Is It ? </label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose An Option"
                                        options={this.state.person_type}
                                        onChange={this.handleDeadPersonOptions}
                                        value={this.state.deadPerson.selected_person}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>

                            <div className="col-md-5">
                                <div><label htmlFor="head-no" className="col-sm-12">Head Number</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="number"
                                        placeholder="Please Provide The Head Number"
                                        className="form-control checkValidate"
                                        onChange={this.handleHeadNo}
                                        value={this.state.deadPerson.headNo}
                                    />
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="form-group">

                                    <div className="col-sm-10" style={{ marginTop: 20 }}>

                                        <button className="btn btn-primary" onClick={this.addRow}><span>Add</span> </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row margin-top-20">
                            <div className="col-md-10 funeral-detail">
                                <table className="table table-bordered table-responsive">
                                    <thead>
                                        <tr>
                                            <th>Person Type</th>
                                            <th>Head No</th>
                                            <th>Action</th>

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {
                                            this.state.person.length <= 0 ?

                                                (<td colSpan="3" class="text-center">No data</td>) :
                                                (this.state.person.map((data, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{data.selected_personName}</td>
                                                            <td>{data.headNo}</td>
                                                            <td><button className="btn btn-primary btn-sm" onClick={this.handleRemove.bind(this, index)}>Remove</button></td>
                                                        </tr>
                                                    )
                                                }
                                                ))
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
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div>
                                    <label htmlFor="attachment" className="col-sm-12 custom-file-label">Provide At Least One Or At Most Two
                                    Attachment</label>
                                </div>

                                <div className="col-sm-10">
                                    <input className="full_width dropZone" type="file" id="attach_file" multiple onChange={this.checkFiles.bind(this)}></input>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {this.state.newDoc.map((data, index) =>

                        <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">

                            <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                <div className="columns"><div className="column-thumbnail">
                                    <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                        <div className="fileuploader-item-icon" style={{ backgroundColor: '#3f4fd3' }}><i>{data.name.split(".")[1]}</i>
                                        </div></div><span className="fileuploader-action-popup"></span></div>
                                    <div className="column-title">
                                        <span className="own-text">
                                            {data.name}
                                        </span></div>
                                    <div className="column-actions">
                                        <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeNewDocument(index, event)}> <i></i></a>
                                    </div></div></li></ul>
                        </div>
                    )
                    }
                </div>
                <div className="row save-btn">
                    <div className="float-right">
                        <div>
                            <button className="btn btn-primary" id="saving_button" type="button" onClick={this.save.bind(this)}>Save</button>
                        </div>

                    </div>
                </div>


            </div>
        )
    }
}

export default BenefitFuneralAddNew;