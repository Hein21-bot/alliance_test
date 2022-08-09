import React,{Component} from "react";
import {getBranch,getRegion,getDepartment,main_url,getFirstDayOfMonth, getTicketStatus} from '../../utils/CommonFunction';
import DatePicker from 'react-datetime';
import moment from "moment";
import Select from "react-select";
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');


class HoStaffReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    
    

    
        render(){
          
        return (
            <div>
                <table className="table table-bordered">
                    <thead>
                    <tr style={{backgroundColor:'blue',color:'white'}}>
                        <th style={{width:100,textAlign:'center'}}>Department</th>
                        <th style={{width:200,textAlign:'center'}}>Position</th>
                        <th style={{width:50,textAlign:'center'}}>Male</th>
                        <th style={{width:50,textAlign:'center'}}>Female</th>
                        <th style={{width:50,textAlign:'center'}}>Total</th>

                    </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{textAlign:'center'}} colSpan={2}>CEO</td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td></td>
                            <td style={{display:'flex',justifyContent:'center',alignItems:'center'}} rowSpan={3}>3</td>
                           
                            
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}} colSpan={2}>COO</td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}></td>
                            
                            
                            
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}} colSpan={2}>CFO</td>
                            <td style={{textAlign:'center'}}></td>
                            <td style={{textAlign:'center'}}>1</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}} rowSpan={4}>HR department</td>
                            <td style={{textAlign:'center'}}>HR Manager</td>
                            <td style={{textAlign:'center'}}>-</td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}} rowSpan={4}>6</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>Senior HR Officer </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>Senior HR Officer </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}> HR Assistant </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>2</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}} rowSpan={5}>Training</td>
                            <td style={{textAlign:'center'}}> Regional Trainer </td>
                            <td style={{textAlign:'center'}}>-</td>
                            <td style={{textAlign:'center'}}>2</td>
                            <td style={{textAlign:'center'}} rowSpan={5}>6</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>  Sr Learning and Development Manager  </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>  Deputy Training Manager  </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}> System Trainer   </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}> Training Logistics Assistant    </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}} rowSpan={5}>Finance Department</td>
                            <td style={{textAlign:'center'}}>  Sr Reporting Officer  </td>
                            <td style={{textAlign:'center'}}>-</td>
                            <td style={{textAlign:'center'}}>2</td>
                            <td style={{textAlign:'center'}} rowSpan={5}>6</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>  Senior Treasury Officer   </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}> Sr Funding Officer  </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>  Accounting Officer    </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>  Accounting Assistant     </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}} rowSpan={4}>Marketing</td>
                            <td style={{textAlign:'center'}}>Marketing Manager </td>
                            <td style={{textAlign:'center'}}>-</td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}} rowSpan={4}>6</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>Sr Branding Officer  </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}> Customer Service Officer  </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>Customer Service Assistant  </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>2</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}} rowSpan={6}>IT Department</td>
                            <td style={{textAlign:'center'}}> IT Manager </td>
                            <td style={{textAlign:'center'}}>-</td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}} rowSpan={6}>6</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>Sr IT Officer  </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}> IT Porject Officer   </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>IT Officer   </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>2</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}> IT Officer (Software Support)   </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}> IT Assistant   </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>2</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}} rowSpan={9}>Operation</td>
                            <td style={{textAlign:'center'}}>  Operation Manager  </td>
                            <td style={{textAlign:'center'}}>-</td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}} rowSpan={9}>6</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}> Sr Agriculture PM   </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>  Sr SME PM   </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}> BSM    </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>2</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}> BSO    </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}> Business Development Manager   </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>2</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>Sr Cashier   </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>2</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}> Recovery Officer   </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>  Cash and Back Office Manager   </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>2</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}} rowSpan={5}>Audit</td>
                            <td style={{textAlign:'center'}}>   Sr Audit Manager   </td>
                            <td style={{textAlign:'center'}}>-</td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}} rowSpan={5}>6</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>  Deputy Audit Manager   </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}> Regional Internal Audit Supervisor   </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}> Sr Auditor    </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>2</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>  Jr Auditor     </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}} rowSpan={3}>Risk</td>
                            <td style={{textAlign:'center'}}>   Risk Manager   </td>
                            <td style={{textAlign:'center'}}>-</td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}} rowSpan={3}>6</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}>  Risk Supervisor  </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}}> Regional Risk Monitor   </td>
                            <td style={{textAlign:'center'}}>1</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}} colSpan={4}>Total</td>
                            <td style={{textAlign:'center'}}>9</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}} colSpan={4}>Regional Staff </td>
                            <td style={{textAlign:'center'}}>9</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}} colSpan={4}>Branch Staff </td>
                            <td style={{textAlign:'center'}}>9</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}} colSpan={4}>Grand Total</td>
                            <td style={{textAlign:'center'}}>9</td>
                        </tr>

                    </tbody>

                </table>
           </div>
        )
    }
}
    export default HoStaffReport;