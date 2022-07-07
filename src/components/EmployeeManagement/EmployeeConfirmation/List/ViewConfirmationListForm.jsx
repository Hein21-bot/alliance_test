import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';


import Select from "react-select";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from "moment";

const ViewConfirmationListForm = props => {
    const { handleSubmit, handleEditCheckInputChange, fullname, extensionPeriod, comment, effectiveDate, employment_id, designations, department, level, letterWarning, score, achievement, warningDate, recommendation, date } = props

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ padding: 10, justifyContent: 'center', boxShadow: '5px 5px 5px lightgrey' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h3 style={{ fontWeight: 'bold' }}>Confirmation Assessment Form</h3>
                </div>
                <div className='w-100' style={{ display: 'flex', justifyContent: 'center', padding: 10, paddingTop:20 }}>
                    <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        <div className='col-lg-4 col-md-4 col-sm-4'>
                            Employee Name
                        </div>
                        <div className='col-lg-2-col-md-2 col-sm-2'>
                            :
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            {fullname}
                        </div>
                    </div>
                </div>
                <div className='w-100' style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
                    <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
                        <div className='col-lg-4 col-md-4 col-sm-4'>
                            Employee ID
                        </div>
                        <div className='col-lg-2-col-md-2 col-sm-2'>
                            :
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            {employment_id}
                        </div>
                    </div>
                </div>
                {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h3 style={{ fontWeight : 'bold' }}>Confirmation Assessment Form</h3>
                </div>
                <div className='w-100' style={{ display: 'flex', justifyContent: 'center', padding: 10, paddingTop:20 }}>
                    <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        <div className='col-lg-4 col-md-4 col-sm-4'>
                            Employee Name
                        </div>
                        <div className='col-lg-2-col-md-2 col-sm-2'>
                            :
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            {fullname}
                        </div>
                    </div>
                </div>

                <div className='w-100' style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
                    <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
                        <div className='col-lg-4 col-md-4 col-sm-4'>
                            Employee ID
                        </div>
                        <div className='col-lg-2-col-md-2 col-sm-2'>
                            :
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            {employment_id}
                        </div>
                    </div>
                </div>
                <div className='w-100' style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
                    <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
                        <div className='col-lg-4 col-md-4 col-sm-4'>
                            Designation
                        </div>
                        <div className='col-lg-2-col-md-2 col-sm-2'>
                            :
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            {designations}
                        </div>
                    </div>
                </div>
                <div className='w-100' style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
                    <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
                        <div className='col-lg-4 col-md-4 col-sm-4'>
                            Department
                        </div>
                        <div className='col-lg-2-col-md-2 col-sm-2'>
                            :
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            {department}
                        </div>
                    </div>
                </div>
                <div className='w-100' style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
                    <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
                        <div className='col-lg-4 col-md-4 col-sm-4'>
                            Level
                        </div>
                        <div className='col-lg-2-col-md-2 col-sm-2'>
                            :
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            {level}
                        </div>
                    </div>
                </div>
                <div className='w-100' style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
                    <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            Date
                        </div>

                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            <input type='date' placeholder='' required name="date" value={date} onChange={handleEditCheckInputChange} style={{ height: 40, width: 160, boxShadow: '0px 1px 1px 0px lightgrey' }} />

                        </div>
                    </div>
                </div>
                <div className='w-100' style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
                    <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            Performance Score
                        </div>

                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            <input type='number' placeholder='' required name="score" value={score} onChange={handleEditCheckInputChange} style={{ height: 40, boxShadow: '0px 1px 1px 0px lightgrey' }} />

                        </div>
                    </div>
                </div>
                <div className='w-100' style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
                    <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            Target Achievement
                        </div>

                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            <input type='number' placeholder='' required name="achievement" value={achievement} onChange={handleEditCheckInputChange} style={{ height: 40, boxShadow: '0px 1px 1px 0px lightgrey' }} />

                        </div>
                    </div>
                </div>
                <div className='w-100' style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
                    <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            Letter Warning
                        </div>

                        <div className='col-lg-6 col-md-6 col-sm-6' style={{ alignItems: 'center', display: 'flex' }}>
                            <input type='radio' placeholder='' required value="letterWarning" checked={letterWarning} onChange={handleEditCheckInputChange} style={{ height: 40, marginRight: 10 }} />
                            Yes
                        </div>
                    </div>
                </div>
                <div className='w-100' style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
                    <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            Letter Warning Date
                        </div>

                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            <input type='date' placeholder='' required name="letterWarningDate" value={warningDate} onChange={handleEditCheckInputChange} style={{ height: 40, width: 160, boxShadow: '0px 1px 1px 0px lightgrey' }} />

                        </div>
                    </div>
                </div>
                <div className='w-100' style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
                    <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            Recommendation
                        </div>

                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            <div style={{ alignItems: 'center', display: 'flex', paddingTop: 10 }}>
                                <input type='radio' placeholder='' required value="Confirmation" checked={recommendation === "Confirmation"} onChange={handleEditCheckInputChange} style={{ height: 40, marginRight: 10 }} />
                                Confirmation
                            </div>
                            <div style={{ alignItems: 'center', display: 'flex', paddingTop: 10 }}>
                                <input type='radio' placeholder='' required value="Extensions" checked={recommendation === "Extensions"} onChange={handleEditCheckInputChange} style={{ height: 40, marginRight: 10 }} />
                                Extensions
                            </div>
                            <div style={{ alignItems: 'center', display: 'flex', paddingTop: 10 }}>
                                <input type='radio' placeholder='' required value="Terminations" checked={recommendation === "Terminations"} onChange={handleEditCheckInputChange} style={{ height: 40, marginRight: 10 }} />
                                Terminations
                            </div>

                        </div>
                    </div>
                </div>
                <div className='w-100' style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
                    <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            Extension Period
                        </div>

                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            <input type='text' placeholder='' required name="extensionPeriod" value={extensionPeriod} onChange={handleEditCheckInputChange} style={{ height: 40, boxShadow: '0px 1px 1px 0px lightgrey' }} />

                        </div>
                    </div>
                </div>
                <div className='w-100' style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
                    <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            Comment on Overall Performance
                        </div>

                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            <input type='text' placeholder='' required name="comment" value={comment} onChange={handleEditCheckInputChange} style={{ height: 40, boxShadow: '0px 1px 1px 0px lightgrey' }} />

                        </div>
                    </div>
                </div>
                <div className='w-100' style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
                    <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            Confirmation Effective Date
                        </div>

                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            <input type='text' placeholder='' required name="effectiveDate" value={effectiveDate} onChange={handleEditCheckInputChange} style={{ height: 40, boxShadow: '0px 1px 1px 0px lightgrey' }} />

                        </div>
                    </div>
                </div>
                <div className='w-100 mx-2' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <button type='submit' className='btn btn-primary' style={{ borderRadius: 10, width: 120 }}>Submit</button>

                </div>
               */}
            </div>
        </form>

    )
}

export default ViewConfirmationListForm