import React, { Component } from 'react'
import Select from 'react-select'
import DatePicker from "react-datetime";
import moment from 'moment'
import { main_url } from '../../../utils/CommonFunction';
import { SalarytemplateValidation } from '../SettingValidation';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

export default class SalaryTemplateAddNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment(new Date()).format('MM-DD-YYYY'),
            basic_salary: '',
            career_level: null,
            career_sub_level: null,
            remark: '',
            addData: [],
            validateErr: {},
            editId: null,
            removeId: null
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.addData !== this.state.addData) {
            this.showTable(this.state.addData);
        }
    }

    componentDidMount() {
        this.showTable(this.state.addData)
        // var that = this;
        // $(document).on('click', '#toEdit', function () {
        //     var data = $(this).find("#edit").text();
        //     data = $.parseJSON(data);
        //     let updateData = that.state.claimDetailData[data];
        //     that.setState({ toEdit: true, claimData1: updateData })
        // });
    }

    handleInputChange = (e) => {
        const id = e.target.id;
        const val = e.target.value;
        const setState = {};
        setState[id] = val;
        this.setState(setState)
    }
    handleSelectorChange = (val, key) => {
        const { sub_level_options, level_options } = this.props;
        const value = key === 'career_level' ?
            ((level_options.find(v => Number(v.career_level_id) === Number(val.career_level_id))).career_level_id) :
            ((sub_level_options.find(v => Number(v.career_sub_level_id) === Number(val.career_sub_level_id))).career_sub_level_id);

        const setState = {};
        setState[key] = value;

        this.setState(setState)
    }
    handleAdd = () => {
        const { date, basic_salary, career_level, career_sub_level, addData, editId, removeId } = this.state;
        const data = { date, basic_salary, career_level, career_sub_level }
        const validateErr = SalarytemplateValidation(data);
        this.setState({ validateErr })

        if (Object.keys(validateErr).length === 0) {
            var addData_ = [...addData];
            if (editId) {
                const index = addData.findIndex(v => v.id === editId)
                const editData = { date, basic_salary, career_level, career_sub_level, addData, id: editId }
                addData_.splice(index, 1, editData)
            } else {
                addData_.push({ date, basic_salary, career_level, career_sub_level, id: addData.length + 1 });
            }
            this.setState({
                addData: addData_,
                date: moment(new Date()).format('MM-DD-YYYY'),
                basic_salary: '',
                career_level: null,
                career_sub_level: null,
                remark: '',
                editId: null
            })
        } else {
            this.props.showToast(0, 'Please Add Fully Information.');
        }
    }

    handleEdit = () => {
        console.log("add data is ===>", this.state.addData)
    }

    handleSave = () => {
        let status = 0;
        const { addData, remark } = this.state;
        const data = {
            addData, remark
        }

        fetch(`${main_url}salaryTemplate/addSalaryTemplate`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `data=${JSON.stringify(data)}`

        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                this.props.showToast(status, text);
            })
    }
    showTable(data) {
        var table;
        var self = this;
        var list = [];
        var obj, one = [];
        const { level_options, sub_level_options } = this.props;

        for (let i = 0; i < data.length; i++) {
            obj = data[i];
            one = {
                no: i + 1,
                date: obj.date ? moment(obj.date).format("MM-DD-YYYY") : '',
                basic_salary: obj.basic_salary,
                career_level: ((level_options.find(v => Number(v.career_level_id) === Number(obj.career_level)) ? level_options.find(v => Number(v.career_level_id) === Number(obj.career_level)).career_level : '')),
                career_sub_level: (sub_level_options.find(v => Number(v.career_sub_level_id) === Number(obj.career_sub_level)) ? sub_level_options.find(v => Number(v.career_sub_level_id) === Number(obj.career_sub_level)).career_sub_level : ''),
                action: '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="Edit" ><span id="edit" class="hidden" >' + JSON.stringify(obj) + '</span>&nbsp;Edit</button><button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="Remove" ><span id="remove" class="hidden" >' + JSON.stringify(obj) + '</span>&nbsp;Remove</button>',
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
            { title: "Date", data: "date" },
            { title: "Basic Salary", data: "basic_salary" },
            { title: "Career Level", data: 'career_level' },
            { title: "Career Sub Level", data: "career_sub_level", },
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
            data: list,
            buttons: [],
            columns: column
        })



        // $('#dataTables').on('click', 'tbody #verify_by', function (e) {
        //     const id = e.target.attributes.id.value;
        //     const index = Number(e.target.attributes.index.value);
        //     const value_ = e.target.attributes.value.value;
        //     let newArr = [...self.state.leavePermissionData]
        //     newArr[index][id] = value_;
        //     self.setState(
        //         { leavePermissionData: newArr },
        //         () => {
        //             document.getElementById(`verify_by${index}`).innerHTML = value_;
        //         }
        //     )
        // });

        $("#dataTables").on('click', '#Edit', function (event) {
            event.preventDefault();
            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            self.goToEdit(data);

        });

        $("#dataTables").on('click', '#Remove', function (event) {
            event.preventDefault();
            var data = $(this).find("#remove").text();
            data = $.parseJSON(data);
            self.goToRemove(data);

        });

    }

    goToEdit = (data) => {
        this.setState({
            editId: data.id,
            date: data.date,
            basic_salary: data.basic_salary,
            career_level: data.career_level,
            career_sub_level: data.career_sub_level
        })
    }

    goToRemove = (data) => {
        let dataForRemove = this.state.addData
        let newData = dataForRemove.filter(v => v.id != data.id)
        this.setState({
            addData: newData
        })
    }

    render() {
        const { date, basic_salary, career_level, career_sub_level, remark, addData } = this.state;
        const { level_options, sub_level_options } = this.props;
        const selectedCareerLevel = level_options.find(v => Number(v.career_level_id) === Number(career_level));
        const selectedCareerSubLevel = sub_level_options.find(v => Number(v.career_sub_level_id) === Number(career_sub_level));
        const FilteredCareerSubLevel = career_level ? sub_level_options.filter(v => Number(v.career_level_id) === Number(career_level)) : sub_level_options;

        return (
            <div className="container">
                <div className='row'>
                    <form id="check_form">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="date" className="col-sm-12">Date</label></div>
                                <div className="col-sm-10">
                                    {/* <input
                                        type="text"
                                        className="form-control input-md"
                                        value={date ? moment(date).format("MM-DD-YYYY") : ''} disabled /> */}
                                    <DatePicker
                                        dateFormat="MM-DD-YYYY"
                                        value={date ? moment(date).format("MM-DD-YYYY") : ''}
                                        timeFormat={false}
                                        open={false}
                                    // inputProps={{ disabled: true }}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="career_level" className="col-sm-12">Career Level<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose An Option"
                                        options={level_options}
                                        onChange={(val) => this.handleSelectorChange(val, 'career_level')}
                                        value={selectedCareerLevel ? selectedCareerLevel : null}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                        styles={{
                                            control: provided => ({
                                                ...provided,
                                                border: this.state.validateErr.careerLevelErr ? '1px solid red' : '1px solid #e5e5e5',
                                                cursor: "pointer"
                                            })
                                        }}
                                    />
                                </div>

                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="career_level" className="col-sm-12">Career Sub Level<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose An Option"
                                        options={FilteredCareerSubLevel}
                                        onChange={(val) => this.handleSelectorChange(val, 'career_sub_level')}
                                        value={selectedCareerSubLevel ? selectedCareerSubLevel : null}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                        styles={{
                                            control: provided => ({
                                                ...provided,
                                                border: this.state.validateErr.careerSubLevelErr ? '1px solid red' : '1px solid #e5e5e5',
                                                cursor: "pointer"
                                            })
                                        }} />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="basic_salary" className="col-sm-12">Basic Salary<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="number"
                                        id='basic_salary'
                                        className="form-control input-md"
                                        value={basic_salary}
                                        onChange={this.handleInputChange}
                                        style={{ border: this.state.validateErr.basicSalaryErr && '1px solid red' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row save-btn">
                            <div className="float-right">
                                {/* this.save.bind(this) */}
                                <button onClick={() => this.handleAdd()} className="btn btn-primary" id="saving_button" type="button">Add</button>
                            </div>
                        </div>
                        <div className="row margin-y">
                            {/* <ShowTable
                                addData={addData}
                                level_options={level_options}
                                sub_level_options={sub_level_options}
                            /> */}
                            <table width="99%"
                                className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive rm-marginTop"
                                id="dataTables"
                            ></table>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="remark" className="col-sm-12">Remark</label></div>
                                <div className="col-sm-10">
                                    <textarea
                                        className="form-control"
                                        id='remark'
                                        cols="40"
                                        rows="2"
                                        value={remark}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row save-btn">
                            <div className="float-right">
                                <button onClick={() => this.handleSave()} disabled={addData.length > 0 ? false : true} className="btn btn-primary" id="saving_button" type="button">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}


const ShowTable = ({ addData, level_options, sub_level_options }) => {
    const header = ['Date', 'Basic Salary', 'Career Level', 'Career Sub Level']
    const getCareerLevel = (level) => {
        return level_options.find(v => Number(v.career_level_id) === Number(level)).career_level;
    }
    const getCareerSubLevel = (sub_level) => {
        return sub_level_options.find(v => Number(v.career_sub_level_id) === Number(sub_level)).career_sub_level;
    }
    return (
        <div className='col-md-10' style={{ margin: '20px 0px 20px 35px' }}>
            <table style={{ width: '100%', border: '1px solid #aaa', textAlign: 'center' }}>
                <thead>
                    <tr>
                        {
                            header.map((v, k) =>
                                <th key={k} style={{ border: '1px solid #aaa', padding: '5px 0px', textAlign: 'center' }}>{v}</th>
                            )
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        addData.length > 0 ?
                            (addData.map((v1, k1) =>
                                <tr key={k1} style={{}}>
                                    <td style={{ border: '1px solid #aaa' }}>{v1.date}</td>
                                    <td style={{ border: '1px solid #aaa' }}>{v1.basic_salary}</td>
                                    <td style={{ border: '1px solid #aaa' }}>{v1.career_level ? getCareerLevel(v1.career_level) : null}</td>
                                    <td style={{ border: '1px solid #aaa' }}>{v1.career_sub_level ? getCareerSubLevel(v1.career_sub_level) : null}</td>
                                </tr>
                            ))
                            :
                            (<tr style={{}}>
                                <td style={{ border: '1px solid #aaa' }}>-</td>
                                <td style={{ border: '1px solid #aaa' }}>-</td>
                                <td style={{ border: '1px solid #aaa' }}>-</td>
                                <td style={{ border: '1px solid #aaa' }}>-</td>
                            </tr>)
                    }
                </tbody>
            </table>
        </div>
    )
}
