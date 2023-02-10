import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import React, { Component } from "react";
import ReactDatePicker from "react-datepicker";
import EmployeePieChart from "./EmployeePieChart";
import { getMacAddress, getMacAddress1 } from "./getMac";
import HeadCountBarChart from "./HeadCountBarChart";
import LeaveCountBarChart from "./LeaveCountBarChart";
import { AttendanceCaldendar } from "./AttendanceCaldendar";
import Profile from "./Profile";
import ThingsTodoTable from "./ThingsTodoTable";
import BenefitBarChart from "./BenefitBarChart";
import ExpenseBarChart from "./ExpenseBarChart";
import HelpDesk from "./HelpDesk";
import HelpDeskLineChart from "./HelpDeskLineChart";
import AttendenceBarChart from "./AttendenceBarChart";
import LeaveCalendar from "./LeaveCalendar"
import ResignBarChart from "./ResignBarChart";
import CompensationandBenefit from "./CompensationandBenefit";
import { main_url,getCookieData } from "../../utils/CommonFunction";
import moment from "moment";
import FixedAssectListTable from './FixedAssectListTable';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

const primary = "#1872ab";
var button = document.querySelector('.button');


export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tapButtonTitle: "",
      confirmRequestPermission:null,
      user: getCookieData("user_info"),
      compensation_permission:null,
      sidebarPermission:[]
      // fixAssetList: false,
      // fixAssetListTitle:""
    };
  }

  async componentDidMount() {
    const id = localStorage.getItem("user_id");
    this.confirmRequest(id);
    this.compensationPermission(id);
    this.$el = $(this.el);
    this.sidebarPermission(id);
    //   const a = await getMacAddress();
    //   const b = await getMacAddress1();
  }
  confirmRequest = async (id) => {
    await fetch(`${main_url}dashboard/confirmRequestPermission/${id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          confirmRequestPermission:data
        })
      })
  }
  compensationPermission= async (id) => {
    await fetch(`${main_url}dashboard/compasationPermission/${id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          compensation_permission:data
        })
      })
  }
  sidebarPermission = async (id) => {
    await fetch(`${main_url}main/sidebarPermission/${id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          sidebarPermission: data.map(v => ({ permission: v.permission_title, access: v.hrm_permission_add }))
        })
      })
  }

  tapButtonClick = (title) => {
    this.setState({ tapButtonTitle: title });

  };

  onClickFixAssetList = (userId, title) => {
    
    fetch(main_url + `dashboard/fixedAssetList/${userId}`)
      .then(response => { return response.json() }).then(res => {
        this.setState({tapButtonTitle:title});
        this._setTableData(res);
      })

  }

  _setTableData = async (data) => {
    var table;
    var l = [];
    var status;
    this.setState({ tapButtonTitle: "active" });
    for (var i = 0; i < data.length; i++) {
      let result = data[i];
      let obj = [];
      obj = {
        no: i + 1,
        employee_id: data[i].employment_id ? data[i].employment_id : '',
        employee_name: data[i].fullname ? data[i].fullname : '',
        position: data[i].designations ? data[i].designations : '-',
        branch: data[i].location_master_name ? data[i].location_master_name : '-',
        asset_item_code: data[i].asset_item_code ? data[i].asset_item_code : '-',
        item_name: data[i].item_name ? data[i].item_name : '-',
        asset_item_description: data[i].asset_item_description ? data[i].asset_item_description : '',
      }

      l.push(obj)
    }

    if ($.fn.dataTable.isDataTable('#dataTables-table')) {
      table = $('#dataTables-table').dataTable();
      table.fnClearTable();
      table.fnDestroy();
      $('#dataTables-table').empty();
    }

    var column = [
      { title: "No", data: "no" },
      { title: "Employee Id", data: "employee_id" },
      { title: "Employee Name", data: "employee_name" },
      { title: "Designation", data: "position" },
      { title: "Branch", data: "branch" },
      { title: "Fixed Asset ID", data: "asset_item_code" },
      { title: "Asset Name", data: "item_name" },
      { title: "Specification", data: "asset_item_description" },
    ]
    table = $("#dataTables-table").DataTable({
      // columnDefs: [
      //     {
      //       targets: 5,
      //       createdCell: function (td) {
      //         $(td).css('background-color', "red")
      //       }
      //     }
      //   ],
      autofill: true,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      pageLength: 50,
      paging: true,
      // buttons: true,
      dom: 'Bfrtip',
      // buttons: [
      //     'copy', 'csv', 'excel', 'pdf'
      // ],
      buttons: [
        // 'copy',
        // {
        //         extend: 'csvHtml5',
        //         title: 'Child Benefit',
        // },
        // {
        //     extend: 'excelHtml5',
        //     title: 'Child Benefit',
        // },
        // {
        //     extend: 'pdfHtml5',
        //     title: 'Child Benefit',
        // }
      ],
      data: l,
      columns: column,
      // createdRow: function (row, data, td, index) {
      //     if (data.leave === true) {
      //         $(row).css('background-color', 'Yellow');
      //     }
      //     if (data.extension != '-') {
      //         $(row).css('background-color', 'Orange');

      //     }
      // }


    });

  }

  render() {

    const btn = {
      // backgroundColor:this.state.tapButtonTitle == "title" ? "green" : "blue",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 5,
      paddingBottom: 7,

      borderRadius: 5,
      borderColor: "transparent",



    };
    const {sidebarPermission}=this.state;
    const DashboardPermission=sidebarPermission.length > 0 && ((sidebarPermission.filter(d => d.permission == "Head Count") && sidebarPermission.filter(d => d.permission == "Head Count")[0].access == true ) || (sidebarPermission.filter(d => d.permission == "Attandence") && sidebarPermission.filter(d => d.permission == "Attandence")[0].access == true) || (sidebarPermission.filter(d => d.permission == "Leave") && sidebarPermission.filter(d => d.permission == "Leave")[0].access == true) || (sidebarPermission.filter(d => d.permission == "Total Employee") && sidebarPermission.filter(d => d.permission == "Total Employee")[0].access == true) || (sidebarPermission.filter(d => d.permission == "Expense") && sidebarPermission.filter(d => d.permission == "Expense")[0].access == true) || (sidebarPermission.filter(d => d.permission == "Compansation and Benefit") && sidebarPermission.filter(d => d.permission == "Compansation and Benefit")[0].access == true) || (sidebarPermission.filter(d => d.permission == "Help Desk") && sidebarPermission.filter(d => d.permission == "Help Desk")[0].access == true) || (sidebarPermission.filter(d => d.permission == "Resign") && sidebarPermission.filter(d => d.permission == "Resign")[0].access == true))

    return (
      
      <div>
        {/* <h3>Dashboard</h3> */}
        {/* <LeaveCalendar /> */}
        {
        this.state.confirmRequestPermission && this.state.confirmRequestPermission.length > 0 || this.state.user.user_id == 1110 || this.state.user.user_id == 1467 
        // DashboardPermission
        ? <div className=""
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            flexWrap: "wrap",
            marginBottom: 15,
            marginTop: 15,


          }}
        >
          {/* {
            sidebarPermission.length > 0 && sidebarPermission.filter(d=>d.permission == 'Head Count') && sidebarPermission.filter(d=>d.permission == 'Head Count')[0].access ==true ?  */}
            <button className="button"
              style={{ ...btn, backgroundColor: this.state.tapButtonTitle == "headCount" ? '#23C6C8' : "#1872ab" }}
              onClick={() => this.tapButtonClick("headCount")} >
              Head Count
            </button>
             {/* : ''} */}
          {/* {sidebarPermission.length > 0 && sidebarPermission.filter(d=>d.permission == 'Attandence') && sidebarPermission.filter(d=>d.permission == 'Attandence')[0].access ==true ?  */}
            <button style={{ ...btn, backgroundColor: this.state.tapButtonTitle == "attendenceChart" ? '#23c6c8' : "#1872ab" }}
            onClick={() => this.tapButtonClick("attendenceChart")}
          >Attandence</button>
           {/* : ''} */}
          {/* {
            sidebarPermission.length > 0 && sidebarPermission.filter(d=>d.permission == 'Leave') && sidebarPermission.filter(d=>d.permission == 'Leave')[0].access ==true ?  */}
            <button
            style={{ ...btn, backgroundColor: this.state.tapButtonTitle == "leaveChart" ? '#23c6c8' : "#1872ab" }}
            onClick={() => this.tapButtonClick("leaveChart")}
          >
            Leave
          </button>
           {/* : ''} */}
          {/* {sidebarPermission.length > 0 && sidebarPermission.filter(d=>d.permission == 'Total Employee') && sidebarPermission.filter(d=>d.permission == 'Total Employee')[0].access ==true ?  */}
            <button
            style={{ ...btn, backgroundColor: this.state.tapButtonTitle == "totalEmployee" ? '#23c6c8' : "#1872ab" }}
            onClick={() => this.tapButtonClick("totalEmployee")}
          >
            Total Employee
          </button>
           {/* : ''} */}
          {/* {sidebarPermission.length > 0 && sidebarPermission.filter(d=>d.permission == 'Expense') && sidebarPermission.filter(d=>d.permission == 'Expense')[0].access ==true ?  */}
            <button
            style={{ ...btn, backgroundColor: this.state.tapButtonTitle == "expense" ? '#23c6c8' : "#1872ab" }}
            onClick={() => this.tapButtonClick("expense")}
          >
            Expense
          </button>
           {/* : ''} */}
          {/* {sidebarPermission.length > 0 && sidebarPermission.filter(d=>d.permission == 'Compansation and Benefit') && sidebarPermission.filter(d=>d.permission == 'Compansation and Benefit')[0].access ==true ? 
            <button
            style={{ ...btn, backgroundColor: this.state.tapButtonTitle == "benefit" ? '#23c6c8' : "#1872ab" }}
            onClick={() => this.tapButtonClick("benefit")}
              >
            Compansation and Benefit
            </button> : ''
          } */}

          
          {
            this.state.compensation_permission && this.state.compensation_permission.length > 0 || this.state.user.user_id == 1110 || this.state.user.user_id == 1467 ? 
            <button
            style={{ ...btn, backgroundColor: this.state.tapButtonTitle == "benefit" ? '#23c6c8' : "#1872ab" }}
            onClick={() => this.tapButtonClick("benefit")}
              >
            Compansation and Benefit
            </button> : ''
          }
       
        {/* {sidebarPermission.length > 0 && sidebarPermission.filter(d=>d.permission == 'Help Desk') && sidebarPermission.filter(d=>d.permission == 'Help Desk')[0].access ==true ?  */}
            <button style={{ ...btn, backgroundColor: this.state.tapButtonTitle == "helpdesk" ? '#23c6c8' : "#1872ab" }} onClick={() => this.tapButtonClick('helpdesk')}>Help Desk</button> 
             {/* : ""} */}
        {/* {sidebarPermission.length > 0 && sidebarPermission.filter(d=>d.permission == 'Resign') && sidebarPermission.filter(d=>d.permission == 'Resign')[0].access ==true ?  */}

          <button style={{ ...btn, backgroundColor: this.state.tapButtonTitle == "resign" ? '#23c6c8' : "#1872ab" }} onClick={() => this.tapButtonClick("resign")}>Resign</button>
           {/* : ''} */}
        </div> : ''}
        
        <Profile onClickFixAssetList={this.onClickFixAssetList}tapButtonTitle={this.state.tapButtonTitle} />
        {this.state.tapButtonTitle == "headCount" ? (
          <div className="row mt-4" style={{ marginTop: 15, position: "relative", left: "18%" }}>
            <div className="col-md-8 col-lg-8 col-sm-12">
              <HeadCountBarChart title={"department"} />
            </div>
            <div className="col-md-8 col-lg-8 col-sm-12">
              <HeadCountBarChart title={"designation"} />
            </div>
          </div>
        ) : this.state.tapButtonTitle == "attendenceChart" ? (
          <div
            className="row mt-4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 15
            }}
          >
            <div className="col-lg-10">
              <AttendenceBarChart />
            </div>
          </div>
        ) : this.state.tapButtonTitle == "totalEmployee" ? (
          <div
            className="row mt-4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 15
            }}
          >
            <div className="col-md-8">
              <EmployeePieChart />
            </div>
          </div>
        ) : this.state.tapButtonTitle == "benefit" ? (
          <div className="row mt-4" style={{
            display: 'flex',
            justifyContent: "center",
            alignItems: 'center',
            marginTop: "13px"
          }}>
            <div className="col-md-8">

              <CompensationandBenefit></CompensationandBenefit>
            </div>
          </div>
        ) : this.state.tapButtonTitle == "expense" ? (
          <div className="row mt-4" style={{
            display: 'flex',
            justifyContent: "center",
            alignItems: 'center',
            marginTop: "15px"
          }}>
            <div className="col-md-8">

              <BenefitBarChart></BenefitBarChart>

            </div>
          </div>
        ) : this.state.tapButtonTitle == "helpdesk" ? (
          <div className="row mt-4">
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
              <HelpDesk></HelpDesk>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
              <HelpDeskLineChart></HelpDeskLineChart>
            </div>
          </div>
        ) : this.state.tapButtonTitle == "leaveChart" ? (
          <div
            className="row mt-4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 15
            }}
          >
            <div className="col-lg-8">
              <LeaveCountBarChart />
            </div>
          </div>
        ) : this.state.tapButtonTitle == "resign" ? (
          <div
            className="row mt-4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 15
            }}
          >
            <div className="col-lg-8">
              <ResignBarChart />
            </div>
          </div>
        ) :
        this.state.tapButtonTitle == "active" ? (
            <div style={{ marginTop: 10 }}>
              {/* <table width="99%"
                className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                id="dataTables-table"
              /> */}
             <FixedAssectListTable ></FixedAssectListTable>

            </div>
          ) : (
            <div>
              <div className="row mt-4" style={{ marginTop: 15 }}>
                <div className="col-md-4 col-lg-4 col-sm-12">
                  <ThingsTodoTable />
                </div>
                <div className="col-md-8 col-lg-8 col-sm-12 d-flex column"style={{marginTop:5,marginRight:0}} >
                  <AttendanceCaldendar />
                  <LeaveCalendar />
                </div></div>
            </div>
          )}
      </div>
    );
  }
}


const styles = {

  tapButtonStyle: {

    // backgroundColor:this.state.color,
    color: "white",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    borderColor: "transparent",

  },
  smallContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  profileLeftText: {
    width: "45%",
    color: primary,
    fontSize: 10,
  },
  profileMiddleText: {
    width: "5%",
    color: primary,
  },
  profileRightText: {
    width: "50%",
    color: primary,
    fontSize: 10,
    display: "flex",
    alignSelf: "flex-start",
  },
};
