import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";
import DatePicker from 'react-datetime';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

const ListSearchForm = props => {

    const { selected_title, titleList, handleDropDown, handleSearch, level_options, sub_level_options, handleLevelSelectorChange, career_level, career_sub_level, selected_branch, handleSelectedRegion, handleSelectedBranch, handleSelectedDeaprtment, selected_department, selected_region, regionList, branchlist, departmentlist, onChange, confirmationMonth, date, dropDownOpen, selected_designation, designationList, handleSelectedDesignation, handleConfirmationListInputChange, handleSelectedLevel, handleSelectedSubLevel, handleSelectedTitle } = props
    return (

        <div style={{ padding: 10, display: 'flex', flexWrap: 'wrap' }}>
            <div className='col-lg-3 col-md-4 col-sm-12 ' style={{ display: 'flex', paddingTop: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                <div className='col-lg-4 col-md-6 col-sm-4' style={{ paddingLeft: 0 }}>
                    Date
                </div>
                <div className='col-lg-7 col-md-7 col-sm-8' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ minWidth: 200 }}>
                        <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={date}
                            onChange={onChange}
                            timeFormat={false}
                        />
                    </div>
                </div>

            </div>

            <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, justifyContent: 'space-between', alignItems: 'center' }}>


                <div>
                    Confirmation Title
                </div>
                <div className='col-lg-7 col-md-7 col-sm-8 ' style={{ display: 'flex', justifyContent: 'start' }}>
                    <div style={{ minWidth: 200 }}>
                        <Select
                            options={titleList}
                            value={selected_title}
                            onChange={handleSelectedTitle}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                        />
                    </div>

                </div>

            </div>
            {
                (selected_title && !selected_title.value) ?
                    <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            Confirmation Month
                        </div>
                        <div className='col-lg-7 col-md-7 col-sm-8' style={{}}>
                            <input type='number' name="confirmationMonth" value={confirmationMonth} onChange={handleConfirmationListInputChange} style={{ minWidth: 200, height: 40 }} />
                        </div>

                    </div> : null
            }

            <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, justifyContent: 'space-between', alignItems: 'center' }}>

                <div>
                    Designation
                </div>
                <div className='col-lg-7 col-md-7 col-sm-8 ' style={{ display: 'flex', justifyContent: 'start' }}>
                    <div style={{ minWidth: 200 }}>
                        <Select
                            options={designationList}
                            value={selected_designation}
                            onChange={handleSelectedDesignation}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                        />
                    </div>

                </div>

            </div>
            <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, justifyContent: 'space-between', alignItems: 'center' }}>

                <div>
                    Level
                </div>
                <div className='col-lg-7 col-md-7 col-sm-8 ' style={{ display: 'flex', justifyContent: 'start' }}>
                    <div style={{ minWidth: 200 }}>
                        <Select
                            options={level_options}
                            value={career_level}
                            onChange={(val) => handleLevelSelectorChange(val, 'career_level')}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                        />
                    </div>

                </div>

            </div>
            <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, justifyContent: 'space-between', alignItems: 'center' }}>

                <div>
                    Sub Level
                </div>
                <div className='col-lg-7 col-md-7 col-sm-8 ' style={{ display: 'flex', justifyContent: 'start' }}>
                    <div style={{ minWidth: 200 }}>
                        <Select
                            options={career_level ? sub_level_options.filter(c => c.career_level_id == career_level.career_level_id) : sub_level_options}
                            value={career_sub_level}
                            onChange={(val) => handleLevelSelectorChange(val, 'career_sub_level')}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                        />
                    </div>

                </div>

            </div>
            <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, justifyContent: 'space-between', alignItems: 'center' }}>

                <div>
                    Region
                </div>
                <div className='col-lg-7 col-md-7 col-sm-8 ' style={{ display: 'flex', justifyContent: 'start' }}>
                    <div style={{ minWidth: 200 }}>
                        <Select
                            options={regionList}
                            value={selected_region}
                            onChange={handleSelectedRegion}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                        />
                    </div>

                </div>

            </div>
            <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, justifyContent: 'space-between', alignItems: 'center' }}>

                <div>
                    Department
                </div>
                <div className='col-lg-7 col-md-7 col-sm-8 ' style={{ display: 'flex', justifyContent: 'start' }}>
                    <div style={{ minWidth: 200 }}>
                        <Select
                            options={departmentlist}
                            value={selected_department}
                            onChange={handleSelectedDeaprtment}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                        />
                    </div>

                </div>

            </div>
            <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, justifyContent: 'space-between', alignItems: 'center' }}>

                <div>
                    Branch
                </div>
                <div className='col-lg-7 col-md-7 col-sm-8 ' style={{ display: 'flex', justifyContent: 'start' }}>
                    <div style={{ minWidth: 200 }}>
                        <Select
                            options={branchlist}
                            value={selected_branch}
                            onChange={handleSelectedBranch}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                        />
                    </div>

                </div>

            </div>
            <div className='col-lg-4 mx-2' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 20 }}>
                <button onClick={handleSearch} className='btn btn-primary' style={{ borderRadius: 3, width: 80 }}>Search</button>

            </div>

        </div>
    )
}

export default ListSearchForm