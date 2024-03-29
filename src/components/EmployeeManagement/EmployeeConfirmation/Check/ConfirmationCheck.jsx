import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../../utils/CommonFunction";
import CheckTable from './CheckTable'
import EditCheckForm from './EditCheckForm';



class ConfirmationCheck extends Component {
    constructor() {
        super();
        this.state = {
            user_info: getCookieData("user_info"),
            user_id: getUserId("user_info"),
            is_main_role: getMainRole(),
            checkListData: null,
            selectedCheckBox: null,
            edit: false,
            selectedTableData: null,
            fullname: null,
            employment_id: null,
            designations: null,
            department: null,
            level: null,
            letterWarning: false,
            score: '',
            achievement: '',
            warningDate: '',
            recommendation: '',
            date: '',
            extensionPeriod: '',
            extensionComment: '',
            comment: '',
            effectiveDate: '',
            view: false,
            selected_user_id: null,
            tabel_id: null,
            selected_checkList: [],
            checkedAll: false,
            status: null,
            verify_person_data: null,
            check_person_data: null,
            ceo_data: null,
            checkPerson: null,
            verifyPerson: null,
            sub_level_options: [],
            selected_sub_level: [],
            status_info: [],
            confirmPerson: null,
            checkAt: null,
            confirmAt: null,
            verifyAt: null,
            approveAt: null,
           
        }

    }

    async componentDidMount() {
        await this.getCheckListData()
        const sub_level = await this.getCareerSubLevelOptions();

        const sub_level_options = sub_level && sub_level.map(v => (
            {
                ...v,
                label: v.career_sub_level,
                value: v.career_sub_level
            }
        ))
       

        this.setState({
            sub_level_options
        })
    }

    getCareerSubLevelOptions = async () => {
        var res = await fetch(`${main_url}allowLevel/getCareerSubLevel`);
        if (res.ok) return res.json();
        else return [];
    }
    


    getWarning(user_id) {
        fetch(`${main_url}confirmation/getWarning/${user_id}`)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({
                        letterWarning: true,
                        warningDate: res[0].letter_warning_date
                    })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    getCheckListData() {

        fetch(`${main_url}confirmation/getConfirmationdata/${getCookieData("user_info").user_id}/${getCookieData("user_info").user_id}/0/0/0/0/0`)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    let data = this.state.user_id == 921 ? res.filter(c => c.status == 3).map(v => ({ ...v, select: true })) : res.filter(c => c.check_person == this.state.user_id || c.confirm_person == this.state.user_id || c.isHR == "HR" || c.request_person == this.state.user_id).map(v => ({ ...v, select: true }))
                    this.setState({
                        checkListData: data,
                    })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }

    handleCheckBoxChange = (data) => {
        const { selected_checkList } = this.state
        const newData = {
            id: data.table_id
        }
        if (selected_checkList.length === 0) {
            this.setState({
                selected_checkList: selected_checkList.concat(newData)
            })
        }
        else if (selected_checkList.filter(c => c.id === data.table_id).length > 0) {
            for (var i = 0; i < selected_checkList.length; i++) {
                if (selected_checkList[i].id == data.table_id) {
                    selected_checkList.splice(i, 1)
                }
            }
            this.setState({
                selected_checkList
            })
        }
        else {
            this.setState({
                selected_checkList: selected_checkList.concat(newData)
            })
        }
    }

    handleSelectedSubLevel = (event) => {
        
        this.setState({
            selected_sub_level: event,
            recommend_level: event.career_sub_level_id,
            

        })
    }
    

    goToViewForm = data => {
        fetch(`${main_url}confirmation/getActionStatus/${data.table_id}`)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                this.setState({
                    status_info: res
                })
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
        this.setState({
            view: true,
            selected_user_id: data.user_id,
            tabel_id: data.table_id,
            selectedTableData: data,
            extensionPeriod: data.extension_period ? data.extension_period : '',
            extensionComment: data.extension_comment ? data.extension_comment : '',
            effectiveDate: data.effective_date,
            fullname: data.fullname,
            employment_id: data.employment_id,
            designations: data.designations,
            department: data.deptname,
            level: data.career_sub_level,
            letterWarning: data.letter_warning ? data.letter_warning : false,
            score: data.performance_score ? data.performance_score : '',
            achievement: data.target_achievement ? data.target_achievement : '',
            warningDate: data.letter_warning_date ? moment.utc(data.letter_warning_date).format("YYYY-MM-DD") : '-',
            recommendation: data.recommendation,
            date: data.date ? moment.utc(data.date).format("YYYY-MM-DD") : '-',//moment(data.createdAt).format("DD/MM/YYYY"),
            career_level_id: data.career_level_id,
            recommend_level: data.recommend_level,
            comment: data.comment_overall_performance,
            stauts:data.status
        })
    }

    goToEditForm = data => {
        this.getWarning(data.user_id)
        this.setState({
            edit: true,
            selected_user_id: data.user_id,
            tabel_id: data.table_id,
            checkPerson: data.check_person,
            confirmPerson: data.confirm_person,
            verifyPerson: data.verify_person,
            selectedTableData: data,
            checkAt: data.checkAt,
            confirmAt: data.confirmAt,
            verifyAt: data.verifyAt,
            approveAt: data.approveAt,
            extensionPeriod: data.extension_period ? data.extension_period : '',
            extensionComment: data.extension_comment ? data.extension_comment : '',
            effectiveDate: data.effective_date ? moment(data.effective_date).format('YYYY-MM-DD') : data.effective_date,
            fullname: data.fullname,
            employment_id: data.employment_id,
            designations: data.designations,
            department: data.deptname,
            level: data.career_sub_level,
            letterWarning: data.letter_warning ? data.letter_warning : false,
            score: data.performance_score ? data.performance_score : '',
            achievement: data.target_achievement ? data.target_achievement : '',
            status: data.status,
            warningDate: data.letter_warning_date ? moment.utc(data.letter_warning_date).format("YYYY-MM-DD") : '-',
            recommendation: data.recommendation === null ? 'Confirmation' : data.recommendation,
            date: data.date ? moment.utc(data.date).format("YYYY-MM-DD") : '-',//moment(data.createdAt).format("DD/MM/YYYY"),
            career_level_id: data.career_level_id,
            recommend_level: data.recommend_level,
            comment: data.comment_overall_performance,
        })
    }

    BackToTable = () => {
        this.setState({
            view: false
        })
        this.getCheckListData()
    }
    handleEditCheckInputChange = e => {
        if (e.target.name === "score") {
            this.setState({
                score: e.target.value
            })
        }
        else if (e.target.name === "achievement") {
            this.setState({
                achievement: e.target.value
            })
        }
        else if (e.target.name === "letterWarningDate") {
            this.setState({
                warningDate: e.target.value
            })
        }
        else if (e.target.name === "extensionPeriod") {
            this.setState({
                extensionPeriod: e.target.value
            })
        }
        else if (e.target.name === "extensionComment") {
            this.setState({
                extensionComment: e.target.value
            })
        }

        else if (e.target.name === "effectiveDate") {
            this.setState({
                effectiveDate: e.target.value
            })
        }
        else if (e.target.name === "comment") {
            this.setState({
                comment: e.target.value
            })
        }
    }

    onRecommendationChange = e => {
        this.setState({
            recommendation: e.target.value
        })
    }

    handleLetterWarningChange = e => {
        this.setState({
            letterWarning: !this.state.letterWarning
        })
    }
    handleSelectAllChange = () => {
        this.setState({
            checkedAll: !this.state.checkedAll,
            
        },()=>{
            if(this.state.checkedAll == true){
                this.setState({
                    selected_checkList: this.state.checkListData.map(v => {
                        let R = {}
                        R.id = v.table_id
                        return R
                    })
                })
            }else {
                this.setState({
                    selected_checkList:[]
                })
                
            }
        })
        
        console.log(this.state.checkedAll,this.state.selected_checkList)
    }

    handleConfirmRequest = () => {
        if (this.state.selected_checkList.length > 0) {
            let data = {
                person: getCookieData("user_info").user_id,
                list: this.state.selected_checkList,
                status: 2,
                confirm_or_not: this.state.recommendation,
                confirmAt: moment.format(new Date()).format('YYYY-MM-DD'),
                extension_comment: this.state.extensionComment,
            }

            let status = 0;
            fetch(`${main_url}confirmation/updateConfirmation`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `confirmation=${JSON.stringify(data)}`
            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    if (status === 200) {
                        toast.success(text);
                        window.location.reload();
                    }
                    else toast.error(text);
                    window.location.reload();
                    // window.location.replace("/confirmation_list");

                })

        }
        else toast.error('Please choose at least one user!')
    }

    handleVerifyRequest = () => {
        if (this.state.selected_checkList.length > 0) {


            let data = {
                person: getCookieData("user_info").user_id,
                list: this.state.selected_checkList,
                status: 3,
                confirm_or_not: this.state.recommendation,
                verifyAt: moment.format(new Date).format('YYYY-MM-DD'),
                extension_comment: this.state.extensionComment
            }

            let status = 0;
            fetch(`${main_url}confirmation/updateConfirmation`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `confirmation=${JSON.stringify(data)}`
            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    if (status === 200) {
                        toast.success(text);
                        window.location.reload();
                    }
                    else toast.error(text);
                    window.location.replace("/confirmation_list");

                })

        }
        else toast.error('Please choose at least one user!')
    }

    handleApproveRequest = () => {
        if (this.state.selected_checkList.length > 0) {
            let data = {
                person: getCookieData("user_info").user_id,
                list: this.state.selected_checkList,
                status: 4,
                confirm_or_not: this.state.recommendation,
                approveAt: moment(new Date()).format('YYYY-MM-DD'),
                extension_comment: this.state.extensionComment
            }

            let status = 0;
            fetch(`${main_url}confirmation/updateConfirmation`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `confirmation=${JSON.stringify(data)}`
            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    if (status === 200) {
                        toast.success(text);
                        window.location.reload();
                    }
                    else toast.error(text);
                    window.location.reload()

                })

        }
        else toast.error('Please choose at least one user!')
    }

    handleSubmit = e => {
        e.preventDefault();
        const { fullname, employment_id, designations, selected_user_id, tabel_id, department, level, letterWarning, score, achievement, warningDate, recommendation, date, extensionPeriod, extensionComment, comment, effectiveDate, selected_sub_level, checkAt, confirmAt, verifyAt, approveAt } = this.state
        let data = {
            fullname,
            employment_id,
            designations,
            department,
            level,
            letter_warning: letterWarning === true ? 1 : 0,
            performance_score: score,
            target_achievement: achievement,
            warning_date: warningDate,
            recommendation,
            extension_period: extensionPeriod,
            extension_comment: extensionComment,
            comment_overall_performance: comment,
            effective_date: effectiveDate,
            user_id: selected_user_id,
            status: this.state.status == 1 ? 2 : this.state.status == 2 ? 3 : 1,
            confirm_or_not: this.state.status == 1 ? recommendation : null,
            confirm_career_sub_level: selected_sub_level.career_sub_level_id,
            recommend_level: selected_sub_level.career_sub_level_id,
            checkAt: this.state.status == 0 ? moment(new Date()).format('YYYY-MM-DD') : moment(checkAt).format('YYYY-MM-DD'),
            confirmAt: this.state.status == 1 ? moment(new Date()).format('YYYY-MM-DD') : confirmAt ? moment(confirmAt).format('YYYY-MM-DD') : null,
            verifyAt: this.state.status == 2 ? moment(new Date()).format('YYYY-MM-DD') : verifyAt ? moment(verifyAt).format('YYYY-MM-DD') : null,
            approveAt: null,
            verify_person: this.state.user_id,
           
        }
        


        let status = 0;
        fetch(`${main_url}confirmation/updateConfirmationDetail/${tabel_id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `checkList=${JSON.stringify(data)}`
        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                if (status === 200) {
                    toast.success(text);
                    this.setState({
                        edit: false
                    })
                    window.location.reload();
                }
                else toast.error(text);
                window.location.reload()
                

            })

    }
    render() {
        let verify_person = this.state.checkListData && (this.state.checkListData[0] ? this.state.checkListData[0].verify_person : null)
        let check_person = this.state.checkListData && (this.state.checkListData[0] ? this.state.checkListData[0].check_person : null)
        const { selected_checkList, extensionPeriod, extensionComment, comment, effectiveDate, checkedAll, edit, view, selectedTableData, fullname, employment_id, designations, department, level, letterWarning, score, achievement, warningDate, status, recommendation, date, checkPerson, verifyPerson, sub_level_options, career_level_id, selected_sub_level, recommend_level, status_info, confirmPerson, checkAt, confirmAt, verifyAt, approveAt,checkListData } = this.state
        return (
            <div className=" border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-12">
                        <ol className="breadcrumb">
                            <li style={{ fontSize: 18 }}>
                                Employee
                            </li>
                            <li style={{ fontSize: 18 }}>
                                Confirmation
                            </li>
                            <li style={{ fontSize: 18 }}>
                                Check
                            </li>


                        </ol>
                        {
                            edit || view ? <div style={{ display: 'flex', paddingTop: 10, justifyContent: 'flex-start', marginBottom: -10 }}>

                                <button className='' onClick={() => this.setState({ edit: false, view: false })} style={{ borderRadius: 5, padding: 10, margin: 10, background: '#337ab7', color: 'white', border: 'none', width: 130 }}>
                                    {'< Back '}
                                </button>
                            </div> : null
                        }
                    </div>

                </div>

                {
                    edit ?
                        <EditCheckForm
                            selectedTableData={selectedTableData}
                            handleEditCheckInputChange={this.handleEditCheckInputChange}
                            onRecommendationChange={this.onRecommendationChange}
                            check_person={checkPerson}
                            confirmPerson={confirmPerson}
                            verify_person={verifyPerson}
                            fullname={fullname}
                            employment_id={employment_id}
                            designations={designations}
                            department={department}
                            level={level}
                            letterWarning={letterWarning}
                            score={score}
                            achievement={achievement}
                            warningDate={warningDate}
                            recommendation={recommendation}
                            extensionPeriod={extensionPeriod}
                            extensionComment={extensionComment}
                            comment={comment}
                            status={status}
                            effectiveDate={effectiveDate}
                            handleSubmit={this.handleSubmit}
                            handleLetterWarningChange={this.handleLetterWarningChange}
                            user_id={this.state.user_id}
                            sub_level_options={sub_level_options}
                            career_level_id={career_level_id}
                            selected_sub_level={selected_sub_level}
                            handleSelectedSubLevel={this.handleSelectedSubLevel}
                            recommend_level={recommend_level}
                            checkListData={checkListData}
                            edit={edit}
                            date={date} />
                        :
                        view ?
                            <EditCheckForm
                                view={view}
                                BackToTable={this.BackToTable}
                                handleLetterWarningChange={() => null}
                                selectedTableData={selectedTableData}
                                handleEditCheckInputChange={() => null}
                                fullname={fullname}
                                employment_id={employment_id}
                                designations={designations}
                                department={department}
                                level={level}
                                letterWarning={letterWarning}
                                score={score}
                                achievement={achievement}
                                warningDate={warningDate}
                                recommendation={recommendation}
                                extensionPeriod={extensionPeriod}
                                extensionComment={extensionComment}
                                comment={comment}
                                effectiveDate={effectiveDate}
                                handleSubmit={this.handleSubmit}
                                sub_level_options={sub_level_options}
                                recommend_level={recommend_level}
                                date={date}
                                
                                status={status}
                                status_info={status_info} />
                            :
                            <div className='white-bg' style={{ boxShadow: '5px 5px 5px lightgrey', paddingTop: 10 }}>
                                <CheckTable goToViewForm={this.goToViewForm} checkedAll={checkedAll} handleCheckBoxChange={this.handleCheckBoxChange} goToEditForm={this.goToEditForm} selectedCheckBox={this.state.selectedCheckBox} handleApproveRequest={this.handleApproveRequest} handleSelectAllChange={this.handleSelectAllChange} data={this.state.checkListData ? this.state.checkListData : []} permission={{
                                    isEdit: (this.state.user_id == 921) ? 0 : 1,
                                    isView: 1,
                                    isSelect: (this.state.user_id == 921) ? 1 : 0,
                                }} />
                            </div>
                }





            </div>
        )

    }
}


export default ConfirmationCheck;