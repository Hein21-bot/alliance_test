import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import $ from "jquery";
import Rodal from 'rodal';

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

var form_validate = true;
var saveBtn = false;


class StaffLoanAddNew extends Component {
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
    selectedFamilyPhone:0,
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
    visible:true,
    staff_loan_visible:false
    };
  }

  componentDidUpdate() {
    if (!form_validate) validate("check_form");
  }

  async componentDidMount() {
    // let id=this.state.user_info!=undefined && this.state.user_info
    let user_info= await getCookieData("user_info")
    console.log(user_info)
    await fetch(`${main_url}staff_loan_new/getStaffUserInfo/${user_info!=null && user_info.user_id}`)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this.setState({
          staffInfo: list
        })
      })
    await fetch(`${main_url}staff_loan_new/getGuarantorInfo`)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        let filterGuarantor=list.filter(v=>v.value != this.state.user_info.user_id)
        console.log("filter guarantor",filterGuarantor)
        this.setState({
          getGuarantorInfo: filterGuarantor
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

    let that=this;
    $(document).on("click", "#toEdit", function () {
      var data = $(this).find("#edit").text();
      data = $.parseJSON(data);
      let newData = that.state.dataSource;
      let editData = newData[data];
      console.log("edit data===>",editData)
      newData.splice(data, 1);
      that.setState(
        {
          dataSource: newData,
          selectedOtherLoan:that.state.OtherLoanList.filter(v=>v.value == editData.other_loan)[0],
          selectedOutstandingAmount:editData.outstanding_amount,
          selectedInstallmentAmount:editData.installment_amount,    

          selectedInstallmentTerm:editData.installment_term,    

          selectedMaturityDate:editData.maturity_date,    

          selectedInstitutionName:editData.institution_name,
          OtherLoanSelectBox:editData.other_loan_selectbox    

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
  hide() {
    this.setState({ visible: false });
    window.location.reload()
}
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
        selectedFamilyIncome: e.target.value
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
    if(this.state.selectedRepaymentPeriod == 0 || this.state.selectedRepaymentPeriod == ''){
      console.log("if request amount")
      this.setState({
        selectedRequestAmount:e.target.value,
        InstallmentAmount:e.target.value
  
      })
    }else{
      const tempAmount= e.target.value / this.state.selectedRepaymentPeriod
      console.log("else request amount")
      this.setState({
        selectedRequestAmount:e.target.value,
        InstallmentAmount:tempAmount.toFixed(0)
      })
    }
    
  }
  
  handleRepaymentPeriod=(e)=>{
    const tempData=(e.target.value == 0 || e.target.value == '') ? 1 : e.target.value
    const tempAmount=this.state.selectedRequestAmount / tempData
    console.log("repayment period")
    this.setState({
      selectedRepaymentPeriod:e.target.value,
      InstallmentAmount:tempAmount.toFixed(0)
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
  addData = (e) => {
    const { userInfo } = this.state;
    console.log("other loan select box",this.state.OtherLoanSelectBox)
    var data = [...this.state.dataSource];
    let filterData=data.filter(v=>v.other_loan == this.state.selectedOtherLoan!=undefined && this.state.selectedOtherLoan!=null && this.state.selectedOtherLoan.value)
    console.log("data",data)
    let tempData = {};
    if (this.state.OtherLoanSelectBox == 1 && this.state.selectedOtherLoan !=null && this.state.selectedInstitutionName != '' &&
    this.state.selectedOutstandingAmount != 0 && this.state.selectedInstallmentTerm != 0 && this.state.selectedInstallmentAmount!=0
    && filterData.length == 0
    ) 
    {
      console.log("1")
     
      tempData.other_loan=this.state.selectedOtherLoan.value;
      tempData.institution_name=this.state.selectedInstitutionName;
      tempData.outstanding_amount=this.state.selectedOutstandingAmount;
      tempData.installment_term=this.state.selectedInstallmentTerm;
      tempData.installment_amount=this.state.selectedInstallmentAmount;
      tempData.maturity_date=this.state.selectedMaturityDate;
      tempData.other_loan_selectbox=this.state.OtherLoanSelectBox;
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
        // OtherLoanSelectBox:0
      });
      saveBtn = true;
      form_validate = true;
      this.setDataTable(data);
    }else if (filterData.length == 0 && this.state.OtherLoanSelectBox == 0 && (this.state.selectedOtherLoan !=null || this.state.selectedInstitutionName ||
      this.state.selectedOutstandingAmount != 0 || this.state.selectedInstallmentTerm != 0 || this.state.selectedInstallmentAmount)
      ) 
    { console.log("0")
        
        
        tempData.other_loan=this.state.selectedOtherLoan.value;
        tempData.institution_name=this.state.selectedInstitutionName;
        tempData.outstanding_amount=this.state.selectedOutstandingAmount;
        tempData.installment_term=this.state.selectedInstallmentTerm;
        tempData.installment_amount=this.state.selectedInstallmentAmount;
        tempData.maturity_date=this.state.selectedMaturityDate;
        tempData.other_loan_selectbox=this.state.OtherLoanSelectBox;

        console.log('select 0 tempData',tempData)
        data.push(tempData);
        this.setState({
          dataSource: data,
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
      console.log("other loan table",data[i])
      const result = data[i];
      const obj = {
        no: index + 1,
        // other_loan: data[i].other_loan != null
        //   ? data[i].other_loan.value == 1 ? "Personal Loan"
        //   : "-",
        other_loan:data[i].other_loan && data[i].other_loan == 1 ? 'Personal Loan' : data[i].other_loan && data[i].other_loan == 2 ? 'Collateral Loan' : 'Other Outstanding debts' ,
        installment_term: data[i].installment_term ? data[i].installment_term : 0,
        outstanding_amount: data[i].outstanding_amount ? data[i].outstanding_amount : 0,
        institution_name: data[i].institution_name ? data[i].institution_name : "-",
        installment_amount: data[i].installment_amount ? data[i].installment_amount : 0,
        maturity_date:data[i].maturity_date ? moment(data[i].maturity_date).format('YYYY-MM-DD') : '-',
        action:
          '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden">'+
          index +
          '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' +
          '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toRemove" ><span id="remove" class="hidden">'+
          index +
          '</span>  <i className="fa fa-cogs"></i>&nbsp;Remove</button>',
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
      // attachment: attachment
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

  save() {
    console.log("new doc", this.state.newDoc);
    console.log("doc", this.state.selectedFamilyRelation == null , this.state.selectedFamilyName == '',this.state.selectedFamilyNRC=='', this.state.selectedFamilyAddress == '',this.state.selectedFamilyIncome==0,this.state.selectedFamilyJob == '',this.state.selectedFamilyPhone ==0,this.state.selectedLoanPurpose == '',this.state.selectedWithdrawLocation ==null || this.state.selectedGuarantor ==null,(this.state.OtherLoanSelectBox == 1 && this.state.dataSource.length == 0));
    if (this.state.FamilyGuarantorNRCDoc.length == 0 || this.state.FamilyIncomeDoc.length == 0 || this.state.StaffGuarantorNRCDoc.length == 0 || this.state.RequestNRCDoc.length == 0) {
      toast.error("Please Choose Attachment File");
    } else if(this.state.selectedFamilyRelation == null || this.state.selectedFamilyName == '' || this.state.selectedFamilyNRC=='' || this.state.selectedFamilyAddress == '' || this.state.selectedFamilyIncome==0 || this.state.selectedFamilyJob == '' || this.state.selectedFamilyPhone ==0 || this.state.selectedLoanPurpose == '' || this.state.selectedWithdrawLocation ==null || this.state.selectedGuarantor ==null || (this.state.OtherLoanSelectBox == 1 && this.state.dataSource.length == 0)){
      toast.error("You need to fill your information successfully");
    }
    else {
      if (this.state.FamilyGuarantorNRCDoc.length > 0 && this.state.FamilyIncomeDoc.length > 0 && this.state.StaffGuarantorNRCDoc.length > 0 && this.state.RequestNRCDoc.length > 0 && this.state.selectedFamilyRelation != null && this.state.selectedFamilyName != '' && this.state.selectedFamilyNRC!='' && this.state.selectedFamilyAddress != '' && this.state.selectedFamilyIncome!=0 && this.state.selectedFamilyJob != '' && this.state.selectedFamilyPhone !=0 && this.state.selectedWithdrawLocation !=null && this.state.selectedLoanPurpose != '' && this.state.selectedGuarantor !=null ) {
        console.log("save new doc", this.state.newDoc);
        
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
          otherLoanCheck:this.state.OtherLoanSelectBox,
          status: this.state.status,
          createdBy: this.state.user_info.user_id,
          // updatedBy: this.state.updatedBy,
        };
        const temp=this.state.dataSource.map((v)=>{
          return{
            nameOfInstitution:v.institution_name,
            outstandingAmount:v.outstanding_amount,
            installmentTerm:v.installment_term,
            installmentAmount:v.installment_amount,
            maturityDate:v.maturity_date,
            otherLoan:v.other_loan,
            
          }
        })

        const formdata = new FormData();
        var tempFamilyIncome = this.state.FamilyIncomeDoc.length;
        for (var i = 0; i < tempFamilyIncome; i++) {
          var imagedata = this.state.FamilyIncomeDoc[i];
          formdata.append("family", imagedata);
        }
        var tempFamilyGuarantorNRC = this.state.FamilyGuarantorNRCDoc.length;
        for (var i = 0; i < tempFamilyGuarantorNRC; i++) {
          var imagedata = this.state.FamilyGuarantorNRCDoc[i];
          formdata.append("familyGuaNRC", imagedata);
        }
        var tempOther = this.state.OtherDoc.length;
        for (var i = 0; i < tempOther; i++) {
          var imagedata = this.state.OtherDoc[i];
          formdata.append("otherDOC", imagedata);
        }
        var tempStaffGuarantorNRC = this.state.StaffGuarantorNRCDoc.length;
        for (var i = 0; i < tempStaffGuarantorNRC; i++) {
          var imagedata = this.state.StaffGuarantorNRCDoc[i];
          formdata.append("staffNRC", imagedata);
        }
        var tempRequesterNRC = this.state.RequestNRCDoc.length;
        for (var i = 0; i < tempRequesterNRC; i++) {
          var imagedata = this.state.RequestNRCDoc[i];
          formdata.append("requesterNRC", imagedata);
        }

        formdata.append("staff_loan_info", JSON.stringify(data));
        formdata.append('staff_loan_detail',JSON.stringify(temp))
        console.log("formdata",formdata)
        let status = 0;
        fetch(`${main_url}staff_loan_new/createStaffLoan`, {
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
  }

  render() {
    console.log("info=======>",this.props.isNew,this.state.staff_loan_visible)
    const{staffInfo,getGuarantorInfo}=this.state;
    return (
      <div className="row">
        { this.props.isNew == true ?
          
        <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <Rodal width={600} height={500} visible={this.state.visible} onClose={this.hide.bind(this)} >
                    <div className="col-md-12 "><h4>Staff Loan Terms and Condition</h4>
                    </div>
                    <div className="col-md-12" style={{ marginTop: 30,maxHeight: 400, overflowY: "scroll",lineHeight:'2px'}}>
                      <p>1.	ဝန်ထမ်းချေးငွေရယူမည့် အလိုင်းရင့်စ်ဝန်ထမ်းသည် ပြီးခဲ့သည့် (၆)လအတွင်း စာဖြင့်သတိပေးခြင်း ခံထားရပါက ဝန်ထမ်းချေးငွေလျောက်ထား၍ မရနိုင်ကြောင်းကို သိရှိနားလည်ပြီးဖြစ်ပါသည်။</p>

<p>
2.	အာမခံသူ နှစ်ဦးစလုံးသည် ဝန်ထမ်းမှ ချေးငွေပြန်လည်ပေးဆပ်နိုင်ခြင်းမရှိပါက အားမခံထားသူနှစ်ဦးစလုံးမှ အပြည့်အဝပြန်လည်ပေးဆပ်ရမည်ကို ဝန်ထမ်းချေးငွေလျောက်ထားမည့်သူမှ အာမခံပေးမည်သူ နှစ်ဦးစလုံးအား သေချာစွာ ရှင်းပြပြီးကြောင်းနှင့် အာမခံပြုလုပ်ရန်အတွက် သဘောတူညီမှု ရယူထားပြီးဖြစ်ပါသည်။ 
</p>

<p>3.	ဝန်ထမ်းချေးငွေရယူထားသည့်ဝန်ထမ်း နှုတ်ထွက်/ရပ်စဲ ခံရခြင်းများဖြစ်ပါက ပြန်လည်ပေးဆပ်ရမည့် ချေးငွေလက်ကျန်ပမာဏနှင့် ကျသင့်သည့်အတိုးကို အလိုင်းရင့်စ်ဝန်ထမ်းအဖြစ် နောက်ဆုံးတာဝန်ထမ်းဆောင်သည့်ရက်တွင် အပြေအကျေပေးဆပ်ရမည်ကိုလည်း သိရှိနားလည်ပြီးဖြစ်ပါသည်။</p>

<p>4.	ချေးငွေလက်ကျန်ငွေနှင့်ကျသင့်အတိုးတို့ကို သတ်မှတ်ရက်ထက်စော၍ အပြေအကျေပေးဆပ်လိုပါက သက်ဆိုင်ရာဒေသအလိုက် ဝန်ထမ်းရေးရာဌာန၏အရာရှိထံသို့ အ‌ကြောင်းကြားရမည်ကိုလည်း သိရှိနားလည်ပြီးဖြစ်ပါသည်။</p>

<p>5.	ဝန်ထမ်းချေးငွေနှင့်ပတ်သက်သည့် ဆုံးဖြတ်ချက်မှန်သမျှသည် ဝန်ထမ်းချေးငွေကော်မတီ၏ ဆုံးဖြတ်ချက်သာ နောက်ဆုံးအတည်ဖြစ်သည်။</p>
                      
                      <div className="col-md-12 btn-rightend" style={{display:'flex',gap:10,marginTop:10}}>
                      <button className="btn btn-danger" onClick={() => window.location.reload()}><span>Cancel</span> </button>
                      <button className="btn btn-primary" onClick={() => this.setState({
                          staff_loan_visible:true,visible:false
                      })}><span>Accept</span> </button>
                      </div>
                     
                      
                      {/* <div className="col-md-6">
                      <button className="btn btn-danger" onClick={() => window.location.reload()}><span>Cancel</span> </button>
                      </div>
                      <div className="col-md-6">
                      <div className="col-md-12">
                      <button className="btn btn-primary" onClick={() => this.setState({
                          staff_loan_visible:true,visible:false
                      })}><span>Accept</span> </button>
                      </div>
                      </div> */}
                        {/* <div className="col-md-3">Comment </div>
                        <div className="col-md-7">
                            <input type="text" className="full_width" onChange={(e) => this.setState({ rejected_comment: e.target.value })}></input>
                        </div>
                        <div className="col-md-2 btn-rightend" >

                            <button className="btn btn-primary" onClick={() => this.props.approvalStatus('rejected', this.state.rejected_comment)}><span>Submit</span> </button>

                        </div> */}
                    </div>
                </Rodal>
        </div> 
        :<>
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
                  <Select
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
                  />
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
                    // disabled
                    onChange={this.familyName}
                    value={this.state.selectedFamilyName}
                    // required={this.state.selectedFamilyName == '' ? true : false}
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
                    // disabled
                    onChange={this.familyNRC}
                    value={this.state.selectedFamilyNRC}
                    // required={this.state.selectedFamilyNRC=='' ? true : false}
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
                    placeholder="Ralation with Family"
                    options={this.state.familyRelation}
                    onChange={this.handleSelectedFamilyRelation}
                    value={this.state.selectedFamilyRelation}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
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
                    // disabled
                    onChange={this.familyJob}
                    value={this.state.selectedFamilyJob}
                    // required={this.state.selectedFamilyJob == '' ?  true : false}
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
                    // disabled
                    rows={3}
                    onChange={this.familyAddress}
                    value={this.state.selectedFamilyAddress}
                    // required={this.state.selectedFamilyAddress == '' ?  true : false}
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
                    // disabled
                    onChange={this.familyIncome}
                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                    value={this.state.selectedFamilyIncome}
                    // required={this.state.selectedFamilyIncome == 0 ? true : false}
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
                    type="text"
                    className="form-control"
                    // disabled
                    onChange={this.familyPhone}
                    // onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                    value={this.state.selectedFamilyPhone}
                    // required={this.state.selectedFamilyPhone == 0 ? true : false}
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
                    disabled={this.state.dataSource.length > 0}
                    checked={this.state.OtherLoanSelectBox == 1 ? 'checked':''}
                    onChange={this.handleSelectBoxOtherLoan}
                  />
                </div>
              </div>
              {
                this.state.OtherLoanSelectBox == 1 ? <div className="col-md-3">
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
              </div> : <></>
              }
              {
                this.state.OtherLoanSelectBox == 1 ? <div className="col-md-3">
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
              </div> : <></>
              }
              {
                this.state.OtherLoanSelectBox == 1 ? <div className="col-md-3">
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
              </div> : <></>
              }
              
              
            </div>
            {
              this.state.OtherLoanSelectBox == 1 ? <div className="row" style={{ marginBottom: 10 }}>
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
                    value={this.state.selectedMaturityDate}
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
              </div>
              <div className="col-md-12">
                <table
                  width="99%"
                  className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                  id="dataTables-Table"
                />
              </div>
            </div> : <></>
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
                  <input type="number" className="form-control" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={this.state.selectedRequestAmount}
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
                  <input type="number" className="form-control" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={this.state.selectedRepaymentPeriod} 
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
                  <input type="text" className="form-control" value={this.state.selectedLoanPurpose} onChange={this.handleLoanPurpose} />
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
                    placeholder="Withdraw Location"
                    options={this.state.WithdrawLocationList}
                    onChange={this.handleWithdrawLocation}
                    value={this.state.selectedWithdrawLocation}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
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
              <div className="form-group col-md-6">
                <div>
                  <label
                    htmlFor="attachment"
                    className="col-sm-12 custom-file-label"
                  >
                    Family Member Income Document
                  </label>
                </div>
                <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="family_income_attach_file"
                    multiple
                    onChange={this.familyIncomeDoc.bind(this)}
                  ></input>
                </div>
                <div>
                  {this.state.FamilyIncomeDoc.map((data, index) => (
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
                <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="staff_guarantor_nrc_attach_file"
                    multiple
                    onChange={this.staffGuarantorNRCDoc.bind(this)}
                  ></input>
                </div>
                  <div>
                    {this.state.StaffGuarantorNRCDoc.map((data, index) => (
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
                <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="requester_nrc_attach_file"
                    multiple
                    onChange={this.RequesterNRCDoc.bind(this)}
                  ></input>
                </div>
                <div>
                  {this.state.RequestNRCDoc.map((data, index) => (
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
                {this.state.FamilyGuarantorNRCDoc.map((data, index) => (
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
                <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="other_doc_attach_file"
                    multiple
                    onChange={this.OtherDoc.bind(this)}
                  ></input>
                </div>
                <div>
                  {this.state.OtherDoc.map((data, index) => (
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
            </div>
          </form>
        </div>
        <div className="row save-btn">
          <div className="float-right">
            <div>
              <button
                className="btn btn-primary"
                id="saving_button"
                type="button"
                onClick={this.save.bind(this)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
        </>}
        
        <ToastContainer />
        {
          this.state.staff_loan_visible ? <>
         
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
                  <Select
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
                  />
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
                    // disabled
                    onChange={this.familyName}
                    value={this.state.selectedFamilyName}
                    // required={this.state.selectedFamilyName == '' ? true : false}
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
                    // disabled
                    onChange={this.familyNRC}
                    value={this.state.selectedFamilyNRC}
                    // required={this.state.selectedFamilyNRC=='' ? true : false}
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
                    placeholder="Ralation with Family"
                    options={this.state.familyRelation}
                    onChange={this.handleSelectedFamilyRelation}
                    value={this.state.selectedFamilyRelation}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
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
                    // disabled
                    onChange={this.familyJob}
                    value={this.state.selectedFamilyJob}
                    // required={this.state.selectedFamilyJob == '' ?  true : false}
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
                    // disabled
                    rows={3}
                    onChange={this.familyAddress}
                    value={this.state.selectedFamilyAddress}
                    // required={this.state.selectedFamilyAddress == '' ?  true : false}
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
                    // disabled
                    onChange={this.familyIncome}
                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                    value={this.state.selectedFamilyIncome}
                    // required={this.state.selectedFamilyIncome == 0 ? true : false}
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
                    type="text"
                    className="form-control"
                    // disabled
                    onChange={this.familyPhone}
                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                    value={this.state.selectedFamilyPhone}
                    // required={this.state.selectedFamilyPhone == 0 ? true : false}
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
                    disabled={this.state.dataSource.length > 0}
                    checked={this.state.OtherLoanSelectBox == 1 ? 'checked':''}
                    onChange={this.handleSelectBoxOtherLoan}
                  />
                </div>
              </div>
              {
                this.state.OtherLoanSelectBox == 1 ? <div className="col-md-3">
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
              </div> : <></>
              }
              {
                this.state.OtherLoanSelectBox == 1 ? <div className="col-md-3">
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
              </div> : <></>
              }
              {
                this.state.OtherLoanSelectBox == 1 ? <div className="col-md-3">
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
              </div> : <></>
              }
              
              
            </div>
            {
              this.state.OtherLoanSelectBox == 1 ? <div className="row" style={{ marginBottom: 10 }}>
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
                    value={this.state.selectedMaturityDate}
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
              </div>
              <div className="col-md-12">
                <table
                  width="99%"
                  className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                  id="dataTables-Table"
                />
              </div>
            </div> : <></>
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
                  <input type="number" className="form-control" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={this.state.selectedRequestAmount}
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
                  <input type="number" className="form-control" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={this.state.selectedRepaymentPeriod} 
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
                  <input type="text" className="form-control" value={this.state.selectedLoanPurpose} onChange={this.handleLoanPurpose} />
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
                    placeholder="Withdraw Location"
                    options={this.state.WithdrawLocationList}
                    onChange={this.handleWithdrawLocation}
                    value={this.state.selectedWithdrawLocation}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
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
              <div className="form-group col-md-6">
                <div>
                  <label
                    htmlFor="attachment"
                    className="col-sm-12 custom-file-label"
                  >
                    Family Member Income Document
                  </label>
                </div>
                <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="family_income_attach_file"
                    multiple
                    onChange={this.familyIncomeDoc.bind(this)}
                  ></input>
                </div>
                <div>
                  {this.state.FamilyIncomeDoc.map((data, index) => (
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
                <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="staff_guarantor_nrc_attach_file"
                    multiple
                    onChange={this.staffGuarantorNRCDoc.bind(this)}
                  ></input>
                </div>
                  <div>
                    {this.state.StaffGuarantorNRCDoc.map((data, index) => (
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
                <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="requester_nrc_attach_file"
                    multiple
                    onChange={this.RequesterNRCDoc.bind(this)}
                  ></input>
                </div>
                <div>
                  {this.state.RequestNRCDoc.map((data, index) => (
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
                {this.state.FamilyGuarantorNRCDoc.map((data, index) => (
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
                <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="other_doc_attach_file"
                    multiple
                    onChange={this.OtherDoc.bind(this)}
                  ></input>
                </div>
                <div>
                  {this.state.OtherDoc.map((data, index) => (
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
            </div>
          </form>
        </div>
        <div className="row save-btn">
          <div className="float-right">
            <div>
              <button
                className="btn btn-primary"
                id="saving_button"
                type="button"
                onClick={this.save.bind(this)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
          </> : ''
        }
        
      </div>
    );
  }
}

export default StaffLoanAddNew;
