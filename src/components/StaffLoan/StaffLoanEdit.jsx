import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import DocumentStaffLoan from "../Common/DocumentStaffLoan";

import $ from "jquery";
import {
  main_url,
  getCookieData,
  validate,
  getUserId,
  alertText,
  stopSaving,
  startSaving,
  getBranch,
  havePermission,
  getWorkFlowStatus,
  getActionStatus
} from "../../utils/CommonFunction";
import Select from "react-select";
import DatePicker from "react-datetime";
import moment from "moment";
// import { myanmarNumToWord } from "myanmar-num-to-word";
import StaffLoanApprovalForm from "../Common/StaffLoanApprovalForm";

var form_validate = true;
var saveBtn = false;


class StaffLoanEdit extends Component {
  constructor() {
    super();
    this.state = {
      
      staffInfo: [],
      user_id: getUserId("user_info"),
      staffGuarantorInfo: {
        staffGuarantorId: 0,
        staffGuarantorName: "",
        staffGuarantorNRC: "",
        staffGuarantorPosition: "",
        staffGuarantorBranch: "",
      },
      FamilyIncomeDoc:[],
      StaffGuarantorNRCDoc:[],
      OtherDoc:[],
      RequestNRCDoc:[],
      FamilyGuarantorNRCDoc:[],

      otherLoanDetails:[],
      familyRelation:[
    ],
    OtherLoanSelectBox:0,
    OtherLoanList:[
      
    ],
    selectedOtherLoan:null,
    selectedFamilyRelation:null,
    selectedFamilyJob:'',
    selectedFamilyNRC:'',
    selectedFamilyName:'',
    selectedFamilyAddress:'',
    selectedFamilyIncome:0,
    selectedFamilyPhone:null,
    selectedInstitutionName:'',
    selectedOutstandingAmount:0,
    selectedInstallmentTerm:0,
    selectedInstallmentAmount:0,
    selectedMaturityDate:new Date(),
    selectedRequestAmount:0,
    selectedRepaymentPeriod:0,
    selectedLoanPurpose:'',
    WithdrawLocationList:[
      
    ],
    selectedWithdrawLocation:null,
    InstallmentAmount:0,
      user_id: "",
      designation: "",
      noOfChildren: "",
      status: 0,
      createdBy: getUserId("user_info"),
      updatedBy: getUserId("user_info"),
      attachment: [],
      newDoc: [],
      // staffInfo: [],
      getGuarantorInfo: [],
      selectedGuarantor: null,
      familyDropdown: [],
    user_info:getCookieData("user_info"),
    targetAchievement:'',
    otherLoanInformation:'',
    performanceRecomm:'',
    check_comment:'',
    verify:'',
    warningCheck:0,
    selectedDisbursementDate:new Date(),
    selectedTermInMonths:0,
    selectedLoanCommitteeDate:new Date(),
    ApproveAmount:0,
    ApproveAmountInWord:'',
    verifyComment:'',
    verifyDoc:[],
    staffInfoDetails:[],
    selectedVerifyInstallmentAmount:0,
    work_flow_status:{
      
    },
    is_main_role:false,
    status_title:'',
    comment:''
    };
  }

  componentDidUpdate() {
    if (!form_validate) validate("check_form");
  }
  currencyFormat=(num)=> {
    if(num == 0 || num == '' || num == null){
      return num
    }else{
      let integer=parseInt(num)
      console.log("number====><",typeof(num),num)
      return integer.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    
 }

  async componentDidMount() {
    // let id=this.state.user_info!=undefined && this.state.user_info
    let user_info= await getCookieData("user_info")
    
    console.log(user_info)

    await fetch(`${main_url}staff_loan_new/getStaffUserInfo/${this.props.dataSource.user_id}`)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this.setState({
          staffInfo: list
        })
      })
    
      await fetch(`${main_url}staff_loan_new/getStaffLoanDetails/${this.props.dataSource.staff_loan_id}`)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this.setState({
        staffInfoDetails: list
        })
      })
      await fetch(`${main_url}staff_loan_new/familyDropDown`)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this.setState({
          familyRelation: list
        })
      })
      await fetch(`${main_url}staff_loan_new/otherLoanDropDown`)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this.setState({
          OtherLoanList: list
        })
      })
      
      let branch = await getBranch();
      this.setState({
        WithdrawLocationList:branch
      })
    let Details=this.state.staffInfoDetails.length != 0 && this.state.staffInfoDetails.mainData != undefined && this.state.staffInfoDetails.mainData.length > 0 && this.state.staffInfoDetails.mainData[0]
    let Document=await (this.state.staffInfoDetails.length != 0 && this.state.staffInfoDetails.document != undefined && this.state.staffInfoDetails.document.length > 0 && this.state.staffInfoDetails.document)
    let otherLoanDetils=await (this.state.staffInfoDetails.length != 0 && this.state.staffInfoDetails.detailsData != undefined && this.state.staffInfoDetails.detailsData.length > 0 ? this.state.staffInfoDetails.detailsData : [])
    console.log("Details",Details)
    let familyDoc=Document.length > 0 && Document.filter(v=>v.fieldName == "familyDOC")
    console.log("family doc in component",familyDoc)
    let familyNRC=Document.length > 0 && Document.filter(v=>v.fieldName == "familyGuaNRC")
    let requesterNRC=Document.length > 0 && Document.filter(v=>v.fieldName == "requesterNRC")
    let otherDoc= Document.length > 0 && Document.filter(v=>v.fieldName == "otherDOC")
    let staffNRC=Document.length > 0 && Document.filter(v=>v.fieldName == "staffNRC")
    let approveAttach=Document.length > 0 && Document.filter(v=>v.fieldName == "approveAttach")

    let relationFamily=this.state.familyRelation.filter(v=>v.value == Details.relation_family)
    // let verifyDoc=Document.length > 0 && Document.filter(v=>v.fieldName == "approveDoc")

      await fetch(`${main_url}staff_loan_new/getGuarantorInfo`)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {

        this.setState({
          getGuarantorInfo: list,
          selectedGuarantor:list.filter(v=>v.value == Details.staff_guarantor_id).length > 0 &&  list.filter(v=>v.value == Details.staff_guarantor_id)[0]
        })
      })
      var work_flow = await getWorkFlowStatus(Details.user_id, this.state.updatedBy, 'Staff Loan', 'Staff Loan');
    this.setState({
        work_flow_status: work_flow,
        is_main_role: havePermission(work_flow)
    })
      let filterWithdraw=this.state.WithdrawLocationList.filter(v=>v.value == Details.withdraw_location).length > 0 && this.state.WithdrawLocationList.filter(v=>v.value == Details.withdraw_location)[0]
      this.setState({
        selectedFamilyName:Details.family_guarantor_name,
        selectedFamilyIncome:Details.user_id ==  this.state.user_info.user_id ?Details.family_guarantor_income_info : this.currencyFormat(Details.family_guarantor_income_info),
        selectedFamilyAddress:Details.family_guarantor_address,
        selectedFamilyJob:Details.family_guarantor_job,
        selectedFamilyNRC:Details.family_guarantor_nrc,
        selectedFamilyPhone:Details.family_guarantor_phone,
        selectedRequestAmount:Details.user_id ==  this.state.user_info.user_id ? Details.requested_amount : this.currencyFormat(Details.requested_amount),
        selectedRepaymentPeriod:Details.repayment_period,
        InstallmentAmount:Details.user_id == this.state.user_info.user_id ? Details.installment_amount : this.currencyFormat(Details.installment_amount),
        selectedWithdrawLocation:filterWithdraw,
        FamilyIncomeDoc:familyDoc,
        StaffGuarantorNRCDoc:staffNRC,
        OtherDoc:otherDoc,
        selectedLoanPurpose:Details.loan_purpose,
        RequestNRCDoc:requesterNRC,
        FamilyGuarantorNRCDoc:familyNRC,
        otherLoanDetails:otherLoanDetils,
        selectedFamilyRelation:relationFamily,
        targetAchievement:Details.target_achievement,
        otherLoanInformation:Details.other_loan_information,
        performanceRecomm:Details.performance_recommendation==null ? '' : Details.performance_recommendation,
        check_comment:Details.checked_comment == null ? '' : Details.checked_comment,
        verify:Details.verified_comment == null ? '' : Details.verified_comment,
        selectedDisbursementDate:Details.disbursement_date == null ? new Date() : Details.disbursement_date,
        selectedTermInMonths:Details.term_in_month == null ? 0 : Details.term_in_month,
        selectedLoanCommitteeDate:Details.loan_committee_date  == null ? new Date() : Details.loan_committee_date,
        selectedVerifyInstallmentAmount:Details.approve_installment_amount == null ? 0 : Details.approve_installment_amount,
        ApproveAmount:Details.approved_amount == null ? 0 : Details.approved_amount,
        verifyComment:Details.approved_comment,
        ApproveAmountInWord:Details.approved_amount_words,
        warningCheck:Details.warning_letter_check,
        verifyDoc:approveAttach,
        OtherLoanSelectBox:Details.other_loan_check
      
      })
      this.editAddData();
    // fetch(`${main_url}staff_loan_new/familyDropDown`)
    //   .then(res => { if (res.ok) return res.json() })
    //   .then(list => {
    //     this.setState({
    //       familyRelation: list
    //     })
    //   })
    let that=this;
    // $(document).on("click", "#toEdit", function () {
    //   var data = $(this).find("#edit").text();
    //   data = $.parseJSON(data);
    //   let newData = that.state.dataSource;
    //   let editData = newData[data];
    //   console.log("edit data===>",editData)
    //   newData.splice(data, 1);
    //   let filterOtherLoan=this.state.OtherLoanList.filter(v=>v.value == editData.other_loan_dropdown)
    //   that.setState(
    //     {
    //       dataSource: newData,
    //       selectedOtherLoan:filterOtherLoan,
    //       selectedOutstandingAmount:editData.outstanding_amount,
    //       selectedInstallmentAmount:editData.installment_amount,    

    //       selectedInstallmentTerm:editData.installment_term,    

    //       selectedMaturityDate:editData.maturity_date,    

    //       selectedInstitutionName:editData.name_of_institution,
    //       OtherLoanSelectBox:editData.other_loan_check    

    //     },
    //     () => that.setDataTable(newData)
    //   );
    // });
     $(document).on("click", "#toEdit", function () {
      var data = $(this).find("#edit").text();
      data = $.parseJSON(data);
      let newData = that.state.otherLoanDetails;
      let editData = newData[data];
      console.log("edit data===>",editData)
      newData.splice(data, 1);

      let filterOtherLoan=that.state.OtherLoanList.filter(v=>v.value == editData.other_loan_dropdown)[0]
      console.log("other loan list",filterOtherLoan)

      that.setState(
        {
          otherLoanDetails: newData,
          selectedOtherLoan:filterOtherLoan, 
          selectedOutstandingAmount:editData.outstanding_amount,
          selectedInstallmentAmount:editData.installment_amount,    

          selectedInstallmentTerm:editData.installment_term,    

          selectedMaturityDate:editData.maturity_date,    

          selectedInstitutionName:editData.name_of_institution,
          // OtherLoanSelectBox:editData.other_loan_check    

        },
        () => that.setDataTable(newData)
      );
    });
    $(document).on("click", "#toRemove", function () {
      var data = $(this).find("#remove").text();
      data = $.parseJSON(data);

      let newData = that.state.otherLoanDetails;
      newData.splice(data, 1);
      that.setState(
        {
          otherLoanDetails: newData,
        },
        () => that.setDataTable(newData)
      );
    });
    // fetch(`${main_url}child_benefit/getChildAvailableAmount`)
    //     .then(res => { if (res.ok) return res.json() })
    //     .then(list => {
    //         this.setState({
    //             available_amount: list.amount
    //         })
    //     })
  }

  handleSelectGuarantor = (event) => {
    console.log('event is ==========>', event)
    this.setState({
      selectedGuarantor: event
    })
  };
  removeFamilyGuarantorNRCDoc(index, event) {
    var array = this.state.FamilyGuarantorNRCDoc;

    array.splice(index, 1);
    this.setState({
      FamilyGuarantorNRCDoc: array,
    });
    console.log("family quarantor nrc doc", this.state.FamilyGuarantorNRCDoc);
  }
  removeFamilyIncomeDoc(index, event) {
    var array = this.state.FamilyIncomeDoc;

    array.splice(index, 1);
    this.setState({
      FamilyIncomeDoc: array,
    });
    console.log("family  income  doc", this.state.FamilyIncomeDoc);
  }
  removeOtherDoc(index, event) {
    var array = this.state.OtherDoc;

    array.splice(index, 1);
    this.setState({
      OtherDoc: array,
    });
    console.log("other doc", this.state.OtherDoc);
  }
  removeStaffGuarantorNRCDoc(index, event) {
    var array = this.state.StaffGuarantorNRCDoc;

    array.splice(index, 1);
    this.setState({
      StaffGuarantorNRCDoc: array,
    });
    console.log("staff quarantor doc", this.state.StaffGuarantorNRCDoc);
  }
  removeRequesterNRCDoc(index, event) {
    var array = this.state.RequestNRCDoc;

    array.splice(index, 1);
    this.setState({
      RequestNRCDoc: array,
    });
    console.log("requester nrc doc", this.state.RequestNRCDoc);
  }
  handleSelectedFamilyRelation=(e)=>{
    this.setState({
      selectedFamilyRelation:e
    })
  }
  familyName=(e)=>{
    this.setState({
      selectedFamilyName:e.target.value
    })
  }
  familyNRC=(e)=>{
    this.setState({
      selectedFamilyNRC:e.target.value
    })
  }
  familyAddress=(e)=>{
    this.setState({
      selectedFamilyAddress:e.target.value
    })
  }
  familyPhone=(e)=>{
    this.setState({
      selectedFamilyPhone:e.target.value
    })
  }
  familyIncome=(e)=>{
    this.setState({
      selectedFamilyIncome:e.target.value
    })
  }
  familyJob=(e)=>{
    this.setState({
      selectedFamilyJob:e.target.value
    })
  }
  handleOtherLoan=(e)=>{
    this.setState({
      selectedOtherLoan:e
    })
  }
  handelInstitutionName=(e)=>{
    this.setState({
      selectedInstitutionName:e.target.value
    })
  }
  handleOutstandingAmount=(e)=>{
    this.setState({
      selectedOutstandingAmount:e.target.value
    })
  }
  handleInstallmentTerm=(e)=>{
    this.setState({
      selectedInstallmentTerm:e.target.value
    })
  }
  handleInstallmentAmount=(e)=>{
    this.setState({
      selectedInstallmentAmount:e.target.value
    })
  }
  handleMaturityDate=(e)=>{
    this.setState({
      selectedMaturityDate:e
    })
  }
  handleRequestAmount=(e)=>{
    if(this.state.selectedRepaymentPeriod == 0){
      this.setState({
        selectedRequestAmount:e.target.value,
        InstallmentAmount:e.target.value
  
      })
    }else{
      const tempAmount= e.target.value / this.state.selectedRepaymentPeriod
      const TrimDecimal=Math.trunc(tempAmount)
      this.setState({
        selectedRequestAmount:e.target.value,
        InstallmentAmount:TrimDecimal
      })
    }
    
  }
  handleRepaymentPeriod=(e)=>{
    const tempAmount=this.state.selectedRequestAmount / e.target.value
    const TrimDecimal=Math.trunc(tempAmount)
    this.setState({
      selectedRepaymentPeriod:e.target.value,
      InstallmentAmount:TrimDecimal
    })
  }
  handleLoanPurpose=(e)=>{
    this.setState({
      selectedLoanPurpose:e.target.value
    })
  }
  handleWithdrawLocation=(e)=>{
    this.setState({
      selectedWithdrawLocation:e
    })
  }
  handleSelectBoxOtherLoan=(event)=>{
    if(event.target.checked == true){
      this.setState({
        OtherLoanSelectBox:event.target.value
      })
    }else{
      this.setState({
        OtherLoanSelectBox:0
      })
    }
  }
  editAddData=()=>{
    this.setDataTable(this.state.otherLoanDetails)
  }
  addData = (e) => {
    const { userInfo,otherLoanDetails } = this.state;
    console.log("other loan select box",this.state.OtherLoanSelectBox)
    var data = [...otherLoanDetails];
    console.log("data=====>",data)
    let OtherLoanselected=this.state.selectedOtherLoan && this.state.selectedOtherLoan.value;
    console.log("other loan selected",OtherLoanselected)
    let filterData=data.filter(v=>v.other_loan_dropdown == OtherLoanselected)
    console.log("data filter=======>",filterData)
    console.log("filter data======>",this.state.OtherLoanSelectBox == 1 && this.state.selectedOtherLoan !=null && this.state.selectedInstitutionName != '' &&
    this.state.selectedOutstandingAmount != 0 && this.state.selectedInstallmentTerm != 0 && this.state.selectedInstallmentAmount!=0
    && filterData.length == 0,filterData.length == 0 && this.state.OtherLoanSelectBox == 0 && (this.state.selectedOtherLoan !=null || this.state.selectedInstitutionName ||
      this.state.selectedOutstandingAmount != 0 || this.state.selectedInstallmentTerm != 0 || this.state.selectedInstallmentAmount))
    let tempData = {};
    if (this.state.OtherLoanSelectBox == 1 && this.state.selectedOtherLoan !=null && this.state.selectedInstitutionName != '' &&
    this.state.selectedOutstandingAmount != 0 && this.state.selectedInstallmentTerm != 0 && this.state.selectedInstallmentAmount!=0
    && filterData.length == 0
    ) 
    {
      console.log("1")
     
      tempData.other_loan_dropdown=this.state.selectedOtherLoan.value;
      tempData.name_of_institution=this.state.selectedInstitutionName;
      tempData.outstanding_amount=this.state.selectedOutstandingAmount;
      tempData.installment_term=this.state.selectedInstallmentTerm;
      tempData.installment_amount=this.state.selectedInstallmentAmount;
      tempData.maturity_date=this.state.selectedMaturityDate;
      // tempData.other_loan_check=this.state.OtherLoanSelectBox;
      console.log(' select 1 tempData',tempData)
      data.push(tempData);
      this.setState({
        otherLoanDetails: data,
        selectedOtherLoan:null,
        selectedInstitutionName:'',
        selectedOutstandingAmount:0,
        selectedInstallmentTerm:0,
        selectedInstallmentAmount:0,
        selectedMaturityDate:new Date(),
        // OtherLoanSelectBox:0
      });
      saveBtn = true;
      form_validate = true;
      this.setDataTable(data);
    }else if (filterData.length == 0 && this.state.OtherLoanSelectBox == 0 && (this.state.selectedOtherLoan !=null || this.state.selectedInstitutionName ||
      this.state.selectedOutstandingAmount != 0 || this.state.selectedInstallmentTerm != 0 || this.state.selectedInstallmentAmount)
      ) 
    { console.log("0")
        
        
        tempData.other_loan_dropdown=this.state.selectedOtherLoan.value;
        tempData.name_of_institution=this.state.selectedInstitutionName;
        tempData.outstanding_amount=this.state.selectedOutstandingAmount;
        tempData.installment_term=this.state.selectedInstallmentTerm;
        tempData.installment_amount=this.state.selectedInstallmentAmount;
        tempData.maturity_date=this.state.selectedMaturityDate;
        // tempData.other_loan_check=this.state.OtherLoanSelectBox;

        console.log('select 0 tempData',tempData)
        data.push(tempData);
        this.setState({
          otherLoanDetails: data,
          selectedOtherLoan:null,
          selectedInstitutionName:'',
          selectedOutstandingAmount:0,
          selectedInstallmentTerm:0,
          selectedInstallmentAmount:0,
          selectedMaturityDate:new Date(),
          // OtherLoanSelectBox:0
        });
      saveBtn = true;
      form_validate = true;
      this.setDataTable(data);

    }else if(filterData.length > 0){
      toast.error("Other Loan is already exist", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }else{
      toast.error("You need to fill your information successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  setDataTable(data) {
    console.log("setdataTable",data)
    let Details=this.state.staffInfoDetails.length != 0 && this.state.staffInfoDetails.mainData != undefined && this.state.staffInfoDetails.mainData.length > 0 && this.state.staffInfoDetails.mainData[0]

    console.log("data===>",Details.user_id==this.state.user_info.user_id ? 'nyi tal' : 'ma nyi bu')
    var table;
    if ($.fn.dataTable.isDataTable("#dataTables-Table")) {
      table = $("#dataTables-Table").dataTable();
      table.fnClearTable();
      table.fnDestroy();
      $("#dataTables-Table").empty();
    }
    var l = [];
    for (var i = 0; i < data.length; i++) {
      const index = i;
      const result = data[i];
      const obj = {
        no: index + 1,
        other_loan:data[i].other_loan_dropdown && data[i].other_loan_dropdown == 1 ? 'Personal Loan' : data[i].other_loan_dropdown && data[i].other_loan_dropdown == 2 ? 'Collateral Loan' : 'Other Outstanding debts' ,

        // other_loan: data[i].other_loan_dropdown != null
        //   ? data[i].other_loan_dropdown.label
        //   : "-",
        installment_term: data[i].installment_term ? data[i].installment_term : 0,
        outstanding_amount: data[i].outstanding_amount ? this.currencyFormat(data[i].outstanding_amount) : 0,
        institution_name: data[i].name_of_institution ? data[i].name_of_institution : "-",
        installment_amount: data[i].installment_amount ? this.currencyFormat(data[i].installment_amount) : 0,
        maturity_date:data[i].maturity_date ? moment(data[i].maturity_date).format('YYYY-MM-DD') : '-',
        action:this.state.user_info.user_id == Details.user_id ? 
          '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit"><span id="edit" class="hidden">'+
          index +
          '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' +
          '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toRemove"><span id="remove" class="hidden">'+
          index +
          '</span>  <i className="fa fa-cogs"></i>&nbsp;Remove</button>' : 
          '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" disabled id="toEdit"><span id="edit" class="hidden">'+
          index +
          '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' +
          '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" disabled id="toRemove"><span id="remove" class="hidden">'+
          index +
          '</span>  <i className="fa fa-cogs"></i>&nbsp;Remove</button>'
          ,
          
      };
      l.push(obj);
    }
    table = $("#dataTables-Table").DataTable({
      searching:false,
      autofill: false,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      paging: false,
      buttons: false,
      data: l,
      columns: [
        { title: "No", data: "no" },
        { title: "Other Loan",data:"other_loan"},
        { title: "Name of Institution", data: "institution_name" },
        { title: "Outstanding Amount", data: "outstanding_amount" },
        { title: "Installment Term", data: "installment_term" },
        { title: "Installment Amount",data:"installment_amount"},
        { title: "Maturity Date",data:"maturity_date"},
        
        { title:'Action',data:'action'}
      ],
      
    });
  }

  familyIncomeDoc(e) {
    var files = document.getElementById("family_income_attach_file").files;

    if (files.length > 3) {
      toast.warning("You can only upload a maximum of 2 files!");
    }

    let newDoc = this.state.FamilyIncomeDoc;
    var obj = document.querySelector("#family_income_attach_file").files.length;
    for (var i = 0; i < obj; i++) {
      var getfile = document.querySelector("#family_income_attach_file").files[i];
      newDoc.push(getfile);
    }
    document.getElementById("family_income_attach_file").value = "";
    this.setState({
      // attachment: attachment,
      FamilyIncomeDoc: newDoc,
    });
  }

  staffGuarantorNRCDoc(e) {
    var files = document.getElementById("staff_guarantor_nrc_attach_file").files;

    if (files.length > 3) {
      toast.warning("You can only upload a maximum of 2 files!");
    }

    let newDoc = this.state.StaffGuarantorNRCDoc;
    var obj = document.querySelector("#staff_guarantor_nrc_attach_file").files.length;
    for (var i = 0; i < obj; i++) {
      var getfile = document.querySelector("#staff_guarantor_nrc_attach_file").files[i];
      newDoc.push(getfile);
    }
    document.getElementById("staff_guarantor_nrc_attach_file").value = "";
    this.setState({
      // attachment: attachment,
      StaffGuarantorNRCDoc: newDoc,
    });
  }
  OtherDoc(e) {
    var files = document.getElementById("other_doc_attach_file").files;

    if (files.length > 3) {
      toast.warning("You can only upload a maximum of 2 files!");
    }

    let newDoc = this.state.OtherDoc;
    var obj = document.querySelector("#other_doc_attach_file").files.length;
    for (var i = 0; i < obj; i++) {
      var getfile = document.querySelector("#other_doc_attach_file").files[i];
      newDoc.push(getfile);
    }
    document.getElementById("other_doc_attach_file").value = "";
    this.setState({
      // attachment: attachment,
      OtherDoc: newDoc,
    });
  }
  RequesterNRCDoc(e) {
    var files = document.getElementById("requester_nrc_attach_file").files;

    if (files.length > 3) {
      toast.warning("You can only upload a maximum of 2 files!");
    }

    let newDoc = this.state.RequestNRCDoc;
    var obj = document.querySelector("#requester_nrc_attach_file").files.length;
    for (var i = 0; i < obj; i++) {
      var getfile = document.querySelector("#requester_nrc_attach_file").files[i];
      newDoc.push(getfile);
    }
    document.getElementById("requester_nrc_attach_file").value = "";
    this.setState({
      // attachment: attachment,
      RequestNRCDoc: newDoc,
    });
  }
  familyGuarantorNRCDoc(e) {
    var files = document.getElementById("family_guarantor_nrc_attach_file").files;

    if (files.length > 3) {
      toast.warning("You can only upload a maximum of 2 files!");
    }

    let newDoc = this.state.FamilyGuarantorNRCDoc;
    var obj = document.querySelector("#family_guarantor_nrc_attach_file").files.length;
    for (var i = 0; i < obj; i++) {
      var getfile = document.querySelector("#family_guarantor_nrc_attach_file").files[i];
      newDoc.push(getfile);
    }
    document.getElementById("family_guarantor_nrc_attach_file").value = "";
    this.setState({
      // attachment: attachment,
      FamilyGuarantorNRCDoc: newDoc,
    });
  }
  handleTargetAchievement=(e)=>{
    this.setState({
        targetAchievement:e.target.value
    })
  }
  handleOtherLoanInformation=(e)=>{
    this.setState({
        otherLoanInformation:e.target.value
    })
  }
  handlePerformanceRecommendation=(e)=>{
    this.setState({
        performanceRecomm:e.target.value
    })
  }
  handleComment=(e)=>{
    this.setState({
        check_comment:e.target.value
    })
  }
  handleVerify=(e)=>{
    this.setState({
        verify:e.target.value
    })
  }
  handleDisbursementDate=(e)=>{
    this.setState({
        selectedDisbursementDate:e
    })
  }
  handleTermInMonths=(e)=>{
    this.setState({
        selectedTermInMonths:e.target.value
    })
  }
  handleLoanCommitteeDate=(e)=>{
    this.setState({
        selectedLoanCommitteeDate:e
    })
  }
  handleVerifyInstallmentAmount=(e)=>{
    this.setState({
      selectedVerifyInstallmentAmount:e.target.value
    })
  }
 
  handleApproveAmount=(e)=>{
    let myanmarNumToWord=require('myanmar-num-to-word')
    
    this.setState({
        ApproveAmount:e.target.value,
        // ApproveAmountInWord:myanmarNumToWord.convertToBurmeseWords(e.target.value,'speech')
    },()=>{
      if(this.state.ApproveAmount != 0 || this.state.ApproveAmount!=''){
        this.setState({
          ApproveAmountInWord:myanmarNumToWord.convertToBurmeseWords(this.state.ApproveAmount)
        })
      }
    })
  }
  handleVerifyComment=(e)=>{
    this.setState({
        verifyComment:e.target.value
    })
  }
  // handleApproveAmountInWord=(e)=>{
  //   this.setState({
  //       ApproveAmountInWord:e.target.value
  //   })
  // }
  handleSelectWaringCheck=(e)=>{
    // this.setState({
    //     selectedDisbursementDate:e
    // })
    if(e.target.checked == true){
      this.setState({
        warningCheck:e.target.value
      })
    }else{
      this.setState({
        warningCheck:0
      })
    }
  }
  verifyAttachment=()=>{
    var files = document.getElementById("attachment").files;

    if (files.length > 3) {
      toast.warning("You can only upload a maximum of 2 files!");
    }

    let newDoc = this.state.verifyDoc;
    var obj = document.querySelector("#attachment").files.length;
    for (var i = 0; i < obj; i++) {
      var getfile = document.querySelector("#attachment").files[i];
      newDoc.push(getfile);
    }
    document.getElementById("attachment").value = "";
    this.setState({
      // attachment: attachment,
      verifyDoc: newDoc,
    });
  }
  removeVerifyDoc(index, event) {
    var array = this.state.verifyDoc;

    array.splice(index, 1);
    this.setState({
      verifyDoc: array,
    });
    console.log("family quarantor nrc doc", this.state.verifyDoc);
  }
 
  approvalStatus = (text, comment) => {
    let Details=this.state.staffInfoDetails.length != 0 && this.state.staffInfoDetails.mainData != undefined && this.state.staffInfoDetails.mainData.length > 0 && this.state.staffInfoDetails.mainData[0]
    console.log("text and commment",Details.status == 2 && this.state.selectedTermInMonths != 0 && this.state.selectedVerifyInstallmentAmount != 0 && this.state.ApproveAmount != 0,(Details.status == 0 || Details.status !=undefined) && (this.state.check_comment!='' || this.state.check_comment!=null) && (this.state.performanceRecomm !='' || this.state.performanceRecomm!=null),Details.status == 1 && this.state.verify !='')
    console.log("check======>",Details.stautus,this.state.check_comment,this.state.performanceRecomm)

    console.log("approval status",Details.status,this.state.selectedTermInMonths,this.state.selectedVerifyInstallmentAmount,this.state.ApproveAmount);
    this.setState({ status_title: text, comment: comment },()=>{
      if(text == 'referback'){
        this.save()
        // console.log('refer back save')
      }
      else if((Details.status == 2 && (this.state.selectedTermInMonths != 0 || this.state.selectedTermInMonths !='') && (this.state.selectedVerifyInstallmentAmount != 0 || this.state.selectedVerifyInstallmentAmount !='') && (this.state.ApproveAmount != 0 || this.state.ApproveAmount != '')) || (Details.status == 0  && this.state.check_comment!='') || (Details.status == 1 && this.state.verify !='')){
        this.save()
        // console.log("save function======>")
      }else{
        toast.error("You need to fill your information successfully")
      }
    })
    
  }
  

  save() {
    console.log("ma thi bu save pae",this.state.selectedFamilyRelation == null,this.state.selectedFamilyName == '', this.state.selectedFamilyNRC=='', this.state.selectedFamilyAddress == '',this.state.selectedFamilyIncome==0, this.state.selectedFamilyJob == '' || this.state.selectedFamilyPhone ==0,this.state.selectedLoanPurpose == '',this.state.selectedWithdrawLocation ==null, this.state.selectedGuarantor ==null ,(this.state.OtherLoanSelectBox == 1 && this.state.otherLoanDetails.length == 0))
    console.log("br nyar",this.state.otherLoanDetails.length == 0)
    // if (this.state.FamilyGuarantorNRCDoc.length == 0 && this.state.FamilyIncomeDoc.length == 0 && this.state.StaffGuarantorNRCDoc.length == 0 && this.state.RequestNRCDoc.length == 0) {
    //   toast.error("Please Choose Attachment File!");
    // } else {
      let Details=this.state.staffInfoDetails.length != 0 && this.state.staffInfoDetails.mainData != undefined && this.state.staffInfoDetails.mainData.length > 0 && this.state.staffInfoDetails.mainData[0]

      if (this.state.FamilyGuarantorNRCDoc.length == 0 || this.state.FamilyIncomeDoc.length == 0 || this.state.StaffGuarantorNRCDoc.length == 0 || this.state.RequestNRCDoc.length == 0 || Details.status == 2 && this.state.verifyDoc.length == 0) {
        toast.error("Please Choose Attachment File");
      } else if(this.state.selectedFamilyRelation == null || this.state.selectedFamilyName == '' || this.state.selectedFamilyNRC=='' || this.state.selectedFamilyAddress == '' || this.state.selectedFamilyIncome==0 || this.state.selectedFamilyJob == '' || this.state.selectedFamilyPhone ==0 || this.state.selectedLoanPurpose == '' || this.state.selectedWithdrawLocation ==null || this.state.selectedGuarantor ==null || (this.state.OtherLoanSelectBox == 1 && this.state.otherLoanDetails.length == 0)){
        toast.error("You need to fill your information successfully");
      }else {
        if (this.state.FamilyGuarantorNRCDoc.length > 0 && this.state.FamilyIncomeDoc.length > 0 && this.state.StaffGuarantorNRCDoc.length > 0 && this.state.RequestNRCDoc.length > 0 && this.state.selectedFamilyRelation != null && this.state.selectedFamilyName != '' && this.state.selectedFamilyNRC!='' && this.state.selectedFamilyAddress != '' && this.state.selectedFamilyIncome!=0 && this.state.selectedFamilyJob != '' && this.state.selectedFamilyPhone !=0 && this.state.selectedWithdrawLocation !=null && this.state.selectedLoanPurpose != '' && this.state.selectedGuarantor !=null ) {

          console.log("save new doc=====>",this.state.selectedRequestAmount,this.state.selectedRepaymentPeriod,this.state.InstallmentAmount);
          var { status_title, is_main_role } = this.state;
          $("#saving_button").attr("disabled", true);
          var data = {
            // user_id: this.state.user_info.user_id,
            staff_guarantor_id:this.state.selectedGuarantor!=null ? this.state.selectedGuarantor.value : '',
            family_guarantor_name:this.state.selectedFamilyName,
            family_guarantor_nrc:this.state.selectedFamilyNRC,
            relation_family:this.state.selectedFamilyRelation.value,
            family_guarantor_job:this.state.selectedFamilyJob,
            family_guarantor_address:this.state.selectedFamilyAddress,
            family_guarantor_income_info:this.state.user_info.user_id != Details.user_id ? this.state.selectedFamilyIncome!=0 && this.state.selectedFamilyIncome.split(',').join('') : this.state.selectedFamilyIncome,
            family_guarantor_phone:this.state.selectedFamilyPhone,

            requested_amount:this.state.user_info.user_id != Details.user_id ? this.state.selectedRequestAmount!=0 && this.state.selectedRequestAmount.split(',').join('') : this.state.selectedRequestAmount,
            repayment_period:this.state.selectedRepaymentPeriod,
            installment_amount:this.state.user_info.user_id != Details.user_id ? this.state.InstallmentAmount!=0 && this.state.InstallmentAmount.split(',').join('') : this.state.InstallmentAmount,

            loan_purpose:this.state.selectedLoanPurpose,
            withdraw_location:this.state.selectedWithdrawLocation.value,
            // status: this.state.status,
            // createdBy: this.state.user_info.user_id,
            target_achievement:this.state.targetAchievement,
            other_loan_information:this.state.otherLoanInformation,
            performance_recommendation:this.state.performanceRecomm,
            checked_comment:this.state.check_comment,
            verified_comment:this.state.verify,
            disbursement_date:this.state.selectedDisbursementDate,
            term_in_month:this.state.selectedTermInMonths,
            loan_committee_date:this.state.selectedLoanCommitteeDate,
            approve_installment_amount:this.state.selectedVerifyInstallmentAmount,
            approved_amount:this.state.ApproveAmount,
            approved_comment:this.state.verifyComment,
            approved_amount_words:this.state.ApproveAmountInWord,
            warning_letter_check:this.state.warningCheck,
            other_loan_check:this.state.OtherLoanSelectBox,
            updatedBy: this.state.user_info.user_id,
          };
          
          // let Details=this.state.staffInfoDetails.length != 0 && this.state.staffInfoDetails.mainData != undefined && this.state.staffInfoDetails.mainData.length > 0 && this.state.staffInfoDetails.mainData[0]
          if(Details.status == 5){
            data.status =this.state.status
          }
          if (status_title !== '' && is_main_role) {
            console.log("status title in save",status_title)
              
            var action = getActionStatus(status_title, Details, this.state.updatedBy, this.state.comment);
            console.log("action",action)
            data.referback_by = action.referback_by;
            data.checked_by = action.checked_by;
            data.verified_by = action.verified_by;
            data.approved_by = action.approved_by;
            data.rejected_by = action.rejected_by;
            data.referback_date = action.referback_date;
            data.checked_date = action.checked_date;
            data.verified_date = action.verified_date;
            data.approved_date = action.approved_date;
            data.rejected_date = action.rejected_date;
            data.referback_comment = action.referback_comment;
            // data.checked_comment = action.checked_comment;
            // data.verified_comment = action.verified_comment;
            // data.approved_comment = action.approved_comment;
            data.status = action.status;
    
        }
          const temp=this.state.otherLoanDetails.length > 0 && this.state.otherLoanDetails.map((v)=>{
            return{
              name_of_institution:v.name_of_institution,
              outstanding_amount:v.outstanding_amount,
              installment_term:v.installment_term,
              installment_amount:v.installment_amount,
              maturity_date:v.maturity_date,
              other_loan_dropdown:v.other_loan_dropdown,
              // other_loan_check:v.other_loan_check
            }
          })
  
          const formdata = new FormData();
          let approveDoc=this.state.verifyDoc!=undefined && this.state.verifyDoc.length;
          for (var i = 0; i < approveDoc; i++) {
            var imagedata = this.state.verifyDoc[i];
            formdata.append("attach", imagedata);
          }
  
          let tempFamilIncome=this.state.FamilyIncomeDoc.length > 0 && this.state.FamilyIncomeDoc.filter(v=>v.fieldName != "familyDOC")
          var tempFamilyIncomeLength = tempFamilIncome.length;
          for (var i = 0; i < tempFamilyIncomeLength; i++) {
            var imagedata = tempFamilIncome[i];
            formdata.append("family", imagedata);
          }
  
  
          let tempFamilOld=this.state.FamilyIncomeDoc.length > 0 && this.state.FamilyIncomeDoc.filter(v=>v.fieldName == "familyDOC")
          var tempFamilyIncomeOldLength = tempFamilOld.length;
          let familyOldDOC=[]
          for (var i = 0; i < tempFamilyIncomeOldLength; i++) {
            // var imagedata = tempFamilOld[i];
            familyOldDOC.push(tempFamilOld[i]);
          } 
          formdata.append("oldFamilyDoc", JSON.stringify(familyOldDOC))
          console.log("family old doc is ====>", familyOldDOC)
  
          let tempFamilyGuaNRc=this.state.FamilyGuarantorNRCDoc.length > 0 && this.state.FamilyGuarantorNRCDoc.filter(v=>v.fieldName != "familyGuaNRC")
          var tempFamilyGuarantorNRCLength = tempFamilyGuaNRc.length;
          for (var i = 0; i < tempFamilyGuarantorNRCLength; i++) {
            var imagedata = tempFamilyGuaNRc[i];
            formdata.append("familyGuaNRC", imagedata);
          }
          let FamilyNRCold=[]
          let tempFamilyNRCOld=this.state.FamilyGuarantorNRCDoc.length > 0 && this.state.FamilyGuarantorNRCDoc.filter(v=>v.fieldName == "familyGuaNRC")
          var tempFamilyRNCLength = tempFamilyNRCOld.length;
          for (var i = 0; i < tempFamilyRNCLength; i++) {
            // var imagedata = tempFamilyNRCOld[i];
            FamilyNRCold.push(tempFamilyNRCOld[i])
            
          }
          formdata.append("oldFamilyGuaDoc", JSON.stringify(FamilyNRCold));
          let tempOther=this.state.OtherDoc.length > 0 && this.state.OtherDoc.filter(v=>v.fieldName != "otherDOC")
          var tempOtherLength = tempOther.length;
          for (var i = 0; i < tempOtherLength; i++) {
            var imagedata = tempOther[i];
            formdata.append("otherDOC", imagedata);
          }
          let OtherDocOld=[]
          let tempOtherDocOld=this.state.OtherDoc.length > 0 && this.state.OtherDoc.filter(v=>v.fieldName == "otherDOC")
          var tempOtherDocoldength = tempOtherDocOld.length;
          for (var i = 0; i < tempOtherDocoldength; i++) {
            // var imagedata = tempOtherDocOld[i];
            
            OtherDocOld.push(tempOtherDocOld[i])
          }
          formdata.append("oldOtherDoc", JSON.stringify(OtherDocOld));
  
          let tempStaffGuarantorNRC = this.state.StaffGuarantorNRCDoc.length > 0 && this.state.StaffGuarantorNRCDoc.filter(v=>v.fieldName != "staffNRC");
          var tempStaffGuarantorNRCLength = tempStaffGuarantorNRC.length;
          for (var i = 0; i < tempStaffGuarantorNRCLength; i++) {
            var imagedata = tempStaffGuarantorNRC[i];
            formdata.append("staffNRC", imagedata);
          }
          let StaffNRCold=[]
          let tempStaffNRCold=this.state.StaffGuarantorNRCDoc.length > 0 && this.state.StaffGuarantorNRCDoc.filter(v=>v.fieldName == "staffNRC")
          var tempStaffNRColdength = tempStaffNRCold.length;
          for (var i = 0; i < tempStaffNRColdength; i++) {
            // var imagedata = tempStaffNRCold[i];
            StaffNRCold.push(tempStaffNRCold[i])
            
          }
          formdata.append("oldStaffGuaDoc", JSON.stringify(StaffNRCold));
  
          var tempRequesterNRC = this.state.RequestNRCDoc.length >0 && this.state.RequestNRCDoc.filter(v=>v.fieldName != "requesterNRC");
          var tempRequesterNRCLength = tempRequesterNRC.length;
          for (var i = 0; i < tempRequesterNRCLength; i++) {
            var imagedata = tempRequesterNRC[i];
            formdata.append("requesterNRC", imagedata);
          }
  
          let RequesterNRCold=[]
          let tempRequesterNrcOld=this.state.RequestNRCDoc.length > 0 && this.state.RequestNRCDoc.filter(v=>v.fieldName == "requesterNRC")
          var tempRequesterNrcOldLength = tempRequesterNrcOld.length;
          for (var i = 0; i < tempRequesterNrcOldLength; i++) {
            // var imagedata = tempRequesterNrcOld[i];
              RequesterNRCold.push(tempRequesterNrcOld[i])
          }
          formdata.append("oldRequesterDoc", JSON.stringify(RequesterNRCold));
  
          formdata.append("staff_loan_info", JSON.stringify(data));
          formdata.append('staff_loan_detail',JSON.stringify(temp))
          console.log("formdata",formdata)
          let status = 0;
          fetch(`${main_url}staff_loan_new/editStaffLoan/${this.props.dataSource.staff_loan_id}`, {
            method: "POST",
            body: formdata,
          })
            .then((res) => {
              status = res.status;
              return res.text();
            })
            .then((text) => {
              this.props.showToast(status, text);
            });
        } else {
          startSaving();
          form_validate = false;
        }
      }
      
    // }
  }

  render() {
    
    const{staffInfo,getGuarantorInfo}=this.state;
    const Details=this.state.staffInfoDetails.length != 0 && this.state.staffInfoDetails.mainData != undefined && this.state.staffInfoDetails.mainData.length > 0 && this.state.staffInfoDetails.mainData[0]
    console.log('trim data=====>',this.state.user_info.user_id != Details.user_id ? this.state.selectedFamilyIncome!=0 
    && this.state.selectedFamilyIncome
    .split(',').join('') : this.state.selectedFamilyIncome
    )
    console.log("details========>",this.state.selectedRequestAmount,this.state.selectedRepaymentPeriod,this.state.InstallmentAmount)

    let otherLoanDetils=(this.state.staffInfoDetails.length != 0 && this.state.staffInfoDetails.detailsData != undefined && this.state.staffInfoDetails.detailsData.length > 0 && this.state.staffInfoDetails.detailsData)

    // console.log("details=====>",this.state.selectedFamilyRelation)
    console.log(Details.status,this.state.selectedTermInMonths,this.state.selectedVerifyInstallmentAmount,this.state.ApproveAmount)

    return (
      <div className="">
        <ToastContainer />
        <div className="row">
          <form className="form-group" id="check_form">
           
            <div className="col-md-12" style={{ marginBottom: 10 }}>
              <div
                className="col-md-12"
                style={{ backgroundColor: "#27568A", color: "white", paddingTop: 5 }}
              >
                <h3>Staff Information</h3>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="employeeId" className="col-md-12">
                    Employee ID
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={staffInfo.length > 0 ? staffInfo[0].employment_id : ''}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="employeeName" className="col-md-12">
                    Employee Name
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={staffInfo.length > 0 ? staffInfo[0].fullname :""}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="nrc" className="col-md-12">
                    NRC
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={staffInfo.length > 0 ? staffInfo[0].nrc : ''}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="backAccount" className="col-md-12">
                    Bank Account
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={staffInfo.length > 0 ? staffInfo[0].account_no : ''}
                  />
                </div>
              </div>
            </div>

            <div className="row" style={{ marginBottom: 10 }}>
            <div className="col-md-3">
              <div>
                  <label htmlFor="personalPhone" className="col-md-12">
                    Customer Code
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={staffInfo.length > 0 ? staffInfo[0].customer_code : ''}
                  />
                </div>
              </div>
              
              <div className="col-md-3">
                <div>
                  <label htmlFor="employedDate" className="col-md-12">
                    Employed Date
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={staffInfo.length > 0 ? staffInfo[0].employ_date : ''}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="applicantCurrentSalary" className="col-md-12">
                    Applicant's Current Salary
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="float"
                    className="form-control"
                    disabled
                    value={staffInfo.length > 0 ?  this.currencyFormat(staffInfo[0].basic_salary) : ''}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="region" className="col-md-12">
                    Region
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={staffInfo.length > 0 ? staffInfo[0].state_name : ''}
                  />
                </div>
              </div>
            </div>

            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="branch" className="col-md-12">
                    Branch
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={staffInfo.length > 0 ?  staffInfo[0].location_master_name : ''}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="designation" className="col-md-12">
                    Designation
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={staffInfo.length > 0 ?  staffInfo[0].designations : ''}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="officePhone" className="col-md-12">
                    Office Phone
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={staffInfo.length > 0 ? staffInfo[0].office_phone : ''}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="personalPhone" className="col-md-12">
                    Personal Phone
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={staffInfo.length > 0 ? staffInfo[0].personal_phone : ''}
                  />
                </div>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-9">
                <div>
                  <label htmlFor="personalPhone" className="col-md-12">
                    Address
                  </label>
                </div>
                <div className="col-md-12">
                  <textarea
                    type="text"
                    className="form-control"
                    disabled
                    rows={3}
                    value={staffInfo.length > 0 ? staffInfo[0].address : ''}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="dateOfBirth" className="col-md-12">
                    Date of Birth
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={staffInfo.length > 0 ? staffInfo[0].dob : ''}
                  />
                </div>
              </div>
            </div>
            
            <div className="col-md-12" style={{ marginBottom: 10 }}>
              <div
                className="col-md-12"
                style={{ backgroundColor: "#27568A", color: "white", paddingTop: 5 }}
              >
                <h3>Staff Guarantor Information</h3>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="staffGuarantorId" className="col-md-12">
                    Staff Guarantor ID
                  </label>
                </div>
                <div className="col-md-12">
                  {
                    this.state.user_info.user_id ==  Details.user_id ? <Select
                    styles={{
                      container: (base) => ({
                        ...base,
                       
                      }),
                      control: (base) => ({
                        ...base,
                        minHeight: "18px",
                      }),
                    }}
                    placeholder="Staff Guarantor ID"
                    options={this.state.getGuarantorInfo}
                    onChange={this.handleSelectGuarantor.bind(this)}
                    value={this.state.selectedGuarantor}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  /> : 
                  <input type="text" className="form-control" value={this.state.selectedGuarantor!=undefined && this.state.selectedGuarantor.label} disabled/>

                  }
                  
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="staffGuarantorName" className="col-md-12">
                    Staff Guarantor Name
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.selectedGuarantor !=null ? this.state.selectedGuarantor.fullname : ''}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="staffGuarantorNRC" className="col-md-12">
                    Staff Guarantor NRC
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.selectedGuarantor!=null ? this.state.selectedGuarantor.nrc : ''}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="staffGuarantorPosition" className="col-md-12">
                    Staff Guarantor Position
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.selectedGuarantor !=null ?  this.state.selectedGuarantor.designations : ''}
                  />
                </div>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="staffGuarantorBranch" className="col-md-12">
                    Staff Guarantor Branch
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.selectedGuarantor!=null ? this.state.selectedGuarantor.location_master_name : ''}
                  />
                </div>
              </div>
            </div>
            
            <div className="col-md-12" style={{ marginBottom: 10 }}>
              <div
                className="col-md-12"
                style={{ backgroundColor: "#27568A", color: "white", paddingTop: 5 }}
              >
                <h3>Family Guarantor Information</h3>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="familyGuarantorName" className="col-md-12">
                    Family Guarantor Name
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled={this.state.user_info.user_id != Details.user_id}
                    onChange={this.familyName}
                    value={this.state.selectedFamilyName}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="familyGuarantorNRC" className="col-md-12">
                    Family Guarantor NRC
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled={this.state.user_info.user_id  != Details.user_id}
                    onChange={this.familyNRC}
                    value={this.state.selectedFamilyNRC}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="relationWithFamily" className="col-md-12">
                    Ralation with Family
                  </label>
                </div>
                <div className="col-md-12">
                  {
                    this.state.user_info.user_id == Details.user_id ? <Select
                    styles={{
                      container: (base) => ({
                        ...base,
                        //   flex: 1
                        // width: 150,
                        // marginRight:10
                      }),
                      control: (base) => ({
                        ...base,
                        minHeight: "18px",
                      }),
                    }}
                    placeholder="Ralation with Family"
                    options={this.state.familyRelation}
                    onChange={this.handleSelectedFamilyRelation}
                    value={this.state.selectedFamilyRelation}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  /> : 
                  <input type="text" className="form-control" value={this.state.selectedFamilyRelation!=undefined &&  this.state.selectedFamilyRelation.length> 0 && this.state.selectedFamilyRelation[0].label} disabled />

                  }
                  
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="familyGuarantorJob" className="col-md-12">
                    Family Guarantor Job
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled={this.state.user_info.user_id  != Details.user_id}
                    
                    onChange={this.familyJob}
                    value={this.state.selectedFamilyJob}
                  />
                </div>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-6">
                <div>
                  <label htmlFor="familyGuarantorAddress" className="col-md-12">
                    Family Guarantor Address
                  </label>
                </div>
                <div className="col-md-12">
                  <textarea
                    type="text"
                    className="form-control"
                    disabled={this.state.user_info.user_id  != Details.user_id}
                    rows={3}
                    onChange={this.familyAddress}
                    value={this.state.selectedFamilyAddress}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="familyGuarantorIncome" className="col-md-12">
                    Family Guarantor Income
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type={Details.user_id ==  this.state.user_info.user_id ? 'number' : 'float'}
                    className="form-control"
                    disabled={this.state.user_info.user_id  != Details.user_id}
                    onChange={this.familyIncome}
                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                    value={this.state.selectedFamilyIncome}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="familyGuarantorPhone" className="col-md-12">
                    Family Guarantor Phone
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="number"
                    className="form-control"
                    disabled={this.state.user_info.user_id  != Details.user_id}

                    onChange={this.familyPhone}
                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                    value={this.state.selectedFamilyPhone}
                  />
                </div>
              </div>
            </div>
            
            <div className="col-md-12" style={{ marginBottom: 10 }}>
              <div
                className="col-md-12"
                style={{ backgroundColor: "#27568A", color: "white", paddingTop: 5 }}
              >
                <h3>Other Loan Information</h3>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="otherLoan" className="col-md-12">
                    Other Loan
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="checkbox"
                    value='1'
                    disabled={this.state.otherLoanDetails.length > 0}
                    checked={this.state.OtherLoanSelectBox == 1 ? 'checked':''}
                    onChange={this.handleSelectBoxOtherLoan}
                  />
                </div>
              </div>
              {
                this.state.OtherLoanSelectBox  == 1 ? 
                <>
                <div className="col-md-3">
                <div>
                  <label htmlFor="otherLoanDropdown" className="col-md-12">
                    Other Loan
                  </label>
                </div>
                <div className="col-md-12">
                  <Select
                    styles={{
                      container: (base) => ({
                        ...base,
                        //   flex: 1
                        // width: 150,
                        // marginRight:10
                      }),
                      control: (base) => ({
                        ...base,
                        minHeight: "18px",
                      }),
                    }}
                    placeholder="Other Loan"
                    options={this.state.OtherLoanList}
                    onChange={this.handleOtherLoan}
                    value={this.state.selectedOtherLoan}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="nameOfInstitution" className="col-md-12">
                    Name of Institution
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className='form-control' value={this.state.selectedInstitutionName}
                  onChange={this.handelInstitutionName}
                   />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="outstandingAmount" className="col-md-12">
                    Outstanding Amount
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="number" className="form-control" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={this.state.selectedOutstandingAmount}
                  onChange={this.handleOutstandingAmount}
                   />
                </div>
              </div>
                </> : ''
              }
              
            </div>
            {
              this.state.OtherLoanSelectBox == 1  ? 
              <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="installmentterm" className="col-md-12">
                    Installment Term
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="number" className="form-control" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={this.state.selectedInstallmentTerm}
                  onChange={this.handleInstallmentTerm}
                   />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="installmentAmount" className="col-md-12">
                    Installment Amount
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="number" className="form-control" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={this.state.selectedInstallmentAmount} 
                  onChange={this.handleInstallmentAmount}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="maturityDate" className="col-md-12">
                    Maturity Date
                  </label>
                </div>
                <div className="col-md-12">
                  <DatePicker
                    className="checkValidate"
                    timeFormat={false}
                    value={moment(this.state.selectedMaturityDate).format('DD/MM/YYYY')}
                    dateFormat="DD/MM/YYYY"
                    onChange={this.handleMaturityDate}
                  />
                </div>
              </div>
              
              <div className="col-md-3" style={{ paddingTop: 20 }}>
              {
                this.state.user_info.user_id ==  Details.user_id ? <button
                className="btn btn-primary"
                id="add_button"
                type="button"
                onClick={this.addData}
              >
                Add
              </button> : ""
              }
                
              </div>
              <div className="col-md-12">
                <table
                  width="99%"
                  className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                  id="dataTables-Table"
                />
              </div>
            </div> : ''
            }
            
            
            <div className="col-md-12" style={{ marginBottom: 10 }}>
              <div
                className="col-md-12"
                style={{ backgroundColor: "#27568A", color: "white", paddingTop: 5 }}
              >
                <h3>Loan Request Information</h3>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="requestAmount" className="col-md-12">
                    Request Amount
                  </label>
                </div>
                <div className="col-md-12">
                  <input 
                  type={this.state.user_info.user_id == Details.user_id ? "number" : "float"}
                  // type="number"
                   className="form-control"
                    disabled={this.state.user_info.user_id  != Details.user_id}
                   onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={this.state.selectedRequestAmount}
                  onChange={this.handleRequestAmount}
                   />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="repaymentPeriod" className="col-md-12">
                    Repayment Period
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="number" className="form-control"
                    disabled={this.state.user_info.user_id  != Details.user_id}

                   onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={this.state.selectedRepaymentPeriod} 
                  onChange={this.handleRepaymentPeriod}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="installmentterm" className="col-md-12">
                    Installment Amount
                  </label>
                </div>
                <div className="col-md-12">
                  <input type={this.state.user_info.user_id == Details.user_id ? "number" : "float"} className="form-control" disabled value={this.state.InstallmentAmount} />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="loanPurpose" className="col-md-12">
                    Loan Purpose
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control"
                    disabled={this.state.user_info.user_id  != Details.user_id}

                   value={this.state.selectedLoanPurpose} onChange={this.handleLoanPurpose} />
                </div>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="withdrawLocation" className="col-md-12">
                    Withdraw Location
                  </label>
                </div>
                <div className="col-md-12">
                  {
                    this.state.user_info.user_id ==  Details.user_id ? <Select
                    styles={{
                      container: (base) => ({
                        ...base,
                        //   flex: 1
                        // width: 150,
                        // marginRight:10
                      }),
                      control: (base) => ({
                        ...base,
                        minHeight: "18px",
                      }),
                    }}
                    placeholder="Withdraw Location"
                    options={this.state.WithdrawLocationList}
                    onChange={this.handleWithdrawLocation}
                    value={this.state.selectedWithdrawLocation}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  /> : 
                  <input type="text" className="form-control" disabled value={this.state.selectedWithdrawLocation!=undefined && this.state.selectedWithdrawLocation!=null && this.state.selectedWithdrawLocation.label} />

                  }
                  
                </div>

              </div>
            </div>

           

            <div className="col-md-12" style={{ marginBottom: 10 }}>
              <div
                className="col-md-12"
                style={{ backgroundColor: "#27568A", color: "white", paddingTop: 5 }}
              >
                <h3>Attachment</h3>
              </div>
            </div>
            <div className="row">
              {
                Details.user_id == this.state.user_info.user_id ? 
                <>
                        <div className="form-group col-md-6">
                <div>
                  <label
                    htmlFor="attachment"
                    className="col-sm-12 custom-file-label"
                  >
                    Family Member Income Document
                  </label>
                </div>
                {
                  Details.user_id == this.state.user_info.user_id ? <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="family_income_attach_file"
                    multiple
                    onChange={this.familyIncomeDoc.bind(this)}
                  ></input>
                </div> : ''
                }
                
                <div>
                  {this.state.FamilyIncomeDoc.length > 0 && this.state.FamilyIncomeDoc.map((data, index) => (
                    <div className="fileuploader-items col-md-6">
                      <ul className="fileuploader-items-list">
                        <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                          <div className="columns">
                            <div className="column-thumbnail">
                              <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                <div
                                  className="fileuploader-item-icon"
                                  style={{ backgroundColor: "#3f4fd3" }}
                                >
                                  <i>{data.name.split(".")[1]}</i>
                                </div>
                              </div>
                              <span className="fileuploader-action-popup"></span>
                            </div>
                            <div className="column-title">
                              <span className="own-text">{data.name}</span>
                            </div>
                            
                                      <div className="column-actions">
                              <a
                                className="fileuploader-action fileuploader-action-remove"
                                onClick={(event) =>
                                  this.removeFamilyIncomeDoc(index, event)
                                }
                              >
                                {" "}
                                <i></i>
                              </a>
                            </div>
                             
                            
                            
                          </div>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group col-md-6">
                <div>
                  <label
                    htmlFor="attachment"
                    className="col-sm-12 custom-file-label"
                  >
                    Staff Guarantor NRC Document
                  </label>
                </div>
                {
                  Details.user_id == this.state.user_info.user_id ? <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="staff_guarantor_nrc_attach_file"
                    multiple
                    onChange={this.staffGuarantorNRCDoc.bind(this)}
                  ></input>
                </div> : ''
                }
                
                  <div>
                    {this.state.StaffGuarantorNRCDoc.length > 0 && this.state.StaffGuarantorNRCDoc.map((data, index) => (
                      <div className="fileuploader-items col-md-6">
                        <ul className="fileuploader-items-list">
                          <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                            <div className="columns">
                              <div className="column-thumbnail">
                                <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                  <div
                                    className="fileuploader-item-icon"
                                    style={{ backgroundColor: "#3f4fd3" }}
                                  >
                                    <i>{data.name.split(".")[1]}</i>
                                  </div>
                                </div>
                                <span className="fileuploader-action-popup"></span>
                              </div>
                              <div className="column-title">
                                <span className="own-text">{data.name}</span>
                              </div>
                              
                                          <div className="column-actions">
                                <a
                                  className="fileuploader-action fileuploader-action-remove"
                                  onClick={(event) =>
                                    this.removeStaffGuarantorNRCDoc(index, event)
                                  }
                                >
                                  {" "}
                                  <i></i>
                                </a>
                              </div>
                               
                              
                            </div>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
              </div>
              
              <div className="form-group col-md-6">
                <div>
                  <label
                    htmlFor="attachment"
                    className="col-sm-12 custom-file-label"
                  >
                    Requester NRC Document
                  </label>
                </div>
                {
                  this.state.user_info.user_id == Details.user_id ? <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="requester_nrc_attach_file"
                    multiple
                    onChange={this.RequesterNRCDoc.bind(this)}
                  ></input>
                </div> : ''
                }
                
                <div>
                  {this.state.RequestNRCDoc.length > 0 && this.state.RequestNRCDoc.map((data, index) => (
                    <div className="fileuploader-items col-md-6">
                      <ul className="fileuploader-items-list">
                        <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                          <div className="columns">
                            <div className="column-thumbnail">
                              <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                <div
                                  className="fileuploader-item-icon"
                                  style={{ backgroundColor: "#3f4fd3" }}
                                >
                                  <i>{data.name.split(".")[1]}</i>
                                </div>
                              </div>
                              <span className="fileuploader-action-popup"></span>
                            </div>
                            <div className="column-title">
                              <span className="own-text">{data.name}</span>
                            </div>
                            
                               <div className="column-actions">
                              <a
                                className="fileuploader-action fileuploader-action-remove"
                                onClick={(event) =>
                                  this.removeRequesterNRCDoc(index, event)
                                }
                              >
                                {" "}
                                <i></i>
                              </a>
                            </div>
                             
                           
                          </div>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group col-md-6">
                  <div>
                      <label
                      htmlFor="attachment"
                      className="col-sm-12 custom-file-label"
                      >
                      Family Guarantor NRC Document
                      </label>
                </div>
                
                  <div className="col-sm-10">
                    <input
                    className="dropZone "
                    type="file"
                    id="family_guarantor_nrc_attach_file"
                    multiple
                    onChange={this.familyGuarantorNRCDoc.bind(this)}
                    ></input>
                  </div> 
                  
                <div>
                {this.state.FamilyGuarantorNRCDoc.length > 0 && 
                this.state.FamilyGuarantorNRCDoc.map((data, index) => (
                  <div className="fileuploader-items col-md-6">
                    <ul className="fileuploader-items-list">
                      <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                        <div className="columns">
                          <div className="column-thumbnail">
                            <div className="fileuploader-item-image fileuploader-no-thumbnail">
                              <div
                                className="fileuploader-item-icon"
                                style={{ backgroundColor: "#3f4fd3" }}
                              >
                                <i>{data.name.split(".")[1]}</i>
                              </div>
                            </div>
                            <span className="fileuploader-action-popup"></span>
                          </div>
                          <div className="column-title">
                            <span className="own-text">{data.name}</span>
                          </div>
                          
                            <div className="column-actions">
                            <a
                              className="fileuploader-action fileuploader-action-remove"
                              onClick={(event) =>
                                this.removeFamilyGuarantorNRCDoc(index, event)
                              }
                            >
                              {" "}
                              <i></i>
                            </a>
                          </div>
                           
                          
                        </div>
                      </li>
                    </ul>
                  </div>
                      ))}
                  </div>
                </div>
                <div className="form-group col-md-6">
                <div>
                  <label
                    htmlFor="attachment"
                    className="col-sm-12 custom-file-label"
                  >
                    Other Attachment Files
                  </label>
                </div>
                {
                  Details.user_id == this.state.user_info.user_id ? <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="other_doc_attach_file"
                    multiple
                    onChange={this.OtherDoc.bind(this)}
                  ></input>
                </div> : ''
                }
                
                <div>
                  {this.state.OtherDoc.length > 0 && this.state.OtherDoc.map((data, index) => (
                    <div className="fileuploader-items col-md-6">
                      <ul className="fileuploader-items-list">
                        <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                          <div className="columns">
                            <div className="column-thumbnail">
                              <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                <div
                                  className="fileuploader-item-icon"
                                  style={{ backgroundColor: "#3f4fd3" }}
                                >
                                  <i>{data.name.split(".")[1]}</i>
                                </div>
                              </div>
                              <span className="fileuploader-action-popup"></span>
                            </div>
                            <div className="column-title">
                              <span className="own-text">{data.name}</span>
                            </div>
                            
                              <div className="column-actions">
                              <a
                                className="fileuploader-action fileuploader-action-remove"
                                onClick={(event) =>
                                  this.removeOtherDoc(index, event)
                                }
                              >
                                {" "}
                                <i></i>
                              </a>
                            </div>
                             
                            
                          </div>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
                </> : 
                <>
                             <div className="document-main">
                            {
                                this.state.FamilyIncomeDoc!=undefined && this.state.FamilyIncomeDoc.length > 0 ?
                                    <DocumentStaffLoan title="Family Income Document" doc={this.state.FamilyIncomeDoc} path='staff_loan_new' />
                                    : ''
                            }
                        </div>
                        <div className="document-main">
                            {
                                this.state.FamilyGuarantorNRCDoc!=undefined && this.state.FamilyGuarantorNRCDoc.length > 0 ?
                                    <DocumentStaffLoan title="Family Guarantor NRC Document" doc={this.state.FamilyGuarantorNRCDoc} path='staff_loan_new' />
                                    : ''
                            }
                        </div>
                        <div className="document-main">
                            {
                                this.state.OtherDoc!=undefined && this.state.OtherDoc.length > 0 ?
                                    <DocumentStaffLoan title="Other Document" doc={this.state.OtherDoc} path='staff_loan_new' />
                                    : ''
                            }
                        </div>
                        <div className="document-main">
                            {
                                this.state.StaffGuarantorNRCDoc!=undefined && this.state.StaffGuarantorNRCDoc.length > 0 ?
                                    <DocumentStaffLoan title="Staff Guarantor NRC Document" doc={this.state.StaffGuarantorNRCDoc} path='staff_loan_new' />
                                    : ''
                            }
                        </div>
                        <div className="document-main">
                            {
                                this.state.RequestNRCDoc!=undefined && this.state.RequestNRCDoc.length > 0 ?
                                    <DocumentStaffLoan title="Requester NRC Document" doc={this.state.RequestNRCDoc} path='staff_loan_new' />
                                    : ''
                            }
                        </div>
                </>
              }
              
            </div>
            {
              this.state.work_flow_status!=undefined && (this.state.work_flow_status.check_by ==1 || this.state.work_flow_status.verify_by == 1 || this.state.work_flow_status.approve_by == 1)  ? 
              <>
                    <div className="col-md-12" style={{ marginBottom: 10 }}>
              <div
                className="col-md-12"
                style={{ backgroundColor: "#27568A", color: "white", paddingTop: 5 }}
              >
                <h3>Recommendation Information</h3>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-6">
                <div>
                  <label htmlFor="requestAmount" className="col-md-12">
                    Target Achievement
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" 
                  disabled={Details.status !=0}  
                  value={this.state.targetAchievement}
                  onChange={this.handleTargetAchievement}
                   />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label htmlFor="repaymentPeriod" className="col-md-12">
                    Other Loan Information
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" disabled={Details.status != 0}   value={this.state.otherLoanInformation} 
                  onChange={this.handleOtherLoanInformation}
                  />
                </div>
              </div>

            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-6">
                <div>
                  <label htmlFor="requestAmount" className="col-md-12">
                    Performance Recommendation
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" disabled={Details.status != 0}   value={this.state.performanceRecomm}
                  onChange={this.handlePerformanceRecommendation}
                   />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label htmlFor="repaymentPeriod" className="col-md-12">
                    Comment
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" disabled={Details.status != 0}  value={this.state.check_comment} 
                  onChange={this.handleComment}
                  />
                </div>
              </div>

            </div>
              </> : ''
            }
            {
              this.state.work_flow_status !=undefined && (this.state.work_flow_status.verify_by == 1 || this.state.work_flow_status.approve_by == 1) 
               ? 
               <>
                  <div className="col-md-12" style={{ marginBottom: 10 }}>
              <div
                className="col-md-12"
                style={{ backgroundColor: "#27568A", color: "white", paddingTop: 5 }}
              >
                <h3>Verfiy Information</h3>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-6">
                <div>
                  <label htmlFor="requestAmount" className="col-md-12">
                    Verify
                  </label>
                </div>
                <div className="col-md-12">
                  <textarea type="text" className="form-control"
                   disabled={Details.status != 1}  
                    value={this.state.verify}
                  onChange={this.handleVerify}
                   />
                </div>
              </div>
              

            </div>
               </> : ''
            }
            {
              this.state.work_flow_status !=undefined && this.state.work_flow_status.approve_by == 1 
              ? 
              <>
                    <div className="col-md-12" style={{ marginBottom: 10 }}>
              <div
                className="col-md-12"
                style={{ backgroundColor: "#27568A", color: "white", paddingTop: 5 }}
              >
                <h3>Approve Information</h3>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-6">
                <div>
                  <label htmlFor="requestAmount" className="col-md-12">
                    Disbursement Date
                  </label>
                </div>
                <div className="col-md-12">
                  {
                    Details.status == 2 ? <DatePicker
                  className="checkValidate"
                  timeFormat={false}
                 
                  value={moment(this.state.selectedDisbursementDate).format('DD/MM/YYYY')}
                  onChange={this.handleDisbursementDate}
                /> :
                <input type="text" className="form-control" value={moment(this.state.selectedDisbursementDate).format('DD/MM/YYYY')} disabled />
                  }
                
                  {/* <DatePicker
                    className="checkValidate"
                    timeFormat={false}
                    value={this.state.selectedDisbursementDate}
                    
                    onChange={this.handleDisbursementDate}
                  /> */}
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label htmlFor="repaymentPeriod" className="col-md-12">
                    Term in Months
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="number" className="form-control"  value={this.state.selectedTermInMonths} disabled={Details.status != 2} onChange={this.handleTermInMonths}/>
                  {/* <DatePicker
                    className="checkValidate"
                    timeFormat={false}
                    value={moment(this.state.selectedTermInMonths).format('DD/MM/YYYY')}
                    
                    onChange={this.handleTermInMonths}
                  /> */}
                </div>
              </div>

            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-6">
                <div>
                  <label htmlFor="requestAmount" className="col-md-12">
                  Loan Committee Date
                  </label>
                </div>
                <div className="col-md-12">
                  {
                    Details.status == 2 ? 
                    <DatePicker
                    className="checkValidate"
                    timeFormat={false}
                    value={moment(this.state.selectedLoanCommitteeDate).format('DD/MM/YYYY')}
                   
                    // dateFormat="DD/MM/YYYY"
                    onChange={this.handleLoanCommitteeDate}
                  /> : 
                  <input type="text" className="form-control" value={moment(this.state.selectedLoanCommitteeDate).format('DD/MM/YYYY')} disabled/>
                  }
                  
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label htmlFor="repaymentPeriod" className="col-md-12">
                    Installment Amount
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="number" className="form-control" disabled={Details.status !=2} onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={this.state.selectedVerifyInstallmentAmount} 
                  onChange={this.handleVerifyInstallmentAmount}
                  />
                </div>
              </div>

            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-6">
                <div>
                  <label htmlFor="requestAmount" className="col-md-12">
                    Approve Amount
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="number" className="form-control" disabled={Details.status !=2 } value={this.state.ApproveAmount}
                  onChange={this.handleApproveAmount}
                   />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label htmlFor="repaymentPeriod" className="col-md-12">
                    Comment
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" disabled={Details.status !=2} value={this.state.verifyComment} 
                  onChange={this.handleVerifyComment}
                  />
                </div>
              </div>

            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-6">
                <div>
                  <label htmlFor="requestAmount" className="col-md-12">
                    Approve Amount(In Word)
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" disabled  value={this.state.ApproveAmountInWord}
                  // onChange={this.handleApproveAmountInWord}
                   />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label htmlFor="repaymentPeriod" className="col-md-12">
                    Warning letter Check
                  </label>
                </div>
                <div className="col-md-12">
                <input
                    type="checkbox"
                    value='1'
                    checked={this.state.warningCheck == 1 ? 'checked':''}
                    disabled={Details.status !=2}
                    onChange={this.handleSelectWaringCheck}
                  />
                </div>
              </div>

            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-6">
              </div>
              <div className="col-md-6">
                <div>
                  <label htmlFor="repaymentPeriod" className="col-md-12">
                    Attachment
                  </label>
                </div>
                <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="attachment"
                    multiple
                    disabled={Details.status !=2}
                    onChange={this.verifyAttachment.bind(this)}
                  ></input>
                </div>
                <div>
                  {this.state.verifyDoc.map((data, index) => (
                    <div className="fileuploader-items col-md-6">
                      <ul className="fileuploader-items-list">
                        <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                          <div className="columns">
                            <div className="column-thumbnail">
                              <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                <div
                                  className="fileuploader-item-icon"
                                  style={{ backgroundColor: "#3f4fd3" }}
                                >
                                  <i>{data.name.split(".")[1]}</i>
                                </div>
                              </div>
                              <span className="fileuploader-action-popup"></span>
                            </div>
                            <div className="column-title">
                              <span className="own-text">{data.name}</span>
                            </div>
                            <div className="column-actions">
                              <a
                                className="fileuploader-action fileuploader-action-remove"
                                onClick={(event) =>
                                  this.removeVerifyDoc(index, event)
                                }
                              >
                                {" "}
                                <i></i>
                              </a>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

            </div>
              </> : ''
            }
            
            
          </form>
        </div>
        {/* <div className="row save-btn">
          <div className="float-right">
            <div>
              <button
                className="btn btn-primary"
                id="saving_button"
                type="button"
                onClick={()=>this.save(this.state.RequestNRCDoc)}
              >
                Save
              </button>
            </div>
          </div>
        </div> */}
        <div className="row save-btn">
                    {/* {
                        havePermission(this.state.work_flow_status) && Details.status !=5 ?
                            <StaffLoanApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={Details.status} work_flow={this.state.work_flow_status} />
                            :
                            <div className="col-md-12 btn-rightend">
                                { Details.status == 5 && Details.user_id == this.state.user_info.user_id ?
                                    <div>
                                        <button onClick={()=>this.save()} className="btn btn-primary" id="saving_button" type="button">Confirm</button>
                                    </div>
                                    :
                                    ''
                                }
                                
                            </div>
                    } */}
                    
                      
                      { Details.status == 5 && Details.user_id == this.state.user_info.user_id ?
                        <div className="col-md-12 btn-rightend">
                          <div>
                              <button onClick={()=>this.save()} className="btn btn-primary" id="saving_button" type="button">Confirm</button>
                          </div>
                          </div>
                          :
                          havePermission(this.state.work_flow_status,Details.user_id) && Details.status !=5 ?
                            <StaffLoanApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={Details.status} work_flow={this.state.work_flow_status} />
                            : ''
                      }
                      
                  
                    
                </div>
      </div>
    );
  }
}

export default StaffLoanEdit;

