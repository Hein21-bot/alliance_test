import React, { Component } from 'react'
import Selector from './Selector';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'jspdf-autotable';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');


export default class LeavePermission extends Component{
    constructor(props){
        super(props);
        this.state={
            leavePermissionData: []
        }
    }

    componentDidMount(){
        this.setState(
            {leavePermissionData: tableData},
            ()=>this.showTable(tableData)
        )
    }

    showTable(data) {
        var table;
        var self = this;

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
            { title: "Leave Category", data: "leave_category", },
            { title: "Designation", data: "designation" },
            { title: "Verify By", data: 'verify_by', orderable:false,type: 'select' },
            { title: "Approve By", data: "approve_by", orderable:false }
        ]
        
        table = $("#dataTables").DataTable({
            autofill: true,
            bLengthChange: true,
            bInfo: false,
            responsive: true,
            paging: false,
            searching: false,
            editor:true,
            lengthChange: true,
            columns: column,
        })
        
        $('#dataTables').on( 'click', 'tbody #verify_by', function (e) {
            const id = e.target.attributes.id.value;
            const index = Number(e.target.attributes.index.value) ;
            const value_ = e.target.attributes.value.value;
            let newArr = [...self.state.leavePermissionData]
            newArr[index][id]=value_;
            self.setState(
                {leavePermissionData:newArr}, 
                ()=>{
                    document.getElementById(`verify_by${index}`).innerHTML=value_;
                }
            )
        } );

        $('#dataTables').on( 'click', 'tbody #approve_by', function (e) {
            const id = e.target.attributes.id.value;
            const index = Number(e.target.attributes.index.value) ;
            const value_ = e.target.attributes.value.value;
            let newArr = [...self.state.leavePermissionData]
            newArr[index][id]=value_;
            self.setState(
                {leavePermissionData:newArr}, 
                ()=>{
                    document.getElementById(`approve_by${index}`).innerHTML=value_;
                }
            )
        } );
 
    }

    render(){
        const { leavePermissionData } = this.state;
        return(
            <div >
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>HR Management System</h2>
                        <ol className="breadcrumb">
                            <li>
                                Setting
                        </li>
                            <li className="active">
                                <a href="#"> Leave Permission</a>
                            </li>
                           
                        </ol>
                    </div>
                </div>
                <div className="row tbl_m_10" />
                <div className="row  border-bottom white-bg dashboard-header">
                    <div className='flex-end whitespace-nowrap' style={{alignItems: 'center' }}>
                        <div style={{ marginRight: 5}}>Leave Category:</div>
                        <div style={{width: 200}}>
                            <Selector 
                                options={leaveCatOptions}
                            />
                        </div>
                    </div>
                    <div className="content">
                        <div className="row tbl_m_10">
                            <table width="99%"
                                className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                                id="dataTables"
                            >
                                <tbody id='Tbody_'>
                                    {
                                        leavePermissionData.map((v,k)=>{
                                            return(
                                            <tr key={k}>
                                                <td>{v.leave_category}</td>
                                                <td>{v.designation}</td>
                                                <td>
                                                <div className="dropdown">
                                                        <button className='btn white-bg select-style' btn-primary id = "dLabel" type = "button" data-toggle="dropdown" >
                                                            <div id={`verify_by${k}`} className='col-lg-11 col-md-11 col-sm-11 text-left' style={{padding: 0}}>{v.verify_by}</div>
                                                            <div className='col-lg-1 col-md-1 col-sm-1'><i className="fa fa-angle-down text-muted"></i></div>
                                                            
                                                        </button >
                                                        <ul className="dropdown-menu" role="menu" aria-labelledby="dLabel">
                                                            {verifyOptions.map((v1,k1)=>
                                                            <li key={k1} id='verify_by' index={k} value={v1.label} style={{ padding: 5, cursor: 'pointer'}}>{v1.label}</li>
                                                        )}
                                                        </ul> 
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="dropdown">
                                                        <button className='btn white-bg select-style' btn-primary id = "dLabel" type = "button" data-toggle="dropdown">
                                                            <div  id={`approve_by${k}`} className='col-lg-11 col-md-11 col-sm-11 text-left' style={{padding: 0}}>{v.approve_by}</div>
                                                            <div className='col-lg-1 col-md-1 col-sm-1'><i className="fa fa-angle-down text-muted"></i></div>
                                                            
                                                        </button >
                                                        <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">
                                                            {approveOptions.map((v2,k2)=>
                                                            <li key={k2} id='approve_by' index={k} value={v2.label} style={{ padding: 5, cursor: 'pointer'}} >{v2.label}</li>
                                                        )}
                                                        </ul> 
                                                    </div>
                                                </td>
                                            </tr>
                                        )})
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='flex-end whitespace-nowrap' style={{alignItems: 'center' }}>
                        <button className='setting-btn bg-green' onClick={()=> console.log('Clicked Save Btn!')}>Save</button>
                        <button className='setting-btn bg-danger' onClick={()=> console.log('Clicked Cancel Btn!')}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }
}

const leaveCatOptions = [
    {id: 1,label: 'Casual Leave', value:'Casual Leave'},
    {id: 2,label: 'Earned Leave', value:'Earned Leave'},
    {id: 3,label: 'Medical Leave', value:'Medical Leave'}
]

const verifyOptions = [
    {id: 1, label: 'Kelvin', value: 'Kelvin'},
    {id: 2, label: 'Jane', value: 'Jane'},
    {id: 3, label: 'Nancy', value: 'Nancy'}
]

const approveOptions = [
    {id: 1, label: 'Josh', value: 'Josh'},
    {id: 2, label: 'Scarlet', value: 'Scarlet'},
    {id: 3, label: 'Joe', value: 'Joe'}
]

const tableData = [
    {id: 101, leave_category: 'Casual Leave', designation: 'IT Manager', verify_by: 'Jane', approve_by: ''},
    {id: 102, leave_category: 'Casual Leave', designation: 'IT Officer', verify_by: 'Kelvin', approve_by: ''},
    {id: 103, leave_category: 'Medical Leave', designation: 'IT Assistant', verify_by: 'Nancy', approve_by: ''},
    {id: 104, leave_category: 'Casual Leave', designation: 'IT Network', verify_by: '', approve_by: 'Josh'},
    {id: 105, leave_category: 'Earned Leave', designation: 'IT Officer', verify_by: 'Jane', approve_by: ''},
    {id: 106, leave_category: 'Casual Leave', designation: 'IT Hardware', verify_by: 'Nancy', approve_by: ''},
    {id: 107, leave_category: 'Earned Leave', designation: 'IT Assistant', verify_by: '', approve_by: ''},
    {id: 108, leave_category: 'Medical Leave', designation: 'IT Manager', verify_by: '', approve_by: 'Scarlet'},
    {id: 109, leave_category: 'Earned Leave', designation: 'IT Manager', verify_by: '', approve_by: ''},
    {id: 110, leave_category: 'Earned Leave', designation: 'IT Officer', verify_by: '', approve_by: ''},
]