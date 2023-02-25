import { main_url } from "../../../utils/CommonFunction"

const getLeaveRequest = async (userId, setData) => {
    await fetch(main_url + `dashboard/leaveRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error leave ===>", error);
    })
}
const getFuneralRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/funeralRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error leave ===>", error);
    })
}

const getTeamBulidingRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/teamBuildingRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error leave ===>", error);
    })
}

const getHospitalRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/hospitalRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error leave ===>", error);
    })
}

const getTravelRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/travelRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error travel ===>", error);
    })
}

const getMedicalRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/medicalRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error medical ===>", error);
    })
}

const getExternalRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/externalRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error external ===>", error);
    })
}

const getWeddingRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/weddingRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error wedding ===>", error);
    })
}

const getChildRequest = async (userId, setData) => {
    await fetch(main_url + `dashboard/childRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error child ===>", error);
    })
}

const getSalaryRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/salaryRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error salary ===>", error);
    })
}

const getBirthdayRequest = async (userId, setData) => {
    await fetch(main_url + `dashboard/birthdayRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error birthday ===>", error);
    })
}

const getConfirmationRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/confirmationRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error confirmation ===>", error);
    })
}



const getCycleRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/cycleRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error staff complain ===>", error);
    })
}

const getOtherRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/otherRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error staff complain ===>", error);
    })
}

const getTrainingRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/trainingRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error staff complain ===>", error);
    })
}

const getPhoneRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/phoneRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error staff complain ===>", error);
    })
}

const getPetrolRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/petrolRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error staff complain ===>", error);
    })
}
const getAttRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/attendance/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error staff complain ===>", error);
    })
}
const getHolidayAttRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/holiday/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error staff complain ===>", error);
    })
} 
const getStaffLoanRequest = async (userId, setData) => {
    await fetch(main_url + `dashboard/staffLoanRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error staff complain ===>", error);
    })
}
const getStaffComplainRequest  = async (userId, setData) => {
    await fetch(main_url + `dashboard/staffComplainRequest`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error staff complain ===>", error);
    })
}

const getHelpDeskRequest =async (userId, setData) => {
    await fetch(main_url + `dashboard/helpDeskRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch(error => {
        console.log('error helpdesk request ===>', error);
    })
}
export const thingsToDoController = {
    getLeaveRequest,
    getBirthdayRequest,
    getChildRequest,
    getExternalRequest,
    getMedicalRequest,
    getSalaryRequest,
    getTravelRequest,
    getWeddingRequest,
    getConfirmationRequest,
    getStaffComplainRequest,
    getFuneralRequest,
    getTeamBulidingRequest,
    getHospitalRequest,
    getCycleRequest,
    getOtherRequest,
    getTrainingRequest,
    getPhoneRequest,
    getPetrolRequest,
    getHelpDeskRequest,
    getAttRequest,
    getHolidayAttRequest,
    getStaffLoanRequest
}