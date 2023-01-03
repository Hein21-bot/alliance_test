import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import moment from 'moment'
import DatePicker from 'react-datetime';
import { imgData } from '../../../utils/Global';
import * as jsPDF from 'jspdf';
import Select from "react-select";
import { main_url, getMainRole,getFirstDayOfYear, getInformation, getUserId, setPrintedStatus, print, fno,getPermissionStatus,getCookieData } from "../../../utils/CommonFunction";
const $ = require('jquery');
const jzip = require('jzip');

window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');


$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

const default_y=10;
export default class BackPayTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: getUserId("user_info"),
            user_info: getCookieData("user_info"),
            dataSource: [],
            selectedRequest: '',
            is_main_role: getMainRole(),
            to_date: moment() ,
            from_date:getFirstDayOfYear(),
            tab:this.props.tab,
            regionList: [],
            branchList: [],
            departmentList: [],
            selected_month: new Date(),
            selected_region: "",
            selected_branch: "",
            selected_department: "",
            permission_status:{}
        }
    }
    async componentDidMount() {
      var permission_status = await getPermissionStatus(this.state.user_info.designations_id,'PayrollForBackPay-RefundAndTemporaryContract','PayrollForBackPay-RefundAndTemporaryContract');
    this.setState({
        permission_status: permission_status
    })
        this.$el = $(this.el);
        this.getBranchList();
        this.getDepartmentList();
        this.getRegionList();

        this.setState({
            dataSource: this.state.dataSource
        }, () => {
            console.log("datasource",this.state.dataSource)
            this._setTableData(this.state.dataSource)
        });

        let that = this;
        $("#dataTables-table").on('click', '#toView', function () {

            var data = $(this).find("#view").text();
            data = $.parseJSON(data);
            // alert(JSON.stringify(data,2,undefined));
            that.props.goToViewForm(data);

        });

        $("#dataTables-table").on('click', '#toEdit', function () {

            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            that.props.goToEditForm(data);

        });
        $("#dataTables-table").on('click', '#toPrint', function () {


            // fetch(`${main_url}wedding_benefit/getWeddingAvailableAmount`)
            //     .then(res => { if (res.ok) return res.json() })
            //     .then(list => {

                    var data = $(this).find("#print").text();
                    data = $.parseJSON(data);

                    that.getPrintData(data)
                // })

        });
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.dataSource != this.props.dataSource) {
          this.setState(
            {
              dataSource: this.props.dataSource,
            },
            () => {
              this._setTableData(this.state.dataSource);
            }
          );
        }
      }


    getRequest() {
        this.search(0);
    }
    getCheck() {
        this.search(1);
    }

    getVerified() {
        this.search(2);
    }
    getApprove() {
        this.search(3);
    }
    getReject() {
        this.search(4);
    }
    // getAllBenefits() {
    //     let id = this.state.user_id;

    //     fetch(main_url + "wedding_benefit/getWeddingBenefit/" + id )
    //         .then(response => {
    //             if (response.ok) return response.json()
    //         })
    //         .then(res => {
    //             if (res) {
    //                 this.setState({ 
    //                     data: res,
    //                     requestData:res.filter(v=>v.createdBy != this.state.user_id),
    //                 }, () => this._setTableData(this.state.requestData))
    //             }
    //         })
    //         .catch(error => console.error(`Fetch Error =\n`, error));

    // }
    // getMyBenefits() {
    //     let id = this.state.user_id;

    //     fetch(main_url + "wedding_benefit/getWeddingBenefit/" + id)
    //         .then(response => {
    //             if (response.ok) return response.json()
    //         })
    //         .then(res => {
    //             if (res) {
    //                 this.setState({ 
    //                     datasource: res,
    //                     requestData:res.filter(v=>v.createdBy == this.state.user_id)
    //                 }, () => this._setTableData(this.state.requestData))
    //             }
    //         })
    //         .catch(error => console.error(`Fetch Error =\n`, error));

    // }
    handleStartDate = async (event) => {
        this.setState({
          from_date:event
        },()=>{console.log(this.state.s_date)})
      }
      handleEndDate = async (event) => {
        this.setState({
          to_date:event
        },()=>{console.log(this.state.e_date)})
      }
      filter() {
        if (this.state.tab == 0) {
            this.getAllBenefits();
        } else if (this.state.tab == 1) {
            this.getMyBenefits();
        }
    }
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
    
      getDepartmentList() {
        fetch(main_url + `main/getDepartment`)
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((res1) => {
          res1.unshift({ label: "All", value: 0 })
          this.setState({ departmentList: res1 });
        })
        .catch((error) => console.error(`Fetch Error =\n`, error));
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
    search(status) {
        let data = this.state.dataSource;
        data = data.filter(d => { return status === d.status });
        this._setTableData(data)
    }
    handleSelectedMonth = (event) => {
        this.setState({
          selected_month: event,
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
    
      handleSelectedDepartment = (event) => {
        if (event !== null)
                  this.setState({
                    selected_department: event,
                  });
              };
      
      async getStatusInfo(id) {
        var res = await fetch(`${main_url}back_pay/getOneDetailInfo/${id}`);
        if (res.ok) return res.json();
        else return [];
      }
       async getBackPay(id){
         var res = await fetch(`${main_url}back_pay/get_back_pay_details/${id}`);
         if (res.ok) return res.json();
         else return [];
       }
    handleSearchData = async (s_date, e_date, user_id) => {
        const departmentId = this.state.selected_department ? this.state.selected_department.value : 0
      const branchId = this.state.selected_branch ? this.state.selected_branch.value :0
      const regionId = this.state.selected_region ? this.state.selected_region.value : 0
        fetch(`${main_url}back_pay/get_back_pay/${regionId}/${branchId}/${departmentId}/${moment(this.state.selected_month).format('YYYY-MM')}/${this.state.user_id}`)
          .then(res => { if (res.ok) return res.json() })
          .then((res) => {
            if (res) {
              this.setState({ dataSource: res },()=>{ this._setTableData(res)});
            }
          })
          .catch((error) => console.error(`Fetch Error =\n`, error));
      }
    async getPrintData(data) {
      console.log("data====>",data)
        var info = await getInformation('back_pay',data.id)
        var today = moment(Date.now()).format('YYYY-MM-DD')
        var doc = new jsPDF("p", "mm", "a4");
        var col = [
          "No",
          "Employee ID",
          "Name",
          "Position",
          "Department",
          "Branch",
          "Region",
          "Backpay Amount",
          "Reason",
          "ATM or Cash",
          "Remark"
        ];
        var rows = [];
        var claim = await this.getBackPay(data.id);
        let one = {};
        if (claim.length > 0) {
          for (let i = 0; i < claim.length; i++) {
            one = claim[i];
            rows.push([
              i+1,
              one.employment_id,
              one.fullname,
              one.designations,
              one.deptname,
              one.location_master_name,
              one.state_name,
              one.total_salary,
              one.reason,
              one.atm_cash == 0 ? "ATM":'Cash',
              one.remark
            ]);
          }
        }
        console.log("rows",rows)
        rows.push(["Total", "", "", "", "", "","",claim.reduce((r,c)=>r+c.total_salary,0),"","",""]);
        doc.autoTable(col, rows, { startY: 55});
        if (doc.previousAutoTable.finalY > 220) {
            doc.addPage();
            doc.previousAutoTable.finalY = 0;
        }
        doc.setFontSize(10);
        doc.addImage(imgData, 'image/jpeg', 10, 10, 50, 15)
        doc.text('HR_0021 V3', 150, 15);
        doc.text('BackPay Request Form', 150, 25)
        doc.text('Generate Date: ' + today, 13, 40)
        doc.text('Voucher No: ' + fno.fno_backpay + data.form_no, 150, 40)
        doc.setFontType("bold");
        doc.text('Request By', 13, doc.previousAutoTable.finalY + 17)
        doc.text('Check By', 65, doc.previousAutoTable.finalY + 17)
        doc.text('Verify By', 114, doc.previousAutoTable.finalY + 17)
        doc.text('Approve By', 164, doc.previousAutoTable.finalY + 17)
        doc.setFontSize(9);
        doc.setFontType("normal");
        doc.text(moment(info.requested.requested_date).format('YYYY-MM-DD'), 13, doc.previousAutoTable.finalY + 25)
        doc.text(info.requested.employment_id, 13, doc.previousAutoTable.finalY + 30)
        doc.text(info.requested.requested_by, 13, doc.previousAutoTable.finalY + 35)
        doc.text(info.requested.branch_name, 13, doc.previousAutoTable.finalY + 40)
        doc.text(info.requested.designations, 13, doc.previousAutoTable.finalY + 45)
        doc.text(moment(info.checked.checked_date).format('YYYY-MM-DD'), 65, doc.previousAutoTable.finalY + 25)
        doc.text(info.checked.employment_id, 65, doc.previousAutoTable.finalY + 30)
        doc.text(info.checked.checked_by, 65, doc.previousAutoTable.finalY + 35)
        doc.text(info.checked.branch_name, 65, doc.previousAutoTable.finalY + 40)
        doc.text(info.checked.designations, 65, doc.previousAutoTable.finalY + 45)
        doc.text(moment(info.verified.verified_date).format('YYYY-MM-DD'), 114, doc.previousAutoTable.finalY + 25)
        doc.text(info.verified.employment_id, 114, doc.previousAutoTable.finalY + 30)
        doc.text(info.verified.verified_by, 114, doc.previousAutoTable.finalY + 35)
        doc.text(info.verified.branch_name, 114, doc.previousAutoTable.finalY + 40)
        doc.text(info.verified.designations, 114, doc.previousAutoTable.finalY + 45)
        doc.text(moment(info.approved.approved_date).format('YYYY-MM-DD'), 164, doc.previousAutoTable.finalY + 25)
        doc.text(info.approved.employment_id, 164, doc.previousAutoTable.finalY + 30)
        doc.text(info.approved.approved_by, 164, doc.previousAutoTable.finalY + 35)
        doc.text(info.approved.branch_name, 164, doc.previousAutoTable.finalY + 40)
        doc.text(info.approved.designations, 164, doc.previousAutoTable.finalY + 45)
        await setPrintedStatus("back_pay", data.id);
        doc.save('Backpay.pdf');
        print(doc, data)
    }
    // async getPrintData(data) {
      // var info = await getInformation("back_pay", data.id);
      // var doc = new jsPDF("l", "mm", "a4");
      // var today = moment(Date.now()).format("DD-MM-YYYY");
      // var name = '';
      // doc.setFontSize(12);
      // doc.addImage(imgData, "image/jpeg", 10, 10, 50, 15);
      // doc.text("HR_0029", 200, 15);
      // doc.text("BackPay Form", 200, 25);
      // doc.text("Generate Date: " + today, 13, 40);
      // doc.text("Voucher No: " + fno.fno_backpay + data.form_no, 200, 40);
      // if (data.isClaim === 0) {
        // this.setTravelAdvanceData(doc, data, 50);
      // } else if (data.isClaim === 1) {
        // await this.setTravelClaimData(doc, data, data.travel_allowance_id, 50);
      // }
      // if (doc.previousAutoTable.finalY > 150) {
        // doc.addPage();
        // doc.previousAutoTable.finalY = 0;
      // }
      // doc.setFontSize(10);
      // doc.setFontType("bold");
      // doc.text("Request By", 13, doc.previousAutoTable.finalY + 20);
      // doc.text("Check By", 65, doc.previousAutoTable.finalY + 20);
      // doc.text("Verify By", 114, doc.previousAutoTable.finalY + 20);
      // doc.text("Approve By", 164, doc.previousAutoTable.finalY + 20);
      // doc.setFontSize(9);
      // doc.setFontType("normal");
      // doc.text(
        // info.requested.requested_date,
        // 13,
        // doc.previousAutoTable.finalY + 25
      // );
      // doc.text(
        // info.requested.employment_id,
        // 13,
        // doc.previousAutoTable.finalY + 30
      // );
      // doc.text(
        // info.requested.requested_by,
        // 13,
        // doc.previousAutoTable.finalY + 35
      // );
      // doc.text(info.requested.branch_name, 13, doc.previousAutoTable.finalY + 40);
      // doc.text(
        // info.requested.designations,
        // 13,
        // doc.previousAutoTable.finalY + 45
      // );
      // doc.text(info.checked.checked_date, 65, doc.previousAutoTable.finalY + 25);
      // doc.text(info.checked.employment_id, 65, doc.previousAutoTable.finalY + 30);
      // doc.text(info.checked.checked_by, 65, doc.previousAutoTable.finalY + 35);
      // doc.text(info.checked.branch_name, 65, doc.previousAutoTable.finalY + 40);
      // doc.text(info.checked.designations, 65, doc.previousAutoTable.finalY + 45);
      // doc.text(
        // info.verified.verified_date,
        // 114,
        // doc.previousAutoTable.finalY + 25
      // );
      // doc.text(
        // info.verified.employment_id,
        // 114,
        // doc.previousAutoTable.finalY + 30
      // );
      // doc.text(info.verified.verified_by, 114, doc.previousAutoTable.finalY + 35);
      // doc.text(info.verified.branch_name, 114, doc.previousAutoTable.finalY + 40);
      // doc.text(
        // info.verified.designations,
        // 114,
        // doc.previousAutoTable.finalY + 45
      // );
      // doc.text(
        // info.approved.approved_date,
        // 164,
        // doc.previousAutoTable.finalY + 25
      // );
      // doc.text(
        // info.approved.employment_id,
        // 164,
        // doc.previousAutoTable.finalY + 30
      // );
      // doc.text(info.approved.approved_by, 164, doc.previousAutoTable.finalY + 35);
      // doc.text(info.approved.branch_name, 164, doc.previousAutoTable.finalY + 40);
      // doc.text(
        // info.approved.designations,
        // 164,
        // doc.previousAutoTable.finalY + 45
      // );
      // doc.save(name + '.pdf');
      // print(doc, data);
    // }

    _setTableData = (data) => {
        console.log("table",data);
        var table;
        var l = [];
        var status;
        // var permission = this.props.permission;
        var has_action = this.state.permission_status.isView === 1 || this.state.permission_status.isEdit === 1 ? true : false;
        if(data){
            for (var i = 0; i < data.length; i++) {
                console.log("stauts",data[i].status)
                let result = data[i];
                let obj = [];
                if (result.status === 0) {
                    status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'
    
                }
                else if (result.status === 1) {
                    status = '<small class="label label-warning" style="background-color:#b33ce0"> Check</small>'
                }
                else if (result.status === 2) {
                    status = '<small class="label label-warning" style="background-color:#f2a509"> Verify</small>'
                }
                else if (result.status === 3) {
                    status = '<small class="label label-warning" style="background-color:#29a50a">Approve</small>'
                }
                else if (result.status === 4) {
    
                    status = '<small class="label label-warning" style="background-color:#f60e2f"> Reject</small>'
                }
                else if (result.status === 5) {
                    status = '<small class="label label-warning" style="background-color:#cc0066"> ReferBack </small>'
                }
    
                obj = {
                    no: i + 1,
                    request_month:data[i].requested_month ? moment(data[i].requested_month).format('YYYY-MM') : '-',
                    form_no:data[i].form_no ? data[i].form_no : '-',
                    employee_id: data[i].employment_id ? data[i].employment_id: '-',
                    employee_name: data[i].fullname ? data[i].fullname: '-',
                    designation: data[i].designations ? data[i].designations : '-',
                    department: data[i].deptname ? data[i].deptname : '-',
                    branch: data[i].location_master_name ? data[i].location_master_name : '-',
                    region: data[i].state_name ? data[i].state_name : '-',
                    amount:data[i].total ? data[i].total: "-",
                    status:status
                }
                if (has_action) {
                    if (result.status !== 3) {
                        obj.action = this.state.permission_status.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';
                        obj.action += this.state.permission_status.isEdit === 1 || (result.status == 5 && data[i].createdBy == this.state.user_id ) ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' : '';
                    } else {
                        obj.action = this.state.permission_status.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';
    
                        if (result.print === 1) {
                            obj.action +=
                                '<button style="margin-right:10px" class="btn btn-info btn-sm own-btn-edit" id="toPrint" ><span id="print" class="hidden" >' +
                                JSON.stringify(result) +
                                '</span>  <i className="fa fa-cogs"></i>&nbsp;Printed</button>';
                        } else {
                            obj.action +=
                                '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toPrint" ><span id="print" class="hidden" >' +
                                JSON.stringify(result) +
                                '</span>  <i className="fa fa-cogs"></i>&nbsp;Print</button>';
                        }
                    }
                }
            //     obj.action =
            //     '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' +
            //     JSON.stringify(result) +
            //     '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>';
            //   obj.action +=
            //     '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' +
            //     JSON.stringify(result) +
            //     '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>';
                l.push(obj)
    
            }
    
        }
        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty();
        }

        var column = [
            { title: "No", data: "no" },
            { title:"Request Month",data:'request_month'},
            { title:'Form No',data:'form_no'},
            { title: "Employee Id", data: "employee_id" },
            { title: "Employee Name", data: "employee_name" },
            { title: "Designation", data: "designation" },
            { title: 'Department', data: 'department'},
            { title: "Branch", data: "branch" },
            { title: 'Region', data: 'region'},
            { title: 'Amount',data:'amount'},
            { title : 'Status',data:'status'},
            { title:"Action",data:'action'}
        ]

        // if (has_action) {
        //     column.push({ title: "Action", data: "action" })
        // }

        table = $("#dataTables-table").DataTable({
            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            paging: true,
            pageLength: 50,
            buttons: true,
            dom: 'Bfrtip',
            // buttons: [
            //     'copy', 'csv', 'excel', 'pdf'
            // ],
            buttons: [
                'copy',
                {
                    extend: 'csvHtml5',
                    title: 'BackPay',
                },
                {
                    extend: 'excelHtml5',
                    title: 'BackPay',
                },
                {
                    extend: 'pdfHtml5',
                    title: 'BackPay',
                }],
            data: l,
            columns: column
        });
    }

    render() { console.log("permission status==>",this.state.permission_status)
        return (
            
            <div>
        <div className="row">
       <div className="col-lg-2" >
            <label>Request Month</label>
            <DatePicker
              dateFormat="MM/YYYY"
              value={this.state.selected_month}
              timeFormat={false}
              onChange={this.handleSelectedMonth}
            />
          </div>

          <div className='col-lg-2' >
        <label>Region</label>
        <Select 
          options={this.state.regionList}
          onChange={this.handleSelectedRegion}
          value={this.state.selected_region}
          className="react-select-container"
          classNamePrefix="react-select"/></div>

          <div className='col-lg-2' >
        <label>Branch </label>
        <Select 
          options={this.state.branchList}
          onChange={this.handleSelectedBranch}
          value={this.state.selected_branch}
          className="react-select-container"
          classNamePrefix="react-select"/></div>

          <div className="col-lg-2">
            <label>Department</label>
            <Select
              options={this.state.departmentList}
              onChange={this.handleSelectedDepartment}
              value={this.state.selected_department}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        
          <div
            className="col-lg-2"
            style={{
              marginTop: "25px",
            }}
          >
            <button className="btn-primary btn" onClick={this.handleSearchData.bind(this)}>Search</button>
          </div> </div>

        <div
          className="row"
          style={{ display: "flex", justifyContent: "end", marginRight: 33 }}
        >
          <div className="row">
            <div className="row border-bottom white-bg dashboard-header">
               <div className="col-12">
               
              <div className="row">
                <div class="btn-group-g ">
                  <button
                    type="button"
                    class="btn label-request g"
                    onClick={this.getRequest.bind(this)}
                  >
                    Request
                  </button>
                  <button
                    type="button"
                    class=" btn label-check g"
                    onClick={this.getCheck.bind(this)}
                  >
                    Check
                  </button>
                  <button
                    type="button"
                    class="btn label-verified g"
                    onClick={this.getVerified.bind(this)}
                  >
                    Verify
                  </button>
                  <button
                    type="button"
                    class="btn label-approve g"
                    onClick={this.getApprove.bind(this)}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    class="btn label-reject g"
                    onClick={this.getReject.bind(this)}
                  >
                    Reject
                  </button>
                </div>
              </div>
               </div>
            </div>
          </div>
        </div>
        <table
          width="99%"
          className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
          id="dataTables-table"
        />
      </div>
        )
    }
}
