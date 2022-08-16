import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";
import DatePicker from 'react-datetime';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

const ListSearchForm = props => {

    const { selected_title, titleList, handleDropDown, handleSearch, level_options, sub_level_options, handleLevelSelectorChange, career_level, career_sub_level, selected_branch, handleSelectedRegion, handleSelectedBranch, handleSelectedDeaprtment, selected_department, selected_region, regionList, branchlist, departmentlist, onChange, confirmationMonth, date, dropDownOpen, selected_designation, designationList, handleSelectedDesignation, handleConfirmationListInputChange, handleSelectedLevel, handleSelectedSubLevel, handleSelectedTitle } = props

   
    return (

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div className='col-lg-3 col-md-4 col-sm-12 ' style={{ display: 'flex', paddingTop: 10, flexDirection: 'column' }}>
                <div className='col-12'>
                    Date
                </div>
                <div className='col-12' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ minWidth: 180 }}>
                        <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={date}
                            onChange={onChange}
                            timeFormat={false}
                        />
                    </div>
                </div>

            </div>

            <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, flexDirection: 'column' }}>


                <div className='col-12'>
                    Confirmation Title
                </div>
                {/* <div className='col-12 ' style={{ display: 'flex', justifyContent: 'start' }}>
                    <div style={{ minWidth: 180 }}>
                        <Select
                            options={titleList}
                            value={selected_title}
                            onChange={handleSelectedTitle}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                            
                        />
                    </div>

                </div> */}
                <div style={{ width: '100%' }}>
                    <div style={{ maxWidth: 180, }}>
                        <Select
                           
                            options={titleList}

                            // isOptionDisabled={(workingDayOptions) => workingDayOptions.disabled}
                            onChange={handleSelectedTitle}
                            value={selected_title}
                            isClearable={true}
                            isSearchable={true}
                            className='react-select-container checkValidate'
                            classNamePrefix="react-select"
                            isMulti
                            // hideSelectedOptions={false}
                            // closeMenuOnSelect

                            styles={{
                                control: provided => ({
                                    ...provided,

                                    cursor: "pointer"
                                })
                            }}
                        />
                    </div>
                </div>

            </div>
            {
                (selected_title && selected_title.filter(v => v.name == "Other Confirmation").length > 0) ?
                    <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, flexDirection: 'column' }}>
                        <div className='col-12'>
                            Confirmation Month
                        </div>
                        <div className='col-12' style={{}}>
                            <input type='number' name="confirmationMonth" value={confirmationMonth} onChange={handleConfirmationListInputChange} style={{ minWidth: 180, height: 40 }} />
                        </div>

                    </div> : null
            }

            <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, flexDirection: 'column' }}>

                <div className='col-12'>
                    Designation
                </div>
                <div className='col-12 ' style={{ display: 'flex', justifyContent: 'start'}}>
                    <div style={{ minWidth: 180 }}>
                        <div style={{ width: '100%' }}>
                            <div style={{ maxWidth: 250, }}>
                                <Select
                                    laceholder="Please Choose An Option"
                                    options={designationList}


                                    onChange={handleSelectedDesignation}
                                    value={selected_designation}
                                    isClearable={true}
                                    isSearchable={true}
                                    className='react-select-container  checkValidate'
                                    classNamePrefix="react-select"
                                    isMulti


                                    styles={{
                                        control: provided => ({
                                            ...provided,

                                            cursor: "pointer"
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, flexDirection: 'column' }}>

                <div className='col-12'>
                    Level
                </div>
                <div className='col-12 ' style={{ display: 'flex', justifyContent: 'start' }}>
                    <div style={{ minWidth: 180 }}>
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
            <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, flexDirection: 'column' }}>

                <div className='col-12'>
                    Sub Level
                </div>
                <div className='col-12 ' style={{ display: 'flex', justifyContent: 'start' }}>
                    <div style={{ minWidth: 180 }}>
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
            <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, flexDirection: 'column' }}>

                <div className='col-12'>
                    Region
                </div>
                <div className='col-12 ' style={{ display: 'flex', justifyContent: 'start' }}>
                    <div style={{ minWidth: 180 }}>
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
            <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, flexDirection: 'column' }}>

                <div className='col-12'>
                    Department
                </div>
                <div className='col-12 ' style={{ display: 'flex', justifyContent: 'start' }}>
                    <div style={{ minWidth: 180 }}>
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
            {/* <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, flexDirection: 'column' }}>

                <div className='col-12'>
                    Branch
                </div>
                <div style={{ width: '100%' }}>
                    <div style={{ maxWidth: 180, }}>
                        <Select
                            laceholder="Please Choose An Option"
                            options={branchlist}

                            // isOptionDisabled={(workingDayOptions) => workingDayOptions.disabled}
                            onChange={handleSelectedBranch}
                            value={selected_branch}
                            isClearable={true}
                            isSearchable={true}
                            className='react-select-container checkValidate'
                            classNamePrefix="react-select"
                            isMulti
                            styles={{
                                control: provided => ({
                                    ...provided,

                                    cursor: "pointer"
                                })
                            }}
                        />
                    </div>
                </div>

            </div> */}
            <div className='col-lg-3 col-md-4 col-sm-12' style={{ display: 'flex', paddingTop: 10, flexDirection: 'column' }}>

            <div className='col-12'>
                Branch
            </div>
            <div className='col-12 ' style={{ display: 'flex', justifyContent: 'start' }}>
                <div style={{ minWidth: 180 }}>
                    <div style={{ width: '100%' }}>
                        <div style={{ maxWidth: 250, }}>
                            <Select
                               
                                placeholder="Please Choose Branch"
                                options={branchlist}
                                onChange={handleSelectedBranch}
                                value={selected_branch}
                                isClearable={true}
                                isSearchable={true}
                                className='react-select-container checkValidate'
                                classNamePrefix="react-select"
                                isMulti
                                styles={{
                                    control: provided => ({
                                        ...provided,
                                        cursor: "pointer"
                                    })
                                }}
                            />
                        </div>
                    </div>
                </div>

            </div>

            </div>
            <div className='col-lg-12 col-md-12 col-sm-12' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
                <button onClick={handleSearch} className='btn btn-primary' style={{ borderRadius: 3, width: 80 }}>Search</button>

            </div>

        </div>
    )
}

export default ListSearchForm