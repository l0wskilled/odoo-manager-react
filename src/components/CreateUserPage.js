import React, {Component} from "react";
import axios from "axios";
import {
    DatePicker,
    MenuItem, Paper, RaisedButton, SelectField, TextField,
    Toggle,
} from "material-ui";
import Translation from "../utils/Translation"
import PubSub from "pubsub-js";
import Constants from "../Constants";
import "./toggle.css";
import Redirect from "react-router-dom/es/Redirect";

const containerStyles = {
    fontSize: 16,
    lineHeight: '24px',
    width: 256,
    height: 24 + 48,
    display: 'inline-block',
    position: 'relative',
};

class CreateUserPage extends Component {
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
            authorised: false,
            id: "",
            lastAccess: [],
            level: "User",
            username: "",
            newPassword: "",
            created: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBirthday = this.handleBirthday.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleBirthday(event, date) {
        this.setState({
            birthday: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
        });
    }

    handleToggle(event, isInputChecked) {
        this.setState((prevState, props) => ({
            authorised: !prevState.authorised
        }))
    }

    handleSelect(event, index, value) {
        this.setState({
            level: value
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        let that = this;
        PubSub.publish(Constants.LOADING, true);
        let config = {
            url: "users/create/",
            method: 'post',
            data: {
                address: String(this.state.address),
                birthday: String(new Date(this.state.birthday).toISOString().split("T")[0]),
                city: String(this.state.city),
                country: String(this.state.country),
                email: String(this.state.email),
                firstname: String(this.state.firstname),
                lastname: String(this.state.lastname),
                username: String(this.state.username),
                newPassword: String(this.state.newPassword),
                mobile: String(this.state.mobile),
                phone: String(this.state.phone),
                level: String(this.state.level),
                authorised: this.state.authorised ? 1 : 0
            },
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("AUTH_TOKEN"),
            }
        };
        axios(config)
            .then(function (response) {
                that.setState({
                    created: true
                });
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
        if (this.state.created)
            return (<Redirect push to={"/users/"}/>);

        return (
            <form onSubmit={this.handleSubmit}>
                <Paper style={{padding: "2em"}}>
                    <h1>{this.state.firstname}'s Profile</h1>
                    <SelectField
                        floatingLabelText="Level"
                        value={this.state.level}
                        onChange={this.handleSelect}
                        required={true}>
                        <MenuItem value="User" primaryText="User"/>
                        <MenuItem value="Superuser" primaryText="Superuser"/>
                    </SelectField><br/>
                    <TextField
                        hintText="First Name"
                        floatingLabelText="First Name"
                        type="text"
                        name="firstname"
                        required={true}
                        onChange={this.handleInputChange}
                        value={this.state.firstname}
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
                        hintText="Username"
                        floatingLabelText="Username"
                        type="text"
                        name="username"
                        required={true}
                        onChange={this.handleInputChange}
                        value={this.state.username}
                    /><br/>
                    <TextField
                        hintText="New Password"
                        floatingLabelText="New Password"
                        type="password"
                        name="newPassword"
                        required={true}
                        onChange={this.handleInputChange}
                        value={this.state.newPassword}
                    /><br/>
                    <TextField
                        hintText="E-Mail"
                        floatingLabelText="E-Mail"
                        type="email"
                        name="email"
                        required={true}
                        onChange={this.handleInputChange}
                        value={this.state.email}
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
                    <Toggle
                        className="toggle"
                        style={containerStyles}
                        label="Authorized"
                        labelPosition="right"
                        onToggle={this.handleToggle}
                        toggled={this.state.authorised}
                    /><br/>
                    <RaisedButton
                        label="Save Changes"
                        primary={true}
                        style={{marginTop: "2em"}}
                        type="submit"
                    />
                </Paper>
            </form>
        );
    }
}

export default CreateUserPage;
