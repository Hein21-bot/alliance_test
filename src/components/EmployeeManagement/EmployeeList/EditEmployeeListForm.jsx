import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";
import EmployeeProfile from '../EmployeeRegister/EmployeeProfile';
import PersonalDetail from '../EmployeeRegister/PersonalDetail';
import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving, calculationWorkingExp } from "../../../utils/CommonFunction";

import EducationDetails from '../EmployeeRegister/EducationDetails';
import ContactDetails from '../EmployeeRegister/CoantactDetails';
import BankAccountDetails from '../EmployeeRegister/BankAcocuntDetails';
import OtherInfo from '../EmployeeRegister/OtherInfo';
import Attachment from '../EmployeeRegister/Attachment';
import EmploymentDetails from '../EmployeeRegister/EmploymentDetails';

class EditEmployeeListForm extends Component {
    constructor() {
        super();
        this.state = {
            tabIndex: 1,
            userImage: '',
            userImageUrl: null,
            employeeId: '',
            employeeNameEng: '',
            employeeNameMyan: '',
            gender: '',
            dateOfBirth: '',
            nationality: '',
            personalPhone: '',
            officePhone: '',
            region: '',
            address: '',
            joinDate: '',
            fatherName: '',
            martialStatus: '',
            motherName: '',
            parentCount: '',
            siblingCount: '',
            childCount: '',
            pInLawCount: '',
            qualificationList: null,
            selected_degree: null,
            selected_qualification: null,
            period: '',
            designation: '',
            organization: '',
            contactPerson: '',
            contactPhone: '',
            sameWithCtPerson: false,
            guarantor: '',
            guarantorPhone: '',
            guarantorNRC: '',
            guarantorNRC_NO: '',
            disConstatusList: [
                { value: 1, label: 'True' },
                { value: 2, label: 'False' },
            ],
            selected_bank: null,
            accountName: '',
            accountNumber: '',
            bankDataEdit: false,
            bankData: [
            ],
            selected_bankRow_Id: 0,
            trainingCode: '',
            partTimeCode: '',
            customerCode: '',
            ThaPaYaAccount: '',
            SSCCardNo: '',
            attachmentUrl: '',
            employeeStatus: '',
            employeeDesignation: '',
            jobTitle: '',
            carrerLevel: '',
            employeeDetailBranch: '',
            employedDate: '',
            disConStatus: '',
            disConDate: '',
            granDistrictCodeList: null,
            nrcList: null,
            selected_NRC_Id: null,
            selected_DistrictCode: null,
            nrc_number: '',
            selected_gran_NRC_Id: null,
            selected_gran_DistrictCode: null,
            gran_nrc_number: '',
            location: '',
            addedDegreeData: [],
            addedQualitificationData: [],
            singleValue: { year: 2014, month: 11 },
            fromMonthYear: new Date(),
            toMonthYear: new Date(),
            workExpData: [],
            employeeStatusList: [{ value: 1, label: 'Permanent' }, { value: 2, label: 'Part-Time' }, { value: 3, label: 'Training' }],
            editMode: [null, null]

        }
        this.hiddenFileInput = React.createRef();
        this.onStatusChange = this.onStatusChange.bind(this);

    }

    handleNext = e => {
        this.setState({
            tabIndex: this.state.tabIndex + 1
        })
    }


    componentDidMount() {

        this.getEmployeeDetailsData()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedEmployeeData !== this.props.selectedEmployeeData) {
            this.getEmployeeDetailsData()
        }
    }

    getEmployeeDetailsData() {
        // confirmation/getOneDetail/:user_id
        const { selectedEmployeeData, level_options, nrcList, granDistrictCodeList, districtCodeList, branchlist } = this.props
        const { disConstatusList } = this.state
        fetch(`${main_url}confirmation/getOneDetail/${this.props.selectedEmployeeData.user_id}`)

            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.setState({
                        userImage: res[0].avatar,
                        userImageUrl: res[0].avatar,
                        employeeId: res[0].employment_id,
                        employeeNameEng: res[0].fullname,
                        employeeNameMyan: res[0].employee_name_myn,
                        gender: res[0].gender,
                        dateOfBirth: res[0].date_of_birth,
                        nationality: res[0].country,
                        personalPhone: res[0].personal_phone,
                        officePhone: res[0].office_phone,
                        region: res[0].city,
                        address: res[0].address,
                        joinDate: res[0].joining_date,
                        fatherName: res[0].father_name,
                        martialStatus: res[0].maratial_status,
                        motherName: res[0].mother_name,
                        parentCount: res[0].parent_count,
                        siblingCount: res[0].sibling_count,
                        childCount: res[0].child_count,
                        pInLawCount: res[0].parent_in_law_count,
                        addedDegreeData: res[0].degree,
                        addedQualitificationData: res[0].qualification,
                        contactPerson: res[0].contact_person,
                        contactPhone: res[0].contact_person_phone,
                        sameWithCtPerson: res[0].same_with_contact_person,
                        guarantor: res[0].gurantee_person,
                        guarantorPhone: res[0].gurantee_person_phone,
                        bankData: res[0].bank_info,
                        trainingCode: res[0].training_code,
                        partTimeCode: res[0].part_time_code,
                        customerCode: res[0].customer_code,
                        ThaPaYaAccount: res[0].thapyay_account,
                        SSCCardNo: res[0].SSC_card_no,
                        attachmentUrl: res[0].attachment_link,
                        employeeStatus: '',
                        employeeDesignation: this.props.designationList.find(c => c.value == res[0].designations_id),
                        jobTitle: res[0].job_title,
                        carrerLevel: level_options && level_options.find(c => c.value == res[0].career_level_id) ? level_options.find(c => c.value == res[0].career_level_id) : null,
                        employeeDetailBranch: branchlist && branchlist.find(c => c.value == res[0].branch_name) ? branchlist.find(c => c.value == res[0].branch_name) : null,
                        employedDate: res[0].employ_date,
                        disConStatus: res[0].discontinued_status == 1 ? disConstatusList.find(c => c.value == 1) : disConstatusList.find(c => c.value == 1),
                        disConDate: res[0].discontinued_date,
                        selected_NRC_Id: nrcList && nrcList.find(c => c.value == res[0].NRC_SD_code) ? nrcList.find(c => c.value == res[0].NRC_SD_code) : null,
                        selected_DistrictCode: districtCodeList && districtCodeList.find(c => c.value == res[0].NRC_District_code) ? districtCodeList.find(c => c.value == res[0].NRC_District_code) : null,////
                        nrc_number: res[0].NRC_no ? res[0].NRC_no : '',
                        selected_gran_NRC_Id: nrcList && nrcList.find(c => parseInt(c.value) == res[0].NRC_SD_code_guarantee) ? nrcList.find(c => parseInt(c.value) == res[0].NRC_SD_code_guarantee) : null,
                        selected_gran_DistrictCode: granDistrictCodeList && granDistrictCodeList.find(c => c.id == res[0].NRC_District_code_guarantee) ? granDistrictCodeList.find(c => c.id == res[0].NRC_District_code_guarantee) : null,
                        gran_nrc_number: res[0].NRC_no_guarantee ? res[0].NRC_no_guarantee : '',
                        workExpData: res[0].work_experience,
                        fullNRC: res[0].nrc,
                        guaFullNRC: res[0].NRC_full_gurantee,
                    })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    updateEmployee = () => {
        const { selected_NRC_Id, userImage, userImageUrl, employeeId, employeeNameEng, employeeNameMyan, dateOfBirth, gender, nationality, personalPhone, region, officePhone, selected_DistrictCode, nrc_number, selected_gran_NRC_Id, disConDate, disConStatus,
            addedDegreeData, addedQualitificationData, workExpData, contactPerson, contactPhone, checked, guarantor, guarantorPhone, bankData, address, joinDate, martialStatus, fatherName, motherName, parentCount, siblingCount, childCount, pInLawCount,
            trainingCode, partTimeCode, customerCode, ThaPaYaAccount, SSCCardNo, attachmentUrl, employeeStatus, employeeDesignation, jobTitle, carrerLevel, employeeDetailBranch, employedDate, selected_gran_DistrictCode, gran_nrc_number } = this.state
        let fullNRCNO = `${selected_NRC_Id ? selected_NRC_Id.label : ''} ${selected_DistrictCode ? selected_DistrictCode.label : ''} ${nrc_number}`
        let guarantorNRC = `${selected_gran_NRC_Id ? selected_gran_NRC_Id.label : ''} ${selected_gran_DistrictCode ? selected_gran_DistrictCode.label : ''} ${gran_nrc_number}`
        var data = {
            employeeId: employeeId,
            employeeNameEng: employeeNameEng,
            employeeNameMyan: employeeNameMyan,
            fullNRCNO: fullNRCNO,
            dateOfBirth: dateOfBirth,
            gender: gender,
            nationality: nationality,
            personalPhone: personalPhone,
            region: region,
            officePhone: officePhone,
            address: address,
            joinDate: joinDate,
            martialStatus: martialStatus,
            fatherName: fatherName,
            motherName: motherName,
            parentCount: parentCount,
            siblingCount: siblingCount,
            childCount: childCount,
            pInLawCount: pInLawCount,
            addedDegreeData: addedDegreeData,
            contactPerson: contactPerson,
            contactPhone: contactPhone,
            checked: checked,
            guarantor: guarantor,
            guarantorNRC: guarantorNRC,
            guarantorPhone: guarantorPhone,
            trainingCode: trainingCode,
            partTimeCode: partTimeCode,
            customerCode: customerCode,
            ThaPaYaAccount: ThaPaYaAccount,
            SSCCardNo: SSCCardNo,
            attachmentUrl: attachmentUrl,
            employeeStatus: employeeStatus ? employeeStatus.value : null,
            employeeDesignation: employeeDesignation ? employeeDesignation.value : null,
            jobTitle: jobTitle,
            carrerLevel: carrerLevel ? carrerLevel.value : null,
            employeeDetailBranch: employeeDetailBranch ? employeeDetailBranch.value : null,
            employedDate: employedDate,
            disConStatus: disConStatus ? disConStatus.value : null,
            disConDate: disConDate,
            user_id: getCookieData("user_info").user_id,
            NRC_SD_code: selected_NRC_Id ? selected_NRC_Id.value : null,
            NRC_District_code: selected_DistrictCode ? selected_DistrictCode.value : null,
            NRC_no: nrc_number,
            NRC_SD_code_gurantee: selected_gran_NRC_Id ? selected_gran_NRC_Id.value : null,
            NRC_District_code_gurantee: selected_gran_DistrictCode ? selected_gran_DistrictCode.value : null,
            NRC_no_gurantee: gran_nrc_number,
            same_with_CT_person: this.state.sameWithCtPerson ? 1 : 0
        }
        const formdata = new FormData();
        formdata.append('data', JSON.stringify(data))
        formdata.append('bank', JSON.stringify(bankData))
        formdata.append('work_experience', JSON.stringify(workExpData))
        formdata.append('qualification', JSON.stringify(addedQualitificationData))
        formdata.append('degree', JSON.stringify(addedDegreeData))
        formdata.append('uploadProfile', userImageUrl)
        let status = 0;
        fetch(`${main_url}employee/editEmployee/${this.props.selectedEmployeeData.user_id}`, {
            method: "POST",
            body: formdata
        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                if (status === 200) {
                    toast.success(text);

                    window.location.reload();
                }
                else toast.error(text);
                 window.location.replace("/employee_list");

            })
    }

    handleClick = event => {
        event.preventDefault()
        this.hiddenFileInput.current.click();
    };

    handleChange = event => {
        event.preventDefault()
        const file = event.target.files
        const fileUploaded = file[0];

        this.setState({
            userImage: window.URL.createObjectURL(file[0]),
            userImageUrl: fileUploaded
        })

    }

    handleAttachmentChange = event => {

        this.setState({
            attachmentUrl: event.target.value
        })

    }

    handleInputChange = e => {
        if (e.target.name === "employeeId") {
            this.setState({
                employeeId: e.target.value
            })
        }
        else if (e.target.name === "employeeNameEng") {
            this.setState({
                employeeNameEng: e.target.value
            })
        }
        else if (e.target.name === "employeeNameMyan") {
            this.setState({
                employeeNameMyan: e.target.value
            })
        }
        else if (e.target.name === "dateOfBirth") {
            this.setState({
                dateOfBirth: e.target.value
            })
        }
        else if (e.target.name === "nationality") {
            this.setState({
                nationality: e.target.value
            })
        }
        else if (e.target.name === "personalPhone") {
            this.setState({
                personalPhone: e.target.value
            })
        }
        else if (e.target.name === "officePhone") {
            this.setState({
                officePhone: e.target.value
            })
        }
        else if (e.target.name === "region") {
            this.setState({
                region: e.target.value
            })
        }
        else if (e.target.name === "address") {
            this.setState({
                address: e.target.value
            })
        }
        else if (e.target.name === "joinDate") {
            this.setState({
                joinDate: e.target.value
            })
        }
        else if (e.target.name === "nrc_number" && this.state.selected_NRC_Id && this.state.selected_DistrictCode) {

            this.setState({
                nrc_number: e.target.value,
                fullNRC: this.state.selected_NRC_Id.label + '/' + this.state.selected_DistrictCode.label + '(N)/' + e.target.value
            })
        }
        else if (e.target.name === "nrc_number" && !this.state.selected_NRC_Id) {
            toast.error("Please Choose Sd code first!")
        }
        else if (e.target.name === "nrc_number" && !this.state.selected_DistrictCode) {
            toast.error("Please Choose Dtstrict code first!")
        }


    }


    handleBankDetailInputChange = (e) => {
        if (e.target.name === "accountName") {
            this.setState({
                accountName: e.target.value.toUpperCase()
            })
        }
        else if (e.target.name === "accountNumber") {
            this.setState({
                accountNumber: e.target.value
            })
        }


    }
    handleOtherInfoInputChange = (e) => {
        if (e.target.name === "trainingCode") {
            this.setState({
                trainingCode: e.target.value
            })
        }
        else if (e.target.name === "partTimeCode") {
            this.setState({
                partTimeCode: e.target.value
            })
        }
        else if (e.target.name === "customerCode") {
            this.setState({
                customerCode: e.target.value
            })
        }
        else if (e.target.name === "ThaPaYaAccount") {
            this.setState({
                ThaPaYaAccount: e.target.value
            })
        }
        else if (e.target.name === "SSCCardNo") {
            this.setState({
                SSCCardNo: e.target.value
            })
        }


    }
    handleEmploymentDetailInputChange = (e) => {

        if (e.target.name === "jobTitle") {
            this.setState({
                jobTitle: e.target.value
            })
        }

        else if (e.target.name === "employedDate") {
            this.setState({
                employedDate: e.target.value
            })
        }
        else if (e.target.name === "disConDate") {
            this.setState({
                disConDate: e.target.value
            })
        }


    }

    onGenderChange = e => {
        this.setState({
            gender: e.target.value
        })
    }
    onStatusChange = e => {
        this.setState({
            martialStatus: e.target.value
        })
    }
    handleSelectedDegree = (event) => {
        if (event !== null)
            this.setState({
                selected_degree: event
            })
    };
    handleSelectedBank = (event) => {
        if (event !== null)
            this.setState({
                selected_bank: event
            })
    };
    handleSelectedBranch = (event) => {
        if (event !== null)
            this.setState({
                employeeDetailBranch: event
            })
    };
    handleSelectedDistrictCode = (event) => {
        if (event !== null && this.state.selected_NRC_Id)
            this.setState({
                selected_DistrictCode: event,
                fullNRC: (this.state.selected_NRC_Id === null ? '' : this.state.selected_NRC_Id.label) + '/' + event.label + '(N)/' + (this.state.nrc_number ? this.state.nrc_number : '')
            })
        else if (!this.state.selected_NRC_Id) return toast.error("Plese choose sd code first")
    };

    handleSelectedNRCId = (event) => {
        if (event !== null) {
            this.setState({
                selected_NRC_Id: event,
                fullNRC: event.label + '/' + (this.state.selected_DistrictCode === null ? '' : this.state.selected_DistrictCode.label) + '(N)/' + (this.state.nrc_number ? this.state.nrc_number : '')
            })
            // this.props.getNRC_DistrictCode(event.label)
        }
    };

    handleGranDistrictCode = (event) => {
        if (event !== null && this.state.selected_gran_NRC_Id) {
            this.setState({
                selected_gran_DistrictCode: event,
                guaFullNRC: (this.state.selected_gran_NRC_Id === null ? '' : this.state.selected_gran_NRC_Id.label) + event.label + (this.state.gran_nrc_number ? this.state.gran_nrc_number : '')
            })
        }
        else if (!this.state.selected_gran_NRC_Id) return toast.error("Plese choose sd code first")
    };

    handleNRC_Id = (event) => {
        if (event !== null) {
            this.setState({
                selected_gran_NRC_Id: event,
                guaFullNRC: event.label + (this.state.selected_gran_DistrictCode === null ? '' : this.state.selected_gran_DistrictCode.label) + (this.state.gran_nrc_number ? this.state.gran_nrc_number : '')
            })
            // this.props.getGran_NRC_DistrictCode(event.label)
        }

    };
    handleSelectedQualification = (event) => {
        if (event !== null)
            this.setState({
                selected_qualification: event
            })
    };

    handleProfileSave = e => {
        e.preventDefault();
        this.setState({
            tabIndex: this.state.tabIndex + 1
        })
    }

    handlePersonalDetailInputChange = e => {

        if (e.target.name === "fatherName") {
            this.setState({
                fatherName: e.target.value
            })
        }
        else if (e.target.name === "motherName") {
            this.setState({
                motherName: e.target.value
            })
        }
        else if (e.target.name === "parentCount") {
            this.setState({
                parentCount: e.target.value
            })
        }
        else if (e.target.name === "siblingCount") {
            this.setState({
                siblingCount: e.target.value
            })
        }
        else if (e.target.name === "childCount") {
            this.setState({
                childCount: e.target.value
            })
        }
        else if (e.target.name === "pInLawCount") {
            this.setState({
                pInLawCount: e.target.value
            })
        }

    }

    handleContactDetailInputChange = e => {

        if (e.target.name === "contactPerson") {
            this.setState({
                contactPerson: e.target.value
            })
        }
        else if (e.target.name === "contactPhone") {
            this.setState({
                contactPhone: e.target.value
            })
        }
        else if (e.target.name === "guarantor") {
            this.setState({
                guarantor: e.target.value
            })
        }
        else if (e.target.name === "guarantorPhone") {
            this.setState({
                guarantorPhone: e.target.value
            })
        }

        else if (e.target.name === "gran_nrc_no" && this.state.selected_gran_NRC_Id && this.state.selected_gran_DistrictCode) {

            this.setState({
                gran_nrc_number: e.target.value,
                guaFullNRC: this.state.selected_gran_NRC_Id.label + this.state.selected_gran_DistrictCode.label + e.target.value
            })
        }
        else if (e.target.name === "gran_nrc_no" && !this.state.selected_gran_NRC_Id) {
            toast.error("Please Choose Sd code first!")
        }
        else if (e.target.name === "gran_nrc_no" && !this.state.selected_gran_DistrictCode) {
            toast.error("Please Choose Dtstrict code first!")
        }

    }


    handlePersonalDetail = e => {
        e.preventDefault();
        this.setState({
            tabIndex: this.state.tabIndex + 1
        })

    }
    handleEducationDetails = e => {
        e.preventDefault();
        this.setState({
            tabIndex: this.state.tabIndex + 1
        })

    }

    handleContactDetails = e => {
        e.preventDefault();
        this.setState({
            tabIndex: this.state.tabIndex + 1
        })

    }
    handleBankAccountDetails = e => {
        e.preventDefault();
        this.setState({
            tabIndex: this.state.tabIndex + 1
        })

    }
    handleOtherInfo = e => {
        e.preventDefault();
        this.setState({
            tabIndex: this.state.tabIndex + 1
        })

    }

    handleAttachment = e => {
        e.preventDefault();
        this.setState({
            tabIndex: this.state.tabIndex + 1
        })

    }
    handleEmploymentDetail = e => {
        e.preventDefault();
        this.updateEmployee();
        this.setState({
            tabIndex: 1
        })

    }

    handleWorkExpChange = () => {
        this.setState({
            workExpChecked: !this.state.workExpChecked
        })
    }
    handleSameWithCtPersonChange = () => {
        this.setState({
            sameWithCtPerson: !this.state.sameWithCtPerson
        })
    }

    handleEditBankData = data => {
        this.setState({
            accountName: data.account_name.toUpperCase(),
            accountNumber: data.account_no,
            bankDataEdit: true,
            selected_bank: this.props.bankList.find(c => c.value === data.id),
            selected_bankRow_Id: data.id
        })
    }




    handleAdd_UpdateBankData = (e) => {
        e.preventDefault();
        const { accountName, accountNumber, selected_bank, bankDataEdit, bankData, employeeNameEng, selected_bankRow_Id } = this.state

        if (bankDataEdit) {
            // ("Update")
            const newData = {
                id: selected_bank.value,
                account_no: accountNumber,
                bank_name: selected_bank.label,
                account_name: accountName.toUpperCase()

            }
            for (var i = 0; i < bankData.length; i++) {
                if (bankData[i].id == selected_bankRow_Id) {
                    bankData.splice(i, 1)
                }
            }
            this.setState({
                bankData: bankData.concat(newData),
                bankDataEdit: false,
                accountName: '',
                selected_bank: null,
                accountNumber: ''
            })
        }
        else {
            //("Add")
            const newData = {
                id: bankData.length + 1,
                account_no: accountNumber,
                bank_name: selected_bank.label,
                account_name: accountName.toUpperCase()

            }
            this.setState({
                bankData: bankData.concat(newData),
                accountName: '',
                selected_bank: null,
                accountNumber: ''
            })
        }
    }

    handleDeleteBankData = data => {
        for (var i = 0; i < this.state.bankData.length; i++) {
            if (this.state.bankData[i].id == data.id) {
                this.state.bankData.splice(i, 1)
            }
        }
        this.setState({
            bankData: this.state.bankData,
            bankDataEdit: false,
            accountName: '',
            selected_bank: null,
            accountNumber: ''

        })

    }

    handleAddDegreeData = () => {
        const { selected_degree, addedDegreeData, editMode } = this.state
        if (selected_degree) {
            const deg = {
                id: selected_degree.id,
                name: selected_degree.degree
            }
            console.log("added degree data is ===>", addedDegreeData, selected_degree)
            if (editMode[0] == 'degree') {
                const newObj = [...addedDegreeData]
                newObj.splice(editMode[1], 1, deg)
                this.setState({
                    addedDegreeData: newObj,
                    editMode: [null, null],
                    selected_degree: null
                })
            } else {
                if (addedDegreeData.length > 0) {
                    this.setState({
                        addedDegreeData: addedDegreeData.filter(c => c.id === selected_degree.id).length > 0 ? addedDegreeData : addedDegreeData.concat(deg),
                        selected_degree: null
                    })
                }

                else this.setState({
                    addedDegreeData: addedDegreeData.concat(deg),
                    selected_degree: null
                })
            }

        }
        else toast.error('Please Choose degree at first!')

    }

    handleUpdateDegreeData = (data, id) => {
        this.setState({
            selected_degree: { label: data.name, value: data.id, degree: data.name, ...data },
            editMode: ['degree', id]
        })
    }

    handleAddQualification = () => {
        const { selected_qualification, addedQualitificationData, editMode } = this.state
        console.log("select qual is ===>", selected_qualification)
        if (selected_qualification) {
            if (editMode[0] == 'qualification') {
                const obj = {
                    id: editMode[1],
                    name: selected_qualification
                }
                const newObj = [...addedQualitificationData]
                newObj.splice(editMode[1], 1, obj)
                this.setState({
                    addedQualitificationData: newObj,
                    editMode: [null, null],
                    selected_qualification: ''
                })
            } else {
                let data = {
                    id: addedQualitificationData.length + 1,
                    name: selected_qualification
                }
                console.log('data is ===>', data)
                this.setState({
                    addedQualitificationData: addedQualitificationData.concat(data),
                    selected_qualification: ''
                })
            }
        }
        else toast.error('Please Add Qualifications at first!')
    }

    handleUpdateQualification = (data, id) => {
        this.setState({
            selected_qualification: data.name,
            editMode: ['qualification', id]
        })
    }

    handleSelectedDesignation = (event) => {
        if (event !== null)
            this.setState({
                employeeDesignation: event
            })
    };

    handleSelectedDisConStus = (event) => {
        if (event !== null)
            this.setState({
                disConStatus: event
            })
    };

    handleSelectedEmpStatus = (event) => {
        if (event !== null)
            this.setState({
                employeeStatus: event
            })
    };

    handleLevelSelectorChange = (event) => {
        if (event !== null)
            this.setState({
                carrerLevel: event
            })
    };

    handleAddWorkExp = (e) => {
        e.preventDefault()
        const { workExpData, period, location, designation, fromMonthYear, toMonthYear, organization, editMode } = this.state
        if (editMode[0] == 'work') {
            const obj = {
                period,
                location,
                designation,
                organization,
                from_year: fromMonthYear,
                to_year: toMonthYear
            }
            const newObj = [...workExpData]
            newObj.splice(editMode[1], 1, obj)
            this.setState({
                workExpData: newObj,
                editMode: [null, null],
                period: '',
                location: '',
                designation: '',
                organization: ''
            })
        } else {
            const data = {
                period,
                location,
                designation,
                organization,
                from_year: fromMonthYear,
                to_year: toMonthYear
            }

            this.setState({
                workExpData: workExpData.concat(data),
                period: '',
                location: '',
                designation: '',
                organization: ''
            })
        }

    }

    handleUpdateWorkExp = (data, id) => {
        this.setState({
            period: data.period,
            location: data.location,
            designation: data.designation,
            organization: data.organization,
            from_year: data.from_year,
            to_year: data.to_year,
            editMode: ['work', id]
        })
    }

    handlePreviousClick = () => {
        this.setState({ tabIndex: this.state.tabIndex - 1 })
    }

    handleEduactionInputChange = (e) => {
        e.preventDefault();
        if (e.target.name === "period") {
            this.setState({
                period: e.target.value
            })
        }

        else if (e.target.name === "location") {
            this.setState({
                location: e.target.value
            })
        }
        else if (e.target.name === "qualification") {
            this.setState({
                selected_qualification: e.target.value
            })
        }
        else if (e.target.name === "designation") {
            this.setState({
                designation: e.target.value
            })
        }
        else if (e.target.name === "organization") {
            this.setState({
                organization: e.target.value
            })
        }
    }

    handleToMonthYear = (e) => {
        this.setState({
            toMonthYear: e
        }, async () => {
            this.setState({
                period: await calculationWorkingExp(e, this.state.toMonthYear)
            })
        })
    }

    handleFromMonthYear = (e) => {
        this.setState({
            fromMonthYear: e
        }, async () => {
            this.setState({
                period: await calculationWorkingExp(this.state.toMonthYear, e)
            })
        })
    }

    handleRemoveWorkExp = (id) => {
        const { workExpData } = this.state
        const newObj = [...workExpData]
        newObj.splice(id, 1)
        this.setState({
            workExpData: newObj
        })
    }

    handleRemoveDegreeData = (id) => {
        const { addedDegreeData } = this.state
        const newObj = [...addedDegreeData]
        newObj.splice(id, 1)
        this.setState({
            addedDegreeData: newObj
        })

    }

    handleRemoveQualification = (id) => {
        const { addedQualitificationData } = this.state
        const newObj = [...addedQualitificationData]
        newObj.splice(id, 1)
        this.setState({
            addedQualitificationData: newObj
        })
    }

    cancelEdit = () => {
        this.setState({
            bankDataEdit: false,
            accountName: '',
            selected_bank: null,
            accountNumber: ''

        })
    }

    clearProfileData = () => {
        this.setState({
            userImage: null,
            userImageUrl: null,
            employeeId: '',
            employeeNameEng: '',
            employeeNameMyan: '',
            gender: '',
            dateOfBirth: '',
            nationality: '',
            personalPhone: '',
            officePhone: '',
            region: '',
            address: '',
            joinDate: '',
            workExpChecked: false,

        })
    }


    render() {
        const { tabIndex, userImage, userImageUrl, nrc_number, period, fullNRC, designation, workExpChecked, organization, sameWithCtPerson, selected_bank, trainingCode, partTimeCode, customerCode, ThaPaYaAccount, SSCCardNo,
            fatherName, qualificationList, selected_qualification, selected_degree, motherName, guarantor, guarantorPhone, attachmentUrl, selected_gran_NRC_Id, employeeStatusList, disConstatusList,
            selected_gran_DistrictCode, guaFullNRC, gran_nrc_number, parentCount, siblingCount, childCount, pInLawCount, martialStatus, officePhone, region, address, joinDate, accountName, accountNumber, employeeStatus, employeeDesignation, jobTitle, carrerLevel, employeeDetailBranch, employedDate, disConStatus, disConDate,
            employeeId, employeeNameEng, nationality, personalPhone, employeeNameMyan, gender, addedDegreeData, addedQualitificationData, workExpData, fromMonthYear, toMonthYear, location, dateOfBirth, contactPerson, contactPhone, bankData, bankDataEdit, selected_DistrictCode, selected_NRC_Id,
        } = this.state
        const { selectedEmployeeData, level_options, editForm, BackToTable, viewForm, bankList, degreeList, nrcList, districtCodeList, designationList, branchlist, granDistrictCodeList } = this.props
        console.log('addedDegreeData...', addedQualitificationData)
        return (
            <div className=" border-bottom white-bg dashboard-header">
                <div className='tabBar col-lg-12 col-md-12 col-sm-12 ' style={{ display: 'flex', paddingLeft: 0, paddingRight: 0, flexDirection: 'row', paddingTop: 20, fontSize: 13, minWidth: 300, overflowX: 'auto', alignItems: 'center' }}>
                    <div className='col-lg-2 col-md-2 ' onClick={() => this.setState({ tabIndex: 1 })} style={{
                        paddingTop: 10, paddingBottom: 10, alignItems: 'center', display: 'flex', whiteSpace: 'nowrap', cursor: 'pointer', marginBottom: tabIndex === 1 ? 5 : 0, fontWeight: tabIndex === 1 ? 'bold' : 'normal',
                        minHeight: tabIndex === 1 ? 35 : 30, background: `${tabIndex === 1 ? '#fff' : '#337ab7'}`, paddingLeft: 10, paddingRight: 10, color: tabIndex === 1 ? 'black' : 'white', border: '1px solid lightgrey', borderBottom: 'none', justifyContent: 'center'
                    }}>
                        Employee Profile
                    </div>
                    <div className='col-lg-2 col-md-2' onClick={() => this.setState({ tabIndex: 2 })} style={{
                        paddingTop: 10, paddingBottom: 10, alignItems: 'center', display: 'flex', whiteSpace: 'nowrap', cursor: 'pointer', marginBottom: tabIndex === 2 ? 5 : 0, fontWeight: tabIndex === 2 ? 'bold' : 'normal',
                        minHeight: tabIndex === 2 ? 35 : 30, background: `${tabIndex === 2 ? '#fff' : '#337ab7'}`, paddingLeft: 10, paddingRight: 10, color: tabIndex === 2 ? 'black' : 'white', border: '1px solid lightgrey', borderBottom: 'none', justifyContent: 'center'
                    }}>
                        Personal Detail
                    </div>
                    <div className='col-lg-2 col-md-2' onClick={() => this.setState({ tabIndex: 3 })} style={{
                        paddingTop: 10, paddingBottom: 10, alignItems: 'center', display: 'flex', whiteSpace: 'nowrap', cursor: 'pointer', marginBottom: tabIndex === 3 ? 5 : 0, fontWeight: tabIndex === 3 ? 'bold' : 'normal',
                        minHeight: tabIndex === 3 ? 35 : 30, background: `${tabIndex === 3 ? '#fff' : '#337ab7'}`, paddingLeft: 10, paddingRight: 10, color: tabIndex === 3 ? 'black' : 'white', border: '1px solid lightgrey', borderBottom: 'none', justifyContent: 'center'
                    }}>
                        Education Details
                    </div>
                    <div className='col-lg-2 col-md-2' onClick={() => this.setState({ tabIndex: 4 })} style={{
                        paddingTop: 10, paddingBottom: 10, alignItems: 'center', display: 'flex', whiteSpace: 'nowrap', cursor: 'pointer', marginBottom: tabIndex === 4 ? 5 : 0, fontWeight: tabIndex === 4 ? 'bold' : 'normal',
                        minHeight: tabIndex === 4 ? 35 : 30, background: `${tabIndex === 4 ? '#fff' : '#337ab7'}`, paddingLeft: 10, paddingRight: 10, color: tabIndex === 4 ? 'black' : 'white', border: '1px solid lightgrey', borderBottom: 'none', justifyContent: 'center'
                    }}>
                        Contact Details
                    </div>
                    <div className='col-lg-2 col-md-2' onClick={() => this.setState({ tabIndex: 5 })} style={{
                        paddingTop: 10, paddingBottom: 10, alignItems: 'center', display: 'flex', whiteSpace: 'nowrap', minWidth: 150, cursor: 'pointer', marginBottom: tabIndex === 5 ? 5 : 0, fontWeight: tabIndex === 5 ? 'bold' : 'normal',
                        minHeight: tabIndex === 5 ? 35 : 30, background: `${tabIndex === 5 ? '#fff' : '#337ab7'}`, paddingLeft: 10, paddingRight: 10, color: tabIndex === 5 ? 'black' : 'white', border: '1px solid lightgrey', borderBottom: 'none', justifyContent: 'center'
                    }}>
                        Bank Account Details
                    </div>
                    <div className='col-lg-2 col-md-2' onClick={() => this.setState({ tabIndex: 6 })} style={{
                        paddingTop: 10, paddingBottom: 10, alignItems: 'center', display: 'flex', whiteSpace: 'nowrap', cursor: 'pointer', marginBottom: tabIndex === 6 ? 5 : 0, fontWeight: tabIndex === 6 ? 'bold' : 'normal',
                        minHeight: tabIndex === 6 ? 35 : 30, background: `${tabIndex === 6 ? '#fff' : '#337ab7'}`, paddingLeft: 10, paddingRight: 10, color: tabIndex === 6 ? 'black' : 'white', border: '1px solid lightgrey', borderBottom: 'none', justifyContent: 'center'
                    }}>
                        Other Information
                    </div>
                    <div className='col-lg-2 col-md-2' onClick={() => this.setState({ tabIndex: 7 })} style={{
                        paddingTop: 10, paddingBottom: 10, alignItems: 'center', display: 'flex', whiteSpace: 'nowrap', cursor: 'pointer', marginBottom: tabIndex === 7 ? 5 : 0, fontWeight: tabIndex === 7 ? 'bold' : 'normal',
                        minHeight: tabIndex === 7 ? 35 : 30, background: `${tabIndex === 7 ? '#fff' : '#337ab7'}`, paddingLeft: 10, paddingRight: 10, color: tabIndex === 7 ? 'black' : 'white', border: '1px solid lightgrey', borderBottom: 'none', justifyContent: 'center'
                    }}>
                        Attachment
                    </div>
                    <div className='col-lg-2 col-md-2' onClick={() => this.setState({ tabIndex: 8 })} style={{
                        paddingTop: 10, paddingBottom: 10, alignItems: 'center', display: 'flex', whiteSpace: 'nowrap', minWidth: 130, cursor: 'pointer', marginBottom: tabIndex === 8 ? 5 : 0, fontWeight: tabIndex === 8 ? 'bold' : 'normal',
                        minHeight: tabIndex === 8 ? 35 : 30, background: `${tabIndex === 8 ? '#fff' : '#337ab7'}`, minWidth: 150, paddingLeft: 10, paddingRight: 10, color: tabIndex === 8 ? 'black' : 'white', border: '1px solid lightgrey', borderBottom: 'none', justifyContent: 'center'
                    }}>
                        Employment Details
                    </div>

                </div>
                {
                    tabIndex === 1 ?
                        <EmployeeProfile
                            editForm={editForm}
                            viewForm={viewForm}
                            onCancelClick={BackToTable}
                            userImage={userImage} handleClick={this.handleClick}
                            hiddenFileInput={this.hiddenFileInput}
                            handleChange={this.handleChange} employeeNameEng={employeeNameEng}
                            employeeId={employeeId} handleInputChange={this.handleInputChange}
                            employeeNameMyan={employeeNameMyan}
                            gender={gender} onGenderChange={this.onGenderChange}
                            dateOfBirth={dateOfBirth} nationality={nationality}
                            personalPhone={personalPhone} officePhone={officePhone}
                            region={region} address={address} joinDate={joinDate}
                            handleProfileSave={this.handleProfileSave}
                            clearProfileData={this.clearProfileData}
                            handleSelectedDistrictCode={this.handleSelectedDistrictCode}
                            handleSelectedNRCId={this.handleSelectedNRCId}
                            selected_DistrictCode={selected_DistrictCode}
                            selected_NRC_Id={selected_NRC_Id}
                            districtCodeList={selected_NRC_Id ? districtCodeList.filter(c => c.sd_code == selected_NRC_Id.sd_code) : districtCodeList}
                            nrcList={nrcList}
                            fullNRC={fullNRC}
                            nrc_number={nrc_number}
                        />

                        : tabIndex === 2 ?
                            <PersonalDetail
                                editForm={editForm}
                                viewForm={viewForm}
                                fatherName={fatherName} motherName={motherName}
                                handlePersonalDetailInputChange={this.handlePersonalDetailInputChange}
                                onStatusChange={this.onStatusChange}
                                martialStatus={martialStatus} parentCount={parentCount}
                                siblingCount={siblingCount} childCount={childCount} pInLawCount={pInLawCount}
                                handlePersonalDetail={this.handlePersonalDetail} handlePreviousClick={this.handlePreviousClick}
                                onCancelClick={BackToTable}
                            /> : tabIndex === 3 ?
                                <EducationDetails
                                    editForm={editForm}
                                    viewForm={viewForm}
                                    handleEducationDetails={this.handleEducationDetails}
                                    handleSelectedDegree={this.handleSelectedDegree}
                                    handleSelectedQualification={this.handleSelectedQualification}
                                    degreeList={degreeList} selected_degree={selected_degree}
                                    qualificationList={qualificationList} selected_qualification={selected_qualification}
                                    handleWorkExpChange={this.handleWorkExpChange} checked={workExpChecked}
                                    handleEduactionInputChange={this.handleEduactionInputChange} period={period} designation={designation} organization={organization}
                                    onCancelClick={BackToTable} location={location}
                                    handleAddDegreeData={this.handleAddDegreeData}
                                    addedDegreeData={addedDegreeData} addedQualitificationData={addedQualitificationData}
                                    workExpData={workExpData} handlePreviousClick={this.handlePreviousClick}
                                    handleAddQualification={this.handleAddQualification} handleAddWorkExp={this.handleAddWorkExp}
                                    fromMonthYear={fromMonthYear} toMonthYear={toMonthYear} handleFromMonthYear={this.handleFromMonthYear} handleToMonthYear={this.handleToMonthYear}
                                    handleUpdateDegreeData={this.handleUpdateDegreeData}
                                    handleUpdateQualification={this.handleUpdateQualification} handleUpdateWorkExp={this.handleUpdateWorkExp} handleRemoveWorkExp={this.handleRemoveWorkExp} handleRemoveDegreeData={this.handleRemoveDegreeData} handleRemoveQualification={this.handleRemoveQualification}

                                />
                                : tabIndex === 4 ?
                                    <ContactDetails
                                        editForm={editForm}
                                        viewForm={viewForm}
                                        contactPerson={contactPerson} contactPhone={contactPhone}
                                        handleContactDetailInputChange={this.handleContactDetailInputChange}
                                        onCancelClick={BackToTable}
                                        handleContactDetails={this.handleContactDetails}
                                        checked={sameWithCtPerson} handleSameWithCtPersonChange={this.handleSameWithCtPersonChange}
                                        guarantor={guarantor} guarantorPhone={guarantorPhone}
                                        selected_gran_NRC_Id={selected_gran_NRC_Id}
                                        selected_gran_DistrictCode={selected_gran_DistrictCode}
                                        gran_nrc_number={gran_nrc_number}
                                        guaFullNRC={guaFullNRC}
                                        districtCodeList={granDistrictCodeList}
                                        nrcList={selected_gran_NRC_Id ? nrcList.filter(c => c.sd_code == selected_gran_NRC_Id.sd_code) : nrcList}
                                        handleNRC_Id={this.handleNRC_Id}
                                        handleGranDistrictCode={this.handleGranDistrictCode}
                                        handlePreviousClick={this.handlePreviousClick}
                                    />
                                    : tabIndex === 5 ?
                                        <BankAccountDetails
                                            editForm={editForm}
                                            viewForm={viewForm}
                                            handleBankDetailInputChange={this.handleBankDetailInputChange}
                                            handleSelectedBank={this.handleSelectedBank}
                                            onCancelClick={BackToTable}
                                            accountName={accountName.toUpperCase()} accountNumber={accountNumber}
                                            bankList={bankList} selected_bank={selected_bank} bankData={bankData}
                                            handleEditBankData={this.handleEditBankData} bankDataEdit={bankDataEdit}
                                            handleAdd_UpdateBankData={this.handleAdd_UpdateBankData}
                                            handleDeleteBankData={this.handleDeleteBankData}
                                            handleBankAccountDetails={this.handleBankAccountDetails}
                                            cancelEdit={this.cancelEdit}
                                            handlePreviousClick={this.handlePreviousClick}

                                        /> : tabIndex === 6 ?
                                            <OtherInfo
                                                editForm={editForm}
                                                onCancelClick={BackToTable}
                                                viewForm={viewForm}
                                                handleOtherInfo={this.handleOtherInfo}
                                                handleOtherInfoInputChange={this.handleOtherInfoInputChange}
                                                trainingCode={trainingCode} partTimeCode={partTimeCode} customerCode={customerCode}
                                                ThaPaYaAccount={ThaPaYaAccount} SSCCardNo={SSCCardNo}
                                                handlePreviousClick={this.handlePreviousClick}
                                            />
                                            : tabIndex === 7 ?
                                                <Attachment
                                                    editForm={editForm}
                                                    viewForm={viewForm}
                                                    handleAttachment={this.handleAttachment}
                                                    handleAttachmentChange={this.handleAttachmentChange}
                                                    attachmentUrl={attachmentUrl}
                                                    onCancelClick={BackToTable}
                                                    handlePreviousClick={this.handlePreviousClick}
                                                /> : tabIndex === 8 ?
                                                    <EmploymentDetails
                                                        editForm={editForm}
                                                        viewForm={viewForm}
                                                        employeeStatus={employeeStatus} employeeDesignation={employeeDesignation} jobTitle={jobTitle} carrerLevel={carrerLevel} employeeDetailBranch={employeeDetailBranch}
                                                        employedDate={employedDate} disConStatus={disConStatus} disConDate={disConDate}
                                                        handleEmploymentDetailInputChange={this.handleEmploymentDetailInputChange}
                                                        handleEmploymentDetail={this.handleEmploymentDetail}
                                                        onCancelClick={BackToTable}
                                                        branchlist={branchlist} employeeStatusList={employeeStatusList}
                                                        disConstatusList={disConstatusList} handleSelectedEmpStatus={this.handleSelectedEmpStatus}
                                                        level_options={level_options} handleSelectedBranch={this.handleSelectedBranch}
                                                        designationList={designationList} handleLevelSelectorChange={this.handleLevelSelectorChange}
                                                        handlePreviousClick={this.handlePreviousClick} handleSelectedDesignation={this.handleSelectedDesignation} handleSelectedDisConStus={this.handleSelectedDisConStus}
                                                    />
                                                    : null
                }

            </div>
        )

    }
}


export default EditEmployeeListForm;