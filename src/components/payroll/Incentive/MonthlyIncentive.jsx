import React, { Component } from "react";
import { main_url,getFirstDayOfCurrentWeek} from "../../../utils/CommonFunction";
import DatePicker from "react-datetime";
import Select from "react-select";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const $ = require("jquery");

export default class MonthlyIncentive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      newDoc: [],
      coData: [],
      fxData: [],
      roData: [],
      bmData: [],
      employeeIdList: [],
      EmployeeNameList: [],
      regionList: [],
      branchList: [],
      designationList: [],
      searchData: [],
      co_fx: [
        { value: 1, label: "CO", name: "co" },
        { value: 2, label: "FX", name: "fx" },
        // { value: 3, label: "RO", name: "ro" },
        // { value: 4, label: "BM/DBM", name: "bm" }
      ],
      selected_month: new Date(),
      selected_region: "",
      selected_branch: "",
      selected_designation: "",
      selected_employeeID: "",
      selected_employee: "",
      selected_type: { value: 1, label: "CO", name: "co" },
      loading: false,
      table_type: 1,
      validate:0,
      deleteType: false,
    };
  }
  async componentDidMount() {
    this.getEmployeeCodeList();
    this.getEmployeeName();
    this.getBranchList();
    this.getRegionList();
    this.getDesignationList();
    // this.getFirstDayOfCurrentWeek();
    await this._setDataTable([]);
  
  };

  showToast = (status, text) => {
    if (status === 200) {
      toast.success(text, {
        position: "top-right",
        autoClose: 5000,
      });
    } else {
      toast.error("Fail To Save Information!");
    }
  };

  getRegionList() {
    fetch(`${main_url}benefit/getRegionList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ state_id: 0, state_name: "All" });
        this.setState({
          regionList: list.map((v) => ({
            ...v,
            label: v.state_name,
            value: v.state_id,
          })),
        });
      });
  };

  getDesignationList() {
    fetch(`${main_url}main/getDesignations`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          designationList: list,
        });
      });
  };

  getBranchList() {
    fetch(`${main_url}main/getBranch`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          branchList: list,
        });
      });
  };

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
  };

  getEmployeeName() {
    fetch(`${main_url}report/employeeName`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          EmployeeNameList: list,
        });
      });
  };

  handleSelectedRegion = (event) => {
    if (event !== null)
      this.setState({
        selected_region: event,
      });
  };

  handleSelectedBranch = (event) => {
    if (event !== null)
      this.setState({
        selected_branch: event,
      });
  };

  handleSelectedDesignation = (event) => {
    if (event !== null)
      this.setState({
        selected_designation: event,
      });
  };

  handleSelectedEmployeeId = (event) => {
    if (event !== null)
      this.setState({
        selected_employeeID: event,
        selected_employee: this.state.EmployeeNameList.filter(
          (v) => v.value == event.user_id
        )[0].label,
      });
  };

  handleSelectedMonth = (event) => {
    this.setState({
      selected_month: event,
    });
  };

  handleSelectedType = (event) => {
    document.querySelector("#attachment").value = "";
    this.setState({
      selected_type: event,
    });
  };

  actionClick = async (e) => { 
    if(e === 1){
      this.setState({
        validate:1
      })
    }
    if ( 
      (
      (( this.state.searchData.length > 0  && this.state.searchData[0].generate !== 2 ) 
    || (this.state.fxData.length > 0 && this.state.fxData[0].generate !== 2)) 
    && (e == 1 || e == 0))
    ||(e === 2 && this.state.validate === 1)) {
      console.log("api======>")
      let status = 0;
      fetch(
        `${main_url}incentive/monthlyGenerate/${
          this.state.selected_type.name
        }/${moment(this.state.selected_month).format("YYYY-MM")}/${e}`
      )
        .then((res) => {
          status = res.status;
          return res.text();
        })
        .then(async (text) => {
          if (e != 0) {
            this.showToast(status, text);
          }
        });
      if (e == 0) {
        document.querySelector("#attachment").value = "";
        this._setDataTable([]);
        this.setState({
          deleteType: false,
          newDoc: [],
          searchData: [],
          fxData:[]
        });
      } else if (e == 2){
        window.location.reload()
      }
    } 
    else if (e == 2 && this.state.validate !== 1){
      toast.error("Please Calculated Pay Slip First!");
    }
    else if ((this.state.fxData.length === 0 && this.state.searchData.length === 0 ) && e === 1){
      toast.error("Please Choose Attachment File!");
    }
    // else {
    //   toast.error("Already Calculated Pay Slip!");
    // }
  };

  handleSearch = (e) => {
    document.querySelector("#attachment").value = "";
    this.setState({
      searchData: [],
      fxData: [],
      coData: [],
      loading:true,
    });
    const employee = this.state.selected_employeeID
      ? this.state.selected_employeeID.value
      : 0;
    const designationId = this.state.selected_designation
      ? this.state.selected_designation.value
      : 0;
    const branchId = this.state.selected_branch
      ? this.state.selected_branch.value
      : 0;
    const regionId = this.state.selected_region
      ? this.state.selected_region.value
      : 0;
      let status = 0;
      let statusText='';
    fetch(
      main_url +
        "salary_report/monthlyReport/" +
        employee +
        "/" +
        designationId +
        "/" +
        branchId +
        "/" +
        regionId +
        "/" +
        this.state.selected_type.name +
        "/" +
        moment(this.state.selected_month).format("YYYY-MM") +
        "/" + '0'
    )
      .then((res) => {
        status = res.status;
        statusText=res.statusText;
        if (res.ok) {return res.json();}
        else{ 
          this.setState({
            searchData:[]
          })
          return res.text
        }
      })
      .then((list) => { 
        if (this.state.selected_type.value === 1) { 
          this.setState({
            searchData:list.data || [],
            fxData: [],
            roData: [],
            bmData: [],
            table_type: 1,
            deleteType: false,
            loading:false
          });
        } else if(this.state.selected_type.value === 2){
          this.setState(
            {
              fxData: list || [],
              coData: [],
              roData: [],
              bmData: [],
              table_type: 2,
            deleteType: false,
            loading:false

            },
            async () => {
              await this._setDataTable(this.state.fxData);
            }
          );
        }
        //  else if(this.state.selected_type.value === 3){
        //   this.setState(
        //     {
        //       roData: list || [],
        //       coData: [],
        //       fxData: [],
        //       table_type: 3,
        //       deleteType: false,
        //       loading:false
        //     },
        //     async () => {
        //       await this._setDataTableRo(this.state.roData);
        //     }
        //   );
        // } else if(this.state.selected_type.value === 4){
        //   this.setState(
        //     {
        //       bmData: list || [],
        //       coData: [],
        //       roData:[],
        //       fxData: [],
        //       table_type: 4,
        //       deleteType: false,
        //       loading:false
        //     },
        //     async () => {
        //       await this._setDataTableBm(this.state.bmData);
        //     }
        //   );
        // }
      })
      .catch((error)=>{ 
        throw(error)
      });
      this.setState({
        searchData:[]
      })
  };
 
  checkFiles(e) {
    
    this.setState({
      loading: true,
      newDoc: [],
      searchData: [],
      coData: [],
    });
 
    var files = document.getElementById("attachment").files;
    var newDoc = this.state.newDoc;
    for (let i = 0; i < files.length; i++) {
      var getfile = document.querySelector("#attachment").files[i];
      console.log("file",getfile)
      newDoc.push(getfile);
    }

    const formdata = new FormData();
    var imagedata = newDoc[0];
    formdata.append("uploadfile", imagedata);
    let status = 0;
    fetch(
      `${main_url}incentiveCo/addIncentiveCo/${moment(
        this.state.selected_month
      ).format("YYYY-MM")}/${this.state.selected_type.name}`,
      {
        method: "POST",
        body: formdata,
      }
    )
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then(async (response) => {
        if (status == 200 && this.state.selected_type.value == 1) {
          this.setState({
            loading: false,
            newDoc:response,
            searchData:response.data,
            deleteType: true,
            table_type: 1,
          });
        } else if (status == 200 && this.state.selected_type.value == 2) {
          console.log('aung tl',response)
          this.setState({
            loading: false,
            fxData: response,
            newDoc:response,
            deleteType: true,
            table_type: 2,
          });
          await this._setDataTable(response);
        }
        //  else if (status == 200 && this.state.selected_type.value == 3) {
        //   this.setState({
        //     loading: false,
        //     roData: response,
        //     newDoc:response,
        //     deleteType: true,
        //     table_type: 3,
        //   });
        //   await this._setDataTableRo(response);
        // } else if (status == 200 && this.state.selected_type.value == 4) {
        //   this.setState({
        //     loading: false,
        //     bmData: response,
        //     newDoc:response,
        //     deleteType: true,
        //     table_type: 4,
        //   });
        //   await this._setDataTableBm(response);
        // } 
        else {
          toast.error("Fail to Save Information", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          this.setState({
            loading: false,
          });
        }
        
      })
      .catch((err) =>{ 
        toast.error('Data Is Already Calculated!')
        this.setState({
          loading:false,
          searchData:[]

        })
      })
  };

searchTable(){ 
  var $rows = $('#monthly_incentive tbody tr');
$('#search').keyup(function() {
  var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

  $rows.show().filter(function() {
    var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
    return !~text.indexOf(val);
  }).hide();
});
  };

  async _setDataTable(compData) {
    console.log("data in datatable",compData)
    let data=compData.data
    var table;
    var l = [];
    if (data!=null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        const index = i;
        const result = data[i];
        const obj = {
          no: index + 1,
          employment_id: data[i].employeeID ? data[i].employeeID : "-",
          co_count: data[i].coCount ? data[i].coCount : "-",
          co_incentive: data[i].incentiveAmount ? data[i].incentiveAmount.toLocaleString() : "-",
          co_incentive_total: data[i].coIncentiveTotal? data[i].coIncentiveTotal.toLocaleString() : "-",
        };
        l.push(obj);
      }
    }
    if ($.fn.dataTable.isDataTable("#dataTables-Table-Fx")) {
      table = $("#dataTables-Table-Fx").dataTable();
      table.fnClearTable();
      table.fnDestroy();
      $("#dataTables-Table-Fx").empty();
    }

    table = $("#dataTables-Table-Fx").DataTable({
      autofill: true,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      paging: true,
      buttons: false,
      dom: 'Bfrtip',

      buttons:  [
        // 'copy',
    // {
    //         extend: 'csvHtml5',
    //         title: 'Birthday Fund',
    // },
    {
        extend: 'excelHtml5',
        title: 'Monthly Incentive(FX)',
    },
    // {
    //     extend: 'pdfHtml5',
    //     title: 'Birthday Fund',
    // }
  ],

      data: l,
      columns: [
        { title: "No", data: "no" },
        { title: "Employee Id", data: "employment_id" },
        { title: "CO Count", data: "co_count" },
        { title: "CO Incentive Amount", data: "co_incentive" },
        { title: "CO Incentive Total", data: "co_incentive_total" },
      ],
    });
  };

  // async _setDataTableRo(data) {
  //   var table;
  //   var l = [];
  //   if (data.length > 0) {
  //     for (var i = 0; i < data.length; i++) {
  //       const index = i;
  //       const result = data[i];
  //       const obj = {
  //         no: index + 1,
  //         employment_id: data[i].employeeID ? data[i].employeeID : "-",
  //         name: data[i].coCount ? data[i].coCount : "-",
  //         par_percent: data[i].par_percent ? data[i].par_percent : "-",
  //         collection_percent :  data[i].collection_percent ? data[i].collection_percent : "-",
  //         par: data[i].par ? data[i].par : "-",
  //         collection: data[i].collection ? data[i].collection : "-",
  //         total: data[i].total ? data[i].total : "-",
  //         remark: data[i].remark ? data[i].remark : "-",
  //       };
  //       l.push(obj);
  //     }
  //   }
  //   if ($.fn.dataTable.isDataTable("#dataTables-Table-Ro")) {
  //     table = $("#dataTables-Table-Ro").dataTable();
  //     table.fnClearTable();
  //     table.fnDestroy();
  //     $("#dataTables-Table-Ro").empty();
  //   }

  //   table = $("#dataTables-Table-Ro").DataTable({
  //     autofill: true,
  //     bLengthChange: false,
  //     bInfo: false,
  //     responsive: true,
  //     paging: true,
  //     buttons: false,
  //     dom: 'Bfrtip',

  //     buttons:  [
  //       // 'copy',
  //   // {
  //   //         extend: 'csvHtml5',
  //   //         title: 'Birthday Fund',
  //   // },
  //   {
  //       extend: 'excelHtml5',
  //       title: 'Monthly Incentive(RO)',
  //   },
  //   // {
  //   //     extend: 'pdfHtml5',
  //   //     title: 'Birthday Fund',
  //   // }
  // ],

  //     data: l,
  //     columns: [
  //       { title: "No", data: "no" },
  //       { title: "Employee Id", data: "employment_id" },
  //       { title: "name", data: "name" },
  //       { title: "PAR %", data: "par_percent" },
  //       { title: "Collection %", data: "collection_percent" },
  //       { title: "PAR", data: "par" },
  //       { title: "Collection", data: "collection" },
  //       { title: "Total", data: "total" },
  //       { title: "Remark", data: "remark" },

  //     ],
  //   });
  // };

  // async _setDataTableBm(data) {
  //   var table;
  //   var l = [];
  //   if (data.length > 0) {
  //     for (var i = 0; i < data.length; i++) {
  //       const index = i;
  //       const result = data[i];
  //       const obj = {
  //         no: index + 1,
  //         employment_id: data[i].employeeID ? data[i].employeeID : "-",
  //         name: data[i].fullname ? data[i].fullname : "-",
  //         amount: data[i].amount ? data[i].amount : "-",        
  //       };
  //       l.push(obj);
  //     }
  //   }
  //   if ($.fn.dataTable.isDataTable("#dataTables-Table-Bm")) {
  //     table = $("#dataTables-Table-Bm").dataTable();
  //     table.fnClearTable();
  //     table.fnDestroy();
  //     $("#dataTables-Table-Bm").empty();
  //   }

  //   table = $("#dataTables-Table-Bm").DataTable({
  //     autofill: true,
  //     bLengthChange: false,
  //     bInfo: false,
  //     responsive: true,
  //     paging: true,
  //     buttons: false,
  //     dom: 'Bfrtip',

  //     buttons:  [
  //       // 'copy',
  //   // {
  //   //         extend: 'csvHtml5',
  //   //         title: 'Birthday Fund',
  //   // },
  //   {
  //       extend: 'excelHtml5',
  //       title: 'Monthly Incentive(BM/DBM)',
  //   },
  //   // {
  //   //     extend: 'pdfHtml5',
  //   //     title: 'Birthday Fund',
  //   // }
  // ],

  //     data: l,
  //     columns: [
  //       { title: "No", data: "no" },
  //       { title: "Employee Id", data: "employment_id" },
  //       { title: "Name", data: "name" },
  //       { title: "Amount", data: "amount" },
  //     ],
  //   });
  // };

  render() { console.log('validate',this.state.fxData.length <= 0 || (this.state.fxData.length > 0 && this.state.fxData[0].generate) === 2 ? 'false':'true');
    return (
      <div>
        <ToastContainer />
        <h3 style={{margin:'15px 15px 15px 0px'}}>Monthly Incentive</h3>
        <div className="row">
          <div className="col-lg-3">
            <label>Request Month</label>
            <DatePicker
              dateFormat="MM/YYYY"
              value={this.state.selected_month}
              timeFormat={false}
              onChange={this.handleSelectedMonth}
            />
          </div>

          <div className="col-lg-3">
            <label>CO/FX</label>
            <Select
              options={this.state.co_fx}
              onChange={this.handleSelectedType}
              value={this.state.selected_type}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="col-lg-3">
            <label>Region</label>
            <Select
              options={this.state.regionList}
              onChange={this.handleSelectedRegion}
              value={this.state.selected_region}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="col-lg-3">
            <label>Branch </label>
            <Select
              options={this.state.branchList}
              onChange={this.handleSelectedBranch}
              value={this.state.selected_branch}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="col-lg-3">
            <label>Designation</label>
            <Select
              options={this.state.designationList}
              onChange={this.handleSelectedDesignation}
              value={this.state.selected_designation}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="col-lg-3">
            <label>Employee Id </label>
            <Select
              options={this.state.employeeIdList}
              onChange={this.handleSelectedEmployeeId}
              value={this.state.selected_employeeID}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="col-lg-3">
            <label>Employee Name</label>
            <input
              className="form-control checkValidate"
              disabled={true}
              type="text"
              data-name="fullname"
              value={this.state.selected_employee}
              placeholder="Employee Name"
              onChange={this.claimChangeText}
            />
          </div>

          <div
            className="col-lg-3"
            style={{
              marginTop: "25px",
            }}
          >
            <button
              className="btn-primary btn"
              onClick={() => this.handleSearch()}
            >
              Search
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2" style={{ padding: '30px 0px 15px 15px' }}>
            <input
              // className="dropZone"
              type="file"
              id="attachment"
              // name="attachment"
              onChange={this.checkFiles.bind(this)}
              style={{ height: 30 }}
            ></input>
          </div>

        {/* { this.state.searchData[0].data[0].generate === 2 ? ('') :(  */}
        <div
            className="col-lg-3"
            style={{
              marginTop: "22px",
            }}
          >
            <button
              className="btn-primary btn"
              onClick={() => this.actionClick(1)}
            >
              Pay Slip Generate
            </button>
          </div>
          {/* )} */}
        </div>

        {this.state.loading ? (
          <div
            className="col-lg-12"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <h1>Loading...</h1>
            {/* <span className="loader"></span> */}
          </div>
        ) : this.state.table_type === 2 ? (
          <div>

            <div className="col-md-12">
              <table
                width="99%"
                className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                id="dataTables-Table-Fx"
              />
              {this.state.fxData.length <= 0 || (this.state.fxData.length > 0 && this.state.fxData[0].generate === 2) ? (''):(
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <div
                    className="col-lg-2"
                    style={{
                      marginTop: "22px",
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <button
                      className="btn-primary btn"
                      onClick={() => this.actionClick(0)}
                    >
                      Delete
                    </button>
                  </div>
                  <div
                    className="col-lg-2"
                    style={{
                      marginTop: "22px",
                      display: "flex",
                      justifyContent: "start",
                    }}
                  >
                    <button
                      className="btn-primary btn"
                      onClick={() => this.actionClick(2)}
                    >
                      Generate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) 
        // : this.state.table_type === 3 ? (
        //   <div>

        //   <div className="col-md-12">
        //     <table
        //       width="99%"
        //       className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
        //       id="dataTables-Table-Ro"
        //     />
        //     {this.state.roData.length <= 0 || this.state.roData[0].generate === 2 ? (''):(
        //       <div style={{ display: "flex", justifyContent: "end" }}>
        //         <div
        //           className="col-lg-2"
        //           style={{
        //             marginTop: "22px",
        //             display: "flex",
        //             justifyContent: "end",
        //           }}
        //         >
        //           <button
        //             className="btn-primary btn"
        //             onClick={() => this.actionClick(0)}
        //           >
        //             Delete
        //           </button>
        //         </div>
        //         <div
        //           className="col-lg-2"
        //           style={{
        //             marginTop: "22px",
        //             display: "flex",
        //             justifyContent: "start",
        //           }}
        //         >
        //           <button
        //             className="btn-primary btn"
        //             onClick={() => this.actionClick(2)}
        //           >
        //             Generate
        //           </button>
        //         </div>
        //       </div>
        //     )}
        //   </div>
        // </div>
        // )
        // : this.state.table_type === 4 ? (
        //   <div>

        //   <div className="col-md-12">
        //     <table
        //       width="99%"
        //       className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
        //       id="dataTables-Table-Bm"
        //     />
        //     {this.state.bmData.length <= 0 || this.state.bmData[0].generate === 2 ? (''):(
        //       <div style={{ display: "flex", justifyContent: "end" }}>
        //         <div
        //           className="col-lg-2"
        //           style={{
        //             marginTop: "22px",
        //             display: "flex",
        //             justifyContent: "end",
        //           }}
        //         >
        //           <button
        //             className="btn-primary btn"
        //             onClick={() => this.actionClick(0)}
        //           >
        //             Delete
        //           </button>
        //         </div>
        //         <div
        //           className="col-lg-2"
        //           style={{
        //             marginTop: "22px",
        //             display: "flex",
        //             justifyContent: "start",
        //           }}
        //         >
        //           <button
        //             className="btn-primary btn"
        //             onClick={() => this.actionClick(2)}
        //           >
        //             Generate
        //           </button>
        //         </div>
        //       </div>
        //     )}
        //   </div>
        // </div>
        // )
        
        : this.state.table_type === 1 && (this.state.searchData.length > 0) ? (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',paddingRight:17}}>
              <div>
            <ReactHTMLTableToExcel 
                         className="btn-excel"
                         table="monthly_incentive"
                         filename={"Monthly Incentive Report "+moment(this.state.selected_month).format('YYYY-MM')}
                         buttonText="Excel"
                         sheet="Sheet"
                        
                         /></div><div className="col-lg-2 col-md-3" style={{padding:"0px 0px 4px 0px",display:"flex",justifyContent:'space-between',alignItems:'center'}}> <div className="col-lg-4" style={{padding:0,fontSize:14}}>Search</div>
            <div className="row col-lg-10" style={{padding:0}}><input className="form-control col-lg-12" style={{padding:0,borderRadius:3,border:"1px solid grey"}} type="text" id="search" onKeyUp={this.searchTable}/></div></div>
             </div>
            <table
              id="monthly_incentive"
              className="table table-bordered"
              style={{ overflow: "Scroll",display:'block',whiteSpace:'nowrap',marginBottom:0 }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    overflow: "scroll",
                  }}
                >
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Employee ID
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    FX Name
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Client Officer Name
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Branch Name
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Product Name
                  </th>
                  <th style={{ textAlign: "center" }} colSpan={4}>
                    Credit
                  </th>
                  <th style={{ textAlign: "center" }}>Saving</th>
                  <th style={{ textAlign: "center" }} colSpan={2}>
                    Collection Rate
                  </th>
                  <th style={{ textAlign: "center" }} colSpan={2}>
                    PAR
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Credit Incentive
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Saving Incentive
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Collective Rate Incentive
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    PAR Deduction Incentive
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Grand Total
                  </th>
                </tr>
                <tr>
                  <th style={{ textAlign: "center" }} colSpan={2}>
                    Disbursement
                  </th>
                  <th style={{ textAlign: "center" }} colSpan={2}>
                    Portfolio
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={2}
                  >
                    Outstanding
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={2}
                  >
                    Demand
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={2}
                  >
                    Actual
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={2}
                  >
                    NO.s
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={2}
                  >
                    Amount
                  </th>
                </tr>
                <tr>
                  <th style={{ textAlign: "center" }}>NO.s</th>
                  <th style={{ textAlign: "center" }}>Amount</th>
                  <th style={{ textAlign: "center" }}>NO.s</th>
                  <th style={{ textAlign: "center" }}>Outstanding</th>
                </tr>
              </thead>
              <tbody style={{ textAlign: "center" }}>
                {this.state.searchData.map((v, i) => { 
                  return (
                    <>
                      <tr>
                        <td>{v.employeeID || '-'}</td>
                        <td>{v.fx_name  || '-'}</td>
                        <td>{v.co_name  || '-'}</td>
                        <td>{v.branch_name  || '-'}</td>
                        <td>{v.product_name  || '-'}</td>
                        <td>{v.creditDisbursementNo  || '-'}</td>
                        <td>{v.creditDisbursementAmount ? v.creditDisbursementAmount.toLocaleString('en-US',{maximumFractionDigits:2}) :'-'}</td>
                        <td>{v.creditPortfolioNo|| '-'}</td>
                        <td>{v.creditPortfolOutstanding ? v.creditPortfolOutstanding.toLocaleString('en-US',{maximumFractionDigits:2}) :'-'}</td>
                        <td>{v.savingOutstanding ? v.savingOutstanding.toLocaleString('en-US',{maximumFractionDigits:2}) :'-'}</td>
                        <td>{v.collectionRateDemand ? v.collectionRateDemand.toLocaleString('en-US',{maximumFractionDigits:2}) :'-'}</td>
                        <td>{v.collectionActual ? v.collectionActual.toLocaleString('en-US',{maximumFractionDigits:2}) :'-'}</td>
                        <td>{v.parNo|| '-'}</td>
                        <td>{v.parAmount ? v.parAmount.toLocaleString('en-US',{maximumFractionDigits:2}) :'-'}</td>
                        <td>{v.creditIncentive ? v.creditIncentive.toLocaleString('en-US',{maximumFractionDigits:2}) :'-'}</td>
                        <td>{v.savingIncentive ? v.savingIncentive.toLocaleString('en-US',{maximumFractionDigits:2}) :'-'}</td>
                        <td>{v.collectiveRateIncentive ? v.collectiveRateIncentive.toLocaleString('en-US',{maximumFractionDigits:2}) :'-'}</td>
                        <td>{v.parDeductionRate ? v.parDeductionRate.toLocaleString('en-US',{maximumFractionDigits:2}) :'-'}</td>
                        <td>{v.totalIncentive ? v.totalIncentive.toLocaleString('en-US',{maximumFractionDigits:2}) :'-'}</td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
            <div style={{width:"100%",display:'flex',justifyContent:'end'}}>
              <div className='col-lg-4'>
<table className="table "style={{overflow:'scroll',  border:'1px solid #c1c1c1',marginBottom:0}}>
<thead>
<tr style={{overflow:'scroll',border:'1px solid #c1c1c1' }}>
            <td style={{textAlign:'center',width:100,border:'1px solid #c1c1c1',fontWeight:'bold'}} colSpan={2}>Grand Total</td>
            <td style={{textAlign:'center',width:100,border:'1px solid #c1c1c1'}} colSpan={2}>{this.state.searchData ? this.state.searchData.reduce((a,c)=>{return a+c.totalIncentive},0).toLocaleString('en-US',{maximumFractionDigits:2}) : '-'}</td>       
</tr>
</thead>
</table></div>
 </div >
         {this.state.searchData[0].generate === 2 ? ('') :(
            <div className="" style={{ display: "flex", justifyContent: "end" }}>
              <div
                className="col-lg-1"
                style={{
                  marginTop: "22px",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <button
                  className="btn-primary btn"
                  onClick={() => this.actionClick(0)}
                >
                  Delete
                </button>
              </div>

              <div
                className="col-lg-1"
                style={{
                  marginTop: "22px",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <button
                  className="btn-primary btn"
                  onClick={() => this.actionClick(2)}
                >
                  Generate
                </button>
              </div>
            </div>)
         }
          </div>
        ) : this.state.table_type === 1 && (this.state.searchData.length === 0 ) ? (
         <div>
           <div style={{display:'flex',justifyContent:'space-between',paddingRight:17}}>
              <div>
            <ReactHTMLTableToExcel 
                         className="btn-excel"
                         table="monthly_incentive"
                         filename={"Monthly Incentive Report "+moment(this.state.selected_month).format('YYYY-MM')}
                         buttonText="Excel"
                         sheet="Sheet"
                        
                         /></div><div className="col-lg-2 col-md-3" style={{padding:"0px 0px 4px 0px",display:"flex",justifyContent:'space-between',alignItems:'center'}}> <div className="col-lg-4" style={{padding:0,fontSize:14}}>Search</div>
            <div className="row col-lg-10" style={{padding:0}}><input className="form-control col-lg-12" style={{padding:0,borderRadius:3,border:"1px solid grey"}} type="text" id="search" onKeyUp={this.searchTable}/></div></div>
             </div>
          <table
            className="table table-bordered"
            id="monthly_incentive"
            style={{ overflow: "Scroll",display:'block',whiteSpace:'nowrap'}}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  overflow: "scroll",
                }}
              >
                <th
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  rowSpan={3}
                >
                  Employee ID
                </th>
                <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    FX Name
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Client Officer Name
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Branch Name
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Product Name
                  </th>
                <th style={{ textAlign: "center" }} colSpan={4}>
                  Credit
                </th>
                <th style={{ textAlign: "center" }}>Saving</th>
                <th style={{ textAlign: "center" }} colSpan={2}>
                  Collection Rate
                </th>
                <th style={{ textAlign: "center" }} colSpan={2}>
                  PAR
                </th>
                <th
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  rowSpan={3}
                >
                  Credit Incentive
                </th>
                <th
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  rowSpan={3}
                >
                  Saving Incentive
                </th>
                <th
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  rowSpan={3}
                >
                  Collective Rate Incentive
                </th>
                <th
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  rowSpan={3}
                >
                  PAR Deduction Incentive
                </th>
                <th
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  rowSpan={3}
                >
                  Grand Total
                </th>
              </tr>
              <tr>
                <th style={{ textAlign: "center" }} colSpan={2}>
                  Disbursement
                </th>
                <th style={{ textAlign: "center" }} colSpan={2}>
                  Portfolio
                </th>
                <th
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  rowSpan={2}
                >
                  Outstanding
                </th>
                <th
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  rowSpan={2}
                >
                  Demand
                </th>
                <th
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  rowSpan={2}
                >
                  Actual
                </th>
                <th
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  rowSpan={2}
                >
                  NO.s
                </th>
                <th
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  rowSpan={2}
                >
                  Amount
                </th>
              </tr>
              <tr>
                <th style={{ textAlign: "center" }}>NO.s</th>
                <th style={{ textAlign: "center" }}>Amount</th>
                <th style={{ textAlign: "center" }}>NO.s</th>
                <th style={{ textAlign: "center" }}>Outstanding</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: "center" }}>
              <tr>
                <td
                  colSpan={19}
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    height: 35,
                    fontSize: 15,
                    borderBottom: "1px solid black",
                  }}
                >
                  No data available in table
                </td>
              </tr>
            </tbody>
          </table></div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

