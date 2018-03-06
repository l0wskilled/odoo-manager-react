import React, {Component} from "react";
import axios from "axios";
import {
    DatePicker,
    MenuItem, Paper, RaisedButton, SelectField, Table, TableBody, TableHeader,
    TableHeaderColumn, TableRow,
    TableRowColumn, TextField,
    Toggle,
} from "material-ui";
import Translation from "../utils/Translation"
import PubSub from "pubsub-js";
import Constants from "../Constants";
import NewPassword from "./NewPassword";
import "./toggle.css";

const containerStyles = {
    fontSize: 16,
    lineHeight: '24px',
    width: 256,
    height: 24 + 48,
    display: 'inline-block',
    position: 'relative',
};

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
            authorised: false,
            id: "",
            lastAccess: [],
            level: ""
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
                let birthday = Date.UTC(response.data.data.birthday.split("-")[0], response.data.data.birthday.split("-")[1] - 1, response.data.data.birthday.split("-")[2]);
                that.setState(({
                    address: response.data.data.address,
                    birthday: new Date(birthday),
                    city: response.data.data.city,
                    country: response.data.data.country,
                    email: response.data.data.email,
                    firstname: response.data.data.firstname,
                    lastname: response.data.data.lastname,
                    mobile: response.data.data.mobile,
                    phone: response.data.data.phone,
                    authorised: response.data.data.authorised === 1,
                    id: response.data.data.id,
                    lastAccess: typeof response.data.data.last_access == 'string' ? [response.data.data.last_access] : response.data.data.last_access,
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
        let that = this;
        PubSub.publish(Constants.LOADING, true);
        let config = {
            url: "users/update/" + id,
            method: 'patch',
            data: {
                address: String(this.state.address),
                birthday: String(this.state.birthday.toISOString().split("T")[0]),
                city: String(this.state.city),
                country: String(this.state.country),
                email: String(this.state.email),
                firstname: String(this.state.firstname),
                lastname: String(this.state.lastname),
                mobile: String(this.state.mobile),
                phone: String(this.state.phone),
                level: String(this.state.level),
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
                    /><br/>
                    <TextField
                        hintText="E-Mail"
                        floatingLabelText="E-Mail"
                        type="text"
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
                    <NewPassword adminMode={true} userId={id}/>
                    <br/>
                    <h2>Last Access (UTC)</h2>
                    {typeof this.state.lastAccess !== "undefined" ?
                        <Table style={{tableLayout: "auto"}} wrapperStyle={{background: "red"}} className="TEST">
                            <TableBody displayRowCheckbox={false}
                                       showRowHover={true}>
                                <TableRow>
                                    <TableHeaderColumn>Date</TableHeaderColumn>
                                    <TableHeaderColumn>IP</TableHeaderColumn>
                                    <TableHeaderColumn>Domain</TableHeaderColumn>
                                    <TableHeaderColumn>Browser</TableHeaderColumn>
                                </TableRow>
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
