import React, { Component } from 'react'
import Select from 'react-select'
import { main_url } from '../../../utils/CommonFunction';
import { CareerPathValidation } from '../SettingValidation';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

export default class CareerPathAddNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            career_level: null,
            career_sub_level: null,
            promotion_quota: null,
            addData: [],
            validateErr: {}
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.addData !== this.state.addData) {
            this.showTable(this.state.addData);
        }
    }

    componentDidMount() {
        this.showTable(this.state.addData)
        let that = this
        $(document).on('click', '#toRemove', function () {
            var data = $(this).find("#remove").text();
            data = $.parseJSON(data);
            

            let newData = that.state.addData;
         
            newData.splice(data, 1)
            that.setState({
                addData: newData
            }, () => that.showTable(newData))

        });
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
        const { career_level, career_sub_level, promotion_quota, addData } = this.state;
        const data = { career_level, career_sub_level, promotion_quota }
        const validateErr = CareerPathValidation(data);
        this.setState({ validateErr })
        if (Object.keys(validateErr).length === 0) {
            const addData_ = [...addData];
            addData_.push({ career_level, career_sub_level, promotion_quota });
            this.setState({
                addData: addData_,
                career_level: null,
                career_sub_level: null,
                promotion_quota: null
            })
        } else {
            this.props.showToast(0, 'Please Add Fully Information.');
        }
    }
    handleSave = () => {
        let status = 0;
        const { addData } = this.state;
        const data = addData
        fetch(`${main_url}careerPathSetting/addCareerPath`, {
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
        var list = [];
        var obj, one = [];
        const { level_options, sub_level_options } = this.props;

        for (let i = 0; i < data.length; i++) {
            obj = data[i];
            const index = i
            one = {
                no: i + 1,
                career_level: ((level_options.find(v => Number(v.career_level_id) === Number(obj.career_level)) ? level_options.find(v => Number(v.career_level_id) === Number(obj.career_level)).career_level : '')),
                career_sub_level: (sub_level_options.find(v => Number(v.career_sub_level_id) === Number(obj.career_sub_level)) ? sub_level_options.find(v => Number(v.career_sub_level_id) === Number(obj.career_sub_level)).career_sub_level : ''),
                promotion_quota: obj.promotion_quota,
                action: '<div style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toRemove" ><span id="remove" class="hidden" >' + index + '</span>  <i className="fa fa-cogs"></i>&nbsp;Remove</div>'
            }

            list.push(one);
        }


        if ($.fn.dataTable.isDataTable('#dataTables')) {
            table = $('#dataTables').dataTable({
                destroy: true,
                searching: false,
            });
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables').empty();
        }


        var column = [
            { title: 'No', data: 'no' },
            { title: "Career Level", data: 'career_level' },
            { title: "Career Sub Level", data: "career_sub_level", },
            { title: "Promotion Quota", data: "promotion_quota", },
            { title: "Action", data: 'action' },
        ]

        table = $("#dataTables").DataTable({
            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            buttons: false,
            paging: false,
            // dom: 'Bfrtip',
            buttons: [],
            data: list,
            columns: column
            // autofill: true,
            // bLengthChange: false,
            // bInfo: false,
            // responsive: true,
            // paging: true,
            // buttons: true,
            // // dom: 'Bfrtip',
            // buttons: [],
            // data: list,
            // columns: column
        })

    }

    render() {
        const { career_level, career_sub_level, promotion_quota, addData } = this.state;
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
                            <div className="form-group col-md-6">
                                <div><label htmlFor="career_sub_level" className="col-sm-12">Career Sub Level<span className="text-danger">*</span></label></div>
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
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="promotion_quota" className="col-sm-12">Promotion Quota<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id="promotion_quota"
                                        className="form-control input-md"
                                        value={promotion_quota ? promotion_quota : ''}
                                        onChange={this.handleInputChange}
                                        style={{ border: this.state.validateErr.promotionQuotaErr && '1px solid red' }}
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


// const ShowTable = ({ addData, level_options, sub_level_options }) => {
//     const header = ['Career Level', 'Career Sub Level', 'Promotion Quota']
//     const getCareerLevel = (level) => {
//         return level_options.find(v => Number(v.career_level_id) === Number(level)).career_level;
//     }
//     const getCareerSubLevel = (sub_level) => {
//         return sub_level_options.find(v => Number(v.career_sub_level_id) === Number(sub_level)).career_sub_level;
//     }
//     return (
//         <div className='col-md-10' style={{ margin: '20px 0px 20px 35px' }}>
//             <table style={{ width: '100%', border: '1px solid #aaa', textAlign: 'center' }}>
//                 <thead>
//                     <tr>
//                         {
//                             header.map((v, k) =>
//                                 <th key={k} style={{ border: '1px solid #aaa', padding: '5px 0px', textAlign: 'center' }}>{v}</th>
//                             )
//                         }
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {
//                         addData.length > 0 ?
//                             (addData.map((v1, k1) =>
//                                 <tr key={k1} style={{}}>
//                                     <td style={{ border: '1px solid #aaa' }}>{v1.career_level ? getCareerLevel(v1.career_level) : null}</td>
//                                     <td style={{ border: '1px solid #aaa' }}>{v1.career_sub_level ? getCareerSubLevel(v1.career_sub_level) : null}</td>
//                                     <td style={{ border: '1px solid #aaa' }}>{v1.promotion_quota}</td>
//                                 </tr>
//                             ))
//                             :
//                             (<tr style={{}}>
//                                 <td style={{ border: '1px solid #aaa' }}>-</td>
//                                 <td style={{ border: '1px solid #aaa' }}>-</td>
//                                 <td style={{ border: '1px solid #aaa' }}>-</td>
//                             </tr>)
//                     }
//                 </tbody>
//             </table>
//         </div>
//     )
// }
