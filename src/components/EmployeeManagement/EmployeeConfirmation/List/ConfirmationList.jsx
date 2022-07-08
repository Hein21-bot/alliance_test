import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../../utils/CommonFunction";

import Select from "react-select";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from "moment";
import ListSearchForm from './ListSearchForm';
import ConfirmationListTable from './ConfirmationListTable'
import ViewConfirmationListForm from './ViewConfirmationListForm';


class ConfirmationList extends Component {
    constructor() {
        super();
        this.state = {
            user_info: getCookieData("user_info"),
            user_id: getUserId("user_info"),
            is_main_role: getMainRole(),
            view: false,
            titleList: [
            ],
            confirmationMonth: null,
            date: new Date(),
            dropDownOpen: false,
            selected_designation: null,
            designationList: null,
            subLevelList: null,
            levelList: null,
            selected_region: null,
            selected_branch: null,
            selected_department: null,
            branchlist: null,
            departmentlist: null,
            regionList: null,
            confirmationListData: null,
            selectedCheckBox: null,
            checkPersonList: null,
            selected_checkPerson: null,
            fullname: null,
            employment_id: null,
            career_level: null,
            career_sub_level: null,
            level_options: null,
            sub_level_options: null,
            verifyPersonList: null,
            selected_verifyPerson: null,
            checkedListData: [],
        }

    }

    async componentDidMount() {
        this.getRegionList();
        this.getBranchList();
        this.getDepartmentList();
        this.getDesignationList()
        // this.getConfirmationList()
        this.getConfirmationTitleList()
        const level = await this.getLevelOptions();
        const sub_level = await this.getCareerSubLevelOptions();
        const level_options = level && level.map(v => (
            {
                ...v,
                label: v.career_level,
                value: v.career_level
            }
        ))
        const sub_level_options = sub_level && sub_level.map(v => (
            {
                ...v,
                label: v.career_sub_level,
                value: v.career_sub_level
            }
        ))
        this.setState({
            level_options,
            sub_level_options
        })
    }


    getLevelOptions = async () => {
        var res = await fetch(`${main_url}allowLevel/getLevel`);
        if (res.ok) return res.json();
        else return [];
    }

    getCareerSubLevelOptions = async () => {
        var res = await fetch(`${main_url}allowLevel/getCareerSubLevel`);
        if (res.ok) return res.json();
        else return [];
    }


    getConfirmationList() {
        const { selected_region, selected_title, confirmationMonth, selected_branch, selected_department, selected_designation, career_level, career_sub_level } = this.state
        const regionId = selected_region ? selected_region.region_id : 0
        const branchId = selected_branch ? selected_branch.branch_id : 0
        const depId = selected_department ? selected_department.departments_id : 0
        const designId = selected_designation ? selected_designation.value : 0
        const lvlId = career_level ? career_level.career_level_id : 0
        const subLvlId = career_sub_level ? selected_branch.career_sub_level_id : 0
        const title = selected_title ? (selected_title.value ? selected_title.value : confirmationMonth) : 0
        fetch(`${main_url}confirmation/getConfirmationList/${regionId}/${depId}/${branchId}/${designId}/${lvlId}/${subLvlId}/${parseInt(title)}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    confirmationListData: list
                })
            })
    }
    // confirmation/getConfirmationList/:regionId/:depId/:branchId/:designationId/:levelId/:subLevelId
    getCheckPersonList() {
        const regionId = this.state.selected_region ? this.state.selected_region.region_id : 0
        const branchId = this.state.selected_branch ? this.state.selected_branch.branch_id : 0
        const departmentId = this.state.selected_department ? this.state.selected_department.departments_id : 0
        fetch(`${main_url}confirmation/getCheckPerson/${regionId}/${branchId}/${departmentId}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    checkPersonList: list.map(v => ({ ...v, label: v.fullname, value: v.branch_id }))
                })
            })
    }

    getVerifyPersonList() {
        const regionId = this.state.selected_region ? this.state.selected_region.region_id : 0
        const branchId = this.state.selected_branch ? this.state.selected_branch.branch_id : 0
        const departmentId = this.state.selected_department ? this.state.selected_department.departments_id : 0
        fetch(`${main_url}confirmation/getVerifyPerson/${regionId}/${branchId}/${departmentId}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                let lists = list.unshift({ branch_id: 0, branch_name: 'All' })

                this.setState({
                    verifyPersonList: list.map(v => ({ ...v, label: v.fullname, value: v.branch_id }))
                })
            })
    }


    getBranchList() {
        fetch(`${main_url}benefit/getBranchList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                let lists = list.unshift({ branch_id: 0, branch_name: 'All' })
                this.setState({
                    branchlist: list.map(v => ({ ...v, label: v.branch_name, value: v.branch_id }))
                })
            })
    }

    getDepartmentList() {
        fetch(`${main_url}benefit/getDepartmentList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                let lists = list.unshift({ departments_id: 0, deptname: 'All' })
                this.setState({
                    departmentlist: list.map(v => ({ ...v, label: v.deptname, value: v.departments_id }))
                })
            })
    }

    getRegionList() {
        fetch(`${main_url}benefit/getRegionList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                let lists = list.unshift({ region_id: 0, region_name: 'All' })
                this.setState({
                    regionList: list.map(v => ({ ...v, label: v.region_name, value: v.region_id }))
                })
            })
    }

    handleLevelSelectorChange = (val, key) => {
        const { sub_level_options, level_options } = this.state;
        const value = key === 'career_level' ?
            ((level_options.find(v => Number(v.career_level_id) === Number(val.career_level_id)))) :
            ((sub_level_options.find(v => Number(v.career_sub_level_id) === Number(val.career_sub_level_id))));

        const setState = {};
        setState[key] = value;
        this.setState(setState)
    }

    handleSelectedDesignation = (event) => {
        if (event !== null)
            this.setState({
                selected_designation: event
            })
    };


    handleSelectedDeaprtment = (event) => {
        if (event !== null)
            this.setState({
                selected_department: event
            })
    };

    handleSelectedRegion = (event) => {
        if (event !== null)
            this.setState({
                selected_region: event
            })
    };

    handleSelectedBranch = (event) => {
        if (event !== null)
            this.setState({
                selected_branch: event
            })
    };
    handleSelectedCheckPerson = (event) => {
        if (event !== null)
            this.setState({
                selected_checkPerson: event
            })
    };

    handleSelectedVerifyPerson = (event) => {
        if (event !== null)
            this.setState({
                selected_verifyPerson: event
            })
    };

    getDesignationList() {
        fetch(`${main_url}main/getDesignations`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    designationList: list//list.map(v => ({ ...v, label: v.region_name, value: v.region_id }))
                })
            })
    }

    getConfirmationTitleList() {
        fetch(`${main_url}confirmation/getConfirmationTitle`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    titleList: list.map(v => ({ ...v, label: v.name, value: v.value }))
                })
            })
    }


    handleSelectedTitle = (event) => {
        if (event !== null)
            this.setState({
                selected_title: event
            })
    };

    handleCheckBoxChange = (data) => {
        const { checkedListData } = this.state

        const newData = {
            id: data.user_id
        }
        if (checkedListData.length === 0) {
            this.setState({
                checkedListData: checkedListData.concat(newData)
            })
        }
        else if (checkedListData.filter(c => c.id === data.user_id).length > 0) {
            for (var i = 0; i < checkedListData.length; i++) {
                if (checkedListData[i].id == data.user_id) {
                    checkedListData.splice(i, 1)
                }
            }
            this.setState({
                checkedListData
            })
        }
        else {
            this.setState({
                checkedListData: checkedListData.concat(newData)
            })
        }
    }

    handleConfirmationListInputChange = (e) => {
        
        this.setState({
            confirmationMonth: (e.target.value)
        })
    }

    handleSearch = e => {
        // this.getEmployeeList({ regionId, depId, branchId, designId })
        this.getCheckPersonList()
        this.getVerifyPersonList()
        this.getConfirmationList()
    }

    onChange = (date) => {
        this.setState({
            date,
            dropDownOpen: false
        })
    }
    handleConfirmRequest = () => {
        if (this.state.checkedListData.length > 0) {


            if (this.state.selected_checkPerson && this.state.selected_verifyPerson) {
                let data = {
                    person: getCookieData("user_info").user_id,
                    list: this.state.checkedListData,
                    verify_person: this.state.selected_verifyPerson.user_id,
                    check_person: this.state.selected_checkPerson.user_id,
                    status: 0
                }

                let status = 0;
                fetch(`${main_url}confirmation/addConfirmation`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `confirmation=${JSON.stringify(data)}`
                })
                    .then(res => {
                        status = res.status;
                        return res.text()
                    })
                    .then(text => {
                        if (status === 200) {
                            toast.success(text);
                            // window.location.reload();
                        }
                        else toast.error(text);
                        // window.location.replace("/confirmation_list");

                    })

            }
            else if (!this.state.selected_verifyPerson) toast.error('Please choose verify person!')
            else toast.error('Please choose check person!')

        }
        else toast.error('Please choose at least one user!')

    }

    handleDropDown = () => {
        this.setState({
            dropDownOpen: !this.state.dropDownOpen
        })
    }

    handleSubmit = e => {
        e.preventDefault();
    }

    render() {
        const { view, selected_title, titleList, confirmationMonth, verifyPersonList, selected_verifyPerson, date, user_info, level_options, sub_level_options, career_level, career_sub_level, confirmationListData, checkPersonList, selected_checkPerson, dropDownOpen, selected_designation, designationList, subLevelList, levelList, selected_branch, selected_department, selected_region, regionList, branchlist, departmentlist } = this.state
        return (
            <div className=" border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <div className="row wrapper white-bg page-heading">
                    <div className="col-lg-12">
                        <h2>HR Management System</h2>
                        <ol className="breadcrumb">
                            <li>
                                Employee
                            </li>
                            <li>
                                Confirmation
                            </li>
                            <li>
                                List
                            </li>
                        </ol>
                    </div>

                </div>

                <div className='white-bg' style={{}}>

                    <ListSearchForm
                        titleList={titleList}
                        confirmationMonth={confirmationMonth}
                        date={date}
                        dropDownOpen={dropDownOpen}
                        selected_designation={selected_designation}
                        designationList={designationList}
                        subLevelList={subLevelList}
                        levelList={levelList}
                        selected_title={selected_title}
                        selected_region={selected_region}
                        selected_branch={selected_branch}
                        selected_department={selected_department}
                        branchlist={branchlist}
                        departmentlist={departmentlist}
                        regionList={regionList}
                        level_options={level_options}
                        sub_level_options={sub_level_options}
                        career_level={career_level}
                        career_sub_level={career_sub_level}
                        handleSearch={this.handleSearch}
                        handleSelectedDesignation={this.handleSelectedDesignation}
                        handleConfirmationListInputChange={this.handleConfirmationListInputChange}
                        handleSelectedTitle={this.handleSelectedTitle}
                        handleSelectedBranch={this.handleSelectedBranch}
                        handleSelectedDeaprtment={this.handleSelectedDeaprtment}
                        handleSelectedRegion={this.handleSelectedRegion}
                        handleDropDown={this.handleDropDown}
                        onChange={this.onChange}
                        handleLevelSelectorChange={this.handleLevelSelectorChange}

                    />
                    <div style={{}}>
                        <div className='dashboard-header ' style={{ alignItems: 'center', borderTop: '1px solid grey', display: 'flex' }}>
                            <h3>Confirmation List Table</h3>

                        </div>
                        {/* <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}> */}

                        {/* <div className='col-lg-8 col-md-10 col-sm-12' style={{ display: 'flex', alignItems: 'center' }}>

                                <div className='col-lg-2 col-md-2 col-sm-2'>
                                    Check Person
                                </div>
                                <div className='col-lg-5 col-md-5 col-sm-6 ' style={{ display: 'flex', justifyContent: 'start' }}>
                                    <div style={{ minWidth: 250 }}>
                                        <Select
                                            options={checkPersonList}
                                            value={selected_checkPerson}
                                            onChange={this.handleSelectedCheckPerson}
                                            className="react-select-container checkValidate"
                                            classNamePrefix="react-select"
                                        />
                                    </div>

                                </div>
                                <div className='col-lg-2' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', }}>
                                    <button onClick={this.handleConfirmRequest} className='btn btn-primary' style={{ borderRadius: 10, width: 150 }}>Confirm Request</button>

                                </div>
                            </div> */}
                        <div className='w-100' style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            <div className='col-lg-5 col-md-4 col-sm-12' style={{ display: 'flex', paddingBottom: 10, alignItems: 'center' }}>

                                <div className='col-lg-4 col-md-4 col-sm-2'>
                                    Check Person
                                </div>
                                <div className='col-lg-8 col-md-8 col-sm-6 ' style={{ display: 'flex', justifyContent: 'start' }}>
                                    <div style={{ minWidth: 250 }}>
                                        <Select
                                            options={checkPersonList}
                                            value={selected_checkPerson}
                                            onChange={this.handleSelectedCheckPerson}
                                            className="react-select-container checkValidate"
                                            classNamePrefix="react-select"
                                        />
                                    </div>

                                </div>

                            </div>
                            <div className='col-lg-5 col-md-4 col-sm-12' style={{ display: 'flex', paddingBottom: 10, alignItems: 'center' }}>

                                <div className='col-lg-2 col-md-4 col-sm-2'>
                                    Verifier
                                </div>
                                <div className='col-lg-8 col-md-8 col-sm-6 ' style={{ display: 'flex', justifyContent: 'start' }}>
                                    <div style={{ minWidth: 250 }}>
                                        <Select
                                            options={verifyPersonList}
                                            value={selected_verifyPerson}
                                            onChange={this.handleSelectedVerifyPerson}
                                            className="react-select-container checkValidate"
                                            classNamePrefix="react-select"
                                        />
                                    </div>

                                </div>

                            </div>
                            <div className='col-lg-2 col-md-1 col-sm-12' style={{ display: 'flex', flexDirection: 'row', paddingBottom: 10, justifyContent: 'flex-start', alignItems: 'center', }}>
                                <button onClick={this.handleConfirmRequest} className='btn btn-primary' style={{ borderRadius: 10, width: 150 }}>
                                    Submit
                                </button>

                            </div>
                        </div>

                    </div>


                    <ConfirmationListTable handleCheckBoxChange={this.handleCheckBoxChange} goToViewForm={null} goToEditForm={null} selectedCheckBox={this.state.selectedCheckBox} data={this.state.confirmationListData ? this.state.confirmationListData : []} permission={{
                        isEdit: 0,
                        isView: 0,
                        isSelect: 1
                    }} />

                </div>
            </div>
        )

    }
}


export default ConfirmationList;


