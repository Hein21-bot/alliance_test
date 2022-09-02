import React, { Component, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";


import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";
import { Link } from 'react-router-dom';


const Attachment = props => {
    const { viewForm, editForm, handleAttachmentChange, handlePreviousClick, handleAttachment, attachmentUrl } = props

    return (
        <form onSubmit={handleAttachment} >
            <div className='white-bg ' style={{
                paddingTop: 50, border: '1px solid lightgrey', display: 'grid', borderTop: 'none', marginTop: -10, paddingLeft: window.innerWidth < 1000 ? 0 : 50, paddingBottom: 30,
                boxShadow: '5px 5px 5px lightgrey'
            }}>

                <div className='col-lg-5 col-md-12 col-sm-12' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 15, alignItems: 'center' }}>


                    <div>
                        Attachment
                    </div>
                    <div className='col-lg-5 col-md-6 col-sm-8' style={{}}>
                        <input type='text' placeholder='' name="attachment" value={attachmentUrl} onChange={handleAttachmentChange} style={{ width: 300, height: 40, paddingLeft: 10 }} />

                    </div>

                </div>
                <div className='col-lg-8' style={{ display: 'flex', justifyContent: 'center' }}>
                    <a className='' target="_blank" href={attachmentUrl} style={{ borderRadius: 5, textDecoration: 'none', display: 'flex', alignItems: 'center', marginTop: 20, marginLeft: -20, padding: 10, cursor: 'pointer', background: '#337ab7', color: 'white', border: 'none', textAlign: 'center', justifyContent: 'center',pointerEvents: !attachmentUrl? 'none' :'' }}>
                        View Attachment
                    </a>
                </div>
                {/* {
                    view ?
                        <div style={{ display: 'flex', justifyContent: 'center' }}>

                            <img src={attachmentImage} required={viewForm ? false : true} alt="" style={{ objectFit: 'contain', width: 500, height: 500 }} />
                        </div>
                        : null
                } */}


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

export default Attachment

