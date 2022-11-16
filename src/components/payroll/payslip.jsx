import React, { Component } from 'react';

class PaySlip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pathname: window.location.pathname
        }
    }

    render() {
       
        return (
           <div className='' style={{background:'white'}}>
<div className='' style={{display:'flex',justifyContent:'center'}}><h2>Pay Slip</h2></div>
<div className='' style={{display:'flex',justifyContent:'center',background:'#1872ab'}}><h3 style={{color:'#000000',fontWeight:'bold'}}>Staff Information</h3></div>
<div className='row'>   
    <div className='col-lg-6'style={{paddingLeft:'30px',paddingTop:'10px'}}>
<p>Staff ID</p>
<p>Name</p>
<p>Department</p>
<p>Designation</p>
<p>Branch</p>
<p>Payment Month</p>
    </div>
    <div className='col-lg-1'style={{paddingLeft:'0px',paddingTop:'10px'}} >
    <p>:</p>
    <p>:</p>
    <p>:</p>
    <p>:</p>
    <p>:</p>
    <p>:</p>
    </div>
    <div className=' col-lg-5'style={{paddingLeft:'90px',paddingTop:'10px'}}>
<p>Staff ID</p>
<p>Name</p>
<p>Department</p>
<p>Designation</p>
<p>Branch</p>
<p>Payment Month</p>
    </div>
    </div>
    <div className='' style={{display:'flex',justifyContent:'center',background:'#1872ab'}}><h3 style={{color:'#000000',fontWeight:'bold'}}>Payroll Information</h3></div>
    <div className='row'>   
    <div className='col-lg-6'style={{paddingLeft:'30px',paddingTop:'10px'}}>
<p>Basic Salary</p>
<p>SSC</p>
<p>Income Tax</p>
<p>Petrol</p>
<p>Maintenance</p>
<p>Staff Loan</p>
<p>Other Deduction</p>
<p>Net Salary</p>
    </div>
    <div className='col-lg-1'style={{paddingLeft:'0px',paddingTop:'10px'}} >
    <p>:</p>
    <p>:</p>
    <p>:</p>
    <p>:</p>
    <p>:</p>
    <p>:</p>
    <p>:</p>
    <p>:</p>
    </div>
    <div className=' col-lg-5'style={{paddingLeft:'90px',paddingTop:'10px'}}>
<p>Staff ID</p>
<p>Name</p>
<p>Department</p>
<p>Designation</p>
<p>Branch</p>
<p>Payment Month</p>
<p>Branch</p>
<p>Payment Month</p>
    </div>
    </div>
<div style={{paddingLeft:'30px',paddingBottom:'10px'}}><h3>Remark : </h3></div>
           </div>
        )
    }
}




    export default PaySlip;