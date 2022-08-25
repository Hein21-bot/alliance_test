import React, { Component } from 'react'
import { main_url, validate, stopSaving, startSaving, alertText } from '../../../utils/CommonFunction';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select'

var form_validate = true;

class TicketSubCategoryAddNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departments_id: -1,
            main_category_id: -1,
            sub_category_name: '',
            priorities_id: -1,
            severity_id: -1,
            remark: ''
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    handleInputChange = (e) => {
        const id = e.target.id;
        const val = e.target.value;
        const setState = {};
        setState[id] = val;
        this.setState(setState)
    }
    handleCheckChange = (e) => {
        const id = e.target.id;
        const val = e.target.checked ? 1 : 0;
        const setState = {};
        setState[id] = val;
        this.setState(setState)
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
        const setState = {};
        setState[key] = value;

        this.setState(setState)
    }
    handleSave = () => {

        // stopSaving();
        if (validate('check_form')) {
            let status = 0;
            const { departments_id, main_category_id, sub_category_name, priorities_id, severity_id, remark } = this.state;
            const data = {
                departments_id, main_category_id, sub_category_name, priorities_id, severity_id, remark
            }
            fetch(`${main_url}subCategory/addSubCategory`, {
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
        const { departments_id, main_category_id, sub_category_name, priorities_id, severity_id, remark } = this.state;
        const { department_type_option, main_category_option, getPriorityOption, getSeverityOption } = this.props;
        const selectedDepartmentType = department_type_option.find(v => v.value == departments_id);
        const selectedMainCategory = main_category_option.find(v => v.main_category_id == main_category_id)
        const selectedPriority = getPriorityOption.find(v => v.value == priorities_id)
        const selectedSeverity = getSeverityOption.find(v => v.value == severity_id)
        const main_category_option_filter = main_category_option.filter(d => d.departments_id == this.state.departments_id)
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
                                        options={main_category_option_filter}
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
                                        value={sub_category_name}
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
                                        value={remark}
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

export default TicketSubCategoryAddNew