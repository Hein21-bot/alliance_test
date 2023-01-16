import React, { Component } from 'react'
import { main_url, validate, startSaving, alertText } from '../../../utils/CommonFunction';
import { ToastContainer, toast } from 'react-toastify';

var form_validate = true;

class DepartmentEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            department:props.data.deptname,
            remark: props.data.remark,
            active: props.data.active,
            id: props.data.departments_id
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }
    handleInputChange=(e)=>{
        this.setState({
           department:e.target.value
        })
       }
       handleInput=(e)=>{
           this.setState({
               remark:e.target.value
           })
       }
       handleCheckChange=(e)=>{
       this.setState({
           active: e.target.checked ? 1 : 0
       })
       }
    handleSave = () => {
        if (validate('check_form')) {
            let status = 0
            const { department, remark, active } = this.state;
            const data = {
              active, department, remark
            }
            fetch(`${main_url}department/editDepartment/${this.state.id}`, {
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
        } else {
            toast.error(alertText, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            startSaving();
            form_validate = false;
        }
    }
    render() { console.log(this.state.department);
    
        return (
            <div className="container">
            <ToastContainer/>
            <div className='row'>
                <form id="check_form">
                    <div className="row">
                        <div className="form-group col-md-6">
                            <div><label htmlFor="designations" className="col-sm-12">Department</label></div>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    id='designations'
                                    className="form-control checkValidate"
                                    value={this.state.department}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </div>                        
                        <div className="form-group col-md-6">
                            <div className='col-sm-10' >
                                <div className='col-md-8' style={{ padding: 0 }}>
                                    <div><label htmlFor="remark" className="col-sm-12">Remark</label></div>
                                    <input
                                        type="text"
                                        id='remark'
                                        className="form-control"
                                        value={this.state.remark}
                                        onChange={this.handleInput}
                                    />
                                </div>
                                <div className='col-md-4' style={{ padding: 0 }}>
                                    <div><label htmlFor="active" className="col-sm-12 text-center" style={{}}>Active</label></div>
                                    <div className="col-sm-12" style={{}}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 5 }}>
                                            <input
                                                type="checkbox"
                                                id={'active'}
                                                checked={this.state.active == 0 ? false : true}
                                                onChange={(e) => this.handleCheckChange(e)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row save-btn">
                        <div className="float-right">
                            
                            <button onClick={() => this.handleSave()} className="btn btn-primary" id="saving_button" type="button">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        )
    }
}

export default DepartmentEdit