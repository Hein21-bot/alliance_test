import React, { Component } from 'react'
import { main_url, validate, stopSaving, startSaving, alertText } from '../../../utils/CommonFunction';
import { ToastContainer, toast } from 'react-toastify';

var form_validate = true;

class LeaveCategoryEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    handleInputChange = (e) => {
        const obj = { ...this.state.data };
        obj[e.target.id] = e.target.value;
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

        // stopSaving();
        if (validate('check_form')) {
            const { data } = this.state;
            let status = 0;
            fetch(`${main_url}leaveCategory/editLeaveCategory/${data.leave_category_id}`, {
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
        const { data } = this.state;
        return (
            <div className="container">
                <div className='row'>
                    <form id="check_form">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="leave_category" className="col-sm-12">Leave Category</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='leave_category'
                                        className="form-control checkValidate"
                                        value={data.leave_category}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="description" className="col-sm-12">Description</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='description'
                                        className="form-control"
                                        value={data.description}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="leave_quota" className="col-sm-12">Leave Quota</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="number"
                                        id='leave_quota'
                                        className="form-control checkValidate"
                                        value={data.leave_quota}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div className='col-sm-10' >
                                    <div className='col-md-8' style={{ padding: 0 }}>
                                        <div><label htmlFor="leave_policy" className="col-sm-12">Leave Policy Description</label></div>
                                        <input
                                            type="text"
                                            id='leave_policy'
                                            className="form-control checkValidate"
                                            value={data.leave_policy}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <div className='col-md-4' style={{ padding: 0 }}>
                                        <div><label htmlFor="allow_leave_count" className="col-sm-12 text-center" style={{}}>Allow Leave Count <br/>({data.allow_leave_count == 1 ? 'Working Day' : 'Calendar Day'})</label></div>
                                        <div className="col-sm-12" style={{}}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 5 }}>
                                                <input
                                                    type="checkbox"
                                                    id='allow_leave_count'
                                                    checked={data.allow_leave_count == 0 ? false : true}
                                                    onChange={(e) => this.handleCheckChange(e)}
                                                />
                                            </div>
                                        </div>
                                    </div>
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

export default LeaveCategoryEdit