import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import SettingHeader from '../SettingHeader';
import { main_url } from '../../../utils/CommonFunction';

export default class Payroll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datasource: [],
            Deduction: [],
            Addition: [],
            Other: []
        }
    }

    async componentDidMount() {
      await this.getPayRoll()
    }

    getPayRoll = async() => {
        const datasource = await this.fetchPayroll();
        const Deduction = datasource.filter((v) => v.type === 'Deduction')
        const Addition = datasource.filter((v) => v.type === 'Addition')
        const Other = datasource.filter((v) => v.type === 'Other')
        this.setState({
            datasource,
            Deduction,
            Addition,
            Other
        })
    }

    handleCheckChange = (e, type) => {
        const arr = type === 'Deduction' ? this.state.Deduction : type === 'Addition' ? this.state.Addition : this.state.Other
        const newArr = [...arr];
        const index = newArr.findIndex(v => Number(v.id) === Number(e.target.id))
        newArr[index].check = e.target.checked === true ? 1 : 0
        const state = {};
        state[type] = newArr;
        this.setState(state)
    }

    fetchPayroll = async () => {
        var res = await fetch(`${main_url}payroll/getPayroll`);
        if (res.ok) return res.json();
        else return [];
    }

    handleSave = () => {
        let status = 0;
        const { Deduction, Addition, Other } = this.state;
        const data = [...Deduction, ...Addition, ...Other]
        fetch(`${main_url}payroll/editPayroll`, {
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
                this.showToast(status, text);
            })
    }

    showToast = (status, text) => {

        if (status === 200) {
            toast.success(text);
            this.getPayRoll()
        }
        else {
            toast.error(text);
        }

    }

    render() {
        return (
            <div className='payroll border-bottom white-bg dashboard-header'>
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <SettingHeader
                    pageTitle="Payroll Setting"
                    permission={{ isAddNew: false }}
                />
                <div className="container margin-y">
                    <div className='row' style={{ display: 'flex', justifyContent: 'center' }}>
                        <table style={{ width: '80%', maxWidth: '1000px' }}>
                            <thead className='text-white' style={{ background: '#27568A', border: '1px solid #27568A' }}>
                                <tr>
                                    <th className='col-md-4' style={{ padding: '5px 20px', textAlign: 'start' }}>Deduction</th>
                                    <th className='col-md-4' style={{ padding: '5px 20px', textAlign: 'start' }}>Addition</th>
                                    <th className='col-md-4' style={{ padding: '5px 20px', textAlign: 'start' }}>Other</th>
                                </tr>
                            </thead>
                            <tbody style={{ border: '1px solid #aaa', }}>
                                <tr style={{}}>
                                    <td style={{ verticalAlign: 'top' }}>
                                        {this.state.Deduction.map((v, k) => (
                                            <div className='col-md-10' key={k} >
                                                <input className='checkbox_' type="checkbox" id={v.id} name={v.name} checked={v.check} style={{ paddingRight: 10, marginRight: 5, marginTop: 5 }} onChange={(e) => this.handleCheckChange(e, v.type)} />
                                                <label for={v.id}> {v.name}</label>
                                            </div>
                                        ))}
                                    </td>
                                    <td style={{ verticalAlign: 'top' }}>
                                        {this.state.Addition.map((v, k) => (
                                            <div className='col-md-10' key={k}>
                                                <input className='checkbox_' type="checkbox" id={v.id} name={v.name} checked={v.check} style={{ paddingRight: 10, marginRight: 5, marginTop: 5 }} onChange={(e) => this.handleCheckChange(e, v.type)} />
                                                <label for={v.id}> {v.name}</label>
                                            </div>
                                        ))}
                                    </td>
                                    <td style={{ verticalAlign: 'top' }}>
                                        {this.state.Other.map((v, k) => (
                                            <div className='col-md-10' key={k}>
                                                <input className='checkbox_' type="checkbox" id={v.id} name={v.name} checked={v.check} style={{ paddingRight: 10, marginRight: 5, marginTop: 5 }} onChange={(e) => this.handleCheckChange(e, v.type)} />
                                                <label for={v.id}> {v.name}</label>
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row save-btn ">
                        <div className="float-right margin-y">
                            <button onClick={() => this.handleSave()} className="btn btn-primary" id="saving_button" type="button">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}