import Cookies from 'universal-cookie';
import $ from 'jquery';
import moment from 'moment';
import { toast } from 'react-toastify';
const CryptoJS = require('crypto-js');

//@kpk
// const main_url = "http://103.29.91.26:50092/";
// const main_url = "http://localhost:8082/";
// const main_url = "http://192.168.100.145:8087/"

// local

//  const main_url = "http://192.168.:8087/";  
// server 

// const main_url = "http://192.168.100.38:8082/" // local
// const main_url = "http://localhost:8082/"


const main_url = "http://103.29.91.26:50092/"; // test server

// const main_url = "http://103.29.91.26:8032/";  // live server


// test new
// const main_url = "http://192.168.43.10:50092/";
//  --------------------------------------------
// const main_url = "http://192.168.1.32:8082/";
// const main_url = "http://192.168.100.199:8087/";

// const php_url = "http://103.29.91.26:8032/marter_hrm/admin/dashboard";
// const remote_url = "http://103.29.91.26:8032/marter_hrm"; // live server


// const remote_url = "http://103.29.91.26:50050"; // remote url live server
const remote_url = "http://103.29.91.26:50093"; // remote url test server


// const remote_url = "http://192.168.1.32:8080/marter_hrm";
//const remote_url = "http://192.168.100.199:8087/";
// const main_url = "http://192.168.100.208:8087/";
const limit_amount = 800001;

const alertText = "Please Add Fully Information!";

const cookies = new Cookies();

const fno = {
    //form number
    //allowance
    fno_travel: 'TR',
    fno_training: 'TA',
    fno_phone: 'PH',
    fno_petrol: 'PE',
    fno_salary: 'SA',

    //staff loan
    fno_staff_loan: 'SL',

    fno_announce: 'AN',

    //benefit
    fno_wedding: 'WB',
    fno_child: 'CB',
    fno_funeral: 'FB',
    fno_external: 'ET',
    fno_medical: 'MB',
    fno_birthday: 'BF',
    fno_team: 'TB',
    fno_other: 'OB',
    fno_hospital: 'HP',
    fno_cycle: 'CI'
}

async function calculationWorkingExp(startDate, endDate) {
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    const diffInMs = Math.abs(date2 - date1);
    const noOfDays = diffInMs / (1000 * 60 * 60 * 24)
    let years = Math.floor(noOfDays / 365);
    let months = Math.floor(noOfDays % 365 / 30);
    let days = Math.floor(noOfDays % 365 % 30);
    let formatMonth = Math.floor(noOfDays / 30)
    let formatYear = years == 0 ? months + ' months ' : years + ' years ' + parseInt(months) + ' months '
    let returnData = formatYear
    return returnData;
}

// function getFirstDayOfNextMonth(a) {
//     const date = new Date(a);
//     const day=date.getDay()
  
//     return new Date(date.getFullYear(), date.getMonth() + 1, day);
//   }
function getFirstDayOfNextMonth(a){
    var date = new Date(a); // Now
    date.setDate(date.getDate() + 30);
    return date
}

function calculationDate(startDate, endDate) {
    var formatstartDate = new Date(startDate);
    var formatendDate = new Date(endDate)
    formatstartDate.setHours(0);
    formatstartDate.setMinutes(0);
    formatstartDate.setSeconds(0);
    formatstartDate.setMilliseconds(0);
    formatendDate.setHours(0);
    formatendDate.setMinutes(0);
    formatendDate.setSeconds(0);
    formatendDate.setMilliseconds(0);
    var timeDiff = Math.abs(formatendDate.getTime() - formatstartDate.getTime() + 1);
    var dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return dayDiff;
}

function calculationDate1(startDate, endDate) {

    // Copy date objects so don't modify originals
    var s = new Date(startDate);
    var e = new Date(endDate);

    // Set time to midday to avoid dalight saving and browser quirks
    s.setHours(0, 0, 0, 0);
    e.setHours(0, 0, 0, 0);

    // Get the difference in whole days
    var totalDays = Math.round((e - s) / 8.64e7);

    // Get the difference in whole weeks
    var wholeWeeks = totalDays / 7 | 0;

    // Estimate business days as number of whole weeks * 5
    var days = wholeWeeks * 5;
    // var days = 0;
    // If not even number of weeks, calc remaining weekend days
    if (totalDays % 7) {
        s.setDate(s.getDate() + wholeWeeks * 7);
        // if (wholeWeeks > 0) {
        //     while (s < e) {
        //         s.setDate(s.getDate() + 1);
        //         // If day isn't a Sunday or Saturday, add to business days
        //         if (s.getDay() != 0 && s.getDay() != 6) {
        //             ++days;
        //         }
        //     }
        // } else {
        while (s <= e) {
            // If day isn't a Sunday or Saturday, add to business days
            if (s.getDay() != 0 && s.getDay() != 6) {
                ++days;
            }
            s.setDate(s.getDate() + 1);
        }
        // }
    } else {
        days = days + 1
    }
    console.log('datys is ===========>', days)
    return days;
}

// for approve amount in cycle insurance

function approveAmount(reqAmount) {
    if (reqAmount < 100000) {
        var appAmount = reqAmount / 2
        return appAmount
    } else {
        var appAmount = 50000
        return appAmount
    }
    return appAmount
}


// function print(doc) {
//     doc.autoPrint();
//     window.open(doc.output('bloburl'), "_blank");
// }

function print(doc, data) {
    if (data != undefined) {
        const info = {
            ...data,
            print: 1
        }

        if (data.print === 0) {
            let status = 0;
            if (data.travel_allowance_id != undefined) {
                fetch(main_url + 'allowance/updatePrint/' + data.travel_allowance_id, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `info=${JSON.stringify(info)}`

                }).then(res => {
                    status = res.status;
                    return res.text()
                })
                    .then(text => {
                        if (status === 200) {
                            // alert("Printed!");
                            window.location.reload();
                        }
                    })
            } else if (data.salary_advance_id != undefined) {
                fetch(main_url + 'salary_advance/updatePrintSalary/' + data.salary_advance_id, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `info=${JSON.stringify(info)}`

                }).then(res => {
                    status = res.status;
                    return res.text()
                })
                    .then(text => {
                        if (status === 200) {
                            // alert("Printed!");
                            window.location.reload();
                        }
                    })
            }
            else if (data.benefit_id != undefined && data.spouse_name != undefined) {
                fetch(main_url + 'wedding_benefit/printUpdateWedding/' + data.benefit_id, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `info=${JSON.stringify(info)}`

                }).then(res => {
                    status = res.status;
                    return res.text()
                })
                    .then(text => {
                        if (status === 200) {
                            // alert("Printed!");
                            window.location.reload();
                        }
                    })
            }
            else if (data.child_benefit_id != undefined) {
                fetch(main_url + 'child_benefit/printUpdateChild/' + data.child_benefit_id, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `info=${JSON.stringify(info)}`

                }).then(res => {
                    status = res.status;
                    return res.text()
                })
                    .then(text => {
                        if (status === 200) {
                            // alert("Printed!");
                            window.location.reload();
                        }
                    })
            }

            else if (data.funeral_benefit_id != undefined) {
                fetch(main_url + 'funeral_benefit/printUpdateFuneral/' + data.funeral_benefit_id, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `info=${JSON.stringify(info)}`

                }).then(res => {
                    status = res.status;
                    return res.text()
                })
                    .then(text => {
                        if (status === 200) {
                            // alert("Printed!");
                            window.location.reload();
                        }
                    })
            }
            else if (data.external_training_id != undefined) {
                fetch(main_url + 'external_benefit/printUpdateExternal/' + data.external_training_id, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `info=${JSON.stringify(info)}`

                }).then(res => {
                    status = res.status;
                    return res.text()
                })
                    .then(text => {
                        if (status === 200) {
                            // alert("Printed!");
                            window.location.reload();
                        }
                    })
            }
            else if (data.medical_benefit_id != undefined) {
                fetch(main_url + 'medical_benefit/printUpdateMedical/' + data.medical_benefit_id, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `info=${JSON.stringify(info)}`

                }).then(res => {
                    status = res.status;
                    return res.text()
                })
                    .then(text => {
                        if (status === 200) {
                            // alert("Printed!");
                            window.location.reload();
                        }
                    })
            }
            else if (data.birthday_benefit_id != undefined) {
                fetch(main_url + 'birthday_benefit/printUpdateBirthday/' + data.birthday_benefit_id, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `info=${JSON.stringify(info)}`

                }).then(res => {
                    status = res.status;
                    return res.text()
                })
                    .then(text => {
                        if (status === 200) {
                            // alert("Printed!");
                            window.location.reload();
                        }
                    })
            }
            else if (data.benefit_id != undefined && data.quater_id != undefined) {
                fetch(main_url + 'team_building/printUpdateTeamBuilding/' + data.benefit_id, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `info=${JSON.stringify(info)}`

                }).then(res => {
                    status = res.status;
                    return res.text()
                })
                    .then(text => {
                        if (status === 200) {
                            // alert("Printed!");
                            window.location.reload();
                        }
                    })
            }
            else if (data.other_benefit_id != undefined) {
                fetch(main_url + 'benefit/printUpdateOther/' + data.other_benefit_id, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `info=${JSON.stringify(info)}`

                }).then(res => {
                    status = res.status;
                    return res.text()
                })
                    .then(text => {
                        if (status === 200) {
                            // alert("Printed!");
                            window.location.reload();
                        }
                    })
            } else if (data.hospitalization_benefit_id != undefined) {
                fetch(main_url + 'hospitalization_benefit/printUpdateHospitalization/' + data.hospitalization_benefit_id, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `info=${JSON.stringify(info)}`

                }).then(res => {
                    status = res.status;
                    return res.text()
                })
                    .then(text => {
                        if (status === 200) {
                            // alert("Printed!");
                            window.location.reload();
                        }
                    })
            }

            else if (data.cycle_insurance_benefit_id != undefined) {
                fetch(main_url + 'cycleInsurance/printCycleInsurance/' + data.cycle_insurance_benefit_id, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `info=${JSON.stringify(info)}`

                }).then(res => {
                    status = res.status;
                    return res.text()
                })
                    .then(text => {
                        if (status === 200) {
                            // alert("Printed!");
                            window.location.reload();
                        }
                    })
            }
        }
        doc.autoPrint();
        window.open(doc.output('bloburl'), "_blank")
    } else {

        doc.autoPrint();
        window.open(doc.output('bloburl'), "_blank")
    }
}

function getFirstDayOfMonth() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    return firstDay;
}
function getFirstDayOfYear() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, 0, 1);
    return firstDay;
}
function getFirstDayOfPrevMonth(){
    var date = new Date(),y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m - 2, 1);
    return firstDay;
}
function getLastDayOfMonth(y, m) {
    return new Date(y, m + 1, 0).getDate();
}

async function getLoginUser(id) {
    var user = getCookieData("user_info");
    if (user === null) {
        if (id !== '') {
            user = await getUserInfoLogin(id);
            if (user.length > 0) {
                setCookieData("user_info", JSON.stringify(user[0]));
                localStorage.setItem('user_id', user[0].user_id);
                return user[0];
            } else return user;
        } else return user;

    } else return user;
}

async function getUserInfoLogin(id) {
    var res = await fetch(`${main_url}main/getUserInfoLogin/${id}`)
    if (res.ok) return res.json();
    else return null;
}

async function getUserInfo(id) {
    var res = await fetch(`${main_url}main/getUserInfo/${id}`)
    if (res.ok) return res.json();
    else return null;
}

async function getBranch() {
    var res = await fetch(`${main_url}main/getBranch`);
    if (res.ok) return res.json();
    else return [];
}
async function getRegion() {
    var res = await fetch(`${main_url}benefit/getRegionList`);
    if (res.ok) return res.json();
    else return [];

}
async function getPersonType() {
    var res = await fetch(`${main_url}main/getPersonType`);
    if (res.ok) return res.json();
    else return [];
}
async function getTicketCategoryType() {
    var res = await fetch(`${main_url}main/getTicketCategoryType`);
    if (res.ok) return res.json();
    else return [];
}

async function getDesignation() {
    var res = await fetch(`${main_url}permission/getDesignation`);
    if (res.ok) return res.json();
    else return [];
}
async function getLevel() {
    var res = await fetch(`${main_url}main/getLevel`);
    if (res.ok) return res.json();
    else return [];
}
// @lucy&kpk
// async function getEmployeeId() {
//     var res = await fetch(`${main_url}benefit/getEmployeeList`);
//     if (res.ok) return res.json();
//     else return [];
// }

function removeCookieData(name) {
    sessionStorage.removeItem("user_info")
    // cookies.remove(name);
}

function setCookieData(name, value) {
    var encrypt_text = CryptoJS.AES.encrypt(value, 'encrypt');
    // cookies.set(name, value, { path: '/' });
    // var now = new Date();
    // var time = now.getTime();
    // time += 3 * 60 * 1000;
    // now.setTime(time);
    // document.cookie = name + "=" + encrypt_text + ";expires=" + now.toUTCString() + ";path=" + remote_url;
    sessionStorage.setItem(name, encrypt_text);
}

function getCookieData(name) {
    // var data = cookies.get(name);
    // if (data) {
    //     // data.replace('=', '');
    //     // data = JSON.parse(data);
    //     return data;
    // }
    // name = name + "=";
    // var decodedCookie = decodeURIComponent(document.cookie);
    // var ca = decodedCookie.split(';');
    // for (var i = 0; i < ca.length; i++) {
    //     var c = ca[i];
    //     while (c.charAt(0) === ' ') {
    //         c = c.substring(1);
    //     }
    //     if (c.indexOf(name) === 0) {
    //         var data = c.substring(name.length, c.length);
    //         var decrypt_text = CryptoJS.AES.decrypt(data, 'encrypt');
    //         data = JSON.parse(decrypt_text.toString(CryptoJS.enc.Utf8));
    //         return data;
    //     }
    // }
    // return null;
    var data = sessionStorage.getItem(name);
    if (data !== null) {
        var decrypt_text = CryptoJS.AES.decrypt(data, 'encrypt');
        data = JSON.parse(decrypt_text.toString(CryptoJS.enc.Utf8));
    }
    return data;

    // return null;
}

function getUserId(name) {
    let user = getCookieData(name);
    if (user !== null) {
        let id = user.user_id;
        if (id > 0) {
            return id;
        }
        else return 0;
    }
}

function isRequestedUser(updatedUser, createdUser) {
    if (updatedUser === createdUser) {
        return false;
    }
    else {
        return false;
    }
}

function getMainRole() {
    var data = sessionStorage.getItem("user_info");
    if (data !== null) {
        var decrypt_text = CryptoJS.AES.decrypt(data, 'encrypt');
        data = JSON.parse(decrypt_text.toString(CryptoJS.enc.Utf8));
        if (data.role_id === 1 || data.role_id === 2 || data.role_id === 3) return true;
        else return false;
    }
    return false;
}

function checkApprovalStatus(dept, total_amount) {
    if (total_amount >= limit_amount && dept === 'Head Office') {
        return true;
    } else {
        return false;
    }
}

async function checkForStaffComplain(id) {
    var res = await fetch(`${main_url}main/checkForStaffComplain/${id}`);
    if (res.ok) return res.json();
    else return [];
}

async function getCOEmployeeList(id) {
    var res = await fetch(`${main_url}main/getCOEmployeeList/${id}`);
    if (res.ok) return res.json();
    else return [];
}

async function getFXEmployeeList(id) {
    var res = await fetch(`${main_url}main/getFXEmployeeList/${id}`);
    if (res.ok) return res.json();
    else return [];
}

function getActionStatus(status, data, createdBy, comment) {
    var action = {
        referback_by: data.referback_by,
        checked_by: data.checked_by,
        verified_by: data.verified_by,
        approved_by: data.approved_by,
        rejected_by: data.rejected_by,
        referback_date: data.referback_date,
        checked_date: data.checked_date,
        verified_date: data.verified_date,
        approved_date: data.approved_date,
        rejected_date: data.rejected_date,
        referback_comment: data.referback_comment,
        checked_comment: data.checked_comment,
        verified_comment: data.verified_comment,
        approved_comment: data.approved_comment,

        status: data.status
    }
    if (status === 'referback') {
        action.referback_by = createdBy;
        action.referback_date = new Date();
        action.referback_comment = comment
        action.status = 5;
    }
    else if (status === 'checked') {
        action.checked_by = createdBy;
        action.checked_date = new Date();
        action.status = 1;
    }
    else if (status === 'verified') {
        action.verified_by = createdBy;
        action.verified_date = new Date();
        action.status = 2;
    }
    else if (status === 'approved') {
        action.approved_by = createdBy;
        action.approved_date = new Date();
        action.status = 3
    }
    else if (status === 'rejected') {
        if (action.status === 0) {
            action.checked_by = createdBy;
            action.verified_by = 0;
            action.approved_by = 0;
            action.checked_comment = comment;
        } else if (action.status === 1) {
            action.verified_by = createdBy;
            action.checked_by = 0;
            action.approved_by = 0;
            action.verified_comment = comment;
        } else if (action.status === 2) {
            action.approved_by = createdBy;
            action.verified_by = 0;
            action.checked_by = 0;
            action.approved_comment = comment;
        }

        action.rejected_by = createdBy;
        action.rejected_date = new Date();
        action.status = 4;
    }
    return action;
}

async function getTrainingVenue() {

    let res = await fetch(main_url + "allowance/getTrainingVenue")
    if (res.ok)
        return res.json()
    else return []
}
async function imageError(e) {
    e.target.src = "assets/img/SeekPng.com_profile-icon-png_9665493.png";

}
async function getTicketMainCategory() {
    let res = await fetch(main_url + "helpDesk/getTicketMainCategory")
    if (res.ok)
        return res.json()
    else return []
}

async function getTicketSubCategory() {
    let res = await fetch(main_url + "helpDesk/getTicketSubCategory")
    if (res.ok)
        return res.json()
    else return []
}

async function getTicketStatus() {
    let res = await fetch(main_url + "helpDesk/getTicketStatus")
    if (res.ok)
        return res.json()
    else return []
}

// async function getOpenClose() {
//     let res = await fetch(main_url + "helpDesk/getOpenClose")
//     if (res.ok)
//         return res.json()
//     else return []
// }

async function getPriority() {
    let res = await fetch(main_url + "helpDesk/getPriority")
    if (res.ok)
        return res.json()
    else return []
}

async function getSeverity() {
    let res = await fetch(main_url + "helpDesk/getSeverity")
    if (res.ok)
        return res.json()
    else return []
}

async function getBranchByHelpDesk() {
    let res = await fetch(main_url + "helpDesk/getBranch")
    if (res.ok)
        return res.json()
    else return []
}

async function getWorkFlowStatus(request_id, user_id, title, type) {
    let res = await fetch(`${main_url}main/getWorkFlowStatus/${request_id}/${user_id}/${title}/${type}`)
    if (res.ok)
        return await res.json()
    else return { check_by: 0, verify_by: 0, approve_by: 0 }
}

async function getPermissionStatus(designations_id, title, type) {
    let res = await fetch(`${main_url}main/getPermissionStatus/${designations_id}/${title}/${type}`)

    if (res.ok)
        return res.json()
    else return { isAddNew: 0, isEdit: 0, isView: 0 }
}

function validate(id) {
    var errorlist = [];
    var formid = `#${id}`;
    var check_inputid = formid + " input.checkValidate";
    var check_divid =
        formid + " div.checkValidate .react-select__value-container";
    var check_txtareaid = formid + " textarea.checkValidate";
    var inputlist = document.querySelectorAll(check_inputid);
    var divlist = document.querySelectorAll(check_divid);
    var txtarealist = document.querySelectorAll(check_txtareaid);
    for (let i = 0; i < txtarealist.length; i++) {

        if (txtarealist[i].value.trim() === "" || txtarealist[i].value === '0') {
            txtarealist[i].style.border = "1px solid red";
            errorlist.push({
                status: false
            });
        } else {
            txtarealist[i].style.border = "1px solid #eee";
            errorlist.push({
                status: true
            });
        }
    }
    for (let i = 0; i < inputlist.length; i++) {

        if (inputlist[i].value.trim() === "" || inputlist[i].value <= 0) {
            inputlist[i].style.border = "1px solid red";
            errorlist.push({
                status: false
            });
        } else {
            inputlist[i].style.border = "1px solid #eee";
            errorlist.push({
                status: true
            });
        }
    }
    for (let i = 0; i < divlist.length; i++) {
        let par = divlist[i];
        let notes = null;
        for (let i = 0; i < par.childNodes.length; i++) {
            if (
                par.childNodes[i].className ===
                "react-select__single-value css-1uccc91-singleValue"
            ) {
                notes = par.childNodes[i].innerHTML;
                break;
            }
        }
        if (notes === null) {
            par.parentElement.style.border = "1px solid red";
            errorlist.push({
                status: false
            });
        } else {
            par.parentElement.style.border = "1px solid #eee";
            errorlist.push({
                status: true
            });
        }
    }
    let status = true;
    for (let i = 0; i < errorlist.length; i++) {
        if (errorlist[i].status === false) {
            status = false;
            break;
        } else {
            status = true;
        }
    }
    if (status === true) {
        return true;
    } else return false;
}

async function getDepartment() {
    var res = await fetch(`${main_url}main/getDepartment`);
    if (res.ok) return res.json();
    else return [];

}

function havePermissionForAmount(status, user_id) {
    let user_info = getCookieData("user_info");
    if ((status.check_by > 0 || status.verify_by > 0 || status.approve_by > 0
        || user_info.designations === 'CEO') && user_id !== user_info.user_id) {
        return true;
    } else {
        return false;
    }
}

function havePermission(status, user_id) {
    let user_info = getCookieData("user_info");
    if (user_id && user_id == user_info.user_id) {
        return false
    } else {
        if (status.check_by > 0 || status.verify_by > 0 || status.approve_by > 0
            || user_info.designations === 'CEO') {
            return true;
        } else {
            return false;
        }
    }

}

function isApprover(user_id) {
    var user = getCookieData("user_info");
    if (user.user_id !== user_id) return true;
    else return false;
}

async function getInformation(path, id) {
    var res = await fetch(`${main_url}${path}/getOneDetailInfo/${id}`);
    if (res.ok) return res.json();
    else return [];

}

async function getLimitAmount() {
    if (limit_amount > 0) return limit_amount;
    else {
        var res = await fetch(`${main_url}main/getLimitAmount`)
        if (res.ok) return res.json();
        else return 0;
    }
}

function checkAmount(amount) {
    var user = getCookieData("user_info");
    // if (amount < limit_amount && approve_by === 1) return true;
    if (amount >= limit_amount && user.designations === 'CEO') return true;
    else return false;
}

function checkLimitAmount(amount) {
    if (amount < limit_amount) return true;
    else return false;
}

function checkHRManager() {
    var user = getCookieData("user_info");
    if (user.designations === 'HR Manager') return true;
    else return false;
}

function checkHRAssistant() {
    var user = getCookieData("user_info");
    if (user.designations === 'HR Assistant') return true;
    else return false;
}
async function setPrintedStatus(path, id) {
    var res = await fetch(`${main_url}${path}/setPrintedStatus/${id}`)
    if (res.ok) {
        window.location.reload();
    }
}

function stopSaving() {
    $('#saving_button').attr('disabled', true);
    // toast.error("Please Choose Attachment File!");
}

function startSaving() {
    $('#saving_button').attr('disabled', false);
}

const atten_report = {
    work: 1,
    work_in_holiday: 2,
    work_in_pholiday: 3,
    approve_leave: 4,
    not_approve_leave: 5,
    absent: 6,
    holiday: 7,
    pholiday: 8
}

async function getAttendancePolicy() {
    var res = await fetch(`${main_url}attendancePolicy/getAttendancePolicy`);
    if (res.ok) return res.json();
    else return [];
}

async function getDesignationData() {
    var res = await fetch(`${main_url}designation/getDesignation`);
    if (res.ok) return res.json();
    else return [];
}

export {
    main_url, remote_url, getUserInfo, setCookieData, getCookieData,
    getUserId, getActionStatus, getDesignation, getBranch, getTicketCategoryType, getRegion,
    getTrainingVenue, getMainRole, getPermissionStatus, getSeverity, getPersonType,
    getBranchByHelpDesk, getPriority, getTicketStatus, getTicketMainCategory, getTicketSubCategory,
    validate, checkForStaffComplain, getDepartment, getWorkFlowStatus,
    getCOEmployeeList, getFXEmployeeList, alertText, getLevel, havePermission,
    getInformation, checkAmount, setPrintedStatus, removeCookieData, getLoginUser,
    print, stopSaving, startSaving, fno, getFirstDayOfMonth, getFirstDayOfYear, checkLimitAmount,
    checkHRManager, checkHRAssistant, checkApprovalStatus, isApprover, havePermissionForAmount,
    calculationDate, isRequestedUser, atten_report, approveAmount, calculationDate1, getAttendancePolicy,
    getDesignationData, calculationWorkingExp, getLastDayOfMonth, imageError,getFirstDayOfPrevMonth,getFirstDayOfNextMonth
}