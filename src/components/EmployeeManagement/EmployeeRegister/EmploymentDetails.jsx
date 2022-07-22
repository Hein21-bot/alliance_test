import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";


import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";


const EmploymentDetails = props => {
    const { designationList, branchlist, employeeStatusList, handleSelectedEmpStatus, disConstatusList, viewForm, editForm, level_options, handleLevelSelectorChange, handleEmploymentDetailInputChange, handleSelectedDisConStus, handleEmploymentDetail, onCancelClick, handleSelectedDesignation, employeeStatus, employeeDesignation, jobTitle, carrerLevel, employeeDetailBranch, employedDate, disConStatus, disConDate, handleSelectedBranch, createNewEmployee } = props
    console.log("discontinute status is ===>", employeeStatus, employeeStatusList)
    return (
        <form onSubmit={handleEmploymentDetail} >
            <div className='white-bg ' style={{
                paddingTop: 20, border: '1px solid lightgrey', display: 'grid', borderTop: 'none', marginTop: -10, paddingLeft: window.innerWidth < 1000 ? 0 : 50, paddingBottom: 20,
                boxShadow: '5px 5px 5px lightgrey'
            }}>

                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>

                    <div>
                        Employee Status
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <Select
                            options={employeeStatusList}
                            isDisabled={true}
                            value={employeeStatus}
                            onChange={handleSelectedEmpStatus}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                        />
                    </div>

                </div>
                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>

                    <div>
                        Designation
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <Select
                            options={designationList}
                            isDisabled={true}
                            value={employeeDesignation}
                            onChange={handleSelectedDesignation}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                        />
                    </div>

                </div>

                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>
                    <div>
                        Job Title
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='text' placeholder='' required={(viewForm || editForm) ? false : true} name="jobTitle" value={jobTitle} onChange={handleEmploymentDetailInputChange} style={{ width: '100%', height: 40, }} disabled/>

                    </div>

                </div>

                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>
                    <div>
                        Carrer Level
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <Select
                            options={level_options}
                            isDisabled={true}
                            value={carrerLevel}
                            onChange={handleLevelSelectorChange}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                        />
                    </div>

                </div>
                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>
                    <div>
                        Branch
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <Select
                            options={branchlist}
                            isDisabled={true}
                            value={employeeDetailBranch}
                            onChange={handleSelectedBranch}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                        />
                    </div>

                </div>
                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>
                    <div>
                        Employed Date
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='date' placeholder='' required={(viewForm || editForm) ? false : true} name="employedDate" value={employedDate} onChange={handleEmploymentDetailInputChange} style={{ width: '100%', height: 40, }} disabled/>

                    </div>

                </div>
                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>
                    <div>
                        Discontinuous Status
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <Select
                            options={disConstatusList}
                            isDisabled={true}
                            value={disConStatus}
                            onChange={handleSelectedDisConStus}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                        />
                    </div>

                </div>
                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>
                    <div>
                        Discontinuous Date
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='date' placeholder='' name="disConDate" value={disConDate} onChange={handleEmploymentDetailInputChange} style={{ width: '100%', height: 40, }} disabled/>

                    </div>

                </div>

            </div>
            {
                viewForm ?
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                        <button className='' onClick={onCancelClick} style={{ borderRadius: 5, padding: 10, margin: 10, background: '#337ab7', color: 'white', border: 'none', width: 130 }}>
                            Back To Table
                        </button>
                    </div>
                    :
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                        <button className='' onClick={onCancelClick} style={{ borderRadius: 5, padding: 10, margin: 10, background: 'red', color: 'white', border: 'none', width: 90 }}>
                            Cancel
                        </button>
                        <button type='submit' style={{ borderRadius: 5, padding: 10, margin: 10, background: '#337ab7', color: 'white', border: 'none', width: 90 }}
                            onClick={createNewEmployee}>
                            Save
                        </button>
                    </div>
            }

        </form>

    )
}

export default EmploymentDetails
