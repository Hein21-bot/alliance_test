import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'jspdf-autotable';
import Select from "react-select";
import { main_url } from '../../../utils/CommonFunction';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

export default class TicketSubCategoryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:[],
            departmentList:[],
            selected_department:null,
            ticketMainCategoryList:[],
            selected_ticket_main_category:null
        }
    }

    async componentDidMount() {
        await this.getTicketSubCategory()
        await this.getTicketMainCategory()
        await this.getDepartmentList()
        this.showTable(this.state.dataSource)


        // this.setState(
        //     { dataSource: this.props.data },
        //     () => this.showTable(this.state.dataSource)
        // )

    }

    componentDidUpdate(prevProps) {
        if (prevProps.dataSource !== this.state.dataSource) {
            // this.setState({
            //     dataSource: this.props.data
            // }, () => {
                this.showTable(this.state.dataSource);

            // })
        }
    }
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
      getTicketMainCategory() {
        fetch(main_url + `mainCategory/getMainCategory/0`)
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((res1) => {
        let temp=res1.map((v)=>({
            ...v,label:v.category_name,value:v.main_category_id
        }))
         
          this.setState({ ticketMainCategoryList: temp },()=>{
            this.state.ticketMainCategoryList.unshift({ label: "All", value: 0 })
          });
        })
        .catch((error) => console.error(`Fetch Error =\n`, error));
      };

      handleSelectedDepartment=(event)=>{
        this.setState({
            selected_department:event
        })
      }

      handleSelectedTicketMainCategory=(event)=>{
        this.setState({
            selected_ticket_main_category:event
        })
      }
      getTicketSubCategory = async () => {
        let department=this.state.selected_department ?  this.state.selected_department.value : 0
        let ticketmaincategory=this.state.selected_ticket_main_category ? this.state.selected_ticket_main_category.value : 0
        fetch(`${main_url}subCategory/getSubCategory/${department}/${ticketmaincategory}`)
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((res1) => {
        //   res1.unshift({ label: "All", value: 0 })
          this.setState({ dataSource: res1 });
        })
        .catch((error) => console.error(`Fetch Error =\n`, error));
        // var res = await fetch(`${main_url}mainCategory/getMainCategory/${department}`);
        // if (res.ok) return res.json();
        // else return [];
    }

    //   getTicketSubCategory = async () => {
    //     var res = await fetch(`${main_url}subCategory/getSubCategory`);
    //     if (res.ok) return res.json();
    //     else return [];
    // }
      

    showTable(data) {
        var table;
        var self = this;
        var list = [];
        var obj, one = [];

        for (let i = 0; i < data.length; i++) {
            obj = data[i];
            one = {
                no: i + 1,
                department: obj.deptname,
                main_category: obj.category_name,
                sub_category: obj.sub_category_name,
                priority: obj.priority,
                severity: obj.severity_name,
                remark: obj.remark ? obj.remark : '',
                action: '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="View" ><span id="view" class="hidden" >' + JSON.stringify(obj) + '</span>&nbsp;View</button><button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="Edit" ><span id="edit" class="hidden" >' + JSON.stringify(obj) + '</span>&nbsp;Edit</button>',
            }

            list.push(one);
        }

        if ($.fn.dataTable.isDataTable('#dataTables')) {
            table = $('#dataTables').dataTable({
                destroy: true,
                searching: false,
            });
            // table.fnClearTable();
            table.fnDestroy();
            // $('#dataTables').empty();
        }


        var column = [
            { title: 'No', data: 'no' },
            { title: 'Department', data: 'department' },
            { title: 'Main Category', data: 'main_category' },
            { title: 'Sub Category', data: 'sub_category' },
            { title: 'Priority', data: 'priority' },
            { title: 'Severity', data: 'severity' },
            { title: 'Remark', data: 'remark' },
            { title: "Action", data: 'action' }
        ]

        table = $("#dataTables").DataTable({
            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            paging: true,
            buttons: true,
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf'
            ],
            data: list,
            columns: column
        })

        $('#dataTables').on('click', 'tbody #verify_by', function (e) {
            const id = e.target.attributes.id.value;
            const index = Number(e.target.attributes.index.value);
            const value_ = e.target.attributes.value.value;
            let newArr = [...self.state.leavePermissionData]
            newArr[index][id] = value_;
            self.setState(
                { leavePermissionData: newArr },
                () => {
                    document.getElementById(`verify_by${index}`).innerHTML = value_;
                }
            )
        });

        $("#dataTables").on('click', '#Edit', function () {
            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            self.props.goToEditForm(data);

        });
        $("#dataTables").on('click', '#View', function () {
            var data = $(this).find("#view").text();
            data = $.parseJSON(data);
            self.props.goToViewForm(data);

        });

    }

    render() {
        return (
            <div>
                <h3 className="col-md-12">Ticket Sub Category Table</h3>
                <div className='row' style={{display:'flex',alignItems:'end',marginBottom:'10px'}}>
                    <div className="col-md-2">
                    <label>Department</label>
                    <Select 
                    options={this.state.departmentList}
                    onChange={this.handleSelectedDepartment}
                    value={this.state.selected_department}
                    className="react-select-container"
                    classNamePrefix="react-select"/>
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="">Ticket Main Category</label>
                        <Select 
                    options={this.state.ticketMainCategoryList}
                    onChange={this.handleSelectedTicketMainCategory}
                    value={this.state.selected_ticket_main_category}
                    className="react-select-container"
                    classNamePrefix="react-select"/>
                    </div>
                    <div className='col-md-2'>
                    <label htmlFor=""></label>
                    <button className="btn-primary btn" onClick={this.getTicketSubCategory.bind(this)}>Search</button>
                    </div>
                </div>
                <table width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive rm-marginTop"
                    id="dataTables"
                ></table>
            </div >
        )
    }
}
