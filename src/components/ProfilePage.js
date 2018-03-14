import React, {Component} from "react";
import axios from "axios";
import {
    DatePicker,
    Paper,
    RaisedButton,
    TextField
} from "material-ui";
import Translation from "../utils/Translation"
import PubSub from "pubsub-js";
import Constants from "../Constants";
import NewPassword from "./NewPassword";

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: "",
            birthday: null,
            city: "",
            country: "",
            email: "",
            firstname: "",
            lastname: "",
            mobile: "",
            phone: "",
            errorEmail: "",
            errorFirstname: "",
            errorLastname: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBirthday = this.handleBirthday.bind(this);
    }

    componentDidMount() {
        PubSub.publish(Constants.LOADING, true);
        let that = this;
        let config = {
            url: "profile",
            method: 'get',
        };
        axios(config)
            .then(function (response) {
                let birthday = Date.UTC(response.data.data.birthday.split("-")[0],response.data.data.birthday.split("-")[1] - 1,response.data.data.birthday.split("-")[2]);
                that.setState(({
                    address: String(response.data.data.address),
                    birthday: new Date(birthday),
                    city: String(response.data.data.city),
                    country: String(response.data.data.country),
                    email: String(response.data.data.email),
                    firstname: String(response.data.data.firstname),
                    lastname: String(response.data.data.lastname),
                    mobile: String(response.data.data.mobile),
                    phone: String(response.data.data.phone),
                }));
                PubSub.publish(Constants.LOADING, false);
            })
            .catch(function (error) {
                if (error.response) {
                    let message = Translation.translateMessage(error.response.data.messages);
                    PubSub.publish(Constants.MESSAGE, message);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                PubSub.publish(Constants.LOADING, false);
            });
    }

    handleBirthday(event, date) {
        this.setState({
            birthday: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.firstname.length < 1
            || this.state.lastname.length < 1
            || this.state.email.length < 1) {
            if (this.state.firstname.length < 1)
                this.setState({errorFirstname: "First Name is required"});
            if (this.state.lastname.length < 1)
                this.setState({errorLastname: "Last Name is required"});
            if (this.state.email.length < 1)
                this.setState({errorEmail: "E-Mail is required"});
            return;
        }
        let that = this;
        PubSub.publish(Constants.LOADING, true);
        let config = {
            url: "profile/update",
            method: 'patch',
            data: {
                address: String(this.state.address),
                birthday: String(new Date(this.state.birthday).toISOString().split("T")[0]),
                city: String(this.state.city),
                country: String(this.state.country),
                email: String(this.state.email),
                firstname: String(this.state.firstname),
                lastname: String(this.state.lastname),
                mobile: String(this.state.mobile),
                phone: String(this.state.phone),
            },
        };
        axios(config)
            .then(function (response) {
                that.setState(({
                    address: String(response.data.data.address),
                    birthday: new Date(response.data.data.birthday),
                    city: String(response.data.data.city),
                    country: String(response.data.data.country),
                    email: String(response.data.data.email),
                    firstname: String(response.data.data.firstname),
                    lastname: String(response.data.data.lastname),
                    mobile: String(response.data.data.mobile),
                    phone: String(response.data.data.phone),
                }));
                PubSub.publish(Constants.LOADING, false);
                let message = Translation.translateMessage(response.data.messages);
                PubSub.publish(Constants.MESSAGE, message);
            })
            .catch(function (error) {
                if (error.response) {
                    let message = Translation.translateMessage(error.response.data.messages);
                    PubSub.publish(Constants.MESSAGE, message);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                PubSub.publish(Constants.LOADING, false);
            });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Paper style={{padding: "2em"}}>
                    <h1>{this.state.firstname}'s Profile</h1>
                    <TextField
                        hintText="First Name"
                        floatingLabelText="First Name"
                        type="text"
                        name="firstname"
                        required={true}
                        onChange={this.handleInputChange}
                        value={this.state.firstname}
                        errorText={this.state.errorFirstname}
                    /><br/>
                    <TextField
                        hintText="Last Name"
                        floatingLabelText="Last Name"
                        type="text"
                        name="lastname"
                        required={true}
                        onChange={this.handleInputChange}
                        value={this.state.lastname}
                        errorText={this.state.errorLastname}
                    /><br/>
                    <TextField
                        hintText="E-Mail"
                        floatingLabelText="E-Mail"
                        type="email"
                        name="email"
                        required={true}
                        onChange={this.handleInputChange}
                        value={this.state.email}
                        errorText={this.state.errorEmail}
                    /><br/>
                    <TextField
                        hintText="Phone"
                        floatingLabelText="Phone"
                        type="text"
                        name="phone"
                        onChange={this.handleInputChange}
                        value={this.state.phone}
                    /><br/>
                    <TextField
                        hintText="Mobile"
                        floatingLabelText="Mobile"
                        type="text"
                        name="mobile"
                        onChange={this.handleInputChange}
                        value={this.state.mobile}
                    /><br/>
                    <TextField
                        hintText="Address"
                        floatingLabelText="Address"
                        type="text"
                        name="address"
                        onChange={this.handleInputChange}
                        value={this.state.address}
                    /><br/>
                    <TextField
                        hintText="City"
                        floatingLabelText="City"
                        type="text"
                        name="city"
                        onChange={this.handleInputChange}
                        value={this.state.city}
                    /><br/>
                    <TextField
                        hintText="Country"
                        floatingLabelText="Country"
                        type="text"
                        name="country"
                        onChange={this.handleInputChange}
                        value={this.state.country}
                    /><br/>
                    <DatePicker
                        mode="landscape"
                        openToYearSelection={true}
                        hintText="Birthday"
                        floatingLabelText="Birthday"
                        value={this.state.birthday}
                        onChange={this.handleBirthday}
                        formatDate={new global.Intl.DateTimeFormat('de-DE', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        }).format}
                    />
                    <RaisedButton
                        label="Save Changes"
                        primary={true}
                        style={{marginTop: "2em"}}
                        type="submit"
                    /><NewPassword adminMode={false}/>
                </Paper>
            </form>
        );
    }
}

export default ProfilePage;
