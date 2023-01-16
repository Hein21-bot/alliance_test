import React, { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import PageHeader from '../layouts/PageHeader';
import AnnouncementTable from './AnnouncementTable';
import AnnouncementAddNew from './AnnouncementAddNew';
import AnnouncementView from './AnnouncementView';
import { main_url, startSaving, getUserId ,getPermissionStatus,getCookieData} from "../../utils/CommonFunction";
import moment from "moment";

export default class AnnouncementMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_info: getCookieData("user_info"),
            user_id: getUserId("user_info"),
            isAddnew: false,
            isTable: true,
            isView: false,
            data: [],
            permission_status: {}

        }
    }

    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.role_id, 'Announcement', 'Announcement');
        this.getAnnouncementData();
        let action = this.props.add; //get from notification
        let data = this.props.data;   //announcement info from notification
        if (action !== undefined && action) {
        this.setState({
            isAddNew: action,
            isTable: false,
            data : data,
            permission_status: permission_status
        })
     }    
 }
    
 getAnnouncementData() {
        fetch(main_url + "announcement/getAnnouncementData/" + this.state.user_id)
          .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({ data: res })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    addAnnouncement = (data) => {
        const formdata = new FormData();

        var obj = document.querySelector("#HDDropZone").files.length;
        for (var i = 0; i < obj; i++) {
            var imagedata = document.querySelector("#HDDropZone").files[i];

            formdata.append('uploadfile', imagedata);
        }

        formdata.append('info', JSON.stringify(data))
        let status = 0;
        fetch(main_url + 'announcement/addAnnouncement', {
            method: "POST",
            body: formdata
        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                this.showToast(status, text);
            })

    }

    AnnouncementAddForm  = () => {
        this.setState({
            isAddnew: true,
            isTable: false,
            isView: false,
        })
    }

    goToAnnouncementView  = (data) => {
        this.setState({
            data: data,
            isAddnew: false,
            isTable: false,
            isView: true,
        })
    }

    goBack = () => {
        this.setState({
            isAddnew: false,
            isTable: true,
            isView: false,
        })
        window.location.reload();
    }

    setupForm = () => {
        this.setState({
            isAddnew: true,
            isTable: false,
            isView: false
        });
    };

    showToast = (status, text) => {
        if (status === 200) {
            toast.success(text);
            window.location.reload();
        }
        else {
            startSaving();
            toast.error(text);
        }

    }
    render() {
        return (
            <div className="wedding-benefit border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <PageHeader pageTitle="Announcement"
                    title="Announcement"
                    setupForm={this.setupForm} isAddNew={this.state.isAddnew}
                    isView={this.state.isView} />
                <div>
                    {
                        this.state.isAddnew ? <AnnouncementAddNew  addAnnouncement={this.addAnnouncement} 
                        goBack={this.goBack} showToast={this.showToast}  /> : ''
                    }
                    {
                        this.state.isTable ? <AnnouncementTable
                        AnnouncementAddForm ={this.AnnouncementAddForm }
                        goToAnnouncementView ={this.goToAnnouncementView }
                        data={this.state.data}
                        permission={this.state.permission_status}
                        /> : ''
                    }
                    {
                        this.state.isView ? <AnnouncementView  goBack={this.goBack} 
                        data={this.state.data} /> : ''
                    }

                </div>
            </div>
        )
    }
}