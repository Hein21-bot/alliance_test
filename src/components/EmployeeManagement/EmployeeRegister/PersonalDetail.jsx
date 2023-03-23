import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";


import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";


const PersonalDetail = props => {
    const { viewForm, editForm } = props
    const { fatherName, handlePersonalDetailInputChange, handlePreviousClick, handlePersonalDetail, onStatusChange, martialStatus, motherName, parentCount, siblingCount, childCount, pInLawCount } = props

    console.log('martialStatus ias =====>', martialStatus)
    let update_martialStatus = martialStatus == 'Single' ? 'UnMarried' : martialStatus

    return (
        <form onSubmit={handlePersonalDetail} >
            <div className='white-bg ' style={{
                paddingTop: 50, border: '1px solid lightgrey', display: 'grid', borderTop: 'none', marginTop: -10, paddingLeft: window.innerWidth < 1000 ? 0 : 50, paddingBottom: 20,
                boxShadow: '5px 5px 5px lightgrey'
            }}>
                {/* <div className='col-lg-6  col-md-12 col-sm-12'> */}
                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                    <div>
                        Matial Status*
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{ display: 'flex', justifyContent: 'space-around', }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: 20 }}>
                            <input type="radio" name="martialStatus" value="UnMarried" required={(viewForm || editForm) ? false : true} checked={update_martialStatus == "UnMarried"} onChange={onStatusChange} /><div style={{ paddingLeft: 10, whiteSpace: 'nowrap' }}>Un-Married</div>

                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input type="radio" name="martialStatus" value="Married" required={(viewForm || editForm) ? false : true} checked={update_martialStatus == "Married"} onChange={onStatusChange} /><div style={{ paddingLeft: 10, whiteSpace: 'nowrap' }}>Married</div>

                        </div>
                    </div>
                </div>


                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>


                    <div>
                        Father Name*
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='text' placeholder='' required={(viewForm || editForm) ? false : true} name="fatherName" value={fatherName} onChange={handlePersonalDetailInputChange} style={{ width: '100%', height: 40, }} />
                    </div>

                </div>
                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>


                    <div>
                        Mother Name*
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='text' placeholder='' required={(viewForm || editForm) ? false : true} name="motherName" value={motherName} onChange={handlePersonalDetailInputChange} style={{ width: '100%', height: 40, }} />

                    </div>

                </div>
                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>


                    <div>
                        Parent Count*
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='number' placeholder='' required={(viewForm || editForm) ? false : true} name="parentCount" value={parentCount} onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} onChange={handlePersonalDetailInputChange} style={{ width: '100%', height: 40, }} />

                    </div>

                </div>

                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>


                    <div>
                        Sibling Count*
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='number' placeholder='' required={(viewForm || editForm) ? false : true} name="siblingCount" value={siblingCount} onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} onChange={handlePersonalDetailInputChange} style={{ width: '100%', height: 40, }} />

                    </div>

                </div>
                {martialStatus == 'UnMarried' ? '' : <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>


                    <div>
                        Child Count*
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='number' placeholder='' required={(viewForm || editForm) ? false : true} name="childCount" value={childCount} onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} onChange={handlePersonalDetailInputChange} style={{ width: '100%', height: 40, }} />

                    </div>

                </div>}
                {martialStatus == 'UnMarried' ? '' : <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>


                    <div>
                        Parent In Law Count*
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='number' placeholder='' required={(viewForm || editForm) ? false : true} name="pInLawCount" value={pInLawCount} onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} onChange={handlePersonalDetailInputChange} style={{ width: '100%', height: 40, }} />

                    </div>

                </div>}

            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                <div className='' onClick={handlePreviousClick} style={{ borderRadius: 5, padding: 10, margin: 10, background: '#337ab7', color: 'white', border: 'none', width: 90, textAlign: 'center', cursor: 'pointer' }}>
                    Previous
                </div>
                <button type="submit" style={{ borderRadius: 5, padding: 10, margin: 10, background: '#337ab7', color: 'white', border: 'none', width: 90 }}>
                    Next
                </button>
            </div>
        </form>

    )
}

export default PersonalDetail
