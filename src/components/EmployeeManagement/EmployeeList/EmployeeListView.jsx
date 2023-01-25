import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";
import EmployeeProfile from '../EmployeeRegister/EmployeeProfile';
import PersonalDetail from '../EmployeeRegister/PersonalDetail';
import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";
import EducationDetails from '../EmployeeRegister/EducationDetails';
import ContactDetails from '../EmployeeRegister/CoantactDetails';
import BankAccountDetails from '../EmployeeRegister/BankAcocuntDetails';
import OtherInfo from '../EmployeeRegister/OtherInfo';
import Attachment from '../EmployeeRegister/Attachment';
import EmploymentDetails from '../EmployeeRegister/EmploymentDetails';

class EmployeeListView extends Component {
    constructor() {
        super();
        this.state = {
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
            careerSubLevel:"",
            officePhone: '',
            career_sublevel:[],
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
                { value: 0, label: 'False' },
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
            careerSubLevel : "",
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
            fullNRC: null,
            guaFullNRC: null,

        }
        this.hiddenFileInput = React.createRef();

    }
    handleClick = event => {
        this.hiddenFileInput.current.click();
    };

    handleNext = e => {
        this.setState({
            tabIndex: this.state.tabIndex + 1
        })
    }

    async componentDidMount() {
       await this.getEmployeeDetailsData()
        // this.getCareerSubLevelOptions();

    }

    handlePreviousClick = () => {
        this.setState({ tabIndex: this.state.tabIndex - 1 })
    }
    async getCareerSubLevelOptions () {
        await fetch(`${main_url}allowLevel/getCareerSubLevel`)
        .then((res) => {
            if (res.ok) return res.json();
          })
        .then(async(res) => {
            if (res) {
                this.setState({ career_sublevel: await res });
            }
          })
          .catch((error) => console.error(`Fetch Error =\n`, error));
      };

    async getEmployeeDetailsData() {
        await this.getCareerSubLevelOptions();
        // confirmation/getOneDetail/:user_id
        const { selectedEmployeeData, level_options, nrcList, granDistrictCodeList, districtCodeList, branchlist } = this.props
        const { disConstatusList } = this.state
        
        await fetch(`${main_url}confirmation/getOneDetail/${selectedEmployeeData.user_id}`)

            .then(response => {
                if (response.ok) return response.json()
            })
            .then(async res => {
                let fullnrc = res[0].nrc;
                let fullnrcNumber = fullnrc.split(' ');
                
                if (res) {
                    console.log('res is ====>', res[0].career_sub_level, this.state.career_sublevel
                    )
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
                        attachmentUrl: res[0].attachmentUrl,
                        employeeStatus: this.state.employeeStatusList.find(c => c.value == res[0].employee_status),
                        employeeDesignation: this.props.designationList.find(c => c.value == res[0].designations_id),
                        jobTitle: res[0].job_title,
                        careerSubLevel : await res[0].career_sub_level ? this.state.career_sublevel.filter(v=>v.career_sub_level_id == res[0].career_sub_level)[0].career_sub_level : '-',
                        carrerLevel: level_options && level_options.find(c => c.value == res[0].career_level_id) ? level_options.find(c => c.value == res[0].career_level_id) : null,
                        employeeDetailBranch: branchlist && branchlist.find(c => c.value == res[0].branch_name) ? branchlist.find(c => c.value == res[0].branch_name) : null,
                        employedDate: res[0].employ_date,
                        disConStatus: res[0].discontinued == 1 ? disConstatusList.find(c => c.value == 1) : disConstatusList.find(c => c.value == 0),
                        disConDate: res[0].discontinued_date,
                        selected_NRC_Id: nrcList && nrcList.find(c => c.value == res[0].NRC_SD_code) ? nrcList.find(c => c.value == res[0].NRC_SD_code) : null,
                        selected_DistrictCode: districtCodeList && districtCodeList.find(c => c.value == res[0].NRC_District_code) ? districtCodeList.find(c => c.value == res[0].NRC_District_code) : null,////
                        nrc_number: res[0].NRC_no,
                        selected_gran_NRC_Id: nrcList && nrcList.find(c => parseInt(c.value) == res[0].NRC_SD_code_guarantee) ? nrcList.find(c => parseInt(c.value) == res[0].NRC_SD_code_guarantee) : null,
                        selected_gran_DistrictCode: granDistrictCodeList && granDistrictCodeList && granDistrictCodeList.find(c => c.id == res[0].NRC_District_code_guarantee) ? granDistrictCodeList.find(c => c.id == res[0].NRC_District_code_guarantee) : null,
                        gran_nrc_number: res[0].NRC_no_guarantee,
                        workExpData: res[0].work_experience,
                        fullNRC: res[0].nrc,
                        guaFullNRC: res[0].NRC_full_gurantee,
                    })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }





    render() {   console.log('dataList',this.state.careerSubLevel);

        const { tabIndex, userImage, userImageUrl, addedDegreeData, addedQualitificationData, workExpData, nrc_number, period, designation, workExpChecked, organization, sameWithCtPerson, bankList, selected_bank, trainingCode, partTimeCode, customerCode, ThaPaYaAccount, SSCCardNo,
            fatherName, degreeList, qualificationList, selected_qualification, selected_degree, motherName, guarantor, guarantorPhone, attachmentUrl, selected_gran_NRC_Id,
            selected_gran_DistrictCode, gran_nrc_number, parentCount, siblingCount, childCount, pInLawCount, martialStatus, officePhone, region, address, joinDate, accountName, accountNumber, employeeStatus, employeeDesignation, jobTitle, carrerLevel,careerSubLevel, employeeDetailBranch, employedDate, disConStatus, disConDate,
            employeeId, employeeNameEng, nationality, personalPhone, guaFullNRC, fullNRC, employeeNameMyan, gender, dateOfBirth, contactPerson, contactPhone, bankData, bankDataEdit, selected_DistrictCode, selected_NRC_Id,
        } = this.state
        const { selectedEmployeeData, nrcList, districtCodeList, viewForm, BackToTable, editForm, granDistrictCodeList } = this.props
        return (
            <div className=" border-bottom white-bg dashboard-header">
                <div style={{ display: 'flex', paddingTop: 10, justifyContent: 'flex-start', marginBottom: -10 }}>

                    <button className='' onClick={BackToTable} style={{ borderRadius: 5, padding: 10, margin: 10, background: '#337ab7', color: 'white', border: 'none', width: 130 }}>
                        {'< Back '}
                    </button>
                </div>
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
                            viewForm={viewForm}
                            editForm={editForm}
                            userImage={userImage} handleClick={() => null}
                            hiddenFileInput={this.hiddenFileInput}
                            handleChange={() => null} employeeNameEng={employeeNameEng}
                            employeeId={employeeId} handleInputChange={() => null}
                            employeeNameMyan={employeeNameMyan}
                            gender={gender} onGenderChange={() => null}
                            dateOfBirth={dateOfBirth} nationality={nationality}
                            personalPhone={personalPhone} officePhone={officePhone}
                            region={region} address={address} joinDate={joinDate}
                            handleProfileSave={this.handleNext}
                            clearProfileData={{}}
                            selected_DistrictCode={selected_DistrictCode}
                            selected_NRC_Id={selected_NRC_Id}
                            districtCodeList={districtCodeList}
                            nrcList={nrcList}
                            nrc_number={nrc_number}
                            onCancelClick={BackToTable}
                            fullNRC={fullNRC}


                        /> : tabIndex === 2 ?
                            <PersonalDetail
                                viewForm={viewForm}
                                editForm={editForm}
                                fatherName={fatherName}
                                martialStatus={martialStatus}
                                motherName={motherName}
                                parentCount={parentCount}
                                siblingCount={siblingCount}
                                childCount={childCount}
                                pInLawCount={pInLawCount}
                                handlePersonalDetailInputChange={() => null}
                                onStatusChange={() => null}
                                handlePersonalDetail={this.handleNext}
                                onCancelClick={BackToTable}
                                handlePreviousClick={this.handlePreviousClick}
                            /> : tabIndex === 3 ?
                                <EducationDetails
                                    degreeList={degreeList} selected_degree={selected_degree}
                                    selected_qualification={selected_qualification}
                                    checked={workExpChecked} period={period} designation={designation} organization={organization}
                                    handleAddDegreeData={this.handleAddDegreeData}
                                    addedDegreeData={addedDegreeData} addedQualitificationData={addedQualitificationData}
                                    workExpData={workExpData} handlePreviousClick={this.handlePreviousClick}
                                    handleAddQualification={this.handleAddQualification} handleAddWorkExp={this.handleAddWorkExp}
                                    handleFromMonthYear={this.handleFromMonthYear} handleToMonthYear={this.handleToMonthYear}
                                    viewForm={viewForm}
                                    editForm={editForm}
                                    handleEducationDetails={this.handleNext}
                                    handleSelectedDegree={() => null}
                                    handleSelectedQualification={() => null}
                                    qualificationList={qualificationList}
                                    handleWorkExpChange={() => null}
                                    handleEduactionInputChange={() => null}
                                    onCancelClick={BackToTable}

                                />
                                : tabIndex === 4 ?
                                    <ContactDetails
                                        viewForm={viewForm}
                                        editForm={editForm}
                                        contactPerson={contactPerson} contactPhone={contactPhone}
                                        handleContactDetailInputChange={() => null}
                                        handleContactDetails={this.handleNext}
                                        checked={sameWithCtPerson} handleSameWithCtPersonChange={() => null}
                                        guarantor={guarantor} guarantorPhone={guarantorPhone}
                                        selected_gran_NRC_Id={selected_gran_NRC_Id}
                                        selected_gran_DistrictCode={selected_gran_DistrictCode}
                                        gran_nrc_number={gran_nrc_number}
                                        districtCodeList={granDistrictCodeList}
                                        nrcList={nrcList}
                                        onCancelClick={BackToTable}
                                        handleNRC_Id={() => null}
                                        handleGranDistrictCode={() => null}
                                        handlePreviousClick={this.handlePreviousClick}
                                        guaFullNRC={guaFullNRC}
                                    />
                                    : tabIndex === 5 ?
                                        <BankAccountDetails
                                            viewForm={viewForm}
                                            editForm={editForm}
                                            handleBankDetailInputChange={() => null}
                                            handleSelectedBank={() => null}
                                            employeeNameEng={employeeNameEng}
                                            accountName={accountName} accountNumber={accountNumber}
                                            bankList={bankList} selected_bank={selected_bank} bankData={bankData}
                                            handleEditBankData={() => null} bankDataEdit={bankDataEdit}
                                            handleAdd_UpdateBankData={() => null}
                                            handleDeleteBankData={() => null}
                                            handleBankAccountDetails={this.handleNext}
                                            onCancelClick={BackToTable}
                                            cancelEdit={this.cancelEdit}
                                            handlePreviousClick={this.handlePreviousClick}
                                        /> : tabIndex === 6 ?
                                            <OtherInfo
                                                handleOtherInfo={this.handleNext} onCancelClick={this.clearProfileData}
                                                handleOtherInfoInputChange={() => null}
                                                handlePreviousClick={this.handlePreviousClick}
                                                trainingCode={trainingCode} partTimeCode={partTimeCode} customerCode={customerCode} ThaPaYaAccount={ThaPaYaAccount} SSCCardNo={SSCCardNo}
                                            />
                                            : tabIndex === 7 ?
                                                <Attachment
                                                    viewForm={viewForm} onCancelClick={BackToTable}
                                                    editForm={editForm}
                                                    handleAttachment={this.handleNext}
                                                    handleAttachmentChange={() => null}
                                                    attachmentUrl={attachmentUrl}
                                                    handlePreviousClick={this.handlePreviousClick}
                                                /> : tabIndex === 8 ?
                                                    <EmploymentDetails 
                                                        viewForm={viewForm}
                                                        editForm={editForm}
                                                        onCancelClick={BackToTable}
                                                        employeeStatus={employeeStatus} employeeDesignation={employeeDesignation} jobTitle={jobTitle} carrerLevel={carrerLevel} careerSubLevel={careerSubLevel} employeeDetailBranch={employeeDetailBranch}
                                                        employedDate={employedDate} disConStatus={disConStatus} disConDate={disConDate}
                                                        handleEmploymentDetailInputChange={() => null}
                                                        handleEmploymentDetail={this.handleNext}
                                                        branchlist={this.props.branchlist} employeeStatusList={this.props.employeeStatusList}
                                                        disConstatusList={this.props.disConstatusList} handleSelectedEmpStatus={this.handleSelectedEmpStatus}
                                                        level_options={this.props.level_options} handleSelectedBranch={this.handleSelectedBranch}
                                                        designationList={this.state.designationList} handleLevelSelectorChange={this.handleLevelSelectorChange}
                                                        handlePreviousClick={this.handlePreviousClick} handleSelectedDesignation={this.handleSelectedDesignation} handleSelectedDisConStus={this.handleSelectedDisConStus}
                                                    />
                                                    : null
                }

            </div>
        )

    }
}


export default EmployeeListView;