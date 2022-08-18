import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";
import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";
import MonthYearPicker from './MonthYearPicker';
import moment from 'moment';
import DatePicker from 'react-datetime';

const EducationDetails = props => {
    const { viewForm, editForm } = props
    const { handleSelectedDegree, handleEducationDetails, workExpData, handlePreviousClick, handleAddWorkExp, handleFromMonthYear, handleToMonthYear, fromMonthYear, toMonthYear, handleAddDegreeData, handleAddQualification, addedDegreeData, addedQualitificationData, onCancelClick, location, degreeList, selected_degree, selected_qualification, designation, organization, handleEduactionInputChange, period, handleWorkExpChange, checked, handleUpdateDegreeData, handleUpdateQualification, handleUpdateWorkExp, handleRemoveQualification, handleRemoveDegreeData, handleRemoveWorkExp } = props


    return (
        <>
            <div className='white-bg ' style={{
                paddingTop: 30, border: '1px solid lightgrey', display: 'grid', borderTop: 'none', marginTop: -10, paddingLeft: window.innerWidth < 1200 ? 0 : 50, paddingBottom: 20,
                boxShadow: '5px 5px 5px lightgrey',
            }}>
                <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{}}>
                        Degree
                    </div>
                    <div className='col-lg-8 col-md-8 col-sm-12' style={{ display: 'flex', alignItems: 'center' }}>
                        <div className='col-lg-8 col-md-8 col-sm-8'>
                            <Select
                                options={degreeList}
                                value={selected_degree}
                                onChange={handleSelectedDegree}
                                className="react-select-container checkValidate"
                                classNamePrefix="react-select"
                            />

                        </div>

                        <button onClick={handleAddDegreeData} style={{ borderRadius: 5, padding: 10, margin: 10, color: 'white', border: 'none', width: 90, border: '1px solid lightgrey', background: "#337ab7" }}>
                            Add
                        </button>

                    </div>

                </div>
                <div className='col-lg-6 col-md-10 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{}}>
                        Qualification
                    </div>
                    <div className='col-lg-8 col-md-8 col-sm-12' style={{ display: 'flex', alignItems: 'center' }}>
                        <div className='col-lg-8 col-md-8 col-sm-8'>
                            {/* <Select
                                options={qualificationList}
                                value={selected_qualification}
                                onChange={handleSelectedQualification}
                                className="react-select-container checkValidate"
                                classNamePrefix="react-select"
                            /> */}
                            <input type='text' placeholder='' required={(viewForm || editForm) ? false : true} name="qualification" value={selected_qualification} onChange={handleEduactionInputChange} style={{ height: 40, width: '100%' }} />

                        </div>

                        <div onClick={handleAddQualification} type="submit" style={{ borderRadius: 5, padding: 10, margin: 10, color: 'white', background: 'lightgrey', textAlign: 'center', border: 'none', width: 90, border: '1px solid lightgrey', background: "#337ab7" }}>
                            Add
                        </div>

                    </div>

                </div>

                <div className='col-lg-10 col-md-12 col-sm-12' style={{ display: 'flex', flexWrap: 'nowrap', background: addedDegreeData ? 'lightgrey' : 'none', padding: 0, marginTop: 10 }}>
                    {
                        addedDegreeData && addedDegreeData.length > 0 ?
                            <div className='col-lg-3 col-md-4 col-sm-6' style={{ color: 'blue', fontWeight: 'bold', }}>
                                <div style={{ padding: 10 }}>
                                    Degree
                                </div>

                                {
                                    addedDegreeData && addedDegreeData.map((v, k) => {
                                        return (
                                            <div key={k} style={{ display: 'flex', alignItems: 'center' }}>
                                                <div key={v.id} style={{ color: ' black', padding: 10 }}>
                                                    {v.degree || v.name}
                                                </div>
                                                {viewForm ? null : <button style={{ borderRadius: 5, color: 'gray', border: 'none', border: '1px solid lightgrey' }} onClick={() => handleRemoveDegreeData(k)}>
                                                    <i class="fa-solid fa-xmark">Remove</i>
                                                </button>}
                                                {/* <button style={{ borderRadius: 5, color: 'gray', border: 'none', border: '1px solid lightgrey' }} onClick={() => handleUpdateDegreeData(v, k)}>
                                                    Edit
                                                </button> */}
                                            </div>
                                        )
                                    })
                                }

                            </div>
                            : null
                    }
                    {
                        addedQualitificationData && addedQualitificationData.length > 0 ?
                            <div className='col-lg-3 col-md-4 col-sm-6' style={{ color: 'blue', fontWeight: 'bold', }}>
                                <div style={{ padding: 10 }}>
                                    Qualitification
                                </div>

                                {
                                    addedQualitificationData && addedQualitificationData.map((v, k) => {
                                        return (
                                            <div key={k} style={{ display: 'flex', alignItems: 'center' }}>
                                                <div key={k} style={{ color: ' black', padding: 10 }}>
                                                    {viewForm || editForm ? v.name : v.qualification}
                                                </div>
                                                {viewForm ? null : <button style={{ borderRadius: 5, color: 'gray', border: 'none', border: '1px solid lightgrey' }} onClick={() => handleRemoveQualification(k)}>
                                                    <i class="fa-solid fa-xmark">Remove</i>
                                                </button>}
                                                {/* <button style={{ borderRadius: 5, color: 'gray', border: 'none', border: '1px solid lightgrey' }} onClick={() => handleUpdateQualification(v, k)}>
                                                    Edit
                                                </button> */}
                                            </div>
                                        )
                                    })
                                }

                            </div>
                            : null
                    }

                </div>
                <div style={{ paddingLeft: 20, alignItems: 'center', marginTop: 30 }}>
                    <input type='checkbox' checked={checked} onChange={handleWorkExpChange} style={{ marginRight: 10 }} />
                    Working Experience
                </div>
                {
                    (checked || (viewForm || editForm)) ?
                        <div style={{ flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>


                                <div className='col-lg-3 col-md-3 col-sm-6' style={{ fontWeight: 'bold', paddingBottom: 10, margin: 10 }}>
                                    {/* <MonthYearPicker label="From Month/Year" value={fromMonthYear} onChange={handleFromMonthYear} /> */}
                                    <h5 className=''>From Month Year</h5>
                                    <DatePicker
                                        dateFormat="MM/YYYY"
                                        value={fromMonthYear}
                                        onChange={handleFromMonthYear}

                                    />
                                </div>
                                <div className='col-lg-3 col-md-3 col-sm-6' style={{ fontWeight: 'bold', paddingBottom: 10, margin: 10 }}>
                                    {/* <MonthYearPicker label="To Month/Year" value={toMonthYear} onChange={handleToMonthYear} /> */}
                                    <h5>To Month Year</h5>
                                    <DatePicker
                                        dateFormat="MM/YYYY"
                                        value={toMonthYear}
                                        onChange={handleToMonthYear} />
                                </div>

                            </div>
                            <form onSubmit={handleAddWorkExp}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <div className='col-lg-2 col-md-3 col-sm-4' style={{ fontWeight: 'bold', paddingBottom: 10, marginLeft: 10, display: 'grid', alignItems: 'center' }}>
                                        Period
                                        <input type='text' placeholder='' required={(checked || editForm) ? true : false} name="period" value={period} onChange={handleEduactionInputChange} style={{ height: 40, }} disabled />

                                    </div>
                                    <div className='col-lg-2 col-md-3 col-sm-4' style={{ fontWeight: 'bold', paddingBottom: 10, marginLeft: 10, display: 'grid', alignItems: 'center' }}>
                                        Designation
                                        <input type='text' placeholder='' required={(checked || editForm) ? true : false} name="designation" value={designation} onChange={handleEduactionInputChange} style={{ height: 40, }} />

                                    </div>
                                    <div className='col-lg-2 col-md-3 col-sm-4' style={{ fontWeight: 'bold', paddingBottom: 10, marginLeft: 10, display: 'grid', alignItems: 'center' }}>
                                        Organization
                                        <input type='text' placeholder='' required={(checked || editForm) ? true : false} name="organization" value={organization} onChange={handleEduactionInputChange} style={{ height: 40, }} />

                                    </div>
                                    <div className='col-lg-2 col-md-3 col-sm-4' style={{ fontWeight: 'bold', paddingBottom: 10, marginLeft: 10, display: 'grid', alignItems: 'center' }}>
                                        Location
                                        <input type='text' placeholder='' required={(checked || editForm) ? true : false} name="location" value={location} onChange={handleEduactionInputChange} style={{ height: 40, }} />

                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 20, }}>
                                        <button type="submit" style={{ borderRadius: 5, padding: 10, marginTop: 12, marginLeft: 10, color: 'black', border: 'none', width: 90, border: '1px solid lightgrey' }}>
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </form>

                        </div> : null
                }{
                    ((checked || (viewForm || editForm)) && workExpData.length > 0) ?
                        <>
                            <div className='col-lg-12 col-md-12 col-sm-12' style={{ display: 'flex', flexWrap: 'nowrap', padding: 0, marginTop: 10 }}>
                                <div className='col-lg-2 col-md-2 col-sm-2' style={{ color: 'blue', fontWeight: 'bold', }}>
                                    From Month/Year
                                </div>
                                <div className='col-lg-2 col-md-2 col-sm-2' style={{ color: 'blue', fontWeight: 'bold', }}>
                                    To Month/Year
                                </div>
                                <div className='col-lg-2 col-md-2 col-sm-2' style={{ color: 'blue', fontWeight: 'bold', }}>
                                    Period
                                </div>
                                <div className='col-lg-2 col-md-3 col-sm-2' style={{ color: 'blue', fontWeight: 'bold' }}>
                                    Designation
                                </div>
                                <div className='col-lg-2 col-md-3 col-sm-2' style={{ color: 'blue', fontWeight: 'bold' }}>
                                    Organization
                                </div>
                                <div className='col-lg-2 col-md-3 col-sm-2' style={{ color: 'blue', fontWeight: 'bold' }}>
                                    Location
                                </div>
                                {viewForm ? null : <div className='col-lg-2 col-md-3 col-sm-2' style={{ color: 'blue', fontWeight: 'bold' }}>
                                    Remove
                                </div>}

                            </div>
                            {
                                workExpData.length > 0 && workExpData.map((v, k) => {

                                    return (
                                        <div className='col-lg-12 col-md-12 col-sm-12' style={{ display: 'flex', flexWrap: 'nowrap', padding: 0, marginTop: 10 }}>

                                            <div className='col-lg-2 col-md-2 col-sm-2' style={{}}>
                                                {moment.utc(new Date(v.from_year)).format('YYYY-MM')}
                                            </div>
                                            <div className='col-lg-2 col-md-2 col-sm-2' style={{}}>
                                                {moment.utc(new Date(v.to_year)).format('YYYY-MM')}
                                            </div>
                                            <div className='col-lg-2 col-md-2 col-sm-2' style={{}}>
                                                {v.period}
                                            </div>
                                            <div className='col-lg-2 col-md-3 col-sm-2' style={{}}>
                                                {v.designation}
                                            </div>
                                            <div className='col-lg-2 col-md-3 col-sm-2' style={{}}>
                                                {v.organization}
                                            </div>
                                            <div className='col-lg-2 col-md-3 col-sm-2' style={{}}>
                                                {v.location}
                                            </div>
                                            {viewForm ? null : <div className='col-lg-2 col-md-3 col-sm-2' style={{}}>
                                                <button style={{ borderRadius: 5, color: 'gray', border: 'none', border: '1px solid lightgrey' }} onClick={() => handleRemoveWorkExp(k)}>
                                                    Remove
                                                </button>
                                            </div>}

                                        </div>)
                                })
                            }

                        </>
                        : null
                }

            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className='' onClick={handlePreviousClick} style={{ borderRadius: 5, padding: 10, margin: 10, background: '#337ab7', color: 'white', border: 'none', width: 90, textAlign: 'center', cursor: 'pointer' }}>
                    Previous
                </div>

                {
                    (((addedDegreeData && addedDegreeData.length > 0) || (addedQualitificationData && addedQualitificationData.length > 0) || (workExpData && workExpData.length > 0)) && !viewForm && !editForm) ?
                        <div onClick={handleEducationDetails} style={{ borderRadius: 5, display: 'flex', alignItems: 'center', margin: 10, cursor: 'pointer', background: '#337ab7', color: 'white', border: 'none', width: 90, textAlign: 'center', justifyContent: 'center' }}>
                            Next
                        </div> :
                        ((viewForm || editForm)) ?
                            <div onClick={handleEducationDetails} style={{ borderRadius: 5, display: 'flex', alignItems: 'center', margin: 10, cursor: 'pointer', background: '#337ab7', color: 'white', border: 'none', width: 90, textAlign: 'center', justifyContent: 'center' }}>
                                Next
                            </div> :
                            ((addedDegreeData.length > 0 || addedQualitificationData.length > 0 || workExpData.length > 0)) ?
                                <button onClick={handleEducationDetails} style={{ borderRadius: 5, padding: 10, margin: 10, background: '#337ab7', color: 'white', border: 'none', width: 90 }}>
                                    Next
                                </button>
                                :
                                <div onClick={() => alert("Please Add Education Data first!")} style={{ borderRadius: 5, display: 'flex', alignItems: 'center', margin: 10, cursor: 'pointer', background: '#337ab7', color: 'white', border: 'none', width: 90, textAlign: 'center', justifyContent: 'center' }}>
                                    Next
                                </div>

                }


            </div>
        </>

    )
}

export default EducationDetails
