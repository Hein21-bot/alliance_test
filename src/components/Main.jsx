import React from 'react';
import { browserHistory } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
//staff loan
// import StaffLoanMain from './Allowance/StaffLoan/StaffLoanMain';
// import ApplyForm from '../components/Allowance/StaffLoan/ApplyForm';
// import RepaymentSchedule from '../components/Allowance/StaffLoan/RepaymentSchedule';
// import StaffLoanList from './Allowance/StaffLoan/StaffLoanList';
// import StaffLoanApproval from './Allowance/StaffLoan/StaffLoanApproval';
// import SettlementSheet from './Allowance/StaffLoan/SettlementSheet';
// import StaffLoanView from './Allowance/StaffLoan/StaffLoanView';

//salary advance
import SalaryAdvanceRequestForm from './Allowance/SalaryAdvance/SalaryAdvanceRequestForm';
import SalaryAdvanceApprovalForm from './Allowance/SalaryAdvance/SalaryAdvanceApprovalForm';
import SalaryAdvanceView from './Allowance/SalaryAdvance/SalaryAdvanceView';
//travel and training
import TravelRequest from './Allowance/Travel/TravelRequestParent';
import TrainingRequest from './Allowance/TrainingRequest/TrainingRequestParent';

//petrol
import PetrolRequestMain from './Allowance/Petrol/PetrolRequestMain';
//phone
import PhoneBillRequest from './Allowance/phone/phonebillparent';
//permission
import PermissionMain from './Permission/PermissionMain';
import PermissionTitle from './Permission/PermissionTitle';
import PermissionType from './Permission/PermissionType';

//benefit
import WeddingBenefitMain from './Benefits/Wedding/WeddingBenefitMain';
import ChildBenefit from './Benefits/Child/ChildBenefitMain';
import FuneralBenefitMain from './Benefits/Funeral/FuneralBenefitMain';
import ExternalTrainingBenefitMain from './Benefits/ExternalTraining/ExternalTrainingBenefitMain';
import MedicalBenefitMain from './Benefits/MedicalBenefit/MedicalBenefitMain';
import BirthdayFundMain from './Benefits/BirthdayFund/BirthdayFundMain';
import OtherBenefitMain from './Benefits/OtherBenefit/OtherBenefitMain';
import TeamBuildingMain from './Benefits/TeamBuilding/TeamBuildingMain';
import HospitalizationMain from './Benefits/HospitalizationBenefit/HospitalizationMain';
import CycleMain from './Benefits/CycleInsuranceBenefit/CycleMain';

import SalaryAdvacneMain from './Allowance/SalaryAdvance/SalaryAdvanceMain';

//helpDesk
import HelpDesk from './HelpDesk/HelpDeskParent';
import StaffComplainMain from './StaffComplain/StaffComplainMain';

//workflow
import WorkFlowMain from './WorkFlow/WorkFlowMain';

//notification
import Notification from './Notification/Notification';

//report
import AttendanceAndLeaveReport from './AttendanceandLeaveReport';
//leave 
import LeaveManagementMain from './LeaveManagement/LeaveManagementMain';

import EmployeeListMain from './EmployeeManagement/EmployeeList/EmployeeListMain';
import EmployeeRegisterMain from './EmployeeManagement/EmployeeRegister/EmployeeRegisterMain.jsx';
import EmploymentDetails from './EmployeeManagement/EmploymentDetail/EmployeeDetailMain';

//Announcement
import AnnouncementMain from './Announcement Setting/AnnouncementMain';
import LeavePermission from './Setting/LeavePermission/LeavePermission';
import Benefit from './Setting/Benefit/Benefit';
import Designation from './Setting/Designation/Designation';
import AttendancePolicy from './Setting/AttendancePolicy/AttendancePolicy';
import Holiday from './Setting/Holiday/Holiday';
import SalaryTemplate from './Setting/SalaryTemplate/SalaryTemplate';
import SSBRate from './Setting/SSBRate/SSBRate';
import CareerPath from './Setting/CareerPath/CareerPath';
import Payroll from './Setting/Payroll/Payroll';
import CareerLevel from './MasterData/CareerLevel/CareerLevel';
import CareerSubLevel from './MasterData/CareerSubLevel/CareerSubLevel'
import Designations from './MasterData/Designations/Designation'
import JobTitle from './MasterData/JobTitle/JobTitle';
import LeaveCategory from './MasterData/LeaveCategory/LeaveCategory'
import AttendanceReasonType from './MasterData/AttendanceReasonType/AttendanceReasonType';
import TicketMainCategory from './MasterData/TicketMainCategory/TicketMainCategory';
import TicketSubCategory from './MasterData/TicketSubCategory/TicketSubCategory';
import TaxRage from './MasterData/TaxRage/TaxRage'
import TaxRelief from './MasterData/TaxRelief/TaxRelief';
import HospitalizationType from './MasterData/HospitalizationType/HospitalizationType'
import { Dashboard } from './Dashboard/Dashboard';
import ConfirmationList from './EmployeeManagement/EmployeeConfirmation/List/ConfirmationList'
import ConfirmationCheck from './EmployeeManagement/EmployeeConfirmation/Check/ConfirmationCheck';
import ConfirmationRequestList from './EmployeeManagement/EmployeeConfirmation/ConfirmationRequest/ConfirmationRequestList';
import HoStaffReport from './Reports/HoStaffReport';

import EmployeeReport from './Reports/EmployeeReport';
import ConfirmationReport from './Reports/ConfirmationReport';
import EmployeeDirectory from './Reports/EmployeeDirectory';
import BranchStaffReport from './Reports/BranchStaffReport';
import RegionStaffReport from './Reports/RegionStaffReport';
import ReportbyServiceYear from './Reports/ReportbyServiceYear';
import ExtensionReport from './Reports/ExtensionReport';
import FRDReport from './Reports/FRDReport';
import RegionWiseStaffReportCount from './Reports/RegionWiseStaffReportCount';
import ResignStaffReport from './Reports/ResignStaffReport';
import EmployeeFixedAsset from './Reports/EmployeeFixedAsset';
import HistoryReport from './Reports/EmployeeHistoryReport';
import LeaveManagementTable from './LeaveManagement/LeaveManagementTable';
import NewLeave from './LeaveManagement/NewLeave';
import LeaveReport from './LeaveManagement/LeaveReport';
import LeaveBalance from './LeaveManagement/LeaveBalance';
import AttendanceReport from './Attendance Report/AttendanceReport';
import LateCheckInReport from './Attendance Report/LateCheckInReport';
import HolidayAttendanceReport from './Attendance Report/HolidayAttendanceReport';
import EarlyCheckOutReport from './Attendance Report/EarlyCheckOutReport';
import WeeklyAttendanceReport from './Attendance Report/WeeklyAttendanceReport';
import ImcompleteAndMissingReport from './Attendance Report/ImcompleteAndMissingReport';
import LateReportByEmployee from './Attendance Report/LateReportByEmployee';
import AbsenceReport from './Attendance Report/AbsenceReport';

import AttendanceType from './Attendance/AttendanceType'
import AttendanceHistory from './Attendance/AttendanceHistory'
import HolidayAttendance from './Attendance/HolidayAttendance'
import AttendanceReportMonthly from './Attendance/AttendanceReport'
import AttendanceAdd from './Attendance/AttendanceAdd';

import SSC from './payroll/SSC';

import ResignOrDismissSalaryMain from './payroll/ResignOrDismissSalary/ResignOrDismissSalaryMain';
import ForeignerSalaryMain from './payroll/ForeignerSalary/ForeignerSalaryMain';
import BackPayMain from './payroll/BackPay/BackPayMain';
import SSCReport from './payroll/sscReportforGovernment';
import PaySlip from './payroll/payslip'
import EmployeeSalaryReport from './payroll/PayrollReports/EmployeeSalaryReport';
import PayrollReportWithBankNo from './payroll/PayrollReports/PayrollReportWithBankNo';
import SalaryHistoryReport from './payroll/PayrollReports/SalaryHistoryReport';
import PayrollSummaryReport from './payroll/PayrollReports/PayrollSummaryReport';
import PayrollDetailsReport from './payroll/PayrollReports/PayrollDetailsReport';
import PayrollSummaryReportWithLocation from './payroll/PayrollReports/PayrollSummaryReportWithLocation';
import PayrollMain from './payroll/Payroll/PayrollMain';
import PayrollUpload from './payroll/Payroll/PayrollUpload';
import MonthlyIncentive from './payroll/Incentive/MonthlyIncentive';
import MonthlyIncentivePayslip from './payroll/Incentive/MonthlyIncentivePayslip';
import MonthlyIncentiveReport from './payroll/Incentive/MonthlyIncentiveReport';
import QuarterlyIncentive from './payroll/Incentive/QuarterlyIncentive';
import QuarterlyIncentivePayslip from './payroll/Incentive/QuarterlyIncentivePayslip';
import QuarterlyIncentiveReport from './payroll/Incentive/QuarterlyIncentiveReport';
import PayslipGenerate1 from './payroll/Payroll/PayslipGenerate1';
import PayrollGenerate from './payroll/Payroll/PayrollGenerate';
import PayrollCalculated from './payroll/Payroll/PayrollCalculated';
import StaffLoanMain from './StaffLoan/StaffLoanMain';
import Department from './MasterData/Departments/Department';
import StaffLoanBeforeComit from './payroll/PayrollReports/StaffLoanBeforeComit';
import StaffLoanAfterComit from './payroll/PayrollReports/StaffLoanAfterComit';
import StaffLoanApprove from './StaffLoan/StaffLoanApprove';
import StaffLoanSummaryReport from './StaffLoan Report/StaffLoanSummaryReport';
import HrStatistics from './Reports/HrStatistics';



const Main = () => (
    <Switch>
        <Route path='/allowance' component={TravelRequest} />
        <Route path='/travelRequest' component={TravelRequest} />
        <Route path='/trainingRequest' component={TrainingRequest} />

        <Route path='/helpDesk' component={HelpDesk} />
        <Route path='/staffComplain' component={StaffComplainMain} />

        {/* <Route path="/staff_loan" component={StaffLoanMain}></Route>
        <Route path="/staff_loan_applyform" component={ApplyForm}></Route>
        <Route path="/staff_loan_approval" component={StaffLoanApproval}></Route>
        <Route path="/staff_loan_repayment" component={RepaymentSchedule}></Route>
        <Route path="/staff_loan_settlement" component={SettlementSheet}></Route>
        <Route path="/staff_loan_view" component={StaffLoanView}></Route> */}

        <Route path="/salary_advance" component={SalaryAdvacneMain}></Route>
        <Route path="/salary_advance_request_form" component={SalaryAdvanceRequestForm}></Route>
        <Route path="/salary_advance_approval_form" component={SalaryAdvanceApprovalForm}></Route>
        <Route path="/salary_advance_view" component={SalaryAdvanceView}></Route>

        <Route path='/petrolRequest' component={PetrolRequestMain} />
        <Route path='/phonebillrequest' component={PhoneBillRequest} />

        <Route path="/permission" component={PermissionMain}></Route>
        <Route path="/permission_title" component={PermissionTitle}></Route>
        <Route path="/permission_type" component={PermissionType}></Route>

        <Route path="/Announcement" component={AnnouncementMain}></Route>

        <Route path="/benefit" component={WeddingBenefitMain}></Route>
        <Route path="/wedding_benefit" component={WeddingBenefitMain}></Route>
        <Route path="/child_benefit" component={ChildBenefit}></Route>
        <Route path="/funeral_benefit" component={FuneralBenefitMain}></Route>
        <Route path="/external_training_benefit" component={ExternalTrainingBenefitMain}></Route>
        <Route path="/medical_benefit" component={MedicalBenefitMain}></Route>
        <Route path="/birthday_fund_benefit" component={BirthdayFundMain}></Route>
        <Route path="/other_benefit" component={OtherBenefitMain}></Route>
        <Route path="/team_building_benefit" component={TeamBuildingMain}></Route>
        <Route path="/hospitalization_benefit" component={HospitalizationMain}></Route>
        <Route path="/cycle_insurance_benefit" component={CycleMain}></Route>
        <Route path="/workflow" component={WorkFlowMain} ></Route>

        <Route path='/notification' component={Notification} />

        <Route path='/benefit_setup_setting' component={Benefit} />
        <Route path='/designation_setting' component={Designation} />
        <Route path='/leave_permission_setting' component={LeavePermission} />
        <Route path='/attendance_policy_setting' component={AttendancePolicy} />
        <Route path='/holiday_setting' component={Holiday} />
        <Route path='/salary_template_setting' component={SalaryTemplate} />
        <Route path='/ssb_rate_setting' component={SSBRate} />
        <Route path='/career_path_setting' component={CareerPath} />
        <Route path='/payroll_setting' component={Payroll} />

        <Route path='/career_level_master_data' component={CareerLevel} />
        <Route path='/career_sub_level_master_data' component={CareerSubLevel} />
        <Route path='/designations_master_data' component={Designations} />
        <Route path='/departments_master_data' component={Department} />
        <Route path='/job_title_master_data' component={JobTitle} />
        <Route path='/leave_category_master_data' component={LeaveCategory} />
        <Route path='/attendance_reason_type_master_data' component={AttendanceReasonType} />
        <Route path='/ticket_main_category_master_data' component={TicketMainCategory} />
        <Route path='/ticket_sub_category_master_data' component={TicketSubCategory} />
        <Route path='/tax_rage_master_data' component={TaxRage} />
        <Route path='/tax_relief_master_data' component={TaxRelief} />
        <Route path='/hospitalization_type_master_data' component={HospitalizationType} />

        <Route path='/attendance_leave_report' component={AttendanceAndLeaveReport} />
        
        <Route path='/leave_management' component={LeaveManagementMain} />

        <Route path="/employee_management" component={EmployeeListMain}></Route>
        <Route path="/employee_register" component={EmployeeRegisterMain}></Route>
        <Route path="/employment_details" component={EmploymentDetails}></Route>

        <Route path="/employee_list" component={EmployeeListMain}></Route>
        <Route path="/confirmation_check" component={ConfirmationCheck}></Route>
        <Route path="/confirmation_list" component={ConfirmationList}></Route>
        <Route path="/confirmation_request_list" component={ConfirmationRequestList}></Route>
        <Route path="/confirmation_approve_list" component={ConfirmationRequestList}></Route>

        <Route path='/EmployeeReport' component={EmployeeReport} ></Route>



        <Route path='/dashboard' component={Dashboard} ></Route>
        <Route path='/reports' component={EmployeeDirectory}></Route>
        <Route path='/HoStaffReport' component={HoStaffReport} />
        <Route path='/EmployeeDirectory' component={EmployeeDirectory} ></Route>
        <Route path='/EmployeeReport' component={EmployeeReport} ></Route>
        <Route path='/ReportbyServiceYear' component={ReportbyServiceYear} ></Route>
        <Route path='/ExtensionReport' component={ExtensionReport} ></Route>
        <Route path='/HistoryReport' component={HistoryReport} ></Route>
        <Route path='/FRDReport' component={FRDReport} ></Route>
        <Route path='/BranchStaffReport' component={BranchStaffReport} ></Route>
        <Route path='/RegionStaffReport' component={RegionStaffReport} ></Route>
        <Route path='/report_confirm' component={ConfirmationReport} ></Route>
        <Route path='/FRDReport' component={FRDReport} ></Route>
        <Route path='/RegionWiseStaffReportCount' component={RegionWiseStaffReportCount}></Route>
        <Route path='/ResignStaffReport' component={ResignStaffReport}></Route>
        <Route path='/EmployeeFixedAsset' component={EmployeeFixedAsset}></Route>
        {/* <Route path='/leave_management' component={LeaveManagementMain}></Route> */}
        <Route path='/leave_management' component={LeaveManagementTable}></Route>
        <Route path='/new_leave' component={NewLeave}></Route>
        <Route path='/leave_report' component={LeaveReport}></Route>
        <Route path='/earned_leave_opening_balance' component={LeaveBalance}></Route>
        <Route path="/attendance_report" component={AttendanceReport}></Route>
        <Route path='/late_checkin_report' component={LateCheckInReport}></Route>
        <Route path='/holiday_attendance_report' component={HolidayAttendanceReport}></Route>
        <Route path='/early_checkout_report' component={EarlyCheckOutReport}></Route>
        <Route path='/weekly_attendance_report' component={WeeklyAttendanceReport}></Route>
        <Route path='/incomplete_and_missing_report' component={ImcompleteAndMissingReport}></Route>
        <Route path='/late_reportby_employee' component={LateReportByEmployee}></Route>
        <Route path='/absence_report' component={AbsenceReport}></Route>

        <Route path='/attendance_type' component={AttendanceType}></Route>
        <Route path='/attendance_history' component={AttendanceHistory}></Route>
        <Route path='/holiday_attendance' component={HolidayAttendance}></Route>
        <Route path='/attendance_report_monthly' component={AttendanceReportMonthly}></Route>
        <Route path='/attendance_add' component={AttendanceAdd}></Route>

        <Route path={'/payroll_main'} component={PayrollMain}></Route>
        <Route path={'/payroll_upload'} component={PayrollUpload}/>
        <Route path='/ssc' component={SSC} />


        <Route path='/resign_or_dismiss_salary' component={ResignOrDismissSalaryMain}></Route>
        <Route path='/foreigner_salary' component={ForeignerSalaryMain}></Route>
        <Route path='/backpay' component={BackPayMain}></Route>
        <Route path='/ssc_report' component={SSCReport}></Route>
        <Route path='/payroll_pay_slip' component={PaySlip}></Route>
        <Route path='/employee_salary_report' component={EmployeeSalaryReport}></Route>
        <Route path="/payrollReport_with_bankno" component={PayrollReportWithBankNo}></Route>
        <Route path="/salary_history_report" component={SalaryHistoryReport}></Route>
        <Route path="/quarterly_report" component={QuarterlyIncentiveReport}></Route>
        <Route path='/payroll_summary_report' component={PayrollSummaryReport}></Route>
        <Route path='/payroll_details_report' component={PayrollDetailsReport}></Route>
        <Route path='/payroll_summary_report_with_location' component={PayrollSummaryReportWithLocation}></Route>
        <Route path='/monthly_incentive' component={MonthlyIncentive}></Route>
        <Route path='/payslip_monthly_incentive' component={MonthlyIncentivePayslip}></Route>
        <Route path='/monthly_report' component={MonthlyIncentiveReport}></Route>
        <Route path='/payslip_quarterly_incentive' component={QuarterlyIncentivePayslip}></Route>
        <Route path='/payslip_generate' component={PayslipGenerate1}></Route>
        <Route path='/quarterly_incentive' component={QuarterlyIncentive}></Route>
        <Route path='/payroll_generate' component={PayrollGenerate}></Route>

        <Route path='/staff_loan' component={StaffLoanMain} ></Route>
        <Route path='/staff_loan_before_committee' component={StaffLoanBeforeComit} ></Route>
        <Route path='/staff_loan_after_committee' component={StaffLoanAfterComit} ></Route>
        <Route path='/staff_loan_approve' component={StaffLoanApprove} ></Route>
        <Route path='/staff_loan_summary_report' component={StaffLoanSummaryReport} ></Route>
        <Route path='/hr_statistic' component={HrStatistics} ></Route>

        








        <Redirect to="/dashboard" />

    </Switch>
);

export default Main;