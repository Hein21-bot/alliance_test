import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";


import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";
import moment from 'moment';


const EmploymentForm = props => {
    const { handleAddFormInputChange, selectedEmployeeId, exitStatusList, selected_exit_status, disConStatusList, selected_disCon_status, handleSelectedDisConStatus, jobList, selected_job, handleSelectedJob, handleSelectedExitStatus, handleSelectedEmployeeId, employeeIdList, handleLevelSelectorChange, career_level, career_sub_level, level_options, sub_level_options, submitAddForm, handleUpdatData, edit,tableView, employeeName, statusList, handleFormCancel, resignReason, handleSelectedBranch, disconDate, handleSelectedDeaprtment, effectiveDate, salary, branchlist, selected_branch, departmentlist, selected_department, handleSelectedDesignation, designationList, selected_designation, actualDate, selected_status, handleSelectedStatus, employedDate,view } = props
    let department = selected_designation != null && departmentlist.filter(v => v.departments_id == selected_designation.departments_id)[0]

    
    let name = employeeName == null ? '' : employeeName
    let temp_salary = salary == null ? 0 : salary
    return (
        <form >
            <div className='white-bg ' style={{ paddingTop: 20, border: '1px solid lightgrey', display: 'grid', marginTop: 10, paddingBottom: 20, boxShadow: '5px 5px 5px lightgrey' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 23 }}>Employment Detail Form</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'flex-start', paddingLeft: 10, paddingRight: 10 }}>
                    <div className='col-lg-5 col-md-12 col-sm-12' style={{}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                            <div>
                                Employee Code
                            </div>
                            <div className='col-lg-7 col-md-5'>
                                <Select
                                    options={employeeIdList}
                                    value={selectedEmployeeId}
                                    onChange={handleSelectedEmployeeId}
                                    className="react-select-container checkValidate"
                                    classNamePrefix="react-select"
                                    isDisabled={view ? true : edit ? true : false}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                            <div>
                                Employee Name
                            </div>
                            <div className='col-lg-7 col-md-5'>
                                <input type='text' placeholder='' isDisabled={view ? true : false} required name="name" value={name.toUpperCase()} onChange={handleAddFormInputChange} style={{ width: '100%', height: 40 }} disabled={edit ? true : false} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                            <div>
                                Employee Status
                            </div>
                            <div className='col-lg-7 col-md-5'>
                                <Select
                                    options={statusList}
                                    value={selected_status}
                                    onChange={handleSelectedStatus}
                                    className="react-select-container checkValidate"
                                    classNamePrefix="react-select"
                                    isDisabled={view ? true :false}
                                />
                            </div>
                        </div>
                        <div className='' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>

                            <div style={{ paddingBottom: 10 }}>
                                Designation
                            </div>
                            <div className='col-lg-7 col-md-5'>
                                <Select
                                    options={designationList}
                                    value={selected_designation}
                                    onChange={handleSelectedDesignation}
                                    className="react-select-container checkValidate"
                                    classNamePrefix="react-select"
                                    isDisabled={view ? true :false}

                                />
                            </div>

                        </div>
                        <div className='' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>

                            <div style={{ paddingBottom: 10 }}>
                                Branch
                            </div>
                            <div className='col-lg-7 col-md-5'>
                                <Select
                                    options={branchlist}
                                    value={selected_branch}
                                    onChange={handleSelectedBranch}
                                    className="react-select-container checkValidate"
                                    classNamePrefix="react-select"
                                    isDisabled={view ? true :false}
                                />
                            </div>

                        </div>
                        <div className='' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>

                            <div style={{ paddingBottom: 10 }}>
                                Department
                            </div>
                            <div className='col-lg-7 col-md-5'>
                                <Select
                                    options={departmentlist}
                                    value={department}
                                    onChange={handleSelectedDeaprtment}
                                    className="react-select-container checkValidate"
                                    classNamePrefix="react-select"
                                    isDisabled={true}
                                />
                            </div>

                        </div>
                        <div className='' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>

                            <div style={{ paddingBottom: 10 }}>
                                Carrer Level
                            </div>
                            <div className='col-lg-7 col-md-5'>
                                <Select
                                    options={level_options}
                                    value={career_level}
                                    onChange={(val) => handleLevelSelectorChange(val, 'career_level')}
                                    className="react-select-container checkValidate"
                                    classNamePrefix="react-select"
                                    isDisabled={view ? true :false}
                                />
                            </div>

                        </div>
                        <div className='' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>

                            <div style={{ paddingBottom: 10 }}>
                                Carrer Sub Level
                            </div>
                            <div className='col-lg-7 col-md-5'>
                                <Select
                                    options={career_level ? sub_level_options.filter(c => c.career_level_id == career_level.career_level_id) : sub_level_options}
                                    value={career_sub_level}
                                    onChange={(val) => handleLevelSelectorChange(val, 'career_sub_level')}
                                    className="react-select-container checkValidate"
                                    classNamePrefix="react-select"
                                    isDisabled={view ? true :false}
                                />
                            </div>

                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                            <div>
                                Date
                            </div>
                            <div className='col-lg-7  col-md-5'>

                                <input type='text' placeholder=''  isDisabled={view ? true :false} required name="date" value={moment(new Date()).format('YYYY-MM-DD')} onChange={null} style={{ width: '100%', height: 40 }} />

                            </div>
                        </div>
                        
                    </div>
                    <div className='col-lg-5 col-md-12 col-sm-12' style={{}}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                            <div>
                                Employed Date
                            </div>
                            <div className='col-lg-7  col-md-5'>
                                <input type='date' placeholder=''  isDisabled={view ? true :false} required name="employedDate" value={moment(employedDate).format('YYYY-MM-DD')} onChange={handleAddFormInputChange} style={{ width: '100%', height: 40 }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                            <div>
                                Effective Date
                            </div>
                            <div className='col-lg-7  col-md-5'>
                                <input type='date' placeholder=''  isDisabled={view ? true :false} required name="effectiveDate" value={moment(effectiveDate).format('YYYY-MM-DD')} onChange={handleAddFormInputChange} style={{ width: '100%', height: 40 }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                            <div>
                                Actual Date
                            </div>
                            <div className='col-lg-7  col-md-5'>
                                <input type='date' placeholder=''  isDisabled={view ? true :false} required name="actualDate" value={moment(actualDate).format('YYYY-MM-DD')} onChange={handleAddFormInputChange} style={{ width: '100%', height: 40 }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                            <div>
                                Job Title
                            </div>
                            <div className='col-lg-7 col-md-5'>
                                <Select
                                    options={jobList}
                                    value={selected_job}
                                    onChange={handleSelectedJob}
                                    className="react-select-container checkValidate"
                                    classNamePrefix="react-select"
                                    isDisabled={view ? true :false}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                            <div>
                                Salary
                            </div>
                            <div className='col-lg-7  col-md-5'>
                                <input type='number' placeholder='' required name="salary"  isDisabled={view ? true :false} value={temp_salary} onChange={handleAddFormInputChange} style={{ width: '100%', height: 40 }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                            <div>
                                Discontinuous Status
                            </div>
                            <div className='col-lg-7 col-md-5'>
                                <Select
                                    options={disConStatusList}
                                    value={selected_disCon_status}
                                    onChange={handleSelectedDisConStatus}
                                    className="react-select-container checkValidate"
                                    classNamePrefix="react-select"
                                    isDisabled={view ? true :false}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                            <div>
                                Discontinuous Date
                            </div>
                            <div className='col-lg-7  col-md-5'>
                                <input type='date' placeholder=''  isDisabled={view ? true :false} name="disconDate" value={moment(disconDate).format('YYYY-MM-DD')} onChange={handleAddFormInputChange} style={{ width: '100%', height: 40 }} />
                            </div>
                        </div>
                        <div className='' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>

                            <div style={{ paddingBottom: 10 }}>
                                Exit Status
                            </div>
                            <div className='col-lg-7 col-md-5'>
                                <Select
                                    options={exitStatusList}
                                    value={selected_exit_status}
                                    onChange={handleSelectedExitStatus}
                                    className="react-select-container checkValidate"
                                    classNamePrefix="react-select"
                                    isDisabled={view ? true :false}
                                />
                            </div>

                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                            <div>
                                Resign Reason
                            </div>
                            <div className='col-lg-7  col-md-5'>
                                <input type='text' placeholder=''  isDisabled={view ? true :false} name="resignReason" value={resignReason} onChange={handleAddFormInputChange} style={{ width: '100%', height: 40 }} />
                            </div>
                        </div>
                    </div>
                </div>
                {
                    view ? <div  style={{ display: 'flex', justifyContent: 'center', marginTop: 15 }}>
                           <button onClick={handleFormCancel} style={{ borderRadius: 5, padding: 10, background: '#337ab7', marginLeft: 15, color: 'white', border: 'none', width: 90 }}>
                                Back
                            </button>
                    </div> :
                    edit ?
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 15 }}>
                            <button onClick={handleUpdatData} style={{ borderRadius: 5, padding: 10, background: '#337ab7', color: 'white', border: 'none', width: 90 }}>
                                Save
                            </button>
                            <button onClick={handleFormCancel} style={{ borderRadius: 5, padding: 10, background: 'red', marginLeft: 15, color: 'white', border: 'none', width: 90 }}>
                                Cancel
                            </button>
                        </div> :
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 15 }}>
                            <button onClick={submitAddForm} style={{ borderRadius: 5, padding: 10, background: '#337ab7', color: 'white', border: 'none', width: 90 }}>
                                Submit
                            </button>
                            <button onClick={handleFormCancel} style={{ borderRadius: 5, padding: 10, background: 'red', marginLeft: 15, color: 'white', border: 'none', width: 90 }}>
                                Cancel
                            </button>
                        </div>
                }

            </div>

        </form>

    )
}

export default EmploymentForm
