import { main_url } from "../../../utils/CommonFunction"

const getLeaveRequest = (userId, setData) => {
    fetch(main_url + `dashboard/leaveRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error leave ===>", error);
    })
}
const getFuneralRequest = (userId, setData) => {
    fetch(main_url + `dashboard/funeralRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error leave ===>", error);
    })
}

const getTeamBulidingRequest = (userId, setData) => {
    fetch(main_url + `dashboard/teamBuildingRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error leave ===>", error);
    })
}

const getHospitalRequest = (userId, setData) => {
    fetch(main_url + `dashboard/hospitalRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error leave ===>", error);
    })
}

const getTravelRequest = (userId, setData) => {
    fetch(main_url + `dashboard/travelRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error travel ===>", error);
    })
}

const getMedicalRequest = (userId, setData) => {
    fetch(main_url + `dashboard/medicalRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error medical ===>", error);
    })
}

const getExternalRequest = (userId, setData) => {
    fetch(main_url + `dashboard/externalRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error external ===>", error);
    })
}

const getWeddingRequest = (userId, setData) => {
    fetch(main_url + `dashboard/weddingRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error wedding ===>", error);
    })
}

const getChildRequest = (userId, setData) => {
    fetch(main_url + `dashboard/childRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error child ===>", error);
    })
}

const getSalaryRequest = (userId, setData) => {
    fetch(main_url + `dashboard/salaryRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error salary ===>", error);
    })
}

const getBirthdayRequest = (userId, setData) => {
    fetch(main_url + `dashboard/birthdayRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error birthday ===>", error);
    })
}

const getConfirmationRequest = (userId, setData) => {
    fetch(main_url + `dashboard/confirmationRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error confirmation ===>", error);
    })
}



const getCycleRequest = (userId, setData) => {
    fetch(main_url + `dashboard/cycleRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error staff complain ===>", error);
    })
}

const getOtherRequest = (userId, setData) => {
    fetch(main_url + `dashboard/otherRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error staff complain ===>", error);
    })
}

const getTrainingRequest = (userId, setData) => {
    fetch(main_url + `dashboard/trainingRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error staff complain ===>", error);
    })
}

const getPhoneRequest = (userId, setData) => {
    fetch(main_url + `dashboard/phoneRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error staff complain ===>", error);
    })
}

const getPetrolRequest = (userId, setData) => {
    fetch(main_url + `dashboard/petrolRequest/${userId}`).then(response => {
        return response.json();
    }).then(data => {
        setData(data);
    }).catch((error) => {
        console.log("error staff complain ===>", error);
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
   
    getFuneralRequest,
    getTeamBulidingRequest,
    getHospitalRequest,
    getCycleRequest,
    getOtherRequest,
    getTrainingRequest,
    getPhoneRequest,
    getPetrolRequest
}