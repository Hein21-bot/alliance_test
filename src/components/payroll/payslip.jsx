import React, { Component } from 'react';
import { main_url, getUserId, } from "../../utils/CommonFunction";
import moment from 'moment';

import { toast, ToastContainer } from "react-toastify";
import DatePicker from 'react-datetime';

class PaySlip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pathname: window.location.pathname,
            user_id: getUserId("user_info"),
            data: [],
            month: moment(new Date()).format('YYYY-MM')
            // month: '2022-08'
        }
    }

    componentDidMount() {
        // this.getPaySlipData(this.state.month)
    }

    getPaySlipData(month) {
        fetch(`${main_url}payroll/getSalaryTemplate/${this.state.user_id}/${month}`)
            .then((response) => {
                if (response.ok) return response.json();
            })
            .then((res) => {
                if (res) {
                    this.setState({ data: res });
                }
                else{
                    toast.error(moment(this.state.month).format('YYYY-MM')+" payroll is not calculate", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                      });
                        }
            })
            .catch((error) => console.error(`Fetch Error =\n`, error));
    }

    handleChangeDate = (event) => {
        this.setState({
            month: moment(event).format('YYYY-MM')
        })
    }

    search() {
        this.getPaySlipData(this.state.month)
    }

    render() {
        return (
            <div>
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
            <div style={{ display: 'flex', paddingTop: 10 }}>
            <div className="col-sm-2">
                <DatePicker
                    className="checkValidate"
                    dateFormat="YYYY-MM"
                    timeFormat={false}
                    value={this.state.month}
                    onChange={this.handleChangeDate}
                />
            </div>
            <div className="col-sm-1">
                <div className='f-right'>
                    <button className="btn btn-primary" type="button" onClick={() => this.search()}>Search</button>
                </div>
            </div>
        </div>
        { (this.state.data.length !== 0 ?
        <div style={{display:'flex',justifyContent:'center',marginTop:40}}>
            <div className='col-lg-10 col-md-10 col-sm-12' style={{ background: 'white' }}>
                {/* <div style={{ display: 'flex', paddingTop: 10 }}>
                    <div className="col-sm-2" >
                        <DatePicker
                            className="checkValidate"
                            dateFormat="YYYY-MM"
                            timeFormat={false}
                            value={this.state.month}
                            onChange={this.handleChangeDate}
                        />
                    </div>
                    <div className="col-sm-1">
                        <div className='f-right'>
                            <button className="btn btn-primary" type="button" onClick={() => this.search()}>Search</button>
                        </div>
                    </div>
                </div> */}
                <div className='' style={{ display: 'flex', justifyContent: 'center' }}><h2>Pay Slip</h2></div>
                <div className='' style={{ display: 'flex', justifyContent: 'center', background: '#1872ab', marginTop: 10 }}><h3 style={{ color: '#ffffff', fontWeight: 'bold' }}>Staff Information</h3></div>
                <div className='row'>
                    <div className='col-lg-6' style={{ paddingLeft: '30px', paddingTop: '10px' }}>
                        <p>Staff ID</p>
                        <p>Name</p>
                        <p>Department</p>
                        <p>Designation</p>
                        <p>Branch</p>
                        <p>Payment Month</p>
                    </div>
                    <div className='col-lg-1' style={{ paddingLeft: '0px', paddingTop: '10px' }} >
                        <p>:</p>
                        <p>:</p>
                        <p>:</p>
                        <p>:</p>
                        <p>:</p>
                        <p>:</p>
                    </div>
                    <div className=' col-lg-5' style={{ paddingLeft: '90px', paddingTop: '10px' }}>
                        <p>{this.state.data.length > 0 && this.state.data[0].employment_id}</p>
                        <p>{this.state.data.length > 0 && this.state.data[0].fullname}</p>
                        <p>{this.state.data.length > 0 && this.state.data[0].deptname}</p>
                        <p>{this.state.data.length > 0 && this.state.data[0].designations}</p>
                        <p>{this.state.data.length > 0 && this.state.data[0].branch_name}</p>
                        <p>{this.state.data.length > 0 && this.state.data[0].payment_month}</p>
                    </div>
                </div>
                <div className='' style={{ display: 'flex', justifyContent: 'center', background: '#1872ab' }}><h3 style={{ color: '#ffffff', fontWeight: 'bold' }}>Payroll Information</h3></div>
                <div className='row'>
                    <div className='col-lg-6' style={{ paddingLeft: '30px', paddingTop: '10px' }}>
                        <p>Basic Salary</p>
                        {this.state.data.length > 0 && this.state.data[0].deduction_detail.map(v =>
                            <p>{v.salary_payment_deduction_label}</p>
                        )}
                        {this.state.data.length > 0 && this.state.data[0].allowance_detail.map(v =>
                            <p>{v.salary_payment_allowance_label}</p>
                        )}
                        <p>Net Salary</p>
                    </div>
                    <div className='col-lg-1' style={{ paddingLeft: '0px', paddingTop: '10px' }} >
                        {this.state.data.length > 0 && this.state.data[0].deduction_detail.map(v =>
                            <p>:</p>
                        )}
                        {this.state.data.length > 0 && this.state.data[0].allowance_detail.map(v =>
                            <p>:</p>
                        )}
                        <p>:</p>
                        <p>:</p>
                    </div>
                    <div className=' col-lg-5' style={{ paddingLeft: '90px', paddingTop: '10px' }}>
                        <p>{this.state.data.length > 0 && this.state.data[0].payment_detail[0].basic_salary}</p>
                        {this.state.data.length > 0 && this.state.data[0].deduction_detail.map(v =>
                            <p>{v.salary_payment_deduction_value}</p>
                        )}
                        {this.state.data.length > 0 && this.state.data[0].allowance_detail.map(v =>
                            <p>{v.salary_payment_allowance_value}</p>
                        )}
                        <p>{this.state.data.length > 0 && this.state.data[0].payment_amount}</p>
                    </div>
                    <div style={{ paddingLeft: '30px', paddingBottom: '10px' }}><h3>Remark : {this.state.data.length > 0 && this.state.data[0].remark ? this.state.data[0].remark :'-'}</h3></div>
                </div>

            </div></div> : "" )}
            </div>
        )
    }
}




export default PaySlip;