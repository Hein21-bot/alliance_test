import React, { Component } from 'react'
import Select from 'react-select'

class TicketSubCategoryView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        }
    }
    render() {
        const { data } = this.state;
        return (
            <div className="container">
                <div className='row'>
                    <form id="check_form">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="department" className="col-sm-12">Department</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control input-md"
                                        value={data.deptname} disabled />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="main_category" className="col-sm-12">Main Category</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control input-md"
                                        value={data.category_name} disabled />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="sub_category" className="col-sm-12">Sub Category</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='sub_category'
                                        className="form-control input-md"
                                        value={data.sub_category_name}
                                        disabled />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="priority" className="col-sm-12">Priority</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control input-md"
                                        value={data.priority} disabled />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="severity" className="col-sm-12">Severity</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='severity'
                                        className="form-control input-md"
                                        value={data.severity_name}
                                        disabled />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="remark" className="col-sm-12">Remark</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control input-md"
                                        value={data.remark} disabled />
                                </div>
                            </div>
                        </div>


                    </form>
                </div>
            </div>
        )
    }
}

export default TicketSubCategoryView