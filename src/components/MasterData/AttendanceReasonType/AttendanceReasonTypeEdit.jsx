import React, { Component } from 'react'
import Select from 'react-select'
import { main_url } from '../../../utils/CommonFunction';

class AttendanceReasonTypeEdit extends Component {
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
        const { attendance_type_option } = this.props;
        const value = (attendance_type_option.find(v => v.value == val.value)).value

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
        const { data } = this.state;
        let status = 0;
        fetch(`${main_url}attendanceReason/editAttendanceReason/${data.id}`, {
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
    }
    render() {
        console.log("data is ====>", this.state.data)
        const { attendance_type_option } = this.props;
        const { data } = this.state;
        const selectedAttendanceType = attendance_type_option.find(v => Number(v.value) === Number(data.attendance_type_id));
        return (
            <div className="container">
                <div className='row'>
                    <form id="check_form">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="reason" className="col-sm-12">Reason</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='reason'
                                        className="form-control"
                                        value={data.reason}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="attendance_type" className="col-sm-12">Attendance Type</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose Level"
                                        options={attendance_type_option}
                                        onChange={(val) => this.handleSelectorChange(val, 'attendance_type_id')}
                                        value={selectedAttendanceType}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select" />
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
                                            value={data.remark}
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
                                                    checked={data.active == 0 ? false : true}
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

export default AttendanceReasonTypeEdit