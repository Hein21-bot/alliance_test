import React, { Component } from 'react'
import Select from 'react-select'
import { main_url, validate, stopSaving, startSaving, alertText } from '../../../utils/CommonFunction';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import DatePicker from 'react-datetime';

var form_validate = true;

class TaxReliefEdit extends Component {
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
    handleSelectorChange = (val, key) => {
        const { allowance_reason_option } = this.props;
        const value = allowance_reason_option.find(v => v.value == Number(val.value)).value;
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

    handleChangeDate = (e) => {
        const obj = { ...this.state.data };
        obj['date'] = e;
        this.setState({
            data: obj
        })
    }

    handleSave = () => {

        // stopSaving();
        if (validate('check_form')) {
            const { data } = this.state;
            let status = 0;
            fetch(`${main_url}taxRelief/editTaxRelief/${data.tax_allowance_id}`, {
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
        const { allowance_reason_option } = this.props
        const { data } = this.state;
        const selectedAllowanceReason = allowance_reason_option.find(v => v.value == Number(data.allowance_reason_id));
        return (
            <div className="container">
                <div className='row'>
                    <form id="check_form">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="date" className="col-sm-12">Date</label></div>
                                <div className="col-sm-10">
                                    <DatePicker
                                        className="checkValidate"
                                        id='date'
                                        timeFormat={false}
                                        value={moment(data.date).format('DD-MM-YYYY')}
                                        onChange={this.handleChangeDate}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="allowance_reason_id" className="col-sm-12">Allowance Reason</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose Level"
                                        options={allowance_reason_option}
                                        onChange={(val) => this.handleSelectorChange(val, 'allowance_reason_id')}
                                        value={selectedAllowanceReason}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select" />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="allowance_percent" className="col-sm-12">Allowance Percent</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='allowance_percent'
                                        className="form-control checkValidate"
                                        value={data.allowance_percent}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="allowance_amount" className="col-sm-12">Allowance Amount</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='allowance_amount'
                                        className="form-control checkValidate"
                                        value={data.allowance_amount}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
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

export default TaxReliefEdit