import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";


import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";


const OtherInfo = props => {
    const { editForm, viewForm, handleOtherInfo, onCancelClick, trainingCode, partTimeCode, customerCode, ThaPaYaAccount, SSCCardNo, handleOtherInfoInputChange } = props

    return (
        <form onSubmit={handleOtherInfo} >
            <div className='white-bg ' style={{
                paddingTop: 50, border: '1px solid lightgrey', display: 'grid', borderTop: 'none', marginTop: -10, paddingLeft: window.innerWidth < 1000 ? 0 : 50, paddingBottom: 30,
                boxShadow: '5px 5px 5px lightgrey'
            }}>

                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>
                    <div>
                        Training Code
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='text' placeholder='' name="trainingCode" value={trainingCode} onChange={handleOtherInfoInputChange} style={{ width: '100%', height: 40, }} />
                    </div>

                </div>
                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>


                    <div>
                        Part-Time Code
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='text' placeholder='' name="partTimeCode" value={partTimeCode} onChange={handleOtherInfoInputChange} style={{ width: '100%', height: 40, }} />
                    </div>

                </div>


                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>


                    <div>
                        Customer Code (CBS)
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='number' placeholder='' name="customerCode" value={customerCode} onChange={handleOtherInfoInputChange} style={{ width: '100%', height: 40, }} />

                    </div>

                </div>
                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>


                    <div>
                        Thapaya Account
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='number' placeholder='' name="ThaPaYaAccount" value={ThaPaYaAccount} onChange={handleOtherInfoInputChange} style={{ width: '100%', height: 40, }} />

                    </div>

                </div>

                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>


                    <div>
                        SSC Card NO
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='number' placeholder='' name="SSCCardNo" value={SSCCardNo} onChange={handleOtherInfoInputChange} style={{ width: '100%', height: 40, }} />

                    </div>

                </div>

            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                <button className='' onClick={onCancelClick} style={{ borderRadius: 5, padding: 10, margin: 10, background: 'red', color: 'white', border: 'none', width: 90 }}>
                    Cancel
                </button>

                <button type="submit" style={{ borderRadius: 5, padding: 10, margin: 10, background: '#337ab7', color: 'white', border: 'none', width: 90 }}>
                    Next
                </button>


            </div>
        </form>

    )
}

export default OtherInfo


// required={(viewForm || editForm) ? false : true}