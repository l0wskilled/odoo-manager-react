import React, {Component} from "react";
import axios from "axios";
import {
    DatePicker, Paper, RaisedButton, Table, TableBody, TableHeader, TableHeaderColumn, TableRow,
    TableRowColumn, TextField,
} from "material-ui";
import Translation from "../utils/Translation"
import PubSub from "pubsub-js";
import Constants from "../Constants";
import NewPassword from "./NewPassword";

class UserPage extends Component {
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
            authorised: "",
            id: "",
            lastAccess: [],
            level: ""
        };
        this.handleBirthday = this.handleBirthday.bind(this);
    }

    handleBirthday(event, date) {
        console.log(this.state.lastAccess);
        this.setState({
            birthday: date
        });
    }

    componentDidMount() {
        const id = parseInt(this.props.match.params.id, 10);

        PubSub.publish(Constants.LOADING, true);
        let that = this;
        let config = {
            url: "users/get/" + id,
            method: 'get',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("AUTH_TOKEN")
            }
        };
        axios(config)
            .then(function (response) {
                that.setState(({
                    address: response.data.data.address,
                    birthday: new Date(response.data.data.birthday),
                    city: response.data.data.city,
                    country: response.data.data.country,
                    email: response.data.data.email,
                    firstname: response.data.data.firstname,
                    lastname: response.data.data.lastname,
                    mobile: response.data.data.mobile,
                    phone: response.data.data.phone,
                    authorised: response.data.data.authorised === 1,
                    id: response.data.data.id,
                    lastAccess: response.data.data.last_access,
                    level: response.data.data.level
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

    handleSubmit(event) {
        const id = parseInt(this.props.match.params.id, 10);

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
            url: "users/update/" + id,
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
                authorised: this.state.authorised ? 1 : 0
            },
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("AUTH_TOKEN"),
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };
        axios(config)
            .then(function (response) {
                that.setState(({
                    address: response.data.data.address,
                    birthday: new Date(response.data.data.birthday),
                    city: response.data.data.city,
                    country: response.data.data.country,
                    email: response.data.data.email,
                    firstname: response.data.data.firstname,
                    lastname: response.data.data.lastname,
                    mobile: response.data.data.mobile,
                    phone: response.data.data.phone,
                    authorised: response.data.data.authorised === 1,
                    id: response.data.data.id,
                    lastAccess: response.data.data.last_access,
                    level: response.data.data.level
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
        const id = parseInt(this.props.match.params.id, 10);
        return (
            <form onSubmit={this.handleSubmit}>
                <Paper style={{padding: "2em"}}>
                    <h1>{this.state.firstname}'s Profile</h1>
                    <TextField
                        hintText="ID"
                        floatingLabelText="ID"
                        type="text"
                        name="id"
                        required={true}
                        onChange={this.handleInputChange}
                        value={this.state.id}
                        disabled={true}
                    /><br/>
                    <TextField
                        hintText="Level"
                        floatingLabelText="Level"
                        type="text"
                        name="level"
                        required={true}
                        onChange={this.handleInputChange}
                        value={this.state.level}
                        disabled={true}
                    /><br/>
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
                        type="text"
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
                        hintText="Country"
                        floatingLabelText="Country"
                        type="text"
                        name="country"
                        onChange={this.handleInputChange}
                        value={this.state.country}
                    /><br/>
                    <TextField
                        hintText="City"
                        floatingLabelText="City"
                        type="text"
                        name="city"
                        onChange={this.handleInputChange}
                        value={this.state.city}
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
                    <TextField
                        hintText="Address"
                        floatingLabelText="Address"
                        type="text"
                        name="address"
                        onChange={this.handleInputChange}
                        value={this.state.address}
                    /><br/>
                    <RaisedButton
                        label="Save Changes"
                        primary={true}
                        style={{marginTop: "2em"}}
                        type="submit"
                    />
                    <NewPassword adminMode={true} userId={id}/>
                    <br/>
                    <h2>Last Access</h2>
                    {typeof this.state.lastAccess !== "undefined" ?
                        <Table>
                            <TableHeader displaySelectAll={false}
                                         adjustForCheckbox={false}>
                                <TableRow>
                                    <TableHeaderColumn>Date</TableHeaderColumn>
                                    <TableHeaderColumn>IP</TableHeaderColumn>
                                    <TableHeaderColumn>Domain</TableHeaderColumn>
                                    <TableHeaderColumn>Browser</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}
                                       showRowHover={true}>
                                {this.state.lastAccess.map((row, index) => (
                                    <TableRow key={index} selectable={false}>
                                        <TableRowColumn>{row.date}</TableRowColumn>
                                        <TableRowColumn>{row.ip}</TableRowColumn>
                                        <TableRowColumn>{row.domain}</TableRowColumn>
                                        <TableRowColumn>{row.browser}</TableRowColumn>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        : ""}
                </Paper>
            </form>
        );
    }
}

export default UserPage;
