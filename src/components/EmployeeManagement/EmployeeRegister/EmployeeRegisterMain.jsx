import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Rodal from 'rodal';

import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving, calculationWorkingExp } from "../../../utils/CommonFunction";
import Attachment from './Attachment.jsx';
import BankAccountDetails from './BankAcocuntDetails.jsx';
import ContactDetails from './CoantactDetails.jsx';
import EducationDetails from './EducationDetails.jsx';
import EmployeeProfile from './EmployeeProfile.jsx';
import EmploymentDetails from './EmploymentDetails.jsx';
import OtherInfo from './OtherInfo.jsx';
import PersonalDetail from './PersonalDetail.jsx';
import EmployeeDetailMain from '../EmploymentDetail/EmployeeDetailMain'


class EmployeeRegisterMain extends Component {
    constructor() {
        super();
        this.state = {
            user_info: getCookieData("user_info"),
            pathname:window.location.pathname,
            user_id: getUserId("user_info"),
            is_main_role: getMainRole(),
            tabIndex: 1,
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
            fatherName: '',
            martialStatus: '',
            motherName: '',
            parentCount: '',
            siblingCount: '',
            childCount: '',
            pInLawCount: '',
            degreeList: null,
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
            bankList: [],
            disConstatusList: [
                { value: 1, label: 'True' },
                { value: 2, label: 'False' },
            ],
            selected_bank: null,
            accountName: '',
            accountNumber: '',
            bankDataEdit: false,
            bankData: [
                // { id: 1, bankName: 'KBZ', name: 'May Choon Htike', bankAcc: '10101010101' },
                // { id: 2, bankName: 'AYA', name: 'May Choon Htike', bankAcc: '20202020202' },
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
            districtCodeList: null,
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
            designationList: null,
            level_options: null,
            branchlist: null,
            employeeStatusList: [{ value: 1, label: 'Permanent' }, { value: 2, label: 'Part-Time' }, { value: 3, label: 'Training' }],
            editMode: [null, null],
            visible: false,
            toDetailForm: false,
            generateUserId: null
        }
        this.hiddenFileInput = React.createRef();
        this.scroll = React.createRef();
        this.onStatusChange = this.onStatusChange.bind(this);
    }

    componentDidMount() {
        this.getBankList()
        this.getDegreeList()
        this.getNRC_DistrictCode(0)
        this.getNRC_SD_Code(0)
        this.getGran_NRC_DistrictCode(0)
        this.getDesignationList()
        this.getLevelOptions();
        this.getBranchList();

    }
    getBranchList() {
        fetch(`${main_url}benefit/getBranchList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                // let lists = list.unshift({ branch_id: 0, branch_name: 'All' })
                this.setState({
                    branchlist: list.map(v => ({ ...v, label: v.branch_name, value: v.branch_id }))
                })
            })
    }
    getDegreeList() {
        fetch(`${main_url}employee/getDegree`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                // let lists = list.unshift({ branch_id: 0, branch_name: 'All' })
                this.setState({
                    degreeList: list.map(v => ({ ...v, label: v.degree, value: v.id }))
                })
            })
    }

    getDesignationList() {
        fetch(`${main_url}main/getDesignations`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    designationList: list//list.map(v => ({ ...v, label: v.region_name, value: v.region_id }))
                })
            })
    }

    getLevelOptions() {
        fetch(`${main_url}allowLevel/getLevel`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    level_options: list.map(v => ({ ...v, label: v.career_level, value: v.career_level_id }))
                })
            })
    }

    createNewEmployee = () => {
        const { selected_NRC_Id, userImage, userImageUrl, employeeId, employeeNameEng, employeeNameMyan, dateOfBirth, gender, nationality, personalPhone, region, officePhone, selected_DistrictCode, nrc_number, selected_gran_NRC_Id, disConDate, disConStatus,
            addedDegreeData, addedQualitificationData, workExpData, contactPerson, contactPhone, checked, guarantor, guarantorPhone, bankData, address, joinDate, martialStatus, fatherName, motherName, parentCount, siblingCount, childCount, pInLawCount,
            trainingCode, partTimeCode, customerCode, ThaPaYaAccount, SSCCardNo, attachmentUrl, employeeStatus, employeeDesignation, jobTitle, carrerLevel, employeeDetailBranch, employedDate, selected_gran_DistrictCode, gran_nrc_number, fromMonthYear, toMonthYear } = this.state
        let fullNRCNO = `${selected_NRC_Id ? selected_NRC_Id.label : ''}/${selected_DistrictCode ? selected_DistrictCode.label : ''}(N)${nrc_number}`
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
            employeeStatus: employeeStatus ? employeeStatus.value : '',
            employeeDesignation: employeeDesignation ? employeeDesignation.value : '',
            jobTitle: jobTitle,
            carrerLevel: carrerLevel ? carrerLevel.value : '',
            employeeDetailBranch: employeeDetailBranch ? employeeDetailBranch.value : '',
            employedDate: employedDate,
            disConStatus: disConStatus ? disConStatus.value : 'False',
            disConDate: disConDate,
            user_id: getCookieData("user_info").user_id,
            NRC_SD_code: selected_NRC_Id ? selected_NRC_Id.id : null,
            NRC_District_code: selected_DistrictCode ? selected_DistrictCode.id : null,
            NRC_no: Number(nrc_number),
            NRC_SD_code_gurantee: selected_gran_NRC_Id ? selected_gran_NRC_Id.id : null,
            NRC_District_code_gurantee: selected_gran_DistrictCode ? selected_gran_DistrictCode.id : null,
            NRC_no_gurantee: Number(gran_nrc_number),
            same_with_CT_person: this.state.sameWithCtPerson ? 1 : 0

        }

        const formdata = new FormData();
        formdata.append('data', JSON.stringify(data))
        formdata.append('uploadProfile', userImageUrl)
        formdata.append('bank', JSON.stringify(bankData))
        formdata.append('work_experience', JSON.stringify(workExpData))
        formdata.append('qualification', JSON.stringify(addedQualitificationData))
        formdata.append('degree', JSON.stringify(addedDegreeData))
        // formdata.append('uploadProfile', userImageUrl)
        // formdata.append('userImage', JSON.stringify(userImage))
        // formdata.append('employeeId', JSON.stringify(employeeId))
        // formdata.append('employeeNameEng', JSON.stringify(employeeNameEng))
        // formdata.append('employeeNameMyan', JSON.stringify(employeeNameMyan))
        // formdata.append('fullNRCNO', JSON.stringify(fullNRCNO))
        // formdata.append('dateOfBirth', JSON.stringify(dateOfBirth))
        // formdata.append('gender', JSON.stringify(gender))
        // formdata.append('nationality', JSON.stringify(nationality))
        // formdata.append('personalPhone', JSON.stringify(personalPhone))
        // formdata.append('region', JSON.stringify(region))
        // formdata.append('officePhone', JSON.stringify(officePhone))
        // formdata.append('address', JSON.stringify(address))
        // formdata.append('joinDate', JSON.stringify(joinDate))
        // formdata.append('martialStatus', JSON.stringify(martialStatus))
        // formdata.append('fatherName', JSON.stringify(fatherName))
        // formdata.append('motherName', JSON.stringify(motherName))
        // formdata.append('parentCount', JSON.stringify(parentCount))
        // formdata.append('siblingCount', JSON.stringify(siblingCount))
        // formdata.append('childCount', JSON.stringify(childCount))
        // formdata.append('pInLawCount', JSON.stringify(pInLawCount))
        // formdata.append('addedDegreeData', JSON.stringify(addedDegreeData))
        // formdata.append('addedQualitificationData', JSON.stringify(addedQualitificationData))
        // formdata.append('workExpData', JSON.stringify(workExpData))
        // formdata.append('contactPerson', JSON.stringify(contactPerson))
        // formdata.append('contactPhone', JSON.stringify(contactPhone))
        // formdata.append('sameWithContact', JSON.stringify(checked))
        // formdata.append('guarantor', JSON.stringify(guarantor))
        // formdata.append('guarantorPhone', JSON.stringify(guarantorPhone))
        // formdata.append('guarantorNRC', JSON.stringify(guarantorNRC))
        // formdata.append('bankData', JSON.stringify(bankData))
        // formdata.append('trainingCode', JSON.stringify(trainingCode))
        // formdata.append('partTimeCode', JSON.stringify(partTimeCode))
        // formdata.append('customerCode', JSON.stringify(customerCode))
        // formdata.append('ThaPaYaAccount', JSON.stringify(ThaPaYaAccount))
        // formdata.append('SSCCardNo', JSON.stringify(SSCCardNo))
        // formdata.append('attachmentUrl', JSON.stringify(attachmentUrl))
        // formdata.append('employeeStatus', JSON.stringify(employeeStatus.label))
        // formdata.append('employeeDesignation', JSON.stringify(employeeDesignation.label))
        // formdata.append('jobTitle', JSON.stringify(jobTitle))
        // formdata.append('carrerLevel', JSON.stringify(carrerLevel.label))
        // formdata.append('employeeDetailBranch', JSON.stringify(employeeDetailBranch.label))
        // formdata.append('employedDate', JSON.stringify(employedDate))
        // formdata.append('disConStatus', JSON.stringify(disConStatus.label))
        // formdata.append('disConDate', JSON.stringify(disConDate))
        let status = 0;
        fetch(`${main_url}employee/addEmployee`, {
            method: "POST",
            body: formdata
        })
            .then(res => {
                status = res.status;
                if (status == 400) {
                    toast.error('Process unsuccessfully!');
                    return null;
                } else {
                    toast.success('Your information is successfully saved!');
                    return res.json();
                }


            })
            .then((data) => {
                if (data) {
                    this.setState({ visible: true, generateUserId: data[0].user_id });
                }



            })
    }

    getBankList() {
        fetch(`${main_url}employee/getBank`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                // let lists = list.unshift({ branch_id: 0, branch_name: 'All' })
                this.setState({
                    bankList: list.map(v => ({ ...v, label: v.bank_name, value: v.id }))
                })
            })
    }

    getNRC_DistrictCode(id) {
        fetch(`${main_url}employee/getNrc/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {

                this.setState({
                    districtCodeList: list.map(v => ({ ...v, label: v.district_code, value: v.id }))
                })
            })
    }

    getGran_NRC_DistrictCode(id) {
        fetch(`${main_url}employee/getNrc/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {

                this.setState({
                    granDistrictCodeList: list.map(v => ({ ...v, label: v.district_code, value: v.id }))

                })
            })
    }

    getNRC_SD_Code(id) {
        fetch(`${main_url}employee/getNrc/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                // let lists = list.unshift({ branch_id: 0, branch_name: 'All' })
                var idList = [];
                var sd_code_arr = [];
                var name = "";
                var count = 1;
                list &&
                    list.map((v, k) => {
                        if (count == 1) {
                            name = v.sd_code;
                            idList.push(v);
                            sd_code_arr.push(v.sd_code);
                        }
                        if (v.sd_code != name && !sd_code_arr.includes(v.sd_code)) {
                            sd_code_arr.push(v.sd_code);
                            idList.push(v);
                            name = v.sd_code;
                        }
                        count++;
                    });

                this.setState({
                    nrcList: idList.map(v => ({ ...v, label: v.sd_code, value: v.id })),

                })
            })
    }

    handleClick = event => {
        event.preventDefault();
        this.hiddenFileInput.current.click();
    };

    handleChange = event => {
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
                employeeNameEng: e.target.value.toUpperCase()
            })
        }
        else if (e.target.name === "employeeNameMyan") {
            this.setState({
                employeeNameMyan: e.target.value
            })
        }
        else if (e.target.name === "dateOfBirth") {
            if (this.state.nrc_number.length != 6) {
                toast.error("NRC number should be 6 digit!")
            } else {
                this.setState({
                    dateOfBirth: e.target.value
                })
            }
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
        else if (e.target.name === "nationality") {
            this.setState({
                nationality: e.target.value
            })
        }
        else if (e.target.name === "nrc_number" && this.state.selected_NRC_Id && this.state.selected_DistrictCode) {
            if (e.target.value.length < 7) {
                this.setState({
                    nrc_number: e.target.value,
                })
            }
        }
        else if (e.target.name === "nrc_number" && !this.state.selected_NRC_Id) {
            toast.error("Please Choose Sd code first!")
        }
        else if (e.target.name === "nrc_number" && !this.state.selected_DistrictCode) {
            toast.error("Please Choose Dtstrict code first!")
        }


    }

    nrcErr = (e) => {
        if (this.state.nrc_number.length < 6) {
            toast.error('NRC number should be 6 digit!')
        }
    }

    handleBankDetailInputChange = (e) => {
        if (e.target.name === "accountName") {
            this.setState({
                accountName: e.target.value
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

                jobTitle: e.target.name
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
            })
        else if (!this.state.selected_NRC_Id) return toast.error("Plese choose sd code first")
    };
    handleSelectedNRCId = (event) => {
        if (event !== null) {
            this.setState({
                selected_NRC_Id: event,
            })
            this.getNRC_DistrictCode(event.label)
        }

    };

    handleGranDistrictCode = (event) => {
        if (event !== null && this.state.selected_gran_NRC_Id)
            this.setState({
                selected_gran_DistrictCode: event,
            })
        else if (!this.state.selected_gran_NRC_Id) return toast.error("Plese choose sd code first")
    };
    handleNRC_Id = (event) => {
        if (event !== null) {
            this.setState({
                selected_gran_NRC_Id: event,
            })
            this.getGran_NRC_DistrictCode(event.label)
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
        const { nrc_number } = this.state;
        if (nrc_number.length < 6) {
            toast.error('NRC number should be 6 digits!');;
        } else {
            this.setState({
                tabIndex: this.state.tabIndex + 1
            })
        }

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
            if (e.target.value.length < 7) {
                this.setState({
                    gran_nrc_number: e.target.value,
                })
            }
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
        const { gran_nrc_number } = this.state;
        if (gran_nrc_number.length < 6) {
            this.setState({
                tabIndex: this.state.tabIndex + 1
            })
        } else {
            this.setState({
                tabIndex: this.state.tabIndex + 1
            })
        }


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
        // this.createNewEmployee();
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
        }, () => {
            if (this.state.sameWithCtPerson) {
                this.setState({
                    guarantor: this.state.contactPerson,
                    guarantorPhone: this.state.contactPhone
                })
            } else {
                this.setState({
                    guarantor: '',
                    guarantorPhone: ''
                })
            }
        })
    }

    handleEditBankData = data => {
        this.setState({
            accountName: data.account_name,
            accountNumber: data.account_no,
            bankDataEdit: true,
            selected_bank: this.state.bankList.find(c => c.value === data.id),
            selected_bankRow_Id: data.id
        }, () => { console.log(this.state.selected_bank) }
        )

    }




    handleAdd_UpdateBankData = (e) => {
        e.preventDefault();
        const { accountName, accountNumber, selected_bank, bankDataEdit, bankData, employeeNameEng, selected_bankRow_Id } = this.state
        if (bankDataEdit) {
            // ("Update")
            const newData = {
                id: selected_bankRow_Id,
                account_no: accountNumber,
                bank_name: selected_bank.label,
                account_name: accountName

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
            if (selected_bank == null) {
                this.setState({ tabIndex: 6 })
            } else {
                const newData = {
                    id: selected_bank.id,
                    account_no: accountNumber,
                    bank_name: selected_bank.label,
                    account_name: accountName

                }
                this.setState({
                    bankData: bankData.concat(newData),
                    accountName: '',
                    selected_bank: null,
                    accountNumber: ''
                })
            }

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
                degree: selected_degree.degree
            }
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
                } else {
                    this.setState({
                        addedDegreeData: addedDegreeData.concat(deg),
                        selected_degree: null
                    })
                }
            }
        }
        else toast.error('Please Choose degree at first!')
    }

    handleUpdateDegreeData = (data, id) => {
        this.setState({
            selected_degree: { label: data.degree, value: data.value, ...data },
            editMode: ['degree', id]
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

    handleAddQualification = () => {
        const { selected_qualification, addedQualitificationData, editMode } = this.state

        if (selected_qualification) {

            if (editMode[0] == 'qualification') {
                const obj = {
                    id: editMode[1],
                    qualification: selected_qualification
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
                    qualification: selected_qualification
                }
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
            selected_qualification: data.qualification,
            editMode: ['qualification', id]
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

    handleRemoveWorkExp = (id) => {
        const { workExpData } = this.state
        const newObj = [...workExpData]
        newObj.splice(id, 1)
        this.setState({
            workExpData: newObj
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


    handleToMonthYear = async (e) => {
        this.setState({
            toMonthYear: e
        }, async () => {
            this.setState({
                period: await calculationWorkingExp(e, this.state.fromMonthYear)
            })
        })
    }

    handleFromMonthYear = async (e) => {
        this.setState({
            fromMonthYear: e
        }, async () => {
            this.setState({
                period: await calculationWorkingExp(this.state.toMonthYear, e)
            })
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

    okClick = () => {
        this.setState({ toDetailForm: true, visible: false })
    }

    cancelClick = () => {
        this.setState({ visible: false })
        window.location.reload()
    }

    hide() {
        this.setState({ visible: false })
       window.location.replace('/employee_list')
    }

    onTapClick = (number, prevNum) => {
        const { tabIndex, userImage, userImageUrl, employeeStatusList, fromMonthYear, toMonthYear, nrc_number, period, level_options, location, designation, workExpChecked, organization, sameWithCtPerson, bankList, selected_bank, trainingCode, partTimeCode, customerCode, ThaPaYaAccount, SSCCardNo,
            fatherName, degreeList, disConstatusList, branchlist, selected_qualification, selected_degree, motherName, guarantor, guarantorPhone, attachmentUrl, selected_gran_NRC_Id, granDistrictCodeList, addedDegreeData, addedQualitificationData, workExpData,
            selected_gran_DistrictCode, gran_nrc_number, parentCount, siblingCount, childCount, pInLawCount, martialStatus, officePhone, region, address, joinDate, accountName, accountNumber, employeeStatus, employeeDesignation, jobTitle, carrerLevel, employeeDetailBranch, employedDate, disConStatus, disConDate,
            employeeId, employeeNameEng, nationality, personalPhone, employeeNameMyan, gender, dateOfBirth, contactPerson, contactPhone, bankData, bankDataEdit, selected_DistrictCode, selected_NRC_Id, districtCodeList, nrcList,
        } = this.state;
        if (number == 1) {
            this.setState({ tabIndex: 1 });
        } else if (number == 2) {

            if (employeeId == '' || employeeNameEng == '' || selected_NRC_Id == null || selected_DistrictCode == null || nrc_number == '' || employeeNameMyan == '' || dateOfBirth == '' || gender == '' || nationality == '' || personalPhone == '' || region == '' || officePhone == '' || address == '' || joinDate == '') {

                toast.error('Please fill all information!');
            } else if (nrc_number.length < 6) {
                toast.error('NRC number should be 6 digits!');
            } else if (employeeId != '' && employeeNameEng != '' && selected_NRC_Id != null && selected_DistrictCode != null && nrc_number != '' && nrc_number.length == 6 && employeeNameMyan != '' && dateOfBirth != '' && gender != '' && nationality != '' && personalPhone != '' && region != '' && officePhone != '' && address != '' && joinDate != '') {

                this.setState({ tabIndex: 2 });
            }
        } else if (number == 3) {
            if (martialStatus != "" && fatherName != '' && motherName != '' && parentCount != '' && siblingCount != '' && ((martialStatus == 'UnMarried' && childCount == '') || (martialStatus == 'Married' && childCount != '')) && ((martialStatus == 'UnMarried' && pInLawCount == '') || (martialStatus == 'Married' && pInLawCount != ''))) {
                this.setState({ tabIndex: 3 });
            } else {
                toast.error('Please fill all information!');

            }
        } else if (number == 4) {
            if (addedDegreeData.length > 0) {
                this.setState({ tabIndex: 4 });
            } else {
                toast.error('Please fill all information!');
            }
        } else if (number == 5) {
            if (contactPerson == "" || contactPhone == '') {
                toast.error('Please fill all information!');
             } else if (contactPerson != "" && contactPhone != '') {
                this.setState({ tabIndex: 5 });
            }
        
            
        
        } else if(number == 6){
            if(employeeId != '' && employeeNameEng != '' && selected_NRC_Id != null && selected_DistrictCode != null && nrc_number != null && employeeNameMyan != '' && dateOfBirth != '' && gender != '' && nationality != '' && personalPhone != '' && region != '' && officePhone != '' && address != '' && joinDate != ''
            && martialStatus != "" && fatherName != '' && motherName != '' && parentCount != '' && siblingCount != '' && ((martialStatus == 'UnMarried' && childCount == '') || (martialStatus == 'Married' && childCount != '')) && ((martialStatus == 'UnMarried' && pInLawCount == '') || (martialStatus == 'Married' && pInLawCount != ''))
            && addedDegreeData.length > 0  && contactPerson != "" && contactPhone != ''){
                this.setState({ tabIndex: 6 });
                
            }else {
                toast.error('Please fill all information!');
            }
        }  else if (number == 7) {
            if (employeeId != '' && employeeNameEng != '' && selected_NRC_Id != null && selected_DistrictCode != null && nrc_number != null && employeeNameMyan != '' && dateOfBirth != '' && gender != '' && nationality != '' && personalPhone != '' && region != '' && officePhone != '' && address != '' && joinDate != ''
                && martialStatus != "" && fatherName != '' && motherName != '' && parentCount != '' && siblingCount != '' && ((martialStatus == 'UnMarried' && childCount == '') || (martialStatus == 'Married' && childCount != '')) && ((martialStatus == 'UnMarried' && pInLawCount == '') || (martialStatus == 'Married' && pInLawCount != ''))
                && addedDegreeData.length > 0  && contactPerson != "" && contactPhone != '' && trainingCode != ''
                ) {
                this.setState({ tabIndex: 7 });
            } else {
                toast.error('Please fill all information!');
            }
        } else if (number == 8) {
            if (attachmentUrl != '') {
                this.setState({ tabIndex: 8 });
            } else {
                toast.error('Please fill all information!');
            }

        }
    }

    render() {
        const { tabIndex, userImage, userImageUrl, employeeStatusList, fromMonthYear, toMonthYear, nrc_number, period, level_options, location, designation, workExpChecked, organization, sameWithCtPerson, bankList, selected_bank, trainingCode, partTimeCode, customerCode, ThaPaYaAccount, SSCCardNo,
            fatherName, degreeList, disConstatusList, branchlist, selected_qualification, selected_degree, motherName, guarantor, guarantorPhone, attachmentUrl, selected_gran_NRC_Id, granDistrictCodeList, addedDegreeData, addedQualitificationData, workExpData,
            selected_gran_DistrictCode, gran_nrc_number, parentCount, siblingCount, childCount, pInLawCount, martialStatus, officePhone, region, address, joinDate, accountName, accountNumber, employeeStatus, employeeDesignation, jobTitle, carrerLevel, employeeDetailBranch, employedDate, disConStatus, disConDate,
            employeeId, employeeNameEng, nationality, personalPhone, employeeNameMyan, gender, dateOfBirth, contactPerson, contactPhone, bankData, bankDataEdit, selected_DistrictCode, selected_NRC_Id, districtCodeList, nrcList,
        } = this.state

        return (
            <div>

                {this.state.toDetailForm ? (
                    <EmployeeDetailMain id={this.state.generateUserId}></EmployeeDetailMain>
                ) : (
                    <div className=" border-bottom white-bg dashboard-header">
                        <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                        <div className="row wrapper border-bottom white-bg page-heading">
                            <div className="col-lg-12">
                                <ol className="breadcrumb">
                                    <li style={{ fontSize: 18 }}>
                                        Employee
                                    </li>
                                    <li className="active" style={{ fontSize: 18 }}>
                                        <a href="#"> Employee Register</a>
                                    </li>

                                </ol>
                            </div>

                        </div>


                        <div className='tabBar col-lg-12 col-md-12 col-sm-12 ' style={{ display: 'flex', paddingLeft: 0, paddingRight: 0, flexDirection: 'row', paddingTop: 20, fontSize: 13, minWidth: 300, overflowX: 'auto', alignItems: 'center' }}>
                            <div className='col-lg-2 col-md-2 ' onClick={() => this.onTapClick(1, tabIndex)} style={{
                                paddingTop: 10, paddingBottom: 10, alignItems: 'center', display: 'flex', whiteSpace: 'nowrap', cursor: 'pointer', marginBottom: tabIndex === 1 ? 5 : 0, fontWeight: tabIndex === 1 ? 'bold' : 'normal',
                                minHeight: tabIndex === 1 ? 35 : 30, background: `${tabIndex === 1 ? '#fff' : '#337ab7'}`, paddingLeft: 10, paddingRight: 10, color: tabIndex === 1 ? 'black' : 'white', border: '1px solid lightgrey', borderBottom: 'none', justifyContent: 'center'
                            }}>
                                Employee Profile
                            </div>
                            <div className='col-lg-2 col-md-2' onClick={() => this.onTapClick(2, tabIndex)} style={{
                                paddingTop: 10, paddingBottom: 10, alignItems: 'center', display: 'flex', whiteSpace: 'nowrap', cursor: 'pointer', marginBottom: tabIndex === 2 ? 5 : 0, fontWeight: tabIndex === 2 ? 'bold' : 'normal',
                                minHeight: tabIndex === 2 ? 35 : 30, background: `${tabIndex === 2 ? '#fff' : '#337ab7'}`, paddingLeft: 10, paddingRight: 10, color: tabIndex === 2 ? 'black' : 'white', border: '1px solid lightgrey', borderBottom: 'none', justifyContent: 'center'
                            }}>
                                Personal Detail
                            </div>
                            <div className='col-lg-2 col-md-2' onClick={() => this.onTapClick(3, tabIndex)} style={{
                                paddingTop: 10, paddingBottom: 10, alignItems: 'center', display: 'flex', whiteSpace: 'nowrap', cursor: 'pointer', marginBottom: tabIndex === 3 ? 5 : 0, fontWeight: tabIndex === 3 ? 'bold' : 'normal',
                                minHeight: tabIndex === 3 ? 35 : 30, background: `${tabIndex === 3 ? '#fff' : '#337ab7'}`, paddingLeft: 10, paddingRight: 10, color: tabIndex === 3 ? 'black' : 'white', border: '1px solid lightgrey', borderBottom: 'none', justifyContent: 'center'
                            }}>
                                Education Details
                            </div>
                            <div className='col-lg-2 col-md-2' onClick={() => this.onTapClick(4, tabIndex)} style={{
                                paddingTop: 10, paddingBottom: 10, alignItems: 'center', display: 'flex', whiteSpace: 'nowrap', cursor: 'pointer', marginBottom: tabIndex === 4 ? 5 : 0, fontWeight: tabIndex === 4 ? 'bold' : 'normal',
                                minHeight: tabIndex === 4 ? 35 : 30, background: `${tabIndex === 4 ? '#fff' : '#337ab7'}`, paddingLeft: 10, paddingRight: 10, color: tabIndex === 4 ? 'black' : 'white', border: '1px solid lightgrey', borderBottom: 'none', justifyContent: 'center'
                            }}>
                                Contact Details
                            </div>
                            <div className='col-lg-2 col-md-2' onClick={() => this.onTapClick(5, tabIndex)} style={{
                                paddingTop: 10, paddingBottom: 10, alignItems: 'center', display: 'flex', whiteSpace: 'nowrap', minWidth: 150, cursor: 'pointer', marginBottom: tabIndex === 5 ? 5 : 0, fontWeight: tabIndex === 5 ? 'bold' : 'normal',
                                minHeight: tabIndex === 5 ? 35 : 30, background: `${tabIndex === 5 ? '#fff' : '#337ab7'}`, paddingLeft: 10, paddingRight: 10, color: tabIndex === 5 ? 'black' : 'white', border: '1px solid lightgrey', borderBottom: 'none', justifyContent: 'center'
                            }}>
                                Bank Account Details
                            </div>
                            <div className='col-lg-2 col-md-2' onClick={() => this.onTapClick(6, tabIndex)} style={{
                                paddingTop: 10, paddingBottom: 10, alignItems: 'center', display: 'flex', whiteSpace: 'nowrap', cursor: 'pointer', marginBottom: tabIndex === 6 ? 5 : 0, fontWeight: tabIndex === 6 ? 'bold' : 'normal',
                                minHeight: tabIndex === 6 ? 35 : 30, background: `${tabIndex === 6 ? '#fff' : '#337ab7'}`, paddingLeft: 10, paddingRight: 10, color: tabIndex === 6 ? 'black' : 'white', border: '1px solid lightgrey', borderBottom: 'none', justifyContent: 'center'
                            }}>
                                Other Information
                            </div>
                            <div className='col-lg-2 col-md-2' onClick={() => this.onTapClick(7, tabIndex)} style={{
                                paddingTop: 10, paddingBottom: 10, alignItems: 'center', display: 'flex', whiteSpace: 'nowrap', cursor: 'pointer', marginBottom: tabIndex === 7 ? 5 : 0, fontWeight: tabIndex === 7 ? 'bold' : 'normal',
                                minHeight: tabIndex === 7 ? 35 : 30, background: `${tabIndex === 7 ? '#fff' : '#337ab7'}`, paddingLeft: 10, paddingRight: 10, color: tabIndex === 7 ? 'black' : 'white', border: '1px solid lightgrey', borderBottom: 'none', justifyContent: 'center'
                            }}>
                                Attachment
                            </div>
                            <div className='col-lg-2 col-md-2' onClick={() => this.onTapClick(8, tabIndex)} style={{
                                paddingTop: 10, paddingBottom: 10, alignItems: 'center', display: 'flex', whiteSpace: 'nowrap', minWidth: 130, cursor: 'pointer', marginBottom: tabIndex === 8 ? 5 : 0, fontWeight: tabIndex === 8 ? 'bold' : 'normal',
                                minHeight: tabIndex === 8 ? 35 : 30, background: `${tabIndex === 8 ? '#fff' : '#337ab7'}`, minWidth: 150, paddingLeft: 10, paddingRight: 10, color: tabIndex === 8 ? 'black' : 'white', border: '1px solid lightgrey', borderBottom: 'none', justifyContent: 'center'
                            }}>
                                Employment Details
                            </div>

                        </div>
                        {/* </div> */}

                        {
                            tabIndex === 1 ?
                                <EmployeeProfile
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
                                    onCancelClick={this.clearProfileData}
                                    handleSelectedDistrictCode={this.handleSelectedDistrictCode}
                                    handleSelectedNRCId={this.handleSelectedNRCId}
                                    selected_DistrictCode={selected_DistrictCode}
                                    selected_NRC_Id={selected_NRC_Id}
                                    districtCodeList={districtCodeList}
                                    nrcList={nrcList}
                                    nrc_number={nrc_number}
                                // nrcErr={this.nrcErr}
                                />

                                : tabIndex === 2 ?
                                    <PersonalDetail
                                        fatherName={fatherName} motherName={motherName}
                                        handlePersonalDetailInputChange={this.handlePersonalDetailInputChange}
                                        onStatusChange={this.onStatusChange} handlePreviousClick={this.handlePreviousClick}
                                        martialStatus={martialStatus} parentCount={parentCount}
                                        siblingCount={siblingCount} childCount={childCount} pInLawCount={pInLawCount}
                                        handlePersonalDetail={this.handlePersonalDetail}

                                    /> : tabIndex === 3 ?
                                        <EducationDetails
                                            handleEducationDetails={this.handleEducationDetails}
                                            handleSelectedDegree={this.handleSelectedDegree}
                                            degreeList={degreeList} selected_degree={selected_degree} location={location}
                                            selected_qualification={selected_qualification}
                                            handleWorkExpChange={this.handleWorkExpChange} checked={workExpChecked}
                                            handleEduactionInputChange={this.handleEduactionInputChange} period={period} designation={designation} organization={organization}
                                            onCancelClick={this.clearProfileData} handleAddDegreeData={this.handleAddDegreeData} handleUpdateDegreeData={this.handleUpdateDegreeData} handleRemoveDegreeData={this.handleRemoveDegreeData}
                                            addedDegreeData={addedDegreeData} addedQualitificationData={addedQualitificationData} handleUpdateQualification={this.handleUpdateQualification} handleRemoveQualification={this.handleRemoveQualification}
                                            workExpData={workExpData} handlePreviousClick={this.handlePreviousClick}
                                            handleAddQualification={this.handleAddQualification} handleAddWorkExp={this.handleAddWorkExp}
                                            fromMonthYear={fromMonthYear} toMonthYear={toMonthYear} handleFromMonthYear={this.handleFromMonthYear} handleToMonthYear={this.handleToMonthYear} handleUpdateWorkExp={this.handleUpdateWorkExp} handleRemoveWorkExp={this.handleRemoveWorkExp}
                                        />
                                        : tabIndex === 4 ?
                                            <ContactDetails
                                                contactPerson={contactPerson} contactPhone={contactPhone}
                                                handleContactDetailInputChange={this.handleContactDetailInputChange}
                                                onCancelClick={this.clearProfileData}
                                                handleContactDetails={this.handleContactDetails}
                                                checked={sameWithCtPerson} handleSameWithCtPersonChange={this.handleSameWithCtPersonChange}
                                                guarantor={guarantor} guarantorPhone={guarantorPhone}
                                                selected_gran_NRC_Id={selected_gran_NRC_Id}
                                                selected_gran_DistrictCode={selected_gran_DistrictCode}
                                                gran_nrc_number={gran_nrc_number}
                                                districtCodeList={granDistrictCodeList}
                                                nrcList={nrcList}
                                                handleNRC_Id={this.handleNRC_Id}
                                                handleGranDistrictCode={this.handleGranDistrictCode}
                                                handlePreviousClick={this.handlePreviousClick}
                                            />
                                            : tabIndex === 5 ?
                                                <BankAccountDetails
                                                    handleBankDetailInputChange={this.handleBankDetailInputChange}
                                                    handleSelectedBank={this.handleSelectedBank}
                                                    onCancelClick={this.clearProfileData}
                                                    accountName={accountName} accountNumber={accountNumber}
                                                    bankList={bankList} selected_bank={selected_bank} bankData={bankData}
                                                    handleEditBankData={this.handleEditBankData} bankDataEdit={bankDataEdit}
                                                    handleAdd_UpdateBankData={this.handleAdd_UpdateBankData}
                                                    handleDeleteBankData={this.handleDeleteBankData}
                                                    handleBankAccountDetails={this.handleBankAccountDetails}
                                                    cancelEdit={this.cancelEdit}
                                                    handlePreviousClick={this.handlePreviousClick}
                                                    employeeNameEng={employeeNameEng}

                                                /> : tabIndex === 6 ?
                                                    <OtherInfo
                                                        handleOtherInfo={this.handleOtherInfo} onCancelClick={this.clearProfileData}
                                                        handleOtherInfoInputChange={this.handleOtherInfoInputChange}
                                                        handlePreviousClick={this.handlePreviousClick}
                                                        trainingCode={trainingCode} partTimeCode={partTimeCode} customerCode={customerCode} ThaPaYaAccount={ThaPaYaAccount} SSCCardNo={SSCCardNo}
                                                    />
                                                    : tabIndex === 7 ?
                                                        <Attachment
                                                            handleAttachment={this.handleAttachment}
                                                            handleAttachmentChange={this.handleAttachmentChange}
                                                            attachmentUrl={attachmentUrl}
                                                            handlePreviousClick={this.handlePreviousClick}
                                                            onCancelClick={this.clearProfileData}
                                                        /> : tabIndex === 8 ?
                                                            <EmploymentDetails
                                                                employeeStatus={employeeStatus} employeeDesignation={employeeDesignation} jobTitle={jobTitle} carrerLevel={carrerLevel} employeeDetailBranch={employeeDetailBranch}
                                                                employedDate={employedDate} disConStatus={disConStatus} disConDate={disConDate} branchlist={branchlist} employeeStatusList={employeeStatusList}
                                                                handleEmploymentDetailInputChange={this.handleEmploymentDetailInputChange} disConstatusList={disConstatusList} handleSelectedEmpStatus={this.handleSelectedEmpStatus}
                                                                handleEmploymentDetail={this.handleEmploymentDetail} level_options={level_options} handleSelectedBranch={this.handleSelectedBranch}
                                                                onCancelClick={this.clearProfileData} designationList={this.state.designationList} handleLevelSelectorChange={this.handleLevelSelectorChange}
                                                                handlePreviousClick={this.handlePreviousClick} handleSelectedDesignation={this.handleSelectedDesignation} handleSelectedDisConStus={this.handleSelectedDisConStus}
                                                                createNewEmployee={this.createNewEmployee}
                                                            />
                                                            : null
                        }





                    </div>
                )}

                <Rodal width={400} height={120} visible={this.state.visible} onClose={this.hide.bind(this)} >
                    <div className="col-md-12 "><h4>Do you want to go to Employment Detail?</h4>
                    </div>
                    <div className="col-md-12" style={{ marginTop: 30, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>


                        <button style={{ marginRight: 10 }} button className="btn btn-primary" onClick={() => this.okClick()}><span>OK</span> </button>


                        <div>
                        <a href='/employee_list' style={{textDecoration:'none'}}>
                            <button className="btn btn-danger"><span>Cancel</span> </button>
                        </a>

                        </div>
                    </div>
                </Rodal>
            </div>
        )

    }
}


export default EmployeeRegisterMain;

