import React, { Component } from 'react'
import Select from 'react-select'

class TicketMainCategoryView extends Component {
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
                                <div><label htmlFor="category_name" className="col-sm-12">Category Name</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control input-md"
                                        value={data.category_name} disabled />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="department" className="col-sm-12">Department</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control input-md"
                                        value={data.deptname} disabled />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="ticket_type" className="col-sm-12">Ticket Type</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='ticket_type'
                                        className="form-control input-md"
                                        value={data.ticket_status}
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

export default TicketMainCategoryView