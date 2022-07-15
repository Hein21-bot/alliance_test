import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";


import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";


const BankAccountDetails = props => {

    const { viewForm, editForm, bankDataEdit, handleEditBankData, handlePreviousClick, handleDeleteBankData, cancelEdit, handleBankDetailInputChange, handleSelectedBank, bankData, selected_bank, accountNumber, accountName, bankList, handleAdd_UpdateBankData, handleBankAccountDetails, employeeNameEng } = props
    return (
        <form onSubmit={handleAdd_UpdateBankData} >
            <div className='white-bg ' style={{
                paddingTop: 50, border: '1px solid lightgrey', borderTop: 'none', marginTop: -10, display: 'grid', paddingLeft: window.innerWidth < 1000 ? 0 : 50, paddingBottom: 20,
                boxShadow: '5px 5px 5px lightgrey',
            }}>
                <div className='col-lg-8 col-md-12 col-sm-10' style={{ display: 'grid', }}>
                    <div className='col-lg-12 col-md-12 col-sm-12' style={{ display: 'flex', paddingTop: 15, alignItems: 'center' }}>


                        <div className='col-md-6 col-sm-4 col-lg-6 col-xs-4' style={{}}>
                            Bank
                        </div>
                        <div className='col-lg-5 col-md-6 col-sm-8 col-xs-8' style={{ paddingLeft: 0, }}>
                            <Select
                                options={bankList}
                                value={selected_bank}
                                onChange={handleSelectedBank}
                                className="react-select-container checkValidate"
                                classNamePrefix="react-select"
                            />
                        </div>

                    </div>
                    <div className='col-lg-12 col-md-12 col-sm-12' style={{ display: 'flex', paddingTop: 15, alignItems: 'center' }}>
                        <div className='col-md-6 col-sm-4 col-lg-6 col-xs-4' style={{}}>
                            Account Name
                        </div>
                        <div className='col-lg-5 col-md-6 col-sm-8 col-xs-8' style={{ paddingLeft: 0, }}>
                            <input type='text' placeholder='' required={(viewForm || editForm) ? false : true} name="accountName" value={employeeNameEng.toUpperCase()} onChange={handleBankDetailInputChange} style={{ width: '100%', height: 40, paddingLeft: 10, }} />

                        </div>

                    </div>
                    <div className='col-lg-12 col-md-12 col-sm-12' style={{ display: 'flex', paddingTop: 15, alignItems: 'center' }}>
                        <div className='col-md-6 col-sm-4 col-lg-6 col-xs-4' style={{}}>
                            Account Number
                        </div>
                        <div className='col-lg-5 col-md-6 col-sm-8 col-xs-8' style={{ paddingLeft: 0, }}>
                            <input type='text' placeholder='' required={(viewForm || editForm) ? false : true} name="accountNumber" value={accountNumber} onChange={handleBankDetailInputChange} style={{ width: '100%', height: 40, paddingLeft: 10, }} />
                        </div>

                    </div>
                </div>

                <div className='' style={{ display: 'flex', alignItems: 'end', justifyContent: 'center', marginLeft: 10, marginBottom: 40 }}>

                    {
                        bankDataEdit ?
                            <div style={{ display: 'flex', justifyContent: 'end' }}>

                                <button type="submit" style={{ borderRadius: 5, padding: 10, margin: 10, marginBottom: 0, color: 'white', background: '#337ab7', border: 'none', width: 90, border: '1px solid lightgrey', textAlign: 'center' }}>
                                    Save
                                </button>
                                <button onClick={cancelEdit} style={{ borderRadius: 5, padding: 10, margin: 10, marginBottom: 0, color: 'white', background: 'red', border: 'none', width: 90, border: '1px solid lightgrey', textAlign: 'center' }}>
                                    Cancel
                                </button>

                            </div> :
                            <button type="submit" style={{ borderRadius: 5, padding: 10, margin: 10, marginBottom: 0, color: 'white', background: '#337ab7', border: 'none', width: 90, border: '1px solid lightgrey', textAlign: 'center' }}>
                                Add
                            </button>
                    }



                </div>

                {
                    bankData && bankData.length > 0 &&
                    <div className='col-lg-10 col-md-12 col-sm-12' style={{ display: 'flex', flexWrap: 'nowrap', padding: 0 }}>
                        <div className='col-lg-2 col-md-2 col-sm-2' style={{ color: 'blue', fontWeight: 'bold', }}>
                            Name
                        </div>
                        <div className='col-lg-3 col-md-3 col-sm-3' style={{ color: 'blue', fontWeight: 'bold' }}>
                            Account Name
                        </div>
                        <div className='col-lg-3 col-md-3 col-sm-3' style={{ color: 'blue', fontWeight: 'bold' }}>
                            Account Number
                        </div>
                        {
                            !(viewForm && editForm) && <div className='col-lg-3 col-md-4 col-sm-4' style={{ color: 'blue', fontWeight: 'bold', textAlign: 'center' }}>
                                Action
                            </div>
                        }


                    </div>
                }

                <div className='col-lg-10 col-md-12 col-sm-12' style={{ justifyContent: 'center', marginTop: 1, paddingTop: 20, paddingLeft: 0, paddingRight: 0 }}>
                    {
                        bankData && bankData.length > 0 && bankData.map((v, k) => {
                            return (
                                <div key={v.id} style={{ display: 'flex', flexWrap: 'nowrap' }}>
                                    <div className='col-lg-2 col-md-2 col-sm-2' style={{}}>
                                        {v.bank_name}
                                    </div>
                                    <div className='col-lg-3 col-md-3 col-sm-3'>
                                        {employeeNameEng}
                                    </div>
                                    <div className='col-lg-3 col-md-3 col-sm-3' style={{}}>
                                        {v.account_no}
                                    </div>
                                    {
                                        !(viewForm && editForm) &&
                                        <div className='col-lg-3 col-md-4 col-sm-4' style={{ display: 'flex', justifyContent: 'center', alignItems: 'start', marginTop: -10, marginBottom: 10 }}>
                                            {/* <div style= }}> */}

                                            <div onClick={() => handleEditBankData(v)} style={{ borderRadius: 5, padding: 10, marginBottom: 10, cursor: 'pointer', background: '#337ab7', color: 'white', border: 'none', width: 90, textAlign: 'center' }}>
                                                Edit
                                            </div>

                                            <div className='' onClick={() => handleDeleteBankData(v)} style={{ borderRadius: 5, padding: 10, marginLeft: 10, marginBottom: 10, cursor: 'pointer', background: 'red', color: 'white', border: 'none', width: 90, textAlign: 'center' }}>
                                                Delete
                                            </div>
                                            {/* </div> */}
                                        </div>
                                    }

                                </div>
                            )
                        })
                    }



                </div>
                {/* </div> */}

            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                <div className='' onClick={handlePreviousClick} style={{ borderRadius: 5, padding: 10, margin: 10, background: '#337ab7', color: 'white', border: 'none', width: 90, textAlign: 'center', cursor: 'pointer' }}>
                    Previous
                </div>
                {
                    (bankData && bankData.length > 0 && !viewForm && !editForm) ?
                        <div onClick={handleBankAccountDetails} style={{ borderRadius: 5, display: 'flex', alignItems: 'center', margin: 10, cursor: 'pointer', background: '#337ab7', color: 'white', border: 'none', width: 90, textAlign: 'center', justifyContent: 'center' }}>
                            Next
                        </div> :
                        (selected_bank === null && accountName === '' && accountNumber === '' && (viewForm || editForm)) ?
                            <div onClick={handleBankAccountDetails} style={{ borderRadius: 5, display: 'flex', alignItems: 'center', margin: 10, cursor: 'pointer', background: '#337ab7', color: 'white', border: 'none', width: 90, textAlign: 'center', justifyContent: 'center' }}>
                                Next
                            </div> :
                            (bankData.length > 0) ?
                                <button type={"submit"} style={{ borderRadius: 5, padding: 10, margin: 10, background: '#337ab7', color: 'white', border: 'none', width: 90 }}>
                                    Next
                                </button> :
                                <div onClick={() => alert("Please Add Bank Data first!")} style={{ borderRadius: 5, display: 'flex', alignItems: 'center', margin: 10, cursor: 'pointer', background: '#337ab7', color: 'white', border: 'none', width: 90, textAlign: 'center', justifyContent: 'center' }}>
                                    Next
                                </div>


                }
                {/* <button type={(selected_bank !== null && accountName != '' && accountNumber != '') ? null : "submit"} onClick={() => handleBankAccountDetails} style={{ borderRadius: 5, padding: 10, margin: 10, background: '#337ab7', color: 'white', border: 'none', width: 90 }}>
                    Next
                </button> */}


            </div>
        </form>

    )
}

export default BankAccountDetails

// let bankData = [
//     { id: 1, bankName: 'KBZ', name: 'May Choon Htike', bankAcc: '10101010101' },
//     { id: 2, bankName: 'AYA', name: 'May Choon Htike', bankAcc: '20202020202' },
// ]