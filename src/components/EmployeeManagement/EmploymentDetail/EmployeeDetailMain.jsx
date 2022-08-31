import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import EmploymentDetailTable from "./EmploymentDetailTable";
import EmploymentDetailsForSingleUserTable from "./EmploymentDetailForSingleUser";
import EmploymentViewForm from "./EmploymonetViewForm";


import {
  main_url,
  getUserId,
  getMainRole,
  getWorkFlowStatus,
  getCookieData,
  getPermissionStatus,
  startSaving,
} from "../../../utils/CommonFunction";
import EmploymentForm from "./EmploymentForm";
import moment from "moment";

class EmployeeDetailMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddNew: false,
      loading:false,
      user_info: getCookieData("user_info"),
      user_id: getUserId("user_info"),
      is_main_role: getMainRole(),
      isTable: true,
      isView: false,
      tableView: false,
      isEdit: false,
      tableEdit: false,
      datasource: [],
      permission_status: {},
      selected_region: null,
      selected_branch: null,
      selected_department: null,
      selected_designation: null,
      branchlist: null,
      employeeIdList: null,
      regionList: [],
      departmentlist: null,
      designationList: null,
      exitStatusList: null,
      selected_exit_status: null,
      searchValue: "",
      employeeData: null,
      addNew: false,
      employeeName: "",
      statusList: null,
      selected_status: null,
      employedDate: "",
      effectiveDate: "",
      actualDate: "",
      salary: "",
      disconDate: "",
      resignReason: "",
      selectedEmploymentData: null,
      selectedEmployeeId: "",
      edit: false,
      view: false,
      level_options: null,
      sub_level_options: null,
      career_level: null,
      career_sub_level: null,
      jobList: null,
      selected_job: null,
      selected_disCon_status: null,
      disConStatusList: [
        { value: 1, label: "True" },
        { value: 2, label: "False" },
      ],
      employmentDataForSingleUser: null,
      salaryList: [],
      singleView: false,
      statusList:[{label:'All',value:-1},{label:'Active',value:0},{label:"Exit", value:1}]
    };
  }

  async componentDidMount() {
    this.getEmployeeList();
    this.getDesignationList();
    this.getBranchList();
    this.getDepartmentList();
    this.getExitStatus();
    this.getEmployeeCodeList();
    this.getJobList();
    this.getRegionList();
    this.getSalaryTemplate();
    this.getStatusList();
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

    if (this.props.data) {
      this.goToViewForm(this.props.data);
    }
    if (this.props.id) {
      fetch(`${main_url}employee/getDetailUser/${this.props.id}`)
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((data) => {
          if (data.length > 0) {
            this.getData(this.props.id);
            this.setState({ tableEdit: true, tableView: false });


          }
        });
    }
  }
  getSalaryTemplate() {
    fetch(`${main_url}salaryTemplate/getSalaryTemplate`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          salaryList: list,
        });
      });
  }
  getStatusList() {
    fetch(`${main_url}benefit/getStatusList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          statusList: list,
        });
      });
  }
  getExitStatus() {
    fetch(`${main_url}employee/getExitStatus`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          exitStatusList: list.map((v) => ({
            ...v,
            label: v.status,
            value: v.id,
          })),
        });
      });
  }

  getEmployeeCodeList() {
    fetch(`${main_url}employee/getEmployeeCode`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          employeeIdList: list.map((v) => ({
            ...v,
            label: v.employee_code,
            value: v.user_id,
          })),
        });
      });
  }

  getJobList() {
    fetch(`${main_url}employee/getJobTitle`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          jobList: list.map((v) => ({ ...v, label: v.job_title, value: v.id })),
        });
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

  getEmployeeList(id) {
    fetch(`${main_url}employee/getEmployeeDetail`)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          this.setState({ employeeData: res });
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  }

  getDesignationList() {
    fetch(`${main_url}main/getDesignations`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          designationList: list, //list.map(v => ({ ...v, label: v.region_name, value: v.region_id }))
        });
      });
  }

  getBranchList() {
    fetch(`${main_url}benefit/getBranchList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ branch_id: 0, branch_name: 'All' })
        this.setState({
          branchlist: list.map((v) => ({
            ...v,
            label: v.branch_name,
            value: v.branch_id,
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
  getDepartmentList() {
    fetch(`${main_url}benefit/getDepartmentList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ departments_id: 0, deptname: 'All' })
        this.setState({
          departmentlist: list.map((v) => ({
            ...v,
            label: v.deptname,
            value: v.departments_id,
          })),
        });
      });
  }

  getData(id) {
    fetch(`${main_url}employee/getDetailUser/${id}`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        if (data.length > 0) {
          this.setState({
            selectedEmploymentData: data[0],
            edit: false,
            view: false,
            addNew: true,
            date: moment(new Date()).format("YYYY-MM-DD"),
            selectedEmployeeId: data.map((v) => ({ user_id: v.user_id, label: v.employment_id, value: v.employment_id }))[0],
            employeeName: data[0].employee_name,
            selected_designation: this.state.designationList.find((c) => c.value == data[0].designations_id),//
            selected_branch: this.state.branchlist.find((c) => parseInt(c.branch_id) === (data[0].branch_name ? parseInt(data[0].branch_name) : data[0].branch_name)),
            selected_department: this.state.departmentlist.find((c) => c.departments_id == data[0].departments_id),
            selected_status: this.state.statusList.find((v) => v.value === parseInt(data[0].employee_status)),
            selected_exit_status: this.state.exitStatusList.find((v) => v.id === parseInt(data[0].exit_status == null ? 0 : data[0].exit_status)),
            employedDate: data[0].employ_date,
            effectiveDate: data[0].last_promotion_date,
            actualDate: data[0].last_promotion_date,
            discontinute_date: data[0].discontinued_date ? moment(data[0].discontinued_date).format("YYYY-MM-DD") : null,
            selected_disCon_status: this.state.disConStatusList.find((v) => v.value === parseInt(data[0].discontinued_status)) ? this.state.disConStatusList.find((v) => v.value === parseInt(data[0].discontinued_status)) : [{ value: 0, label: "False" }],
            salary: data[0].basic_salary,
            resignReason: data[0].resign_reason,
            selected_job: this.state.jobList.find((v) => v.label == data[0].job_title),
            career_level: this.state.level_options.find((v) => parseInt(v.career_level_id) === parseInt(data[0].career_level_id)),
            career_sub_level: this.state.sub_level_options.find((v) => v.career_sub_level_id === data[0].career_sub_level_id),
          });
        }
        // else {
        //   this.setState({
        //     selectedEmploymentData: null,
        //     edit: false,
        //     addNew: true,
        //     date: moment(new Date()).format("YYYY-MM-DD"),
        //     employeeName: null,
        //     selected_designation: null, //
        //     selected_branch: null,
        //     selected_department: null,
        //     selected_status: null,
        //     selected_exit_status: null,
        //     employedDate: null,
        //     effectiveDate: null,
        //     actualDate: null,
        //     discontinute_date: null,
        //     selected_disCon_status: null,
        //     salary: null,
        //     resignReason: null,
        //     selected_job: null,
        //     career_level: null,
        //     career_sub_level: null,
        //   });
        // }
      });
  }

  showToast = (status, text) => {
    if (status === 200) {
      toast.success(text);
      window.location.reload();
    } else {
      startSaving();
      toast.error(text);
    }
  };

  handleSelectedDeaprtment = (event) => {
    if (event !== null)
      this.setState({
        selected_department: event,
      });
  };

  handleSelectedBranch = (event) => {
    if (event !== null)
      this.setState({
        selected_branch: event,
      });
  };
  handleSelectedRegion = (event) => {
    if (event !== null)
      this.setState({
        selected_region: event,
      });
  };
  handleSelectedDesignation = (event) => {
    if (event !== null)
      this.setState({
        selected_designation: event,
      });
  };
  handleSelectedstatus =(event) => {
    if (event !==null)
    this.setState({
      selected_status :event
    });
  };
  handleSelectedStatus = (event) => {
    if (event !== null)
      this.setState({
        selected_status: event,
      });
  };

  handleSelectedEmployeeId = (event) => {
    if (event !== null) this.getData(event.user_id);
    this.setState({
      selectedEmployeeId: event,
    });
  };

  handleSelectedExitStatus = (event) => {
    if (event !== null)
      this.setState({
        selected_exit_status: event,
      });
  };

  handleSelectedDisConStatus = (event) => {
    if (event !== null)
      this.setState({
        selected_disCon_status: event,
      });
  };

  handleSelectedJob = (event) => {
    if (event !== null)
      this.setState({
        selected_job: event,
      });
  };


  handleSearchList = (e) => {
    this.setState({
      loading:true
    })
    e.preventDefault();
   
    // this.getEmployeeList({ regionId, depId, branchId, designId,statusId });
    fetch(`${main_url}employee/getEmployeeDetail/${this.state.selected_region
    ? this.state.selected_region.state_id
    : 0}/${this.state.selected_department
    ? this.state.selected_department.departments_id
    : 0}/${this.state.selected_branch
    ? this.state.selected_branch.branch_id
    : 0}/${this.state.selected_designation
    ? this.state.selected_designation.value
    : 0}/${this.state.selected_status
    ? this.state.selected_status.value
    :-1}`)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          this.setState({ employeeData: res,loading:false });
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
          // .then(res => { if (res.ok) return res.json() })
          // .then(list => {
          //   this._setTableData(list);
          // })
      
 
  };

  handleAddFormInputChange = (e) => {
    if (e.target.name === "employeeName") {
      this.setState({
        employeeName: e.target.value,
      });
    } else if (e.target.name === "employedDate") {
      this.setState({
        employedDate: e.target.value,
      });
    } else if (e.target.name === "effectiveDate") {
      this.setState({
        effectiveDate: e.target.value,
      });
    } else if (e.target.name === "actualDate") {
      this.setState({
        actualDate: e.target.value,
      });
    } else if (e.target.name === "salary") {
      this.setState({
        salary: e.target.value,
      });
    } else if (e.target.name === "disconDate") {
      this.setState({
        disconDate: e.target.value,
      });
    } else if (e.target.name === "resignReason") {
      this.setState({
        resignReason: e.target.value,
      });
    }
  };
  submitAddForm = (e) => {
    e.preventDefault();
    const {
      selected_status,
      effectiveDate,
      actualDate,
      salary,
      selected_job,
      selected_disCon_status,
      disconDate,
      resignReason,
      employedDate,
      career_sub_level,
      selected_exit_status,
      selected_branch,
      career_level,
      selected_department,
      selected_designation,
      employeeName,
      selectedEmployeeId,
      user_id,
    } = this.state;
    let data = {
      user_id: selectedEmployeeId.user_id,
      employed_status: selected_status ? selected_status.value : null,
      employee_name: employeeName ? employeeName : '',
      employee_code: selectedEmployeeId
        ? selectedEmployeeId.label.trim()
        : null,
      designation: selected_designation ? selected_designation.value : null,
      branch: selected_branch ? parseInt(selected_branch.branch_id) : null,
      department: selected_department
        ? selected_department.departments_id
        : null,
      career_level: career_level ? career_level.career_level_id : null,
      career_sub_level: career_sub_level
        ? career_sub_level.career_sub_level_id
        : null,
      exit_status: selected_exit_status ? selected_exit_status.value : null,
      employee_date: employedDate ? employedDate : "",
      effective_date: effectiveDate ? effectiveDate : "",
      salary: salary ? salary : "",
      job_title: selected_job ? selected_job.value : null,
      discontinute_status: selected_disCon_status
        ? selected_disCon_status.value
        : null,
      discontinute_date: disconDate ? disconDate : "",
      resign_reason: resignReason ? resignReason : "",
      date: actualDate ? actualDate : "",
    };
    let status = 0;
    fetch(`${main_url}employee/addEmploymentDetail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `employee=${JSON.stringify(data)}`,
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
        window.location.replace("/employment_details");
      });
    this.setState({
      addNew: false,
    });
  };

  goToEditForm = (data) => {

    this.setState({
      selectedEmploymentData: data,
      edit: true,
      addNew: false,
      view: false,

      user_id: data.user_id,
      selectedEmployeeId: this.state.employeeIdList.find(
        (v) => v.user_id == data.user_id
      ),
      employeeName: data.fullname,
      selected_designation: this.state.designationList.find(
        (c) => c.label == data.designation_name
      ), //
      selected_branch: this.state.branchlist.find(
        (c) =>
          parseInt(c.branch_id) ==
          data.branch_id
      ),
      selected_department: this.state.departmentlist.find(
      (v) => v.label == data.deptname
      ),
      selected_status: this.state.statusList.find(
        (v) => v.value == parseInt(data.status)
      ),
      selected_exit_status: this.state.exitStatusList.find(
        (v) => v.id == parseInt(data.exit_status)
      ),
      employedDate: data.employee_date,
      effectiveDate: data.effective_date,
      actualDate: data.actual_date,
      disconDate: data.discontinute_date != null ? data.discontinute_date : '',
      selected_disCon_status: this.state.disConStatusList.find(
        (v) => v.value == parseInt(data.discontinute_status)
      )
        ? this.state.disConStatusList.find(
          (v) => v.value == parseInt(data.discontinute_status)
        )
        : [{ value: 2, label: "False" }],
      salary: data.salary,
      resignReason: data.resign_reason,
      selected_job: this.state.jobList.find(
        (v) => v.label == data.job_title
      ),
      career_level: this.state.level_options.find(
        (v) => v.career_level_id == data.career_level
      ),
      career_sub_level: this.state.sub_level_options.find(
        (v) => v.career_sub_level_id == data.career_sub_level
      ),
    });
  };

  goToViewForm = (data) => {
    this.setState({
      tableView: true,
    });
    fetch(`${main_url}employee/getEmployUserDetail/${data.user_id}`)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          this.setState({ employmentDataForSingleUser: res });
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  };

  goToSingleViewForm = (data) => {
    console.log('view Data ===>', data)

    this.setState({
      selectedEmploymentData: data,
      edit: false,
      view: false,
      addNew: false,
      singleView: true,

      user_id: data.user_id,
      selectedEmployeeId: this.state.employeeIdList.find(
        (v) => v.user_id == data.user_id
      ),
      employeeName: data.fullname,
      selected_designation: this.state.designationList.find(
        (c) => c.label == data.designation_name
      ), //
      selected_branch: this.state.branchlist.find(
        (c) =>
          parseInt(c.branch_id) ==
          data.branch_id
      ),
      selected_department: this.state.departmentlist.find(
        (v) => v.label == data.deptname
      ),
      selected_status: this.state.statusList.find(
        (v) => v.value == parseInt(data.status)
      ),
      selected_exit_status: this.state.exitStatusList.find(
        (v) => v.id == parseInt(data.exit_status)
      ),
      employedDate: data.employee_date,
      effectiveDate: data.effective_date,
      actualDate: data.actual_date,
      disconDate: data.discontinute_date != null ? data.discontinute_date : '',
      selected_disCon_status: this.state.disConStatusList.find(
        (v) => v.value == parseInt(data.discontinute_status)
      )
        ? this.state.disConStatusList.find(
          (v) => v.value == parseInt(data.discontinute_status)
        )
        : [{ value: 2, label: "False" }],
      salary: data.salary,
      resignReason: data.resign_reason,
      selected_job: this.state.jobList.find(
        (v) => v.label == data.job_title
      ),
      career_level: this.state.level_options.find(
        (v) => v.career_level_id == data.career_level
      ),
      career_sub_level: this.state.sub_level_options.find(
        (v) => v.career_sub_level_id == data.career_sub_level
      ),
    });
  }

  handleUpdatData = (e) => {
    e.preventDefault();
    const {
      selected_status,
      effectiveDate,
      selectedEmploymentData,
      actualDate,
      salary,
      selected_job,
      selected_disCon_status,
      disconDate,
      resignReason,
      employedDate,
      career_sub_level,
      selected_exit_status,
      selected_branch,
      career_level,
      selected_department,
      selected_designation,
      employeeName,
      selectedEmployeeId,
      user_id,
    } = this.state;


    let data = {
      user_id: user_id,
      employed_status: selected_status ? selected_status.value : null,
      employee_name: employeeName ? employeeName.toUpperCase : '',
      employee_code: selectedEmployeeId
        ? selectedEmployeeId.label.trim()
        : null,
      designation: selected_designation ? selected_designation.value : null,
      branch: selected_branch ? parseInt(selected_branch.branch_id) : null,
      deparment: selected_department
        ? selected_department.departments_id
        : null,
      career_level: career_level ? career_level.career_level_id : null,
      career_sub_level: career_sub_level
        ? career_sub_level.career_sub_level_id
        : null,
      exit_status: selected_exit_status ? selected_exit_status.value : null,
      employee_date: employedDate
        ? moment(employedDate).format("YYYY-MM-DD")
        : null,
      effective_date: effectiveDate
        ? moment(effectiveDate).format("YYYY-MM-DD")
        : null,
      date: actualDate ? moment(actualDate).format("YYYY-MM-DD") : null,
      salary: salary ? salary : "",
      job_title: selected_job ? selected_job.value : null,
      discontinute_status: selected_disCon_status
        ? selected_disCon_status.value
        : null,
      discontinute_date: disconDate
        ? moment(disconDate).format("YYYY-MM-DD")
        : null,
      resign_reason: resignReason ? resignReason : "",
    };
    let status = 0;
    fetch(
      `${main_url}employee/updateEmploymentDetail/${selectedEmploymentData.id == undefined ? this.props.id : selectedEmploymentData.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `employee=${JSON.stringify(data)}`,
      }
    )
      .then((res) => {
        status = res.status;
        return res.text();
      })
      .then((text) => {
        if (status === 200) {
          toast.success(text);
          window.location.reload();
        } else toast.error(text);
        window.location.replace("/employment_details");
      });
  };

  handleFormCancel = () => {
    this.setState({
      addNew: false,
      tableEdit: false,
      tableView: false
    });
    this.getEmployeeList();
    this.clearFormData();
  };

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
    this.setState(setState, () => {
      if (key != "career_level") {
        this.setState({
          salary: this.state.salaryList.filter(
            (v) => v.career_sub_level == value.career_sub_level_id
          )[0].basic_salary,
        });
      }
    });
  };

  clearFormData = () => {
    this.setState({
      selected_region: null,
      selected_branch: null,
      selected_department: null,
      selected_designation: null,
      selected_exit_status: null,
      addNew: false,
      employeeName: "",
      selected_status: null,
      employedDate: "",
      effectiveDate: "",
      actualDate: "",
      salary: "",
      disconDate: "",
      resignReason: "",
      selectedEmploymentData: null,
      selectedEmployeeId: "",
      edit: false,
      view: false,
      career_level: null,
      career_sub_level: null,
      selected_job: null,
      selected_disCon_status: null,
    });
  };
  BackToTable = () => {
    this.setState({
      viewForm: false,
      editForm: false,
      selectedEmployeeData: null,
      editForm: false,
    });
    const regionId = this.state.selected_region
      ? this.state.selected_region.region_id
      : 0;
    const depId = this.state.selected_department
      ? this.state.selected_department.departments_id
      : 0;
    const branchId = this.state.selected_branch
      ? this.state.selected_branch.branch_id
      : 0;
    const designId = this.state.selected_designation
      ? this.state.selected_designation.value
      : 0;
      const statusId = this.state.selected_status
      ? this.state.selected_status.value
      :0;
    this.getEmployeeList({ regionId, depId, branchId, designId ,statusId});
  };
  render() {
    const {
      addNew,
      level_options,
      sub_level_options,
      employeeName,
      jobList,
      selected_job,
      statusList,
      exitStatusList,
      selected_exit_status,
      selected_status,
      employeeIdList,
      employedDate,
      disconDate,
      resignReason,
      selectedEmployeeId,
      effectiveDate,
      actualDate,
      salary,
      designationList,
      selected_designation,
      employmentDataForSingleUser,
      branchlist,
      selected_branch,
      disConStatusList,
      selected_disCon_status,
      departmentlist,
      regionList,
      selected_department,
      edit,
      view,
      singleView,
      career_level,
      career_sub_level,
      tableEdit,
      tableView
    } = this.state;
    if(this.state.loading==true){
      return <div style={{ display: 'flex', justifyContent: 'center' }}><h2>Loading...</h2></div>
    }else{
      return (
        <div className=" border-bottom white-bg dashboard-header">
          <ToastContainer position={toast.POSITION.TOP_RIGHT} />
          {/* <form > */}
          <div className="row wrapper white-bg page-heading">
            <div className="col-lg-12 col-md-12">
              <ol className="breadcrumb">
                <li style={{ fontSize: 18 }}>Employee</li>
                <li className="active" style={{ fontSize: 18 }}>
                  <a href="#"> Employment Details</a>
                </li>
              </ol>
            </div>
            {addNew || edit || singleView || view ? null : (
              
              <div
                className=""
                style={{
                  marginTop: 50,
                //   alignItems: "start",
                //   display: "flex",
                //   flexWrap: "wrap",
                }}
              >
               <div
                  className="col-lg-2 col-md-3 col-sm-12"
                  style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
                >
                  <div style={{ paddingBottom: 10 }}>Region</div>
  
                  <Select
                    options={this.state.regionList}
                    value={this.state.selected_region}
                    onChange={this.handleSelectedRegion.bind(this)}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                  />
                </div>
                <div
                  className="col-lg-2 col-md-3 col-sm-12"
                  style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
                >
                  <div style={{ paddingBottom: 10 }}>Department</div>
  
                  <Select
                    options={this.state.departmentlist}
                    value={this.state.selected_department}
                    onChange={this.handleSelectedDeaprtment.bind(this)}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                  />
                </div>
                <div
                  className="col-lg-2 col-md-3 col-sm-12"
                  style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
                >
                  <div style={{ paddingBottom: 10 }}>Branch</div>
  
                  <Select
                    options={this.state.branchlist}
                    value={this.state.selected_branch}
                    onChange={this.handleSelectedBranch.bind(this)}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                  />
                </div>
                <div
                  className="col-lg-2 col-md-3 col-sm-12"
                  style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
                >
                  <div style={{ paddingBottom: 10 }}>Designation</div>
  
                  <Select
                    options={this.state.designationList}
                    value={this.state.selected_designation}
                    onChange={this.handleSelectedDesignation.bind(this)}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                  />
                </div>
                <div
                  className="col-lg-2 col-md-3 col-sm-12"
                  style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
                >
                  <div style={{ paddingBottom: 10 }}>Status</div>
  
                  <Select
                    options={this.state.statusList}
                    value={this.state.selected_status}
                    onChange={this.handleSelectedstatus.bind(this)}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                  />
                </div>
              {/* <div className="col-lg-2 col-md-5" style={{marginTop:"10px"}}>
                <button
                  onClick={() => this.setState({ addNew: true })}
                  style={{
                    borderRadius: 5,
                    padding: 10,
                    background: "#337ab7",
                    color: "white",
                    border: "none",
                  }}
                >
                   Add New 
                </button>
              </div> */}
              <div
                  className="col-lg-2 col-md-3 col-sm-8"
                  style={{ display: "flex",marginTop:30 }}
                >
                  <button
                    onClick={this.handleSearchList}
                    className="btn btn-primary"
                    style={{ borderRadius: 3, width: 80, marginRight: 15}}
                  >
                    Search
                  </button>
                  <button
                    onClick={() => this.setState({ addNew: true })}
                    className="btn btn-primary"
                    style={{ borderRadius: 3, width: 80, textAlign: 'center' }}
                  >
                    Add New
                  </button>
                </div>
              </div>
            )}
          </div>
          {this.state.tableView ? (
            <div style={{}}>
              <button
                onClick={() => {
                  this.setState({ tableView: false });
                  this.getEmployeeList();
                }}
                style={{
                  borderRadius: 5,
                  padding: 10,
                  background: "#337ab7",
                  color: "white",
                  border: "none",
                }}
              >
                {"< Back"}
              </button>
              <EmploymentDetailsForSingleUserTable
                goToViewForm={null}
                goToEditForm={null}
                data={
                  this.state.employmentDataForSingleUser
                    ? this.state.employmentDataForSingleUser
                    : []
                }
                permission={{
                  isEdit: 0,
                  isView: 0,
                }}
              />
  
            </div>
          ) : this.state.singleView ? (
            <>
              <EmploymentViewForm
                singleView={singleView}
                view={view}
                selectedEmployeeId={selectedEmployeeId}
                level_options={level_options}
                sub_level_options={sub_level_options}
                employeeName={employeeName}
                statusList={statusList}
                selected_status={selected_status}
                handleAddFormInputChange={this.handleAddFormInputChange}
                handleSelectedStatus={this.handleSelectedStatus}
                employedDate={employedDate}
                effectiveDate={effectiveDate}
                actualDate={actualDate}
                salary={salary}
                disconDate={disconDate}
                designationList={designationList}
                selected_designation={selected_designation}
                branchlist={branchlist}
                selected_branch={selected_branch}
                departmentlist={departmentlist}
                selected_department={selected_department}
                handleSelectedBranch={this.handleSelectedBranch}
                handleSelectedDeaprtment={this.handleSelectedDeaprtment}
                handleSelectedDesignation={this.handleSelectedDesignation}
                submitAddForm={this.submitAddForm}
                handleFormCancel={this.handleFormCancel}
                handleUpdatData={this.handleUpdatData}
                handleSelectedEmployeeId={this.handleSelectedEmployeeId}
                handleLevelSelectorChange={this.handleLevelSelectorChange}
                career_level={career_level}
                career_sub_level={career_sub_level}
                employeeIdList={employeeIdList}
                exitStatusList={exitStatusList}
                selected_exit_status={selected_exit_status}
                handleSelectedExitStatus={this.handleSelectedExitStatus}
                jobList={jobList}
                selected_job={selected_job}
                handleSelectedJob={this.handleSelectedJob}
                disConStatusList={disConStatusList}
                resignReason={resignReason}
                selected_disCon_status={selected_disCon_status}
                handleSelectedDisConStatus={this.handleSelectedDisConStatus}
              /></>
          ) : (
            <>
              {addNew || edit || tableEdit ? (
                <EmploymentForm
                  edit={edit}
                 
                  selectedEmployeeId={selectedEmployeeId}
                  level_options={level_options}
                  sub_level_options={sub_level_options}
                  employeeName={employeeName}
                  statusList={statusList}
                  selected_status={selected_status}
                  handleAddFormInputChange={this.handleAddFormInputChange}
                  handleSelectedStatus={this.handleSelectedStatus}
                  employedDate={employedDate}
                  effectiveDate={effectiveDate}
                  actualDate={actualDate}
                  salary={salary}
                  disconDate={disconDate}
                  designationList={designationList}
                  selected_designation={selected_designation}
                  branchlist={branchlist}
                  selected_branch={selected_branch}
                  departmentlist={departmentlist}
                  selected_department={selected_department}
                  handleSelectedBranch={this.handleSelectedBranch}
                  handleSelectedDeaprtment={this.handleSelectedDeaprtment}
                  handleSelectedDesignation={this.handleSelectedDesignation}
                  submitAddForm={this.submitAddForm}
                  handleFormCancel={this.handleFormCancel}
                  handleUpdatData={this.handleUpdatData}
                  handleSelectedEmployeeId={this.handleSelectedEmployeeId}
                  handleLevelSelectorChange={this.handleLevelSelectorChange}
                  career_level={career_level}
                  career_sub_level={career_sub_level}
                  employeeIdList={employeeIdList}
                  exitStatusList={exitStatusList}
                  selected_exit_status={selected_exit_status}
                  handleSelectedExitStatus={this.handleSelectedExitStatus}
                  jobList={jobList}
                  selected_job={selected_job}
                  handleSelectedJob={this.handleSelectedJob}
                  disConStatusList={disConStatusList}
                  resignReason={resignReason}
                  selected_disCon_status={selected_disCon_status}
                  handleSelectedDisConStatus={this.handleSelectedDisConStatus}
                />
              ) : (
                <div style={{}}>
                  <EmploymentDetailTable
  
                    goToEditForm={this.goToEditForm}
                    goToSingleViewForm={this.goToSingleViewForm}
                    data={this.state.employeeData ? this.state.employeeData : []}
                    permission={{
                      isEdit: 1,
                      isView: 1,
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      );
    }
    
  }
}

export default EmployeeDetailMain;
