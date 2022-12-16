import React, { Component } from "react";

import { getCookieData, removeCookieData, remote_url, main_url } from "../../utils/CommonFunction";

export default class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      user: getCookieData("user_info"),
      pathname: window.location.pathname,
      isHR: false,
      confirmHR1:null,
      confirmRequestPermission:null
    };

    // this.checkHR = this.checkHR.bind(this)
  }
  logout() {
    removeCookieData("user_info");
  }


  checkPathName() {
    const { pathname } = this.state;
    if (pathname.includes("master_data")) {
      return "/master_data";
    }
    if (pathname.includes("setting")) {
      return "/setting";
    }
    if (pathname.includes("benefit")) {
      return "/benefit";
    }
    if (pathname.includes("staff_loan")) {
      return "/staff_loan";
    }
    if (pathname.includes("helpDesk")) {
      return "/helpDesk";
    }
    if(pathname.includes('paySlip')){
      return '/paySlip'
    }
    if(pathname.includes('SSCReport')){
      return '/ssc_report'
    }
    if (pathname.includes("staffComplain")) {
      return "/staffComplain";
    }
    if (pathname.includes("leavemanagement")) {
      return "/leavemanagement";
    }
    if (pathname.includes("attendance_leave_report")) {
      return "/attendance_leave_report";
    }
    if (pathname.includes("notification")) {
      return "/notification";
    }
    if (pathname.includes("dashboard")) {
      return "/dashboard";
    }
    if(pathname.includes('employee_salary_report')){
      return '/payroll_reports'
    }
    if (pathname.includes("employee")) {
      return "/employee_management";
    }
    if (pathname.includes("employment")) {
      return "/employee_management";
    }
    if (pathname.includes('confirmation')) {
      return "/confirmation";
    }
    if (pathname.includes('reports')) {
      return "/reports";
    }
    if(pathname.includes('payroll_calculation')){
      return '/payroll_calculation';
    }
    if(pathname.includes('incentive')){
      return '/incentive';
    }
    if(pathname.includes('attendancerelatedreports')){
      return '/attendancerelatedreports'
    }
    if(pathname.includes('attendance')){
      return '/attendance'
    }
    if(pathname.includes('payroll')){
      return '/payroll'
    }
    if(pathname.includes('payroll_reports')){
      return '/payroll_reports'
    }
    if(pathname.includes('salary_history_report')){
      return '/payroll_reports'
    }
    if(pathname.includes('payrollReport_with_bankno')){
      return '/payroll_reports'
    }
    
    
    else return "/dashboard";
  }

  async componentDidMount() {
    const id = localStorage.getItem("user_id");
    await this.checkHR(id)
    await this.confirmHR1(id)
    await this.confirmRequest(id)
  }
  confirmRequest=async(id)=>{
    await fetch(`${main_url}dashboard/confirmRequestPermission/${id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          confirmRequestPermission:data
        })
      })
  }
  confirmHR1=async (id)=>{
    await fetch(`${main_url}dashboard/confirmPermission/${id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          confirmHR1:data
        })
      })
  }

  checkHR = async (id) => {
    await fetch(`${main_url}dashboard/sidebarPermission/${id}`)
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          const checkHRVal = data[0].deptname == "HR";
          this.setState({
            isHR: checkHRVal,
          });
        }
      })
  }

  render() {
    const { pathname, user, isHR } = this.state;
    return (
      <div>
        <nav className="navbar-default navbar-static-side">
          <div className="sidebar-collapse sidebar">
            <ul className="nav" id="side-menu">


              {/* <li className={this.checkPathName() === '/dashboard' ? 'active' : ''}>
                                    <a href="/dashboard" refresh="true"><i className="fa fa-desktop"></i>Dashboard</a>
                                </li> */}
              {/* <li className="nav-header">
                    <div className="profile-element" style={{
                                    display:"flex",
                                    justifyContent:"center",
                                    alignContent:"center",
                                    marginTop:"20px",
                                    marginBottom:"20px"
                                  
                                  }}>
                                  <img src="assets/img/business_logo.png" width="75%" height="10%" alt=""   />
                    </div>
                    <div className="logo-element">
                       
                        <img
                            class="rounded-circle"
                            src={"assets/img/Alliance_logo_svg.svg"}
                            width="50px"
                            height={"50px"}
                            />
                    </div>
                  </li>              */}
              <li className="nav-header">
                <div className="dropdown profile-element user-style">
                  <div className="profile-element" style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    marginBottom: "20px"

                  }}>
                    <img src="assets/img/business_logo.png" width="100%" height="10%" alt="" />
                  </div>

                </div>
                <div className="logo-element">
                  {/* Marter */}
                  <img
                    class="rounded-circle"
                    src={"assets/img/Alliance_logo_svg.svg"}
                    width="50px"
                    height={"50px"}
                  />
                </div>

              </li>
              <li className={((pathname === "/dashboard") || (pathname == `${'/' + user.user_id}`) ? 'active' : '')} id="dashboard">
                <a href="/dashboard" className="sideList">
                  <img src={"assets/icons/Dashboard.svg"} alt="" height="20" width="20" style={{ marginRight: 5 }} />
                  <span className="sideText">Dashboard</span>
                </a>
              </li>

              <li
                className={this.checkPathName() === "/setting" ? "active" : ""}
                style={{
                  display: (isHR || this.state.user.user_id == 1110 || this.state.user.user_id == 1467) ? 'block' : "none"
                }}
              >
                <a href="/attendance_policy_setting" className="sideList">
                  <i className="fas fa-cog sideIcon" style={{ color: 'white' }}></i>
                  <span className="sideText">Setting</span>
                </a>
                <ul className="nav nav-second-level collapse">
                  <li
                    className={
                      pathname === "/attendance_policy_setting" ? "active" : ""
                    }
                  >
                    <a href="/attendance_policy_setting">Attendance Policy</a>
                  </li>
                  <li
                    className={
                      pathname === "/benefit_setup_setting" ? "active" : ""
                    }
                  >
                    <a href="/benefit_setup_setting">Benefit</a>
                  </li>
                  <li
                    className={pathname === "/holiday_setting" ? "active" : ""}
                  >
                    <a href="/holiday_setting">Holiday</a>
                  </li>
                  <li
                    className={
                      pathname === "/salary_template_setting" ? "active" : ""
                    }
                  >
                    <a href="/salary_template_setting">Salary Template</a>
                  </li>
                  <li
                    className={pathname === "/ssb_rate_setting" ? "active" : ""}
                  >
                    <a href="/ssb_rate_setting">SSB Rate</a>
                  </li>
                  <li
                    className={
                      pathname === "/career_path_setting" ? "active" : ""
                    }
                  >
                    <a href="/career_path_setting">Career Path</a>
                  </li>
                  <li
                    className={pathname === "/payroll_setting" ? "active" : ""}
                  >
                    <a href="/payroll_setting">Payroll</a>
                  </li>
                </ul>
              </li>

              <li
                className={
                  this.checkPathName() === "/master_data" ? "active" : ""
                }
                style={{ display: (isHR || this.state.user.user_id == 1110 || this.state.user.user_id == 1467) ? 'block' : "none" }}
              >
                <a href="/career_level_master_data" className="sideList">
                  <i className="fa fa-key sideIcon" style={{ color: 'white' }}></i>
                  <span className="sideText">Master Data</span>
                </a>
                <ul className="nav nav-second-level collapse">
                  <li
                    className={
                      pathname === "/career_level_master_data" ? "active" : ""
                    }
                  >
                    <a href="/career_level_master_data">
                      {/* <i className="fa fa-user"></i> */}
                      Career Level
                    </a>
                  </li>
                  <li
                    className={
                      pathname === "/career_sub_level_master_data"
                        ? "active"
                        : ""
                    }
                  >
                    <a href="/career_sub_level_master_data">
                      {/* <i className="fa fa-user-o"></i> */}
                      Career Sub Level
                    </a>
                  </li>
                  <li
                    className={
                      pathname === "/designations_master_data" ? "active" : ""
                    }
                  >
                    <a href="/designations_master_data">
                      {/* <i className="fa fa-id-badge"></i> */}
                      Designations
                    </a>
                  </li>
                  <li
                    className={
                      pathname === "/job_title_master_data" ? "active" : ""
                    }
                  >
                    <a href="/job_title_master_data">
                      {/* <i className="fa fa-suitcase"></i> */}
                      Job Title
                    </a>
                  </li>
                  <li
                    className={
                      pathname === "/leave_category_master_data" ? "active" : ""
                    }
                  >
                    <a href="/leave_category_master_data">
                      {/* <i className="fa fa-calendar-times-o"></i> */}
                      Leave Catyegory
                    </a>
                  </li>
                  <li
                    className={
                      pathname === "/attendance_reason_type_master_data"
                        ? "active"
                        : ""
                    }
                  >
                    <a href="/attendance_reason_type_master_data">
                      {/* <i className="fa fa-check-square-o"></i> */}
                      Attendance Reason Type
                    </a>
                  </li>
                  <li
                    className={
                      pathname === "/hospitalization_type_master_data"
                        ? "active"
                        : ""
                    }
                  >
                    <a href="/hospitalization_type_master_data">
                      {/* <i className="fa fa-check-square-o"></i> */}
                      Hospitalization Type
                    </a>
                  </li>
                  <li
                    className={
                      pathname === "/ticket_main_category_master_data"
                        ? "active"
                        : ""
                    }
                  >
                    <a href="/ticket_main_category_master_data">
                      {/* <i className="fa fa-ticket"></i> */}
                      Ticket Main Category
                    </a>
                  </li>
                  <li
                    className={
                      pathname === "/ticket_sub_category_master_data"
                        ? "active"
                        : ""
                    }
                  >
                    <a href="/ticket_sub_category_master_data">
                      {/* <i className="fa fa-tags"></i> */}
                      Ticket Sub Category
                    </a>
                  </li>
                  <li
                    className={
                      pathname === "/tax_rage_master_data" ? "active" : ""
                    }
                  >
                    <a href="/tax_rage_master_data">
                      {/* <i className="fa fa-file-text"></i> */}
                      Tax Rage
                    </a>
                  </li>
                  <li
                    className={
                      pathname === "/tax_relief_master_data" ? "active" : ""
                    }
                  >
                    <a href="/tax_relief_master_data">
                      {/* <i className="fa fa-level-down"></i> */}
                      Tax Relief
                    </a>
                  </li>
                </ul>
              </li>
              
              <li
                className={
                  this.checkPathName() === "/employee_management"||this.checkPathName() === "/reports" || pathname == "/EmployeeDirectory"|| pathname === "/ResignStaffReport" || pathname === "/RegionStaffReport" || pathname === "/BranchStaffReport" || pathname === "/HoStaffReport" || pathname === "/EmployeeReport" || pathname === "/ReportbyServiceYear" || pathname === "/HistoryReport" || pathname === "/FRDReport" || pathname === "/ExtensionReport" || pathname === "/RegionWiseStaffReportCount"  
                    ? "active"
                    : " "
                }
                style={{ display: (isHR || this.state.user.user_id == 1110 || this.state.user.user_id == 1467) ? 'block' : "none" }}
              >
                <a href="/employee_list" className="sideList">
                  <i className="fas fa-user-cog" style={{ color: 'white' }}></i>
                  <span className="sideText">Employee Management</span>
                </a>
                <ul className="nav nav-second-level collapse">
                  <li className={pathname === "/employee_list" ? "active" : " "}>
                    <a href="/employee_list">Employee Lists</a>
                  </li>
                  <li
                    className={
                      pathname === "/employment_details" ? "active" : " "
                    }
                  >
                    <a href="/employment_details">Employment Details</a>
                  </li>
                  <li className={this.checkPathName() === "/reports" || pathname == "/EmployeeDirectory"|| pathname === "/ResignStaffReport" || pathname === "/RegionStaffReport" || pathname === "/BranchStaffReport" || pathname === "/HoStaffReport" || pathname === "/EmployeeReport" || pathname === "/ReportbyServiceYear" || pathname === "/HistoryReport" || pathname === "/FRDReport" || pathname === "/ExtensionReport" || pathname === "/RegionWiseStaffReportCount"   ? "active" : " "}>
                    <a href="/reports" className="sideText">Employee Related Reports</a>
                    <ul className="nav nav-third-level collapse">
                  <li
                    className={pathname === "/EmployeeReport" ? "active" : ""}
                  >
                    <a href="/EmployeeReport">Employee Report</a>
                  </li>
                  <li
                    className={pathname === "/ReportbyServiceYear" ? "active" : ""}
                  >
                    <a href="/ReportbyServiceYear">Employee Report by Service Year</a>
                  </li>
                  <li
                    className={pathname === "/HistoryReport" ? "active" : ""}
                  >
                    <a href="/HistoryReport"> Employee History Report</a>
                  </li>
                  <li
                    className={pathname === "/EmployeeDirectory" ? "active" : ""}
                  >
                    <a href="/EmployeeDirectory">Employee Directory Reoprt</a>
                  </li>
                  <li className={pathname === "/HoStaffReport" ? "active" : ""}>
                    <a href="/HoStaffReport">Ho Staff Report</a>
                  </li>
                  <li className={pathname === "/BranchStaffReport" ? "active" : ""}>
                    <a href="/BranchStaffReport">Branch Staff Report</a>
                  </li>
                  <li className={pathname === "/RegionStaffReport" ? "active" : ""}>
                    <a href="/RegionStaffReport">Regional Staff Report</a>
                  </li>
                  <li
                    className={pathname === "/FRDReport" ? "active" : ""}
                  >
                    <a href="/FRDReport">FRD Report</a>
                  </li>
                  <li className={pathname === "/ResignStaffReport" ? "active" : ""}>
                    <a href="/ResignStaffReport">Resign Staff Report</a>
                  </li>
                  <li
                    className={pathname === "/ExtensionReport" ? "active" : ""}
                  >
                    <a href="/ExtensionReport">Extension Report</a>
                  </li>
                  <li
                    className={pathname === "/RegionWiseStaffReportCount" ? "active" : ""}
                  >
                    <a href="/RegionWiseStaffReportCount">Region Wise Staff Count Report</a>
                  </li>
                </ul>
                  </li>
                </ul>
              </li>

              <li
                className={this.checkPathName() === "/confirmation"  ? "active" : ""}
                style={{display:(this.state.confirmRequestPermission && this.state.confirmRequestPermission.length > 0 || this.state.confirmHR1 && this.state.confirmHR1.length > 0 ||this.state.user.user_id == 1110 || this.state.user.user_id == 1467 ? 'block' : 'none')}}
              >
                <a href="/confirmation_check" className="sideList">
                  <i className="fas fa-user-check" style={{ color: 'white' }}></i>
                  <span className="sideText">Confirmation</span>
                </a>
                <ul className="nav nav-second-level collapse">
                  {this.state.confirmHR1 && this.state.confirmHR1.length > 0 ||this.state.user.user_id == 1110 || this.state.user.user_id == 1467 ? <li
                    className={
                      pathname === "/confirmation_list" ? "active" : " "
                    }
                  >
                    <a href="/confirmation_list">Confirmation Prepare List</a>
                  </li> : ''}
                  {
                    this.state.confirmRequestPermission && this.state.confirmRequestPermission.length > 0 ||this.state.user.user_id == 1110 || this.state.user.user_id == 1467 ? <li
                    className={
                      pathname === "/confirmation_check" ? "active" : " "
                    }
                  >
                    <a href="/confirmation_check">Confirmation Request List</a>
                  </li> : ''
                  }
                  
                  {
                    this.state.confirmHR1 && this.state.confirmHR1.length > 0 ||this.state.user.user_id == 1110 || this.state.user.user_id == 1467  ? <li
                    className={
                      pathname === "/confirmation_approve_list"
                        ? "active"
                        : ""
                    }
                  >
                    <a href="/confirmation_approve_list">Approve List</a>
                  </li> : ''
                  }
                  
                  
                </ul>
              </li>

              <li
                className={this.checkPathName() === "/attendance" || pathname === '/incomplete_and_missing_report' || pathname === '/holiday_attendance' || pathname === '/attendance_report_monthly' || pathname === "/attendance_type" || pathname === "/attendance_history" ? "active" : ""}
                // style={{ display: isHR  ? 'block' : "none" }}
             >
                <a href="/incomplete_and_missing_report" className="sideList">
                <i class="fa fa-address-book" style={{color:'white'}}></i>
                 
                  <span className="sideText">Attendance</span>
                </a>
                <ul className="nav nav-second-level collapse">
                  <li
                    className={
                      pathname === "/incomplete_and_missing_report" ? "active" : " "
                    }
                  >
                    <a href="/incomplete_and_missing_report">Incomplete And Missing Report</a>
                  </li>
                  {/* <li
                    className={
                      pathname === "/holiday_attendance" ? "active" : " "
                    }
                  >
                    <a href="/holiday_attendance">Holiday Attendance</a>
                  </li> */}
                  <li
                    className={
                      pathname === "/attendance_report_monthly" ? "active" : " "
                    }
                  >
                    <a href="/attendance_report_monthly">Attendance Report</a>
                  </li>
                  <li
                    className={
                      pathname === "/attendance_type" ? "active" : " "
                    }
                  >
                    <a href="/attendance_type">Attendance Request</a>
                  </li>
                  <li
                    className={
                      pathname === "/attendance_history"
                        ? "active"
                        : ""
                    }
                  >
                    <a href="/attendance_history">Attendance History</a>
                  </li>
                  
                </ul>
              </li>
              
              <li
                className={this.checkPathName() === "/payroll" || this.checkPathName()==='/incentive' || this.checkPathName() === 'payroll_calculation' || this.checkPathName() === '/payroll_reports' || pathname === '/payslip_generate' || pathname === '/ssc' || pathname === "/payroll_main" || pathname === '/foreigner_salary' || pathname === "/resign_or_dismiss_salary" || pathname === '/payroll_generate' || pathname ==='/pay_slip'|| pathname== '/monthly_incentive'|| pathname == "/quarterly_incentive_payslip" || pathname == "/monthly_incentive_payslip" || pathname == "/quarterly_incentive" ||  pathname == '/employee_salary_report' || pathname === '/monthly_report'|| pathname === '/quarterly_report' || pathname == '/ssc_report' ? "active" : ""}
               
             >
                <a href="/ssc" className="sideList">
                <i class="fa fa-address-book" style={{color:'white'}}></i>
                 
                  <span className="sideText">Payroll</span>
                </a>
                <ul className="nav nav-second-level collapse">
                  
                  <li
                    className={
                      pathname === "/ssc" ? "active" : " "
                    }
                  >
                    <a href="/ssc">SSC Calculation</a>
                  </li>
                  <li className={this.checkPathName() === "/payroll_calculation" || pathname == "/payroll_main" || pathname == '/payslip_generate' || pathname == '/payroll_generate'   ? "active" : " "}>
                    <a href="/payroll_calculation" className="sideText">Payroll Calculation</a>
                    <ul className="nav nav-third-level collapse">
                    <li
                    className={
                      pathname === "/payroll_main" ? "active" : " "
                    }
                  >
                    <a href="/payroll_main">Payroll</a>
                  </li>
                  <li
                    className={
                      pathname === "/payslip_generate" ? "active" : ""
                    }
                  >
                    <a href="/payslip_generate">PaySlip Generate</a>
                  </li>
                  <li
                    className={
                      pathname === "/payroll_generate" ? "active" : " "
                    }
                  >
                    <a href="/payroll_generate">Payroll Generate</a>
                  </li>
                   
                </ul>
                  </li>
                 
                  <li className={this.checkPathName() === "/incentive" || pathname == "/monthly_incentive"|| pathname == "/monthly_incentive_payslip"|| pathname == "/quarterly_incentive_payslip" || pathname == '/quarterly_incentive' ? "active" : " "}>
                    <a href="/incentive" className="sideText">Incentive</a>
                    <ul className="nav nav-third-level collapse">
                    <li
                    className={
                      pathname === "/monthly_incentive" ? "active" : " "
                    }
                  >
                    <a href="/monthly_incentive">Monthly Incentive</a>
                  </li>
                  <li
                    className={
                      pathname === "/monthly_incentive_payslip" ? "active" : " "
                    }
                  >
                    <a href="/monthly_incentive_payslip">Monthly Incentive Pay Slip</a>
                  </li>
                  <li
                    className={
                      pathname === "/quarterly_incentive" ? "active" : ""
                    }
                  >
                    <a href="/quarterly_incentive">Quarterly Incentive</a>
                  </li>
                  <li
                    className={
                      pathname === "/quarterly_incentive_payslip" ? "active" : " "
                    }
                  >
                    <a href="/quarterly_incentive_payslip">Quarterly Incentive Pay Slip</a>
                  </li>
                  
                   
                </ul>
                  </li>
                 
                  <li
                    className={
                      pathname === "/resign_or_dismiss_salary"
                        ? "active"
                        : ""
                    }
                  >
                    <a href="/resign_or_dismiss_salary">Resing Or Dismiss Salary</a>
                  </li>
                  {/* <li
                    className={
                      pathname === "/monthly_incentive"
                        ? "active"
                        : ""
                    }
                  >
                    <a href="/monthly_incentive">Monthly Incentive</a>
                  </li>
                  <li
                    className={
                      pathname === "/monthly_incentive_payslip"
                        ? "active"
                        : ""
                    }
                  >
                    <a href="/monthly_incentive_payslip">Monthly Incentive Payslip</a>
                  </li> */}
                  <li
                    className={
                      pathname === "/foreigner_salary"
                        ? "active"
                        : ""
                    }
                  >
                    <a href="/foreigner_salary">Foreigner Salary</a>
                  </li>
                  <li className={this.checkPathName() === "/payroll_reports" || pathname == "/pay_slip" || pathname == '/payroll_summary_report' || pathname == '/payroll_details_report' || pathname == '/ssc_report' || pathname == '/payroll_summary_report_with_location' || pathname == '/employee_salary_report' || pathname == '/salary_history_report' || pathname == '/payrollReport_with_bankno' || pathname === '/monthly_report' || pathname === '/quarterly_report' || pathname == '/ssc_report' ? "active" : " "}>
                    <a href="/pay_slip" className="sideText">Payroll Related Reports</a>
                    <ul className="nav nav-third-level collapse">
                    
                  <li className={pathname === "/pay_slip" ? "active" : ""}>
                    <a href="/pay_slip">PaySlip</a>
                  </li>
                  <li className={pathname === "/ssc_report" ? "active" : ""}>
                    <a href="/ssc_report">SSC Report for Goverment</a>
                  </li>
                  <li className={pathname === "/payroll_summary_report" ? "active" : ""}>
                    <a href="/payroll_summary_report">Payroll Summary Report</a>
                  </li>
                  <li className={pathname === "/payroll_details_report" ? "active" : ""}>
                    <a href="/payroll_details_report">Payroll Details Report</a>
                  </li>
                  <li className={pathname === "/payroll_summary_report_with_location" ? "active" : ""}>
                    <a href="/payroll_summary_report_with_location">Payroll Summary Report With Location</a>
                  </li>
                  <li className={pathname === "/employee_salary_report" ? "active" : ""}>
                    <a href="/employee_salary_report">Employee Salary Report</a>
                  </li>
                  <li className={pathname === "/salary_history_report" ? "active" : ""}>
                    <a href="/salary_history_report">Salary History Report</a>
                  </li>
                  <li className={pathname === "/payrollReport_with_bankno" ? "active" : ""}>
                    <a href="/payrollReport_with_bankno">Payroll Report With Bank No</a>
                  </li>
                  <li className={pathname === "/monthly_report" ? "active" : ""}>
                    <a href="/monthly_report">Monthly Incentive Report</a>
                  </li>
                  <li className={pathname === "/quarterly_report" ? "active" : ""}>
                    <a href="/quarterly_report">Quarterly Incentive Report</a>
                  </li>
                </ul>
                  </li>
                </ul>
              </li>
              {/* <li
                className={
                  this.checkPathName() === "/payroll_reports" || pathname === '/pay_slip' ? "active" : ""
                }
              >
                <a href="/pay_slip" className="sideList">

                  <img src="assets/icons/Leave (1).svg" alt="" width="20" height="20" style={{ marginRight: 5 }} />
                  <span className="sideText">Payroll Related Reports</span>
                </a>
                <ul className="nav nav-second-level collapse">
                  <li className={pathname === "/pay_slip" ? "active" : ""}>
                    <a href="/pay_slip">PaySlip</a>
                  </li>
                 
                </ul>

              </li> */}


              <li
                className={
                  this.checkPathName() === "/leavemanagement" || pathname === '/leave_management' || pathname === '/leave_report' || pathname === '/earned_leave_opening_balance' || pathname === '/attendance_leave_report' ? "active" : ""
                }
              >
                <a href="/leave_management" className="sideList">

                  <img src="assets/icons/Leave (1).svg" alt="" width="20" height="20" style={{ marginRight: 5 }} />
                  <span className="sideText">Leave</span>
                </a>
                <ul className="nav nav-second-level collapse">
                  <li className={pathname === "/leave_management" ? "active" : ""}>
                    <a href="/leave_management">Leave Request</a>
                  </li>
                  {/* <li
                    className={pathname === "/new_leave" ? "active" : ""}
                  >
                    <a href="/new_leave">New Leave</a>
                  </li> */}
                  <li
                    className={pathname === "/leave_report" ? "active" : ""}
                  >
                    <a href="/leave_report">Leave Report</a>
                  </li>
                  <li
                    className={pathname === "/earned_leave_opening_balance" ? "active" : ""}
                  >
                    <a href="/earned_leave_opening_balance">Earned Leave Opening Balance</a>
                  </li>
                  <li className={pathname === "/attendance_leave_report" ? "active" : ""}>
                    <a href="/attendance_leave_report">Attendance And Leave </a>
                  </li>
                </ul>

              </li>


              <li
                className={this.checkPathName() === "/benefit" ? "active" : ""}
              >
                <a href="/wedding_benefit" className="sideList">
                  <img src="assets/icons/Benefit.svg" width="20" height="20" alt="" style={{ marginRight: 5 }} />
                  <span className="sideText">Benefits</span>
                </a>
                <ul className="nav nav-second-level collapse">
                  <li
                    className={pathname === "/wedding_benefit" ? "active" : ""}
                  >
                    <a href="/wedding_benefit">Wedding Benefits</a>
                  </li>
                  <li className={pathname === "/child_benefit" ? "active" : ""}>
                    <a href="/child_benefit">Child Benefit</a>
                  </li>
                  <li
                    className={pathname === "/funeral_benefit" ? "active" : ""}
                  >
                    <a href="/funeral_benefit">Funeral Benefit</a>
                  </li>
                  <li
                    className={
                      pathname === "/external_training_benefit" ? "active" : ""
                    }
                  >
                    <a href="/external_training_benefit">External Training</a>
                  </li>
                  <li
                    className={pathname === "/medical_benefit" ? "active" : ""}
                  >
                    <a href="/medical_benefit">Medical Benefit</a>
                  </li>
                  <li
                    className={
                      pathname === "/birthday_fund_benefit" ? "active" : ""
                    }
                  >
                    <a href="/birthday_fund_benefit">Birthday Fund</a>
                  </li>
                  <li
                    className={
                      pathname === "/team_building_benefit" ? "active" : ""
                    }
                  >
                    <a href="/team_building_benefit">Team Building</a>
                  </li>
                  <li
                    className={
                      pathname === "/hospitalization_benefit" ? "active" : ""
                    }
                  >
                    <a href="/hospitalization_benefit">Hospitalization</a>
                  </li>
                  <li
                    className={
                      pathname === "/cycle_insurance_benefit" ? "active" : ""
                    }
                  >
                    <a href="/cycle_insurance_benefit">Cycle Insurance</a>
                  </li>
                  <li className={pathname === "/other_benefit" ? "active" : ""}>
                    <a href="/other_benefit">Other Benefit</a>
                  </li>
                </ul>
              </li>


              <li
                className={
                  this.checkPathName() === "/allowance" || pathname === '/travelRequest' || pathname === '/trainingRequest' || pathname === '/salary_advance' || pathname === '/phonebillrequest' || pathname === '/petrolRequest' ? "active" : ""
                }
              >
                <a href="/travelRequest" className="sideList">
                  <img src="assets/icons/Allowance (1).svg" alt="" width="20" height="20" style={{ marginRight: 5 }} />
                  <span className="sideText">Allowance</span>
                </a>
                <ul className="nav nav-second-level collapse">
                  <li className={pathname === "/travelRequest" ? "active" : ""}>
                    <a href="/travelRequest">Travel Request</a>
                  </li>
                  {/* <lihelpDesk
                    className={pathname === "/trainingRequest" ? "active" : ""}
                  >
                    <a href="/trainingRequest">Training Request</a>
                  </li> */}
                  <li
                    className={pathname === "/salary_advance" ? "active" : ""}
                  >
                    <a href="/salary_advance">Salary Advance</a>
                  </li>
                  {/* <li
                    className={pathname === "/phonebillrequest" ? "active" : ""}
                  >
                    <a href="/phonebillrequest">Phone Bill</a>
                  </li>
                  <li className={pathname === "/petrolRequest" ? "active" : ""}>
                    <a href="/petrolRequest">Petrol Request</a>
                  </li> */}
                </ul>

              </li>
            


              <li
                className={this.checkPathName() === "/helpDesk" ? "active" : ""}
              >
                <a href="/helpDesk" className="sideList" refresh="true">
                  <img src="assets/icons/Helpdesk (1).svg" alt="" width="20" height="20" style={{ marginRight: 5 }} />
                  <span className="sideText">Help Desk</span>
                </a>
              </li>
              {/* <li
                className={this.checkPathName() === "/pay_slip" || pathname =="/pay_slip" ? "active" : ""}
              >
                <a href="/pay_slip" className="sideList" refresh="true">
                <i className="fa fa-briefcase sideIcon"></i>
                  <span className="sideText">PaySlip</span>
                </a>
              </li> */}
              
              {/* <li
                className={this.checkPathName() === "/ssc_report" || pathname =="/ssc_report" ? "active" : ""}
              >
                <a href="/ssc_report" className="sideList" refresh="true">
                <i className="fa fa-briefcase sideIcon"></i>
                  <span className="sideText">SSC Report</span>
                </a>
              </li> */}

              <li
                className={
                  this.checkPathName() === "/staffComplain" ? "active" : ""
                }
              >
                <a href="/staffComplain" className="sideList" refresh="true">
                  <img src="assets/icons/aa.svg" width="20" height="20" style={{ marginRight: 5 }} alt="" />
                  <span className="sideText">Staff Complain Box</span>
                </a>
              </li>

              {/* <li
                className={
                  this.checkPathName() === "/staff_loan" ? "active" : ""
                }
              >
                <a href="/staff_loan" className="sideList">
                  <img src="assets/icons/bb.svg" width="20" height="20" style={{ marginRight: 5 }} alt="" />
                  <span className="sideText">Staff Loan</span>
                </a>
                <ul className="nav nav-second-level collapse">
                  <li className={pathname === "/staff_loan" ? "active" : ""}>
                    <a href="/staff_loan">
                      <i className="fas fa-clipboard-list"></i>Staff Loan List
                    </a>
                  </li>
                  <li
                    className={
                      pathname === "/staff_loan_repayment" ? "active" : ""
                    }
                  >
                    <a href="/staff_loan_repayment">
                      <i className="fa fa-credit-card"></i>Repayment Schedule
                    </a>
                  </li>
                  <li
                    className={
                      pathname === "/staff_loan_settlement" ? "active" : ""
                    }
                  >
                    <a href="/staff_loan_settlement">
                      <i className="fa fa-calendar"></i>Settlement Sheet
                    </a>
                  </li>
                </ul>
              </li> */}


              

            
{/* 
              <li
                className={
                  this.checkPathName() === "/notification" ? "active" : ""
                }
              >
                <a href="/notification" className="sideList" refresh="true">
                  <i className="fa fa-bell sideIcon" style={{ color: 'white' }}></i>
                  <span className="sideText">Notification</span>
                </a>
              </li> */}

              {/* <li className={pathname === "/Announcement" ? "active" : ""}>
                  <a href="/Announcement" className="sideList" >
                    <i className="fas fa-atlas sideIcon" style={{ color: 'white' }}></i>
                    <span className="sideText">Announcement Setting</span>
                  </a>
                </li> */}

              <li>
                <a href={remote_url} className="sideList" onClick={this.logout.bind(this)}>
                  <i className="fa fa-sign-out sideIcon" style={{ color: 'white' }}></i> <span className="sideText">Log out</span>
                </a>
              </li>

              {/* <li className={pathname === '/notification' ? 'active' : ''}>
                                    <a href="/notification" refresh="true"><i className="fa fa-bell"></i>Notification</a>
                                </li> */}

              {this.state.user && this.state.user.user_id === 1 ? (
                <li className="">
                  <a href="/workflow" className="sideList" refresh="true">
                    <i className="fa fa-briefcase sideIcon"></i>
                    <span className="sideText">Work Flow</span>
                  </a>
                </li>
              ) : (
                ""
              )}

              {this.state.user && this.state.user.user_id === 1 ? (
                <li className={pathname === "/permission" ? "active" : ""}>
                  <a href="/permission" className="sideList">
                    <i className="fa fa-key sideIcon"></i>
                    <span className="sideText">Permission</span>
                  </a>
                </li>
              ) : (
                // <li className="">
                //     <a href="">Permission</a>
                //     <ul className="nav nav-second-level">
                //         {/* <li className={pathname === '/permission_title' ? 'active' : ''}><a href="/permission_title"><i className="fa fa-calendar"></i>Permission Title</a></li> */}
                //         {/* <li className={pathname === '/permission_type' ? 'active' : ''}><a href="/permission_type"><i className="fa fa-calendar"></i>Permission Type</a></li > */}

                //     </ul >
                // </li >
                ""
              )}
              {/* <li>
                                    <a target="blank" href={php_url}><i className="fa fa-user"></i> <span className="nav-label">Back</span></a>
                                </li> */}

            </ul>
          </div>
        </nav>
      </div>
    );
  }
}
