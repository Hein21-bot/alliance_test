import React, { Component } from 'react'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import { toast, ToastContainer } from 'react-toastify';
import Select from 'react-select';
import {
    main_url, getDesignation, getUserId
} from '../../utils/CommonFunction';
// include styles
import 'rodal/lib/rodal.css';
import 'react-toastify/dist/ReactToastify.min.css';

export default class PermissionAddNew
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createdBy: getUserId("user_info"),
            dataSource: props.data,
            designation: [],
            selectedDesignation: ''

        }
    }

    add = () => {

        let data = {
            dataSource: this.state.dataSource,
            createdBy: this.state.createdBy,
            designation: this.state.selectedDesignation.value
        }

        fetch(main_url + 'permission/addPermissionApproval', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `info=${JSON.stringify(data)}`

        })
            .then(data => data.text())
            .then(data => {
                if (data === 'success') {

                    window.location.reload();

                }
                else {
                    this.props.showToast(data);
                }
            })

    }
    async componentDidMount() {
        let designation = await getDesignation();
        this.setState({
            designation: designation,

        })

    }
    handleSelectedDesignation = (event) => {


        this.setState({ selectedDesignation: event })
    }
    render() {

        return (
            <div>
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>HR Management System</h2>
                        <ol className="breadcrumb">
                            <li>
                                Allowance
                        </li>
                            <li className="active">
                                <a>Permission Add New </a>
                            </li>

                        </ol>
                    </div>
                    <div className="col-lg-2" style={{ marginTop: '2%' }}>
                        <button className="btn btn-primary" onClick={this.props.goBack}>Back To List</button>
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight" id="check_form">

                    <div className="form-horizontal" name="demo-form">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Designation<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">
                                        <Select
                                            placeholder="Choose Permission Type"
                                            value={this.state.dataSource.designation}
                                            onChange={this.handleSelectedDesignation}
                                            options={this.state.designation}
                                            className='react-select-container checkValidate'
                                            classNamePrefix="react-select"
                                        />

                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Permission Type</th>
                                        <th>Permission Title</th>
                                        <th>Add New</th>
                                        <th>Edit</th>
                                        <th>View</th>

                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        this.state.dataSource.length <= 0 ?

                                            <td colSpan="3" class="text-center">No data</td> :
                                            this.state.dataSource.map((data, index) =>
                                                data.detail.map((title, index) =>
                                                    index === 0 ?
                                                        <tr key={index}>
                                                            <td rowSpan={data.detail.length}>{data.permission_type}</td>
                                                            <td>{title.permission_title}</td>
                                                            <td>
                                                                <div className="pretty p-default p-curve">
                                                                    <input type="checkbox"
                                                                        onChange={(e) =>
                                                                            title.isAddNew = e.target.checked

                                                                        } />
                                                                    <div className="state p-success-o">
                                                                        <label></label>
                                                                    </div>
                                                                </div></td>
                                                            <td>
                                                                <div className="pretty p-default p-curve">
                                                                    <input type="checkbox"
                                                                        onChange={(e) =>
                                                                            title.isEdit = e.target.checked

                                                                        } />
                                                                    <div className="state p-success-o">
                                                                        <label></label>
                                                                    </div>
                                                                </div></td>
                                                            <td>
                                                                <div className="pretty p-default p-curve">
                                                                    <input type="checkbox"
                                                                        onChange={(e) =>
                                                                            title.isView = e.target.checked

                                                                        } />
                                                                    <div className="state p-success-o">
                                                                        <label></label>
                                                                    </div>
                                                                </div></td>
                                                        </tr>
                                                        : <tr key={index}>
                                                            <td>{title.permission_title}</td>
                                                            <td>
                                                                <div className="pretty p-default p-curve">
                                                                    <input type="checkbox"
                                                                        onChange={(e) =>
                                                                            title.isAddNew = e.target.checked

                                                                        } />
                                                                    <div className="state p-success-o">
                                                                        <label></label>
                                                                    </div>
                                                                </div></td>
                                                            <td>
                                                                <div className="pretty p-default p-curve">
                                                                    <input type="checkbox"
                                                                        onChange={(e) =>
                                                                            title.isEdit = e.target.checked

                                                                        } />
                                                                    <div className="state p-success-o">
                                                                        <label></label>
                                                                    </div>
                                                                </div></td>
                                                            <td>
                                                                <div className="pretty p-default p-curve">
                                                                    <input type="checkbox"
                                                                        onChange={(e) =>
                                                                            title.isView = e.target.checked

                                                                        } />
                                                                    <div className="state p-success-o">
                                                                        <label></label>
                                                                    </div>
                                                                </div></td>

                                                        </tr>

                                                )

                                            )

                                    }
                                </tbody>
                            </table>

                        </div></div>

                    <div className="col-md-12 btn-rightend">

                        <button onClick={this.add.bind(this)} className="btn btn-primary"><span>Confirm</span> </button>
                    </div>
                </div>



            </div >
        )
    }
}