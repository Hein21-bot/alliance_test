import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
//staff loan
import ApplyForm from '../components/Allowance/StaffLoan/ApplyForm';
import RepaymentSchedule from '../components/Allowance/StaffLoan/RepaymentSchedule';
// import StaffLoanList from './Allowance/StaffLoan/StaffLoanList';
import StaffLoanApproval from './Allowance/StaffLoan/StaffLoanApproval';
import SettlementSheet from './Allowance/StaffLoan/SettlementSheet';
import StaffLoanView from './Allowance/StaffLoan/StaffLoanView';

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

import StaffLoanMain from './Allowance/StaffLoan/StaffLoanMain';
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
const Main = () => (
    <Switch>
        <Route path='/allowance' component={TravelRequest} />
        <Route path='/travelRequest' component={TravelRequest} />
        <Route path='/trainingRequest' component={TrainingRequest} />

        <Route path='/helpDesk' component={HelpDesk} />
        <Route path='/staffComplain' component={StaffComplainMain} />

        <Route path="/staff_loan" component={StaffLoanMain}></Route>
        <Route path="/staff_loan_applyform" component={ApplyForm}></Route>
        <Route path="/staff_loan_approval" component={StaffLoanApproval}></Route>
        <Route path="/staff_loan_repayment" component={RepaymentSchedule}></Route>
        <Route path="/staff_loan_settlement" component={SettlementSheet}></Route>
        <Route path="/staff_loan_view" component={StaffLoanView}></Route>

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



        <Route path='/dashboard'  component={Dashboard} ></Route>
        <Route path='/HoStaffReport' component={HoStaffReport} />
        <Redirect to="/dashboard" />

    </Switch>
);

export default Main;