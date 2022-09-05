import React, { Component } from 'react';
import Select from 'react-select';
import moment from 'moment';
import $ from 'jquery';
import {
    main_url, getTicketMainCategory, getTicketStatus, getBranch, getTicketCategoryType, getTicketSubCategory,
    getPriority, getUserId, getDepartment, validate, getSeverity, startSaving, stopSaving
} from '../../utils/CommonFunction';
import { toast } from 'react-toastify';

const ticketType = [{
    value: 1,
    label: 'Internal'
}, {
    value: 2,
    label: 'External'
}]

var form_validate = true;
export default class TravelRequestAddNew
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketType: [],
            allMainCategory: [],
            allSubCategory: [],
            mainCategory: [],
            assignPerson: [],
            ticketStatus: [],
            subCategory: [],
            priority: [],
            severity: [],
            department: [],
            requested_dept: [],
            selected_requested_dept: [],
            selectedSeverity: [],
            branch: [],
            attachment: [],
            newDoc: [],
            data: {
                user_id: getUserId("user_info"),
                createdBy: getUserId("user_info"),
                ticketType: '',
                ticketStatus: '',
                ticketCode: '',
                ticket_name: '',
                subCategoryId: '',
                mainCategoryId: '',
                ticket_status_id: '',
                ticket_desc: '',
                priority: 0,
                severity: 0,
                branchId: '',
                departmentId: '',
                requestedDept: '',
                assign_person_id: '',
                request_comment: '',
                assignPerson_comment: '',
                createdAt: moment().format('DD-MM-YYYY HH:mm:ss'),
            }
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    getOpenAndCloseStatus(status) {
        let ticket = status.filter(function (s) { return s.value === 1 || s.value === 6 })
        return ticket;
    }

    async componentDidMount() {
        let mainCategory = await getTicketMainCategory();
        let subCategory = await getTicketSubCategory();
        let ticketStatus = await getTicketStatus();
        let ticketType = await getTicketCategoryType();
        ticketStatus = this.getOpenAndCloseStatus(ticketStatus);
        let branch = await getBranch();
        let dept = await getDepartment();
        let data = this.state.data;
        data.ticket_status_id = ticketStatus[0]

        let priority = await getPriority();
        let severity = await getSeverity();
        this.setState({
            allMainCategory: mainCategory,
            allSubCategory: subCategory,
            ticketStatus: ticketStatus,
            branch: branch,
            priority: priority,
            severity: severity,
            department: dept,
            ticketType: ticketType
        })

    }

    handleSelectedTicketType = (event) => {
        let data = this.state.data
        data.ticketType = event;
        data.mainCategoryId = [];
        data.subCategoryId = [];
        this.setState({
            data: data
        }, () => this.setTicketMainCategory(event.value))
    }

    handleSelectedTicketMainCategory = (event) => {
        let data = this.state.data
        data.mainCategoryId = event
        data.subCategoryId = '';
        data.priority = '';
        this.setState({
            data: data
        }, () => this.setTicketSubCategory(event.value))

    }

    setTicketMainCategory() {
        let all = this.state.allMainCategory;
        let dept = this.state.data.departmentId;
        let deptID = Array.isArray(dept) ? 0 : dept.value;
        let data = this.state.data;
        let ticketType = data.ticketType !== '' ? data.ticketType.value : 0;
        let main = [];
        if (deptID > 0 || ticketType > 0) {
            let condition = '1';
            if (ticketType > 0) {
                all = all.filter(function (a) {
                    return a.ticket_category_type === ticketType
                })
            }
            if (deptID > 0) {
                all = all.filter(function (a) {
                    return a.departments_id === deptID
                })
            }
            main = all;
        }
        this.setState({
            mainCategory: main,
            subCategory: []
        })
    }

    setTicketSubCategory(main_id) {
        let all = this.state.allSubCategory;
        let sub = all.filter(function (a) { return a.main_category_id === main_id });
        this.setState({
            subCategory: sub
        })
    }

    changeText = (e) => {
        let data = this.state.data;
        let name = e.target.dataset.name;
        data[name] = e.target.value;

        this.setState({
            data: data
        })
    }

    handleSelectedTicketSubCategory = (event) => {
        let data = this.state.data
        data.subCategoryId = { label: event.label, value: event.value };
        data.priority = { label: event.priority, value: event.priority_id };
        data.severity = { label: event.severity_name, value: event.severity_id }
        this.setState({
            data: data
        })
    }

    handleSelectedTicketStatus = (event) => {
        let data = this.state.data
        data.ticket_status_id = event
        this.setState({
            data: data
        })
    }

    handleSelectedPriority = (event) => {
        let data = this.state.data
        data.priority = event
        this.setState({
            data: data
        })
    }

    handleSelectedSeverity = (event) => {
        let data = this.state.data
        data.severity = event.value
        this.setState({
            data: data,
            selectedSeverity: event
        })
    }

    handleSelectedAssignPerson = (event) => {
        let data = this.state.data
        data.assign_person_id = event
        this.setState({
            data: data
        })
    }

    //@kpk
    removeNewDocument(index, event) {
        var array = this.state.newDoc;
        array.splice(index, 1);
        this.setState({
            newDoc: array
        })
    }

    changeComment = (event) => {
        let data = this.state.data
        data.request_comment = event.target.value
        this.setState({
            data: data
        })
    }

    handlefileChanged(event) {
        var files = document.getElementById("HDDropZone").files;
        var attachment = [];

        event.preventDefault();
        let arr = [];
        let url = [];
        for (let i = 0; i < event.target.files.length; i++) {
            let reader = new FileReader();
            let getfile = event.target.files[i];
            attachment.push(files[i])
            reader.onloadend = (r) => {
                url.push(r.target.result);
            }
            reader.readAsDataURL(getfile);
            arr.push(getfile);
        }
        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#HDDropZone").files.length;
        for (var i = 0; i < obj; i++) {
            var getfile = document.querySelector("#HDDropZone").files[i];
            newDoc.push(getfile)
        }
        document.querySelector("#HDDropZone").value=''

        this.setState({
            attachment: attachment,
            newDoc: newDoc
        })
    }

    handleSelectedDepartment = (event) => {
        let data = this.state.data
        data.departmentId = event
        data.mainCategoryId = '';
        data.assign_person_id = '';
        this.setState({
            data: data
        }, () => {
            this.setTicketMainCategory()
            this.getAssignPerson(event.value, data.branchId.value)
        })
    }

    // handleSelectedRequestedDept = (event) => {
    //     let data = this.state.data;
    //     data.requestedDept = event;
    //     data.mainCategoryId = [];
    //     data.subCategoryId = [];
    //     data.assign_person_id = '';
    //     this.setState({
    //         data: data,
    //         selected_requested_dept: event
    //     }, () => {
    //         this.setTicketMainCategory()
    //         this.getAssignPerson(event.value, data.branchId.value)
    //     })
    // }

    getAssignPerson(deptId, branchId) {
        if (branchId === undefined) branchId = 0;
        fetch(main_url + "helpDesk/getAssignPersonByBranchAndDepartment/" + deptId + "/" + branchId)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                
                if (res.length > 0) {
                    this.setState({ assignPerson: res, })
                } else {
                    this.setState({ assignPerson: [], })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    handleSelectedBranch = async (event) => {
        this.setState({
            assignPerson: []
        })
        let data = this.state.data
        data.branchId = event

        data.assign_person_id = ''
        this.setState({
            data: data
        }, () => {
            this.getAssignPerson(data.departmentId.value, event.value)
        })
    }

    // addHelpDesk = (data, newDoc) => {
    addHelpDesk = () => {
       if(this.state.newDoc.length == 0){
        toast.error("Please Choose Attachment File!")
       }else{
        if (validate('check_form')) {
            $('#saving_button').attr('disabled', true);
            var data = this.state.data
            var newDoc = this.state.newDoc
            const formdata = new FormData();

            // var obj = document.querySelector("#HDDropZone").files.length;
            // var newDoc = this.state.newDoc
            for (var i = 0; i < newDoc.length; i++) {
                var imagedata = newDoc[i]
                formdata.append('uploadfile', imagedata);
            }

            formdata.append('info', JSON.stringify(data))
            let status = 0;
            fetch(main_url + 'helpDesk/addHelpDesk', {
                method: "POST",
                body: formdata
            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    this.props.showToast(status, text);
                })
        }
        else {
            startSaving();
            form_validate = false;
        }
       }
       
    }

    // check = () => {
    //     stopSaving();
    //     if (validate('check_form')) {
    //         var doc = this.state.newDoc
    //         this.props.addHelpDesk(this.state.data, doc);
    //     }
    //     else {
    //         startSaving();
    //         form_validate = false;
    //     }
    // }

    render() {
        return (
            <div className="wrapper wrapper-content">
                <div className="form-horizontal" id="check_form">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12" >Request Type<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <Select
                                        placeholder="Please Choose Type"
                                        value={this.state.data.ticketType}
                                        onChange={this.handleSelectedTicketType}
                                        options={this.state.ticketType}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group"   >
                                <div><label className="col-sm-12" >Ticket Name<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10" >
                                    <input type='text' className="form-control checkValidate"
                                        value={this.state.data.ticket_name}
                                        data-name='ticket_name'
                                        onChange={this.changeText}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group"   >
                                <div><label className="col-sm-12" >Requested Department<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10" >
                                    <Select
                                        placeholder="Please Choose Department"
                                        value={this.state.data.departmentId}
                                        onChange={this.handleSelectedDepartment}
                                        options={this.state.department}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                    {/* <Select
                                        placeholder="Please Choose Request Department"
                                        value={this.state.selected_requested_dept}
                                        onChange={this.handleSelectedRequestedDept}
                                        options={this.state.requested_dept}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12 mt20" >Ticket Main Category<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <Select
                                        placeholder="Please Choose Type"
                                        value={this.state.data.mainCategoryId}
                                        onChange={this.handleSelectedTicketMainCategory}
                                        options={this.state.mainCategory}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12 mt20">Ticket Sub Category<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <Select
                                        placeholder="Please Choose Type"
                                        value={this.state.data.subCategoryId}
                                        onChange={this.handleSelectedTicketSubCategory}
                                        options={this.state.subCategory}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12 mt20" >Ticket Status<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose Type"
                                        value={this.state.data.ticket_status_id}
                                        onChange={this.handleSelectedTicketStatus}
                                        options={this.state.ticketStatus}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12 mt20" >Severity<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    {/* <Select
                                        placeholder="Please Choose Severity"
                                        value={this.state.selectedSeverity}
                                        onChange={this.handleSelectedSeverity}
                                        options={this.state.severity}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    /> */}
                                    <input type="text" className="form-control full_width" value={this.state.data.severity !== '' ? this.state.data.severity.label : ''} disabled></input>

                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12 mt20" >Priority<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control full_width" value={this.state.data.priority !== '' ? this.state.data.priority.label : ''} disabled></input>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12 mt20" >Location Branch<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose Type"
                                        value={this.state.data.branchId}
                                        onChange={this.handleSelectedBranch}
                                        options={this.state.branch}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12 mt20" >Department<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <Select
                                        placeholder="Please Choose Type"
                                        value={this.state.data.departmentId}
                                        onChange={this.handleSelectedDepartment}
                                        options={this.state.department}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                        </div>
                         */}
                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12 mt20" >Assign Person<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose Type"
                                        value={this.state.data.assign_person_id}
                                        onChange={this.handleSelectedAssignPerson}
                                        options={this.state.assignPerson}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6" >
                            <div className="form-group" >
                                <div><label className="col-sm-12 mt20" >Ticket Description</label></div>
                                <div className="col-sm-10" >
                                    <textarea
                                        className="form-control"
                                        cols="20"
                                        rows="5"
                                        data-name='ticket_desc'
                                        value={this.state.data.ticket_desc}
                                        placeholder="Enter Ticket Description"
                                        onChange={this.changeText}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6" >
                            <div className="form-group" >
                                <div><label className="col-sm-12 mt20">Comment</label></div>
                                <div className="col-md-10">
                                    <textarea className="form-control"
                                        cols="20"
                                        rows="5"
                                        value={this.state.data.request_comment}
                                        placeholder="Enter Comment"
                                        onChange={this.changeComment}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group"   >
                                <div><label className="col-sm-12 mt20">Help Desk Document</label></div>
                                <div className="col-md-10">
                                    <input type="file" id="HDDropZone" className="dropZone form-control" onChange={this.handlefileChanged.bind(this)} multiple />
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

                    <div className="row">
                        <div className="col-md-12">
                            <div className="btn-rightend margin-top-20">
                                <button onClick={this.addHelpDesk.bind(this)} id="saving_button" className="btn btn-primary"><span>Save</span> </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        );
    }
}

