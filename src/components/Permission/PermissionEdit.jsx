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

export default class PermissionEdit
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: props.data,
            designation: [],
            updatedBy: getUserId("user_info"),
            selectedDesignation: ''

        }
    }
    changeAddNew = (titleIndex, typeIndex, value) => {
        let ds = this.state.dataSource;
        let array = ds[typeIndex].detail;
        array[titleIndex].isAddNew = value.target.checked
        ds[typeIndex].detail = array;
        this.setState({
            dataSource: ds
        })
    }

    changeView = (titleIndex, typeIndex, value) => {
        let ds = this.state.dataSource;
        let array = ds[typeIndex].detail;
        array[titleIndex].isView = value.target.checked
        ds[typeIndex].detail = array;
        this.setState({
            dataSource: ds
        })

    }
    changeEdit = (titleIndex, typeIndex, value) => {
        let ds = this.state.dataSource;
        let array = ds[typeIndex].detail;
        array[titleIndex].isEdit = value.target.checked
        ds[typeIndex].detail = array;
        this.setState({
            dataSource: ds
        })

    }

    add = () => {

        let data = {
            dataSource: this.state.dataSource,
            updatedBy: this.state.updatedBy
        }

        fetch(main_url + 'permission/editPermissionApproval/' + this.state.dataSource[0].detail[0].designations, {
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
                    toast.error('😰 Failed', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }
            })

    }
    getDesignationName(id) {

        let type = this.state.designation;

        let result = [];
        for (let i = 0; i < type.length; i++) {

            if (id === type[i].value) {

                result = type[i];
                break;
            }
        }

        return result.label;
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

                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>HR Management System</h2>
                        <ol className="breadcrumb">
                            <li>
                                Allowance
                        </li>
                            <li className="active">
                                <a>Permission Edit</a>
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
                                        <input
                                            className="form-control"
                                            placeholder="Choose Permission Type"
                                            value={this.getDesignationName(this.state.dataSource[0].detail[0].designations)}
                                            disabled
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
                                            this.state.dataSource.map((data, indx) =>
                                                data.detail.map((title, index) =>
                                                    index === 0 ?
                                                        <tr key={index}>
                                                            <td rowSpan={data.detail.length}>{data.permission_type}</td>
                                                            <td>{title.permission_title}</td>
                                                            <td>
                                                                <div className="pretty p-default p-curve">
                                                                    <input type="checkbox"
                                                                        onChange={this.changeAddNew.bind(this, index, indx)}
                                                                        checked={title.isAddNew === 1 || title.isAddNew === true ? 'checked' : ''} />

                                                                    <div className="state p-success-o">
                                                                        <label></label>
                                                                    </div>
                                                                </div></td>
                                                            <td>
                                                                <div className="pretty p-default p-curve">
                                                                    <input type="checkbox"
                                                                        onChange={this.changeEdit.bind(this, index, indx)}
                                                                        checked={title.isEdit === 1 || title.isEdit === true ? 'checked' : ''} />

                                                                    <div className="state p-success-o">
                                                                        <label></label>
                                                                    </div>
                                                                </div></td>
                                                            <td>
                                                                <div className="pretty p-default p-curve">
                                                                    <input type="checkbox"
                                                                        onChange={this.changeView.bind(this, index, indx)}
                                                                        checked={title.isView === 1 || title.isView === true ? 'checked' : ''} />


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
                                                                        onChange={this.changeAddNew.bind(this, index, indx)}
                                                                        checked={title.isAddNew === 1 || title.isAddNew === true ? 'checked' : ''} />
                                                                    <div className="state p-success-o">
                                                                        <label></label>
                                                                    </div>
                                                                </div></td>
                                                            <td>
                                                                <div className="pretty p-default p-curve">
                                                                    <input type="checkbox"
                                                                        onChange={this.changeEdit.bind(this, index, indx)}
                                                                        checked={title.isEdit === 1 || title.isEdit === true ? 'checked' : ''} />
                                                                    <div className="state p-success-o">
                                                                        <label></label>
                                                                    </div>
                                                                </div></td>
                                                            <td>
                                                                <div className="pretty p-default p-curve">
                                                                    <input type="checkbox"
                                                                        onChange={this.changeView.bind(this, index, indx)}
                                                                        checked={title.isView === 1 || title.isView === true ? 'checked' : ''} />
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