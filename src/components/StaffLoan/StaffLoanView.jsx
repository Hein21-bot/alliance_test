import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import $ from "jquery";
import {
  main_url,
  getCookieData,
  validate,
  getUserId,
  alertText,
  stopSaving,
  startSaving,
  getBranch
} from "../../utils/CommonFunction";
import Select from "react-select";
import DatePicker from "react-datetime";
import moment from "moment";
import ApprovalInformation from "../Common/ApprovalInformation";
import DocumentStaffLoan from "../Common/DocumentStaffLoan";

var form_validate = true;
var saveBtn = false;


class StaffLoanView extends Component {
  constructor() {
    super();
    this.state = {
      // status_info:[],
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

      dataSource:[],
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
    comment:'',
    verify:'',
    warningCheck:0,
    selectedDisbursementDate:new Date(),
    selectedTermInMonths:new Date(),
    selectedLoanCommitteeDate:new Date(),
    ApproveAmount:0,
    ApproveAmountInWord:'',
    verifyComment:'',
    verifyDoc:[],
    staffInfoDetails:[],
    selectedVerifyInstallmentAmount:0
    };
  }

  componentDidUpdate() {
    if (!form_validate) validate("check_form");
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
    let otherLoanDetils=await (this.state.staffInfoDetails.length != 0 && this.state.staffInfoDetails.detailsData != undefined && this.state.staffInfoDetails.detailsData.length > 0 && this.state.staffInfoDetails.detailsData)
    console.log("otherLoanDetails",otherLoanDetils)
    let familyDoc=Document.length > 0 && Document.filter(v=>v.fieldName == "familyDOC")
    console.log("family doc in component",familyDoc)
    let familyNRC=Document.length > 0 && Document.filter(v=>v.fieldName == "familyGuaNRC")
    let requesterNRC=Document.length > 0 && Document.filter(v=>v.fieldName == "requesterNRC")
    let otherDoc= Document.length > 0 && Document.filter(v=>v.fieldName == "otherDOC")
    let staffNRC=Document.length > 0 && Document.filter(v=>v.fieldName == "staffNRC")
    let approveAttach=Document.length > 0 && Document.filter(v=>v.fieldName == "approveAttach")

    let relationFamily=this.state.familyRelation.filter(v=>v.value == Details.relation_family)
      await fetch(`${main_url}staff_loan_new/getGuarantorInfo`)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {

        this.setState({
          getGuarantorInfo: list,
          selectedGuarantor:list.filter(v=>v.value == Details.staff_guarantor_id).length > 0 &&  list.filter(v=>v.value == Details.staff_guarantor_id)[0]
        })
      })
      await fetch(`${main_url}staff_loan_new/getOneDetailInfo/${this.props.dataSource.staff_loan_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    status_info: res
                })
            })
            .catch(error => console.log(error))
    
      let filterWithdraw=this.state.WithdrawLocationList.filter(v=>v.value == Details.withdraw_location).length > 0 && this.state.WithdrawLocationList.filter(v=>v.value == Details.withdraw_location)[0]
      this.setState({
        selectedFamilyName:Details.family_guarantor_name,
        selectedFamilyIncome:Details.family_guarantor_income_info,
        selectedFamilyAddress:Details.family_guarantor_address,
        selectedFamilyJob:Details.family_guarantor_job,
        selectedFamilyNRC:Details.family_guarantor_nrc,
        selectedFamilyPhone:Details.family_guarantor_phone,
        selectedRequestAmount:Details.requested_amount,
        selectedRepaymentPeriod:Details.repayment_period,
        InstallmentAmount:Details.installment_amount,
        selectedWithdrawLocation:filterWithdraw,
        FamilyIncomeDoc:familyDoc,
        StaffGuarantorNRCDoc:staffNRC,
        OtherDoc:otherDoc,
        selectedLoanPurpose:Details.loan_purpose,
        RequestNRCDoc:requesterNRC,
        FamilyGuarantorNRCDoc:familyNRC,
        dataSource:otherLoanDetils,
        selectedFamilyRelation:relationFamily,
        targetAchievement:Details.target_achievement,
        otherLoanInformation:Details.other_loan_information,
        performanceRecomm:Details.performance_recommendation,
        check_comment:Details.checked_comment,
        verify:Details.verified_comment,
        selectedDisbursementDate:Details.disbursement_date,
        selectedTermInMonths:Details.term_in_month,
        selectedLoanCommitteeDate:Details.loan_committee_date,
        selectedVerifyInstallmentAmount:Details.approve_installment_amount,
        ApproveAmount:Details.approved_amount,
        verifyComment:Details.approved_comment,
        ApproveAmountInWord:Details.approved_amount_words,
        warningCheck:Details.warning_letter_check,
        verifyDoc:approveAttach

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
      let newData = that.state.dataSource;
      let editData = newData[data];
      console.log("edit data===>",editData)
      newData.splice(data, 1);

      let filterOtherLoan=that.state.OtherLoanList.filter(v=>v.value == editData.other_loan_dropdown)
      // console.log("other loan list",this.state.OtherLoanList)

      that.setState(
        {
          dataSource: newData,
          selectedOtherLoan:filterOtherLoan, 
          selectedOutstandingAmount:editData.outstanding_amount,
          selectedInstallmentAmount:editData.installment_amount,    

          selectedInstallmentTerm:editData.installment_term,    

          selectedMaturityDate:editData.maturity_date,    

          selectedInstitutionName:editData.name_of_institution,
          OtherLoanSelectBox:editData.other_loan_check    

        },
        () => that.setDataTable(newData)
      );
    });
    $(document).on("click", "#toRemove", function () {
      var data = $(this).find("#remove").text();
      data = $.parseJSON(data);

      let newData = that.state.dataSource;
      newData.splice(data, 1);
      that.setState(
        {
          dataSource: newData,
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
      this.setState({
        selectedRequestAmount:e.target.value,
        InstallmentAmount:tempAmount
      })
    }
    
  }
  handleRepaymentPeriod=(e)=>{
    const tempAmount=this.state.selectedRequestAmount / e.target.value
    this.setState({
      selectedRepaymentPeriod:e.target.value,
      InstallmentAmount:tempAmount
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
    this.setDataTable(this.state.dataSource)
  }
  addData = (e) => {
    const { userInfo } = this.state;
    console.log("other loan select box",this.state.OtherLoanSelectBox)
    var data = [...this.state.dataSource];
    // console.log("data",data)
    console.log("data======>",data)
    let tempData = {};
    if (this.state.OtherLoanSelectBox == 1 && this.state.selectedOtherLoan !=null && this.state.selectedInstitutionName != '' &&
    this.state.selectedOutstandingAmount != 0 && this.state.selectedInstallmentTerm != 0 && this.state.selectedInstallmentAmount!=0
    ) 
    {
      console.log("1")
     
      tempData.other_loan_dropdown=this.state.selectedOtherLoan;
      tempData.name_of_institution=this.state.selectedInstitutionName;
      tempData.outstanding_amount=this.state.selectedOutstandingAmount;
      tempData.installment_term=this.state.selectedInstallmentTerm;
      tempData.installment_amount=this.state.selectedInstallmentAmount;
      tempData.maturity_date=this.state.selectedMaturityDate;
      tempData.other_loan_check=this.state.OtherLoanSelectBox;
      console.log(' select 1 tempData',tempData)
      data.push(tempData);
      this.setState({
        dataSource: data,
        selectedOtherLoan:null,
        selectedInstitutionName:'',
        selectedOutstandingAmount:0,
        selectedInstallmentTerm:0,
        selectedInstallmentAmount:0,
        selectedMaturityDate:new Date(),
        OtherLoanSelectBox:0
      });
      saveBtn = true;
      form_validate = true;
      this.setDataTable(data);
    }else if (this.state.OtherLoanSelectBox == 0 && (this.state.selectedOtherLoan !=null || this.state.selectedInstitutionName ||
      this.state.selectedOutstandingAmount != 0 || this.state.selectedInstallmentTerm != 0 || this.state.selectedInstallmentAmount)
      ) 
    { console.log("0")
        
        
        tempData.other_loan_dropdown=this.state.selectedOtherLoan;
        tempData.name_of_institution=this.state.selectedInstitutionName;
        tempData.outstanding_amount=this.state.selectedOutstandingAmount;
        tempData.installment_term=this.state.selectedInstallmentTerm;
        tempData.installment_amount=this.state.selectedInstallmentAmount;
        tempData.maturity_date=this.state.selectedMaturityDate;
        tempData.other_loan_checkbox=this.state.OtherLoanSelectBox;

        console.log('select 0 tempData',tempData)
        data.push(tempData);
        this.setState({
          dataSource: data,
          selectedOtherLoan:null,
          selectedInstitutionName:'',
          electedOutstandingAmount:0,
          selectedInstallmentTerm:0,
          selectedInstallmentAmount:0,
          selectedMaturityDate:new Date(),
          OtherLoanSelectBox:0
        });
      saveBtn = true;
      form_validate = true;
      this.setDataTable(data);

    }else{
      toast.error("Some Field is Empty", {
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
    console.log("data===>",data)
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
        outstanding_amount: data[i].outstanding_amount ? data[i].outstanding_amount : 0,
        institution_name: data[i].name_of_institution ? data[i].name_of_institution : "-",
        installment_amount: data[i].installment_amount ? data[i].installment_amount : 0,
        maturity_date:data[i].maturity_date ? moment(data[i].maturity_date).format('YYYY-MM-DD') : '-',
        // action:
        //   '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden">'+
        //   index +
        //   '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' +
        //   '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toRemove" ><span id="remove" class="hidden">'+
        //   index +
        //   '</span>  <i className="fa fa-cogs"></i>&nbsp;Remove</button>',
      };
      l.push(obj);
    }
    table = $("#dataTables-Table").DataTable({
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
        // { title:'Action',data:'action'}
      ],
    });
  }

  familyIncomeDoc(e) {
    var files = document.getElementById("family_income_attach_file").files;

    if (files.length > 2) {
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

    if (files.length > 2) {
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

    if (files.length > 2) {
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

    if (files.length > 2) {
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

    if (files.length > 2) {
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
        comment:e.target.value
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
        selectedTermInMonths:e
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
    this.setState({
        ApproveAmount:e.target.value
    })
  }
  handleVerifyComment=(e)=>{
    this.setState({
        verifyComment:e.target.value
    })
  }
  handleApproveAmountInWord=(e)=>{
    this.setState({
        ApproveAmountInWord:e.target.value
    })
  }
  handleSelectWaringCheck=(e)=>{
    this.setState({
        selectedDisbursementDate:e
    })
  }
  verifyAttachment=()=>{
    var files = document.getElementById("attachment").files;

    if (files.length > 2) {
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
 

  

  save(RequestNRCDoc) {
    console.log("save======>",this.state.FamilyGuarantorNRCDoc,this.state.FamilyIncomeDoc,this.state.StaffGuarantorNRCDoc,RequestNRCDoc)
    // if (this.state.FamilyGuarantorNRCDoc.length == 0 && this.state.FamilyIncomeDoc.length == 0 && this.state.StaffGuarantorNRCDoc.length == 0 && this.state.RequestNRCDoc.length == 0) {
    //   toast.error("Please Choose Attachment File!");
    // } else {
      if (this.state.FamilyGuarantorNRCDoc.length > 0 && this.state.FamilyIncomeDoc.length > 0 && this.state.StaffGuarantorNRCDoc.length > 0 && RequestNRCDoc.length > 0) {
        console.log("save new doc");
        $("#saving_button").attr("disabled", true);
        var data = {
          userId: this.state.user_info.user_id,
          staffGuarantorUserId:this.state.selectedGuarantor!=null ? this.state.selectedGuarantor.value : '',
          familyGuarantorName:this.state.selectedFamilyName,
          familyGuarantorNRC:this.state.selectedFamilyNRC,
          familyRelation:this.state.selectedFamilyRelation.value,
          familyGuarantorJob:this.state.selectedFamilyJob,
          familyGuarantorAddres:this.state.selectedFamilyAddress,
          familyGuarantorIncome:this.state.selectedFamilyIncome,
          familyGuarantorPhone:this.state.selectedFamilyPhone,
          requestAmount:this.state.selectedRequestAmount,
          repaymentPeriod:this.state.selectedRepaymentPeriod,
          loanRequestInstallmentAmount:this.state.InstallmentAmount,
          loanPurpose:this.state.selectedLoanPurpose,
          withdrawLocation:this.state.selectedWithdrawLocation.value,
          status: this.state.status,
          createdBy: this.state.user_info.user_id,
          // updatedBy: this.state.updatedBy,
        };
        const temp=this.state.dataSource.map((v)=>{
          return{
            nameOfInstitution:v.name_of_institution,
            outstandingAmount:v.outstanding_amount,
            installmentTerm:v.installment_term,
            installmentAmount:v.installment_amount,
            maturityDate:v.maturity_date,
            otherLoan:v.other_loan_dropdown,
            otherLoanCheck:v.other_loan_checkbox
          }
        })

        const formdata = new FormData();
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
        formdata.append("oldFamilyGuaDoc ", JSON.stringify(FamilyNRCold));
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
    // }
  }

  render() {
    console.log("info=======>",this.state.staffInfoDetails)
    const{staffInfo,getGuarantorInfo}=this.state;
    const Details=this.state.staffInfoDetails.length != 0 && this.state.staffInfoDetails.mainData != undefined && this.state.staffInfoDetails.mainData.length > 0 && this.state.staffInfoDetails.mainData[0]
    console.log("details=====>",Details)
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
                    value={staffInfo.length > 0 ? staffInfo[0].customer_code : ''}
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
                    type="text"
                    className="form-control"
                    disabled
                    value={staffInfo.length > 0 ?  staffInfo[0].basic_salary : ''}
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
                  <input type="text" className="form-control" disabled value={this.state.selectedGuarantor!=undefined && this.state.selectedGuarantor.label} />
                  {/* <Select
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
                  /> */}
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
                    disabled
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
                    disabled
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
                  {/* <Select
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
                  /> */}
                  <input type="text" className="form-control" disabled value={this.state.selectedFamilyRelation!=undefined && this.state.selectedFamilyRelation.label} />
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
                    disabled
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
                    disabled
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
                    type="number"
                    className="form-control"
                    disabled
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
                    disabled
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
            {/* <div className="row" style={{ marginBottom: 10 }}>
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
                    checked={this.state.OtherLoanSelectBox == 1 ? 'checked':''}
                    onChange={this.handleSelectBoxOtherLoan}
                  />
                </div>
              </div>
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
            </div> */}
            <div className="row" style={{ marginBottom: 10 }}>
              {/* <div className="col-md-3">
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
                <button
                  className="btn btn-primary"
                  id="add_button"
                  type="button"
                  onClick={this.addData}
                >
                  Add
                </button>
              </div> */}
              <div className="col-md-12">
                <table
                  width="99%"
                  className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                  id="dataTables-Table"
                />
              </div>
            </div>
            
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
                  <input type="number" className="form-control" disabled onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={this.state.selectedRequestAmount}
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
                  <input type="number" className="form-control" disabled onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={this.state.selectedRepaymentPeriod} 
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
                  <input type="text" className="form-control" disabled value={this.state.InstallmentAmount} />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="loanPurpose" className="col-md-12">
                    Loan Purpose
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" disabled value={this.state.selectedLoanPurpose} onChange={this.handleLoanPurpose} />
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
                  {/* <Select
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
                  /> */}
                  <input type="text" className="form-control" disabled value={this.state.selectedWithdrawLocation!=undefined && this.state.selectedWithdrawLocation.label} />
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
            <div className="row document-main">
                            {
                                this.state.FamilyIncomeDoc!=undefined && this.state.FamilyIncomeDoc.length > 0 ?
                                    <DocumentStaffLoan title="Family Income Document" doc={this.state.FamilyIncomeDoc} path='staff_loan_new' />
                                    : ''
                            }
                        </div>
                        <div className="row document-main">
                            {
                                this.state.FamilyGuarantorNRCDoc!=undefined && this.state.FamilyGuarantorNRCDoc.length > 0 ?
                                    <DocumentStaffLoan title="Family Guarantor NRC Document" doc={this.state.FamilyGuarantorNRCDoc} path='staff_loan_new' />
                                    : ''
                            }
                        </div>
                        <div className="row document-main">
                            {
                                this.state.OtherDoc!=undefined && this.state.OtherDoc.length > 0 ?
                                    <DocumentStaffLoan title="Other Document" doc={this.state.OtherDoc} path='staff_loan_new' />
                                    : ''
                            }
                        </div>
                        <div className="row document-main">
                            {
                                this.state.StaffGuarantorNRCDoc!=undefined && this.state.StaffGuarantorNRCDoc.length > 0 ?
                                    <DocumentStaffLoan title="Staff Guarantor NRC Document" doc={this.state.StaffGuarantorNRCDoc} path='staff_loan_new' />
                                    : ''
                            }
                        </div>
                        <div className="row document-main">
                            {
                                this.state.RequestNRCDoc!=undefined && this.state.RequestNRCDoc.length > 0 ?
                                    <DocumentStaffLoan title="Requester NRC Document" doc={this.state.RequestNRCDoc} path='staff_loan_new' />
                                    : ''
                            }
                        </div>
            {/* <div className="row">
              <div className="form-group col-md-6">
                <div>
                  <label
                    htmlFor="attachment"
                    className="col-sm-12 custom-file-label"
                  >
                    Family Member Income Document
                  </label>
                </div>
                
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
                          
                        </div>
                      </li>
                    </ul>
                  </div>
                      ))}
                  </div>
                </div>
            </div> */}
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
                  <input type="number" className="form-control" disabled  value={this.state.targetAchievement}
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
                  <input type="number" className="form-control" disabled value={this.state.otherLoanInformation} 
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
                  <input type="number" className="form-control" disabled  value={this.state.performanceRecomm}
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
                  <input type="text" className="form-control" disabled value={this.state.comment} 
                  onChange={this.handleComment}
                  />
                </div>
              </div>

            </div>
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
                  <textarea type="text" className="form-control" disabled value={this.state.verify}
                  onChange={this.handleVerify}
                   />
                </div>
              </div>
              

            </div>
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
                  {/* <DatePicker
                    className="checkValidate"
                    timeFormat={false}
                    value={this.state.selectedDisbursementDate}
                    dateFormat="DD/MM/YYYY"
                    onChange={this.handleDisbursementDate}
                  /> */}
                  <input type="text" className="form-control" disabled value={moment(this.state.selectedDisbursementDate).format('YYYY-MM-DD')} />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label htmlFor="repaymentPeriod" className="col-md-12">
                    Term in Months
                  </label>
                </div>
                <div className="col-md-12">
                  {/* <DatePicker
                    className="checkValidate"
                    timeFormat={false}
                    value={this.state.selectedTermInMonths}
                    dateFormat="DD/MM/YYYY"
                    onChange={this.handleTermInMonths}
                  /> */}
                  <input type="text" className="form-control" disabled value={moment(this.state.selectedTermInMonths).format('YYYY-MM-DD')} />
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
                  {/* <DatePicker
                    className="checkValidate"
                    timeFormat={false}
                    value={this.state.selectedLoanCommitteeDate}
                    dateFormat="DD/MM/YYYY"
                    onChange={this.handleLoanCommitteeDate}
                  /> */}
                  <input type="text" className="form-control" disabled value={moment(this.state.selectedLoanCommitteeDate).format('YYYY-MM-DD')} />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label htmlFor="repaymentPeriod" className="col-md-12">
                    Installment Amount
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" disabled value={this.state.selectedVerifyInstallmentAmount} 
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
                  <input type="number" className="form-control" disabled value={this.state.ApproveAmount}
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
                  <input type="text" className="form-control" disabled value={this.state.verifyComment} 
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
                  <input type="text" className="form-control" disabled value={this.state.ApproveAmountInWord}
                  onChange={this.handleApproveAmountInWord}
                   />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label htmlFor="repaymentPeriod" className="col-md-12">
                    Waring letter Check
                  </label>
                </div>
                <div className="col-md-12">
                <input
                    type="checkbox"
                    value='1'
                    checked={this.state.warningCheck == 1 ? 'checked':''}
                    onChange={this.handleSelectWaringCheck}
                    disabled
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
                {/* <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="attachment"
                    multiple
                    onChange={this.verifyAttachment.bind(this)}
                  ></input>
                </div> */}
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
                            {/* <div className="column-actions">
                              <a
                                className="fileuploader-action fileuploader-action-remove"
                                onClick={(event) =>
                                  this.removeVerifyDoc(index, event)
                                }
                              >
                                {" "}
                                <i></i>
                              </a>
                            </div> */}
                          </div>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

            </div>
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
        {
                            !Array.isArray(this.state.status_info) ?

                                <div className="row approval-main margin-top-20">
                                    <ApprovalInformation status={this.state.status_info} />
                                </div>
                                : ''
                        }
      </div>
    );
  }
}

export default StaffLoanView;

