import React, { Component } from 'react'
import { main_url, validate, stopSaving, startSaving, alertText } from '../../../utils/CommonFunction';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select'

var form_validate = true;

class JobTitleAddNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departments_id: -1,
            designations_id: -1,
            job_title: '',
            requirement: '',
            job_description: '',
            remark: '',
            active: 1
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
        const { department_type_option, desiglnation_options } = this.props;
        const value = key == 'departments_id' ?
            ((department_type_option.find(v => v.value == val.value)).value) :
            ((desiglnation_options.find(v => v.designations_id == Number(val.designations_id))).value);
        const setState = {};
        setState[key] = value;

        this.setState(setState)
    }
    handleSave = () => {

        stopSaving();
        if (validate('check_form')) {
            let status = 0;
            const { departments_id, designations_id, job_title, requirement, job_description, remark, active } = this.state;
            const data = {
                departments_id, designations_id, job_title, requirement, job_description, remark, active
            }
            fetch(`${main_url}jobTitle/addJobTitle`, {
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
        const { department_type_option, desiglnation_options } = this.props;
        const desiglnation_filter_options = desiglnation_options.filter(v => v.departments_id == this.state.departments_id)
        const { departments_id, designations_id, job_title, requirement, job_description, remark, active } = this.state;
        const selectedDepartmentType = department_type_option.find(v => v.value == departments_id);
        const selectedDesignationType = desiglnation_options.find(v => v.designations_id == Number(designations_id));
        return (
            <div className="container">
                <div className='row'>
                    <form id="check_form">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="departments_id" className="col-sm-12">Department</label></div>
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
                                <div><label htmlFor="designations_id" className="col-sm-12">Designation</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose Designation"
                                        options={desiglnation_filter_options}
                                        onChange={(val) => this.handleSelectorChange(val, 'designations_id')}
                                        value={selectedDesignationType}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select" />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="job_title" className="col-sm-12">Job Title</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='job_title'
                                        className="form-control"
                                        value={job_title}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="job_description" className="col-sm-12">Job Description</label></div>
                                <div className="col-sm-10">
                                    <textarea
                                        type="text"
                                        id='job_description'
                                        className="form-control"
                                        value={job_description}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                            
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div className='col-sm-10' >
                                    <div className='col-md-8' style={{ padding: 0 }}>
                                        <div><label htmlFor="remark" className="col-sm-12">Remark</label></div>
                                        <input
                                            type="text"
                                            id='remark'
                                            className="form-control"
                                            value={remark}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <div className='col-md-4' style={{ padding: 0 }}>
                                        <div><label htmlFor="active" className="col-sm-12 text-center" style={{}}>Active</label></div>
                                        <div className="col-sm-12" style={{}}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 5 }}>
                                                <input
                                                    type="checkbox"
                                                    id={'active'}
                                                    checked={active == 0 ? false : true}
                                                    onChange={(e) => this.handleCheckChange(e)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="requirement" className="col-sm-12">Requirement</label></div>
                                <div className="col-sm-10">
                                    <textarea
                                        type="text"
                                        id='requirement'
                                        className="form-control"
                                        value={requirement}
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

export default JobTitleAddNew