import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'jspdf-autotable';
import moment from "moment";
import Select from 'react-select'
import { getLevel } from "../../../utils/CommonFunction"
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

export default class SalaryTemplateTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: props.data,
            levelStatus: "",
            level: [],
            serach_data: []
        }
    }
    async componentDidMount() {
        this.setState(
            { dataSource: this.props.data },
            () => this.showTable(this.state.dataSource)
        )
        let level = await getLevel();
        level.unshift({ label: "All", value: 0 });
        this.setState({
            level: level
        })
    }
    handleSelectedlevelStatus = async (event) => {
        let levelStatus = this.state.levelStatus
        levelStatus = event
        this.setState({
            levelStatus: levelStatus
        })
    }
    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                dataSource: this.props.data
            }, () => {
                this.showTable(this.state.dataSource);

            })
        }
    }
    handleSearchData = () => {
        this.setState({
            serach_data: this.state.dataSource.filter(v => v.career_level == this.state.levelStatus.value)
        }, () => {
            this.showTable(this.state.serach_data)
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
                remark: obj.remark ? obj.remark : '-',
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
            { title: "Date", data: "date" },
            { title: "Basic Salary", data: "basic_salary" },
            { title: "Career Level", data: 'career_level' },
            { title: "Career Sub Level", data: "career_sub_level", },
            { title: "Remark", data: "remark", },
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
            columns: column,
            stripeClasses: []
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
                <div className='row'>
                    <h3 className="col-md-12">Salary Template Table</h3></div>
                <div className='' style={{ display: "flex" }}>
                    <Select
                        styles={{
                            container: base => ({
                                ...base,
                                //   flex: 1
                                width: 150,
                                //   marginLeft: 10,
                                marginBottom: 20

                            }),
                            control: base => ({
                                ...base,
                                minHeight: '18px'
                            }),

                        }}
                        placeholder="Level"
                        options={this.state.level}
                        onChange={this.handleSelectedlevelStatus}
                        value={this.state.levelStatus}
                        className='react-select-container'
                        classNamePrefix="react-select"
                    />

                    <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>
                </div>
                <table width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive rm-marginTop"
                    id="dataTables"
                ></table>
            </div >
        )
    }
}