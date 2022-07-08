import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";


import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";


const ContactDetails = props => {
    const { viewForm, editForm, contactPerson, handlePreviousClick, guaFullNRC, contactPhone, selected_gran_NRC_Id, handleNRC_Id, selected_gran_DistrictCode, districtCodeList, nrcList, handleGranDistrictCode, gran_nrc_number, handleContactDetailInputChange, handleContactDetails, guarantor, guarantorPhone, handleSameWithCtPersonChange, checked } = props
    const guarantorNRC = guaFullNRC ? guaFullNRC : `${selected_gran_NRC_Id ? selected_gran_NRC_Id.label : ''} ${selected_gran_DistrictCode ? '/' + selected_gran_DistrictCode.label : ''} ${gran_nrc_number ? '(N)/' + gran_nrc_number : ''}`
    return (
        <form onSubmit={handleContactDetails} >
            <div className='white-bg ' style={{
                paddingTop: 50, border: '1px solid lightgrey', display: 'grid', borderTop: 'none', marginTop: -10, paddingLeft: window.innerWidth < 1000 ? 0 : 50, paddingBottom: 20,
                boxShadow: '5px 5px 5px lightgrey'
            }}>

                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>


                    <div>
                        Contact Person
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='text' placeholder='' required={(viewForm || editForm) ? false : true} name="contactPerson" value={contactPerson} onChange={handleContactDetailInputChange} style={{ width: '100%', height: 40, }} />
                    </div>

                </div>
                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>


                    <div>
                        Contact Phone
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='number' placeholder='' required={(viewForm || editForm) ? false : true} name="contactPhone" value={contactPhone} onChange={handleContactDetailInputChange} style={{ width: '100%', height: 40, }} />
                    </div>

                </div>
                <div style={{ paddingLeft: 20, alignItems: 'center', marginTop: 10 }}>
                    <input type='checkbox' checked={checked} onChange={handleSameWithCtPersonChange} style={{ marginRight: 10 }} />
                    Same With Contact Person
                </div>

                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, alignItems: 'center' }}>


                    <div>
                        Guarantor
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='text' placeholder='' required={(viewForm || editForm) ? false : true} name="guarantor" value={guarantor} onChange={handleContactDetailInputChange} style={{ width: '100%', height: 40, }} />

                    </div>

                </div>
                <div className='col-lg-7 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>


                    <div>
                        Guarantor's Phone
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <input type='number' placeholder='' required={(viewForm || editForm) ? false : true} name="guarantorPhone" value={guarantorPhone} onChange={handleContactDetailInputChange} style={{ width: '100%', height: 40, }} />

                    </div>

                </div>

                <div className='col-lg-7 col-md-12 col-sm-12' style={{ paddingTop: 15, }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ alignItems: 'center', paddingTop: 15 }}>
                            Guarantor's NRC
                        </div>

                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            <div className='w-100' style={{ display: 'flex', paddingBottom: 15 }}>
                                <div className='col-lg-2 col-md-2 col-sm-2' style={{ width: '50%', paddingLeft: 0, paddingRight: 5 }}>
                                    <Select
                                        options={nrcList}
                                        value={selected_gran_NRC_Id}
                                        onChange={handleNRC_Id}
                                        className="react-select-container checkValidate"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                                <div className='col-lg-2 col-md-2 col-sm-2' style={{ width: '50%', paddingLeft: 0, paddingRight: 5 }}>
                                    <Select
                                        options={districtCodeList}
                                        value={selected_gran_DistrictCode}
                                        onChange={handleGranDistrictCode}
                                        className="react-select-container checkValidate"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                                <div className='col-lg-6 col-md-6 col-sm-6' style={{ paddingRight: 0, paddingLeft: 0 }}>
                                    <input type='number' placeholder='' required={(viewForm || editForm) ? false : true} name="gran_nrc_no" value={gran_nrc_number} onChange={handleContactDetailInputChange} style={{ width: '100%', height: 40, }} />

                                </div>
                            </div>
                            <input type='text' placeholder='' name="" required={(viewForm || editForm) ? false : true} value={guarantorNRC} style={{ width: '100%', height: 40, }} />


                        </div>
                    </div>
                </div>

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

export default ContactDetails
