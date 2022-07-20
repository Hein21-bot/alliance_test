import React, { Component } from 'react'
import { main_url, validate, stopSaving, startSaving, alertText } from '../../../utils/CommonFunction';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select'

var form_validate = true;

class TicketMainCategoryAddNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category_name: '',
            departments_id: -1,
            ticket_status_id: -1,
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
        const { department_type_option, ticket_type_option } = this.props;
        const value = key == 'departments_id' ?
            ((department_type_option.find(v => v.value == val.value)).value) :
            ((ticket_type_option.find(v => v.value == Number(val.value))).value);
        const setState = {};
        setState[key] = value;

        this.setState(setState)
    }
    handleSave = () => {

        stopSaving();
        if (validate('check_form')) {
            let status = 0;
            const { category_name, departments_id, ticket_status_id, remark } = this.state;
            const data = {
                category_name, departments_id, ticket_status_id, remark
            }
            fetch(`${main_url}mainCategory/addMainCategory`, {
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
        const { department_type_option, ticket_type_option } = this.props;
        // const desiglnation_filter_options = desiglnation_options.filter(v => v.departments_id == this.state.departments_id)
        const { category_name, departments_id, ticket_status_id, remark } = this.state;
        const selectedDepartmentType = department_type_option.find(v => v.value == departments_id);
        const selectedTicketType = ticket_type_option.find(v => v.designations_id == Number(ticket_status_id));
        return (
            <div className="container">
                <div className='row'>
                    <form id="check_form">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="category_name" className="col-sm-12">Main Category</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='category_name'
                                        className="form-control checkValidate"
                                        value={category_name}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
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
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="ticket_status_id" className="col-sm-12">Ticket type</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose Department"
                                        options={ticket_type_option}
                                        onChange={(val) => this.handleSelectorChange(val, 'ticket_status_id')}
                                        value={selectedTicketType}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select" />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="remark" className="col-sm-12">remark</label></div>
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

export default TicketMainCategoryAddNew