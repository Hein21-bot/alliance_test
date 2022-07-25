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

export const thingsToDoController = {
    getLeaveRequest,
    getBirthdayRequest,
    getChildRequest,
    getExternalRequest,
    getMedicalRequest,
    getSalaryRequest,
    getTravelRequest,
    getWeddingRequest
}