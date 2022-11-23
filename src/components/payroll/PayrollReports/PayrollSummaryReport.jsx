import React, { Component } from "react";
import { main_url } from '../../../utils/CommonFunction';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import Select from 'react-select';
import DatePicker from 'react-datetime';
import moment from "moment";
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');
class PayrollSummaryReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regionList: null,
      empName: 0,
      martial_status: null,
      contact_person: null,
      contact_phone: null,
      guarantee_contact_person: null,
      guarantee_contact_phone: null,
      phone_no: null,
      employee_id: null,
      employee_date: moment().format("YYYY-MM-DD"),
      selected_Branch: null,
      selected_department: null,
      selected_designation: null,
      selected_region: null,
      designationList: null,
      branchlist: null,
      departmentlist: null,
      branchId: null,
      designationId: null,
      departmentId: null,
      regionId: null,
      EmployeeNameList: null,
      selected_employee: null,
      date:moment().format("YYYY-MM-DD")
    }
  }

  async componentDidMount() {
    this.$el = $(this.el);
    this.setState(
      {
        dataSource: this.props.data,

      },
      () => {
        this._setTableData(this.state.dataSource);
      }

    );
    this.getRegionList();
    this.getBranchList();
    this.handleSearchData();

    
  }
 
  getBranchList() {
    fetch(`${main_url}benefit/getBranchList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          branchlist: list.map((v) => ({
            ...v,
            
          })),
        });
      });
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
  }
 
  handleSelectedBranch = async (event) => {
    if (event != null)
      this.setState({
        selected_Branch: event
      })
  };
 
  handleSelectedRegion = async (event) => {
    if (event != null)
      this.setState({
        selected_region: event
      })
  };
  handleSelectedDate=async(event)=>{
    this.setState({
        date:event
    })
  }
  
  _setTableData = (data) => {
    var table;
    var l = [];
    if (data) {
      for (var i = 0; i < data.length; i++) {
        let result = data[i];
        let obj = [];
        obj = {
          no: i + 1,
          branch: data[i].branch_name ? data[i].branch_name : "-",
          region: data[i].region_name ? data[i].region_name : "-",
          gross_salary:data[i].current_effective_date ? data[i].current_effective_date : '-',
          deduction_or_additions:data[i].current_effective_date ? data[i].current_effective_date : '-',
          salary_after_deductions_additions:data[i].current_effective_date ? data[i].current_effective_date : '-',
          ssc_3:data[i].current_effective_date ? data[i].current_effective_date : '-',
          ssc_2:data[i].current_effective_date ? data[i].current_effective_date : '-',
          income_tax:data[i].current_effective_date ? data[i].current_effective_date : '-',
          net_salary_paid:data[i].current_effective_date ? data[i].current_effective_date : '-',
          total_gross_salary:data[i].current_effective_date ? data[i].current_effective_date : '-',
          maintenance:data[i].current_effective_date ? data[i].current_effective_date : '-',
          petrol:data[i].current_effective_date ? data[i].current_effective_date : '-',
          back_pay:data[i].current_effective_date ? data[i].current_effective_date : '-',

          income_tax_adjust:data[i].current_effective_date ? data[i].current_effective_date : '-',
          use_office_cycle:data[i].current_effective_date ? data[i].current_effective_date : '-',
          salary_cut:data[i].current_effective_date ? data[i].current_effective_date : '-',
          deduction_loan:data[i].current_effective_date ? data[i].current_effective_date : '-',
          total:data[i].current_effective_date ? data[i].current_effective_date : '-',

        }
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
        { title: "Region", data: "region" },
        { title: "Branch Name", data: "branch" },
        { title: "Gross Salary", data: "gross_salary"},
        { title: "Deductions(+)/Additions(-)", data: "deduction_or_additions" },
        { title: "Salary After deductions/additions", data: "salary_after_deductions_additions" },
        { title: "SSC(Employer 3%)", data: "ssc_3"},
        { title: "SSC(Employee 2%)", data: "ssc_2"},
        { title: "Income Tax", data: "income_tax"},
        { title: "Net Salary Paid", data: "net_salary_paid"},
        { title: "Total Gross Salary", data: "total_gross_salary"},
        { title: "Maintenance", data: "maintenance"},

        { title: "Petrol", data: "petrol"},
        { title: "BackPay", data: "back_pay"},
        { title: "Income Tax Adjust", data: "income_tax_adjust"},
        { title: "Deduct for using office cycle", data: "use_office_cycle"},
        { title: "Salary Cut(Tablet)", data: "salary_cut"},
        { title: "Deduction of Loan", data: "deduction_loan"},
        { title: "Total", data: "total"},


      ]
      table = $("#dataTables-table").DataTable({

        autofill: true,
        bLengthChange: false,
        bInfo: false,
        responsive: true,
        pageLength: 50,
        paging: true,
            buttons: true,
        dom: 'Bfrtip',
         buttons: [
       
        'excel'
         ],
        buttons: [
          
          {
              extend: 'excelHtml5',
              title: 'Payroll Summary Report',
          },
         
        ],
        data: l,
        columns: column
      });
    
  }
  handleSearchData = () => {
    // this.setState({
    const branchId = this.state.selected_Branch ? this.state.selected_Branch.value : 0
   
    const regionId = this.state.selected_region ? this.state.selected_region.state_id : 0
    const Date=moment(this.state.date).format('YYYY-MM-DD')
    
    // })

    fetch(main_url + "report/employeeReport/" + regionId + "/"  + branchId + "/" + Date)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this._setTableData(list);
      })
  }
  render() {
  
    return (
      <div>
        <div className="row  white-bg dashboard-header">
        <h3 className="" style={{paddingLeft:"10px"}}>Employee Salary Report</h3>
          <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 10px' }}>
          <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={this.state.date}
                            onChange={this.handleSelectedDate}
                            timeFormat={false}
                        />
          <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                  marginRight:10,
                  marginLeft:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Branch"
              options={this.state.branchlist}
              onChange={this.handleSelectedBranch}
              value={this.state.selected_Branch}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Region"
              options={this.state.regionList}
              onChange={this.handleSelectedRegion}
              value={this.state.selected_region}
              className='react-select-container'
              classNamePrefix="react-select"
            />
           
            
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>
          </div>
        
        <table width="99%"
          className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
          id="dataTables-table"
        />
        <div style={{display:'flex',justifyContent:'center'}}>
        <table className="table table-bordered" style={{width:'20%'}}>
            <thead>
                <tr>
                    <th></th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>ATM</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Cash</td>
                    <td>1312</td>
                </tr>
                <tr>
                    <td>Total</td>
                    <td>3516546</td>
                </tr>
            </tbody>
        </table>
        </div>
      </div>
      </div>
    )
  }
}
export default PayrollSummaryReport;