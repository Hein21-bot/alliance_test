import React, { Component } from 'react'
import Select from 'react-select'
import { main_url, validate, stopSaving, startSaving, alertText } from '../../../utils/CommonFunction';
import { ToastContainer, toast } from 'react-toastify';

var form_validate = true;

class TicketSubCategoryEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        }
    }
    handleInputChange = (e) => {
        const obj = { ...this.state.data };
        obj[e.target.id] = e.target.value;
        this.setState({
            data: obj
        })
    }
    handleSelectorChange = (val, key) => {
        const { department_type_option, main_category_option, getPriorityOption, getSeverityOption } = this.props;
        const value = key == 'departments_id' ?
            ((department_type_option.find(v => v.value == val.value)).value) :
            key == 'main_category_id' ?
                ((main_category_option.find(v => v.main_category_id == Number(val.value))).value) :
                key == 'priorities_id' ?
                    ((getPriorityOption.find(v => v.value == Number(val.value))).value) :
                    ((getSeverityOption.find(v => v.value == Number(val.value))).value)
        const obj = { ...this.state.data };
        obj[key] = value;
        this.setState({
            data: obj
        })
    }
    handleCheckChange = (e) => {
        const id = e.target.id;
        const val = e.target.checked ? 1 : 0;
        const obj = { ...this.state.data };
        obj[id] = val;
        this.setState({
            data: obj
        })
    }
    handleSave = () => {

        stopSaving();
        if (validate('check_form')) {
            const { data } = this.state;
            let status = 0;
            fetch(`${main_url}subCategory/editSubCategory/${data.sub_category_id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `data=${JSON.stringify(data)}`

            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    this.props.showToast(status, text);
                })
        } else {
            toast.error(alertText, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            startSaving();
            form_validate = false;
        }
    }
    render() {
        const { department_type_option, main_category_option, getPriorityOption, getSeverityOption } = this.props;
        const { data } = this.state;
        const selectedDepartmentType = department_type_option.find(v => v.value == data.departments_id);
        const selectedMainCategory = main_category_option.find(v => v.main_category_id == data.main_category_id)
        const selectedPriority = getPriorityOption.find(v => v.value == data.priorities_id)
        const selectedSeverity = getSeverityOption.find(v => v.value == data.severity_id)
        return (
            <div className="container">
                <div className='row'>
                    <form id="check_form">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="department_id" className="col-sm-12">Department</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose Department"
                                        options={department_type_option}
                                        onChange={(val) => this.handleSelectorChange(val, 'departments_id')}
                                        value={selectedDepartmentType}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select" />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="main_category" className="col-sm-12">Main Category</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose Main Category"
                                        options={main_category_option}
                                        onChange={(val) => this.handleSelectorChange(val, 'main_category_id')}
                                        value={selectedMainCategory}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select" />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="sub_category" className="col-sm-12">Sub Category</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='sub_category_name'
                                        className="form-control checkValidate"
                                        value={data.sub_category_name}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="priority" className="col-sm-12">Priority</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose Main Category"
                                        options={getPriorityOption}
                                        onChange={(val) => this.handleSelectorChange(val, 'priorities_id')}
                                        value={selectedPriority}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select" />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="severity" className="col-sm-12">Severity</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose Main Category"
                                        options={getSeverityOption}
                                        onChange={(val) => this.handleSelectorChange(val, 'severity_id')}
                                        value={selectedSeverity}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select" />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="remark" className="col-sm-12">Remark</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='remark'
                                        className="form-control"
                                        value={data.remark}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row save-btn">
                            <div className="float-right">
                                {/* this.save.bind(this) */}
                                <button onClick={() => this.handleSave()} className="btn btn-primary" id="saving_button" type="button">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default TicketSubCategoryEdit