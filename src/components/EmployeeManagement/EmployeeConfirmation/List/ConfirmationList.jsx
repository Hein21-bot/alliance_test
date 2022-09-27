import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";

import {
  main_url,
  getUserId,
  getMainRole,
  getWorkFlowStatus,
  getCookieData,
  getPermissionStatus,
  startSaving,
} from "../../../../utils/CommonFunction";
import Rodal from "rodal";
import Select from "react-select";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import ListSearchForm from "./ListSearchForm";
import ConfirmationListTable from "./ConfirmationListTable";
import ViewConfirmationListForm from "./ViewConfirmationListForm";
import ConfirmationRequest from "./components/ConfirmationRequest";

class ConfirmationList extends Component {
  constructor() {
    super();
    this.state = {
      user_info: getCookieData("user_info"),
      loading:false,
      user_id: getUserId("user_info"),
      is_main_role: getMainRole(),
      view: false,
      titleList: [],
      confirmationMonth: null,
      date: new Date(),
      promotion_date: [],
      employee_date: [],
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
      visible: false,
      modal_visible: false,
      extension_comment: "",
      requestComponent: false,
      title: '',
      approveComponent: false,
      selected_title_list: null,
      selected_designation_list: null,
      checkboxAll: false,
    };
  }

  show_Modal() {
    this.setState({ modal_visible: true });
  }

  hide_Modal() {
    this.setState({ modal_visible: false });
  }

  async componentDidMount() {
    this.getRegionList();
    this.getBranchList();
    this.getDepartmentList();
    this.getDesignationList();
    // this.getConfirmationList()
    this.getConfirmationTitleList();
    const level = await this.getLevelOptions();
    const sub_level = await this.getCareerSubLevelOptions();
    const level_options =
      level &&
      level.map((v) => ({
        ...v,
        label: v.career_level,
        value: v.career_level,
      }));
    const sub_level_options =
      sub_level &&
      sub_level.map((v) => ({
        ...v,
        label: v.career_sub_level,
        value: v.career_sub_level,
      }));
    this.setState({
      level_options,
      sub_level_options,
    });
  }

  getLevelOptions = async () => {
    var res = await fetch(`${main_url}allowLevel/getLevel`);
    if (res.ok) return res.json();
    else return [];
  };

  getCareerSubLevelOptions = async () => {
    var res = await fetch(`${main_url}allowLevel/getCareerSubLevel`);
    if (res.ok) return res.json();
    else return [];
  };

  getConfirmationList() {
    const {
      selected_region,
      selected_title_list,
      selected_designation_list,
      selected_title,
      confirmationMonth,
      selected_branch,
      selected_department,
      selected_designation,
      career_level,
      career_sub_level,
      selected_branch_list
    } = this.state;
    this.setState({loading:true})

    const regionId = selected_region ? selected_region.state_id : 0;
    const branchId = selected_branch ? selected_branch.branch_id : 0;
    const depId = selected_department ? selected_department.departments_id : 0;
    const designId = selected_designation ? selected_designation_list : 0;
    const lvlId = career_level ? career_level.career_level_id : 0;
    const subLvlId = career_sub_level ? selected_branch.career_sub_level_id : 0;
    const title_list = selected_title_list ? selected_title_list : 0;
    const designation_list = selected_designation_list ? selected_designation_list : 0
    const branch_list=selected_branch_list ? selected_branch_list : 0

    const title = selected_title
      ? selected_title.value
        ? selected_title.value
        : confirmationMonth
      : 0;
    // const formData = new FormData();
    // formData.append('title_list', JSON.stringify(title_list))

    if (regionId == 0 && depId == 0 && branchId == 0) {
      return toast.error('Please Choose region or department or branch!')
    } else {
      fetch(
        `${main_url}confirmation/getConfirmationList/${regionId}/${depId}/${branch_list}/${designation_list}/${lvlId}/${subLvlId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `title_list=${title_list.length == 0 ? 0 : JSON.stringify(title_list)}`,

      }
      )
        .then((res) => {
          // if (res.ok) return res.json();
          if (res.ok) {
            return res.json();
          }
        })
        .then((list) => {
          this.setState({
            confirmationListData: list,loading:false
          });
        });
    }
  }
  // confirmation/getConfirmationList/:regionId/:depId/:branchId/:designationId/:levelId/:subLevelId
  
  

  getVerifyPersonList() {
    const {selected_branch_list}=this.state;
    this.setState({
      loading:true
    })
    const regionId = this.state.selected_region
      ? this.state.selected_region.state_id
      : 0;
    const branchId = this.state.selected_branch
      ? this.state.selected_branch.value
      : 0;
    const departmentId = this.state.selected_department
      ? this.state.selected_department.departments_id
      : 0;
      const branch_list=selected_branch_list ? selected_branch_list : 0
    fetch(
      `${main_url}confirmation/getVerifyPerson/${regionId}/${branch_list}/${departmentId}`
    )
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ branch_id: 0, branch_name: "All" });

        this.setState({
          verifyPersonList: list.map((v) => ({
            ...v,
            label: v.fullname,
            value: v.branch_id,
            loading:false
          })),
        });
      });
  }
  getDesignationList() {
    fetch(`${main_url}main/getDesignations`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          designationList: list
        });
      });
  }
  getBranchList() {
    fetch(`${main_url}benefit/getBranchList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          branchlist: list.map((v) => ({
            ...v,
            
          })),
        });
      });
  }

  getDepartmentList() {
    fetch(`${main_url}benefit/getDepartmentList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ departments_id: 0, deptname: "All" });
        this.setState({
          departmentlist: list.map((v) => ({
            ...v,
            label: v.deptname,
            value: v.departments_id,
          })),
        });
      });
  }

  getRegionList() {
    fetch(`${main_url}benefit/getRegionList`)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        let lists = list.unshift({ state_id: 0, state_name: 'All' })
        this.setState({
          regionList: list.map(v => ({ ...v, label: v.state_name, value: v.state_id }))
        })
      })
  }
  handleLevelSelectorChange = (val, key) => {
    const { sub_level_options, level_options } = this.state;
    const value =
      key === "career_level"
        ? level_options.find(
          (v) => Number(v.career_level_id) === Number(val.career_level_id)
        )
        : sub_level_options.find(
          (v) =>
            Number(v.career_sub_level_id) === Number(val.career_sub_level_id)
        );

    const setState = {};
    setState[key] = value;
    this.setState(setState);
  };

  handleSelectedDesignation = (event) => {

    if (event !== null) {

      this.setState({

        selected_designation: event,
        selected_designation_list: event.map(v => v.value)
      });

    } else {
      this.setState({
        selected_designation: null,
      });
    }

  };

  handleSelectedDeaprtment = (event) => {
    if (event !== null)
      this.setState({
        selected_department: event,
      });
  };

  handleSelectedRegion = (event) => {
    if (event !== null)
      this.setState({
        selected_region: event,
      });
  };

  handleSelectedBranch = (event) => {
   
    if (event !== null){
      this.setState({
        selected_branch: event,
        selected_branch_list:event.map(v=>v.value)
      });
    }else{
      this.setState({
        selected_branch:null
      })
    }
      
  };
  // handleSelectedCheckPerson = (event) => {
  //   if (event !== null)
  //     this.setState({
  //       selected_checkPerson: event,
  //     });
  // };

  handleSelectedVerifyPerson = (event) => {
    if (event !== null)
      this.setState({
        selected_verifyPerson: event,
      });
  };
  getConfirmationTitleList() {
    fetch(`${main_url}confirmation/getConfirmationTitle`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          titleList: list.map((v) => ({ ...v})),
        });
      });
  }

  handleSelectedTitle = (event) => {
   
    if (event !== null) {
      this.setState({
        selected_title: event,
        selected_title_list: event.map(v => v.value)
      })
    } else {
      this.setState({
        selected_title: null
      })
    }

  };

  handleCheckBoxChange = async (data) => {
    const { checkedListData } = this.state;
    const checkedListData_ = [...checkedListData];
    var tempArray = [];
    await fetch(main_url + 'confirmation/detailCheckPerson/' + data.branch_id + '/' + data.user_id).then(response => {
      return response.json();
    }).then(res => { tempArray = res })
    const newData = {
      id: data.user_id,
      employee_id: data.code ? data.code : "",
      employee_name: data.fullname ? data.fullname : "",
      position: data.designations ? data.designations : "-",
      career_level: data.career_level ? data.career_level : "-",
      career_sub_level: data.career_sub_level ? data.career_sub_level : "-",
      department: data.deptname ? data.deptname : "-",
      branch_id: data.branch_id ? data.branch_id : '-',
      branch: data.branch_name ? data.branch_name : "-",
      region: data.region_name ? data.region_name : "-",
      employee_date: data.employee_date ? moment(data.employee_date).format('DD-MM-YYYY') : "-",
      promotion_date: data.promotion_date
        ? data.promotion_date
        : "-",
        extension:data.extension?data.extension:"-",
      date: moment(data.createdAt).format("DD-MM-YYYY"),
      service_year: data.service_year ? data.service_year : "-",
      leave: data.leave ? data.leave : "-",
      leave_category: data.leave_category ? data.leave_category : '-',
      leave_start_date: data.leave_start_date ? data.leave_start_date : '-',
      leave_end_date: data.leave_end_date ? data.leave_end_date : '-',
      leave_status: data.leave_status ? data.leave_status : '-',
      checkPerson: tempArray,

    };
    if (checkedListData_.length === 0) {
      checkedListData_.push(newData);
      this.setState(
        {
          checkedListData: checkedListData_,
        },
        () => console.log(this.state.checkedListData)
      );
    } else if (
      checkedListData_.filter((c) => c.id === data.user_id).length > 0
    ) {
      for (var i = 0; i < checkedListData_.length; i++) {
        if (checkedListData_[i].id == data.user_id) {
          checkedListData_.splice(i, 1);
        }
      }
      this.setState({
        checkedListData: checkedListData_,
      });
    } else {
      checkedListData_.push(newData);
      this.setState({
        checkedListData: checkedListData_,
      });
    }
  };

  handleConfirmationListInputChange = (e) => {
    this.setState({
      confirmationMonth: e.target.value,
    });
  };

  handleSearch = (e) => {
    // this.getEmployeeList({ regionId, depId, branchId, designId })
   
    this.getVerifyPersonList();
    this.getConfirmationList();
  };

  onChange = (date) => {
    this.setState({
      date,
      dropDownOpen: false,
    });
  };

  handleVisible = (title) => {
    if (this.state.checkedListData.length > 0) {
      this.setState({
        requestComponent: true,
        title: title
      });
    }
  };

  handleLeaveExtensionRequest = (extension_comment) => {

    if (this.state.checkedListData.length > 0) {
      let data = {
        person: getCookieData("user_info").user_id,
        list: this.state.checkedListData,
        extension_comment: extension_comment,
        status: 5,
        createdAt: moment(new Date()).format('YYYY-MM-DD')
      };


      let status = 0;
      fetch(`${main_url}confirmation/addConfirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `confirmation=${JSON.stringify(data)}`,
      })
        .then((res) => {
          status = res.status;
          return res.text();
        })
        .then((text) => {
          if (status === 200) {
            toast.success(text);
            window.location.reload();
          } else toast.error(text);
        });
    } else toast.error("Please choose at least one user!");
  };

  // handleConfirmRequest = () => {
  //   if (this.state.checkedListData.length > 0) {
  //     if (this.state.selected_checkPerson && this.state.selected_verifyPerson) {
  //       let data = {
  //         person: getCookieData("user_info").user_id,
  //         list: this.state.checkedListData,
  //         verify_person: this.state.selected_verifyPerson.user_id,
  //         check_person: this.state.selected_checkPerson.user_id,
  //         status: 0
  //       };
  //       console.log('data list ===>', data.list)
  //       // let status = 0;
  //       // fetch(`${main_url}confirmation/addConfirmation`, {
  //       //   method: "POST",
  //       //   headers: {
  //       //     "Content-Type": "application/x-www-form-urlencoded",
  //       //   },
  //       //   body: `confirmation=${JSON.stringify(data)}`,
  //       // })
  //       //   .then((res) => {
  //       //     status = res.status;
  //       //     return res.text();
  //       //   })
  //       //   .then((text) => {
  //       //     if (status === 200) {
  //       //       toast.success(text);
  //       //       window.location.reload();
  //       //     } else toast.error(text);
  //       //     window.location.replace("/confirmation_list");
  //       //   });
  //     } else if (!this.state.selected_verifyPerson)
  //       toast.error("Please choose verify person!");
  //     else toast.error("Please choose check person!");
  //   } else toast.error("Please choose at least one user!");
  // };

  handleCheckboxAll = async (e) => {
    this.setState({checkboxAll: e});
    const tempCheckListData = this.state.checkedListData;
    if ( e == true) {
      await this.state.confirmationListData.map(async(v) => {
        var tempArray = [];
     await fetch(main_url + 'confirmation/detailCheckPerson/' + v.branch_id + '/' + v.user_id).then(response => {
      return response.json();
    }).then(res => { tempArray = res })
        const newData = {
          id: v.user_id,
          employee_id: v.code ? v.code : "",
          employee_name: v.fullname ? v.fullname : "",
          position: v.designations ? v.designations : "-",
          career_level: v.career_level ? v.career_level : "-",
          career_sub_level: v.career_sub_level ? v.career_sub_level : "-",
          department: v.deptname ? v.deptname : "-",
          branch_id: v.branch_id ? v.branch_id : '-',
          branch: v.branch_name ? v.branch_name : "-",
          region: v.region_name ? v.region_name : "-",
          employee_date: v.employee_date ? moment(v.employee_date).format('DD-MM-YYYY') : "-",
          promotion_date: v.promotion_date
            ? v.promotion_date
            : "-",
            extension:v.extension?v.extension:"-",
          date: moment(v.createdAt).format("DD-MM-YYYY"),
          service_year: v.service_year ? v.service_year : "-",
          leave: v.leave ? v.leave : "-",
          leave_category: v.leave_category ? v.leave_category : '-',
          leave_start_date: v.leave_start_date ? v.leave_start_date : '-',
          leave_end_date: v.leave_end_date ? v.leave_end_date : '-',
          leave_status: v.leave_status ? v.leave_status : '-',
          checkPerson: tempArray,
        };
        tempCheckListData.push(newData);
      });
      this.setState({checkedListData: tempCheckListData})
    } else {
      this.setState({checkedListData: []});
    }
  }

  handleDropDown = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
  };
  
  render() {
    if(this.state.loading==true){
      return <div style={{ display: 'flex', justifyContent: 'center' }}><h2>Loading...</h2></div>
    }
    
    else{
      const { checkboxAll, checkedListData,view, selected_title, titleList, confirmationMonth, verifyPersonList, selected_verifyPerson, date, promotion_date, employee_date, user_info, level_options, sub_level_options, career_level, career_sub_level, confirmationListData, checkPersonList, selected_checkPerson, dropDownOpen, selected_designation, designationList, subLevelList, levelList, selected_branch, selected_department, selected_region, regionList, branchlist, departmentlist, } = this.state;
    console.log('checkListData ===>', checkedListData)
      return (
        <div className=" border-bottom white-bg dashboard-header">
          <ToastContainer position={toast.POSITION.TOP_RIGHT} />
          {this.state.requestComponent == false ? (
            <>
              <div className="row wrapper white-bg page-heading">
                <div className="col-lg-12">
                  <ol className="breadcrumb">
                    <li style={{ fontSize: 18 }}>Employee</li>
                    <li style={{ fontSize: 18 }}>Confirmation</li>
                    <li style={{ fontSize: 18 }}>List</li>
                  </ol>
                </div>
              </div>
  
              <div className="white-bg" style={{}}>
                <ListSearchForm
                
                  titleList={titleList}
                  confirmationMonth={confirmationMonth}
                  date={date}
                  promotion_date={promotion_date}
                  employee_date={employee_date}
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
                  handleConfirmationListInputChange={
                    this.handleConfirmationListInputChange
                  }
                  handleSelectedTitle={this.handleSelectedTitle}
                  handleSelectedBranch={this.handleSelectedBranch}
                  handleSelectedDeaprtment={this.handleSelectedDeaprtment}
                  handleSelectedRegion={this.handleSelectedRegion}
                  handleDropDown={this.handleDropDown}
                  onChange={this.onChange}
                  handleLevelSelectorChange={this.handleLevelSelectorChange}
                />
                <hr />
                <div style={{}}>
  
                  {this.state.visible == false ? (
                    <div className="col-lg-12 col-md-12" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                      <div style={{width: '20%'}}>
                        <label>
                        <input type={'checkbox'} onChange={() => this.handleCheckboxAll(!checkboxAll)}/>
                        Select All
                        </label>
                      </div>
                    <div
                      // className="col-lg-12 col-md-12 col-sm-12"
                      style={{ width: '80%', display: 'flex', justifyContent: 'flex-end', marginBottom: 5, paddingRight: 5 }}
                    >
                      <button
                        onClick={() => this.handleVisible('request')}
                        className="btn btn-primary"
                        style={{ borderRadius: 3, width: 80, marginRight: 15 }}
                      >
                        Request
                      </button>
                      <button
                        onClick={() => this.handleVisible('extension')}
                        className="btn btn-danger"
                        style={{ borderRadius: 3, width: 90 }}
                      >
                        Extension
                      </button>
                    </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
  
                <ConfirmationListTable
                  handleCheckBoxChange={this.handleCheckBoxChange}
                  goToViewForm={null}
                  goToEditForm={null}
                  selectedCheckBox={this.state.selectedCheckBox}
                  data={
                    this.state.confirmationListData
                      ? this.state.confirmationListData
                      : []
                  }
                  permission={{
                    isEdit: 0,
                    isView: 0,
                    isSelect: 1,
                  }}
                  departmentlist={departmentlist}
                  checkboxAll={checkboxAll}
                />
              </div>
            </>
          ) : (
            <ConfirmationRequest
              data={this.state.checkedListData}
              checkData={this.state.checkPersonList}
              confirmData={this.state.verifyPersonList}
              selected_verifyPerson={selected_verifyPerson}
              handleSelectedVerifyPerson={this.handleSelectedVerifyPerson}
              // selected_checkPerson={selected_checkPerson}
              // handleSelectedCheckPerson={this.handleSelectedCheckPerson}
              // handleConfirmRequest={this.handleConfirmRequest}
              handleLeaveExtensionRequest={this.handleLeaveExtensionRequest}
              title={this.state.title}
              setData={this.setState}
            />
          )}
        </div>
      );
    }
  }
}

export default ConfirmationList;
