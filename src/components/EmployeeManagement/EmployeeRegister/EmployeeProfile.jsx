import React, { Component } from 'react';
import Select from "react-select";


import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";
import { ToastContainer, toast } from 'react-toastify';


const EmployeeProfile = props => {
    const { userImage, handleClick, hiddenFileInput, districtCodeList, fullNRC, nrcList, handleProfileSave, nrc_number, handleChange, handleSelectedDistrictCode, handleSelectedNRCId, selected_DistrictCode, selected_NRC_Id, employeeId, region, address, joinDate, nationality, personalPhone, officePhone, dateOfBirth, handleInputChange, onGenderChange, employeeNameEng, employeeNameMyan, gender,nrcErr } = props
    const { onCancelClick, viewForm, editForm } = props


    const imgUrl = userImage ? (userImage.includes('103.29.91.26') ? userImage : main_url + 'confirmation/getProfile/' + userImage) : ''

    // const nrcErr = () => {
    //     if(nrc_number.length < 6){
    //         toast.error("NRC number should be 6 digit!");
    //     }
    // }

   

    let fullNRCNO = fullNRC ? fullNRC :
        // fullNRC.split(" ")[0] + '/' + fullNRC.split(" ")[1] + '(N)' + fullNRC.split(" ")[2] :
        `${selected_NRC_Id ? (selected_NRC_Id.label) : ''}${selected_DistrictCode ? ('/' + selected_DistrictCode.label) : ''}${nrc_number ? ('(N)' + nrc_number) : ''}`

    return (
        <form onSubmit={handleProfileSave} >
            <div className='white-bg ' style={{ paddingTop: 20, border: '1px solid lightgrey', display: 'grid', borderTop: 'none', marginTop: -10, paddingBottom: 20, boxShadow: '5px 5px 5px lightgrey' }}>
                <div className='' style={{ display: 'flex' }}>
                    <div className='col-lg-6 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}> Profile Photo</div>
                        <div className='col-lg-7 col-md-6 w-100' style={{ display: 'flex', }}>
                            <div style={{ border: '1px solid grey', width: 140, height: 120, borderStyle: 'dashed' }}>
                                <img src={imgUrl} alt="" style={{ width: 140, height: 120, objectFit: 'contain' }} />
                            </div>
                            {
                                viewForm ? null : <div className='' style={{ display: 'flex', alignItems: 'end', paddingLeft: 10 }}>
                                    <button onClick={(e) => handleClick(e)} style={{ borderRadius: 5, padding: 10, background: '#337ab7', color: 'white', border: 'none', width: 90 }}>
                                        Browse
                                    </button>
                                    <input type="file" id="user-image"
                                        ref={hiddenFileInput}
                                        accept="image/*"
                                        onChange={(e) => handleChange(e)}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            }

                        </div>

                    </div>
                </div>
                <div style={{ display: 'flex', paddingTop: 15, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <div className='col-lg-6 col-md-12 col-sm-12' style={{}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                            <div>
                                Employee ID
                            </div>
                            <div className='col-lg-7 col-md-6 col-sm-6'>
                                <input type='text' placeholder='' required={(viewForm) ? false : true} name="employeeId" value={employeeId} onChange={handleInputChange} style={{ width: '100%', height: 40 }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                            <div>
                                Employee Name (Eng)
                            </div>
                            <div className='col-lg-7 col-md-6 col-sm-6'>
                                <input type='text' placeholder='' required={(viewForm) ? false : true} name="employeeNameEng" value={employeeNameEng.toUpperCase()} onChange={handleInputChange} style={{ width: '100%', height: 40 }} />

                            </div>
                        </div>
                    </div>
                    <div className='col-lg-6 col-md-12 col-sm-12' style={{ paddingTop: 15, }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ alignItems: 'center', paddingTop: 15 }}>
                                NRC
                            </div>
                            <div className='col-lg-7 col-md-6 col-sm-6'>
                                <div className='w-100' style={{ display: 'flex', paddingBottom: 15 }}>
                                    <div className='col-lg-2 col-md-2 col-sm-2' style={{ width: '38%', paddingLeft: 0, paddingRight: 5 }}>
                                        <Select
                                            options={nrcList}
                                            value={selected_NRC_Id}
                                            onChange={viewForm ? null : handleSelectedNRCId}
                                            className="react-select-container checkValidate"
                                            classNamePrefix="react-select"
                                        />
                                    </div>
                                    <div className='col-lg-2 col-md-2 col-sm-2' style={{ width: '62%', paddingLeft: 0, paddingRight: 5 }}>
                                        <Select
                                            options={districtCodeList}
                                            value={selected_DistrictCode}
                                            onChange={viewForm ? null : handleSelectedDistrictCode}
                                            className="react-select-container checkValidate"
                                            classNamePrefix="react-select"
                                        />
                                    </div>
                                    <div className='col-lg-6 col-md-6 col-sm-6' style={{ paddingRight: 0, paddingLeft: 0 }}>
                                        <input type='number' placeholder='' required={(viewForm) ? false : true} name="nrc_number" value={nrc_number} onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} onChange={handleInputChange} style={{ width: '100%', height: 40 }} />

                                    </div>
                                </div>
                                <input type='text' placeholder='' name="" required={(viewForm) ? false : true} value={fullNRCNO} onChange={() => null} style={{ minWidth: '100%', height: 40 }} />


                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <div className='col-lg-6 col-md-12 col-sm-12' style={{ paddingTop: 15 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                            <div>
                                Employee Name (Myan)
                            </div>
                            <div className='col-lg-7 col-md-6 col-sm-6'>
                                <input type='text' placeholder='' required={(viewForm) ? false : true} name="employeeNameMyan" value={employeeNameMyan} onChange={handleInputChange} style={{ width: '100%', height: 40 }} />


                            </div>
                        </div>
                    </div>

                    <div className='col-lg-6 col-md-12 col-sm-12' style={{ paddingTop: 15 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                            <div>
                                Date Of Birth
                            </div>
                            <div className='col-lg-7 col-md-6 col-sm-6'>
                                <input type='date' placeholder='' required={(viewForm) ? false : true} name="dateOfBirth" value={dateOfBirth} onChange={handleInputChange} style={{ width: '100%', height: 40 }} />
                            </div>
                        </div>
                    </div>

                </div>

                <div style={{ display: 'flex', paddingTop: 10, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <div className='col-lg-6 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                        <div>
                            Gender
                        </div>
                        <div className='col-lg-7 col-md-6' style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input type="radio" value="male" name='gender' required={(viewForm) ? false : true} checked={gender === "male"} onChange={onGenderChange} /><div style={{ paddingLeft: 10 }}>Male</div>

                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input type="radio" value="female" name='gender' required={(viewForm) ? false : true} checked={gender === "female"} onChange={onGenderChange} /><div style={{ paddingLeft: 10 }}>Female</div>

                            </div>
                        </div>
                    </div>
                    <div className='col-lg-6 col-md-12 col-sm-12' style={{ paddingTop: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                            <div>
                                Nationality
                            </div>
                            <div className='col-lg-7 col-md-6 col-sm-6'>
                                <input type='text' placeholder='' required={(viewForm) ? false : true} name="nationality" value={nationality} onChange={handleInputChange} style={{ width: '100%', height: 40 }} />
                            </div>
                        </div>
                    </div>

                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <div className='col-lg-6 col-md-12 col-sm-12' style={{ paddingTop: 15 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                            <div>
                                Personal Phone
                            </div>
                            <div className='col-lg-7 col-md-6 col-sm-6'>
                                <input type='number' placeholder='' required={(viewForm) ? false : true} name="personalPhone" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={personalPhone} onChange={handleInputChange} style={{ width: '100%', height: 40 }} />


                            </div>
                        </div>
                    </div>

                    <div className='col-lg-6 col-md-12 col-sm-12' style={{ paddingTop: 15 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                            <div>
                                Religion
                            </div>
                            <div className='col-lg-7 col-md-6 col-sm-6'>
                                <input type='text' placeholder='' required={(viewForm) ? false : true} name="region" value={region} onChange={handleInputChange} style={{ width: '100%', height: 40 }} />
                            </div>
                        </div>
                    </div>

                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <div className='col-lg-6 col-md-12 col-sm-12' style={{ paddingTop: 15 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                            <div>
                                Office Phone
                            </div>
                            <div className='col-lg-7 col-md-6 col-sm-6'>
                                <input type='number' placeholder='' required={(viewForm) ? false : true} name="officePhone" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={officePhone} onChange={handleInputChange} style={{ width: '100%', height: 40 }} />


                            </div>
                        </div>
                    </div>

                    <div className='col-lg-6 col-md-12 col-sm-12' style={{ paddingTop: 15 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                            <div>
                                Address
                            </div>
                            <div className='col-lg-7 col-md-6 col-sm-6'>
                                <input type='text' placeholder='' required={(viewForm) ? false : true} name="address" value={address} onChange={handleInputChange} style={{ width: '100%', height: 40 }} />
                            </div>
                        </div>
                    </div>

                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end' }}>


                    <div className='col-lg-6 col-md-12 col-sm-12' style={{ paddingTop: 15 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                            <div>
                                Join Date
                            </div>
                            <div className='col-lg-7 col-md-6 col-sm-6'>
                                <input type='date' placeholder='' required={(viewForm) ? false : true} name="joinDate" value={joinDate} onChange={handleInputChange} style={{ width: '100%', height: 40 }} />
                            </div>
                        </div>
                    </div>

                </div>


            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                <button className='' onClick={onCancelClick} style={{ borderRadius: 5, padding: 10, margin: 10, background: 'red', color: 'white', border: 'none', width: 90 }}>
                    Cancel
                </button>
                <button type="submit" style={{ borderRadius: 5, padding: 10, margin: 10, background: '#337ab7', color: 'white', border: 'none', width: 90 }} onClick={nrcErr}>
                    Next
                </button>
            </div>
        </form>

    )
}

export default EmployeeProfile