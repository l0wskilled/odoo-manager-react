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

class CreateServerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            name: "",
            localeIp: "",
            remoteIp: "",
            created: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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
        let that = this;
        PubSub.publish(Constants.LOADING, true);
        let config = {
            url: "servers/create/",
            method: 'post',
            data: {
                name: String(this.state.name),
                localeIp: String(this.state.localeIp),
                remoteIp: String(this.state.remoteIp),
            },
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("AUTH_TOKEN"),
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };
        axios(config)
            .then(function (response) {
                that.setState(({
                    created: true
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
        if (this.state.created)
            return (<Redirect push to={"/servers/"}/>);

        return (
            <form onSubmit={this.handleSubmit}>
                <Paper style={{padding: "2em"}}>
                    <h1>{this.state.name}'s Configuration</h1>
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
                        hintText="Name"
                        floatingLabelText="Name"
                        type="text"
                        name="name"
                        required={true}
                        onChange={this.handleInputChange}
                        value={this.state.name}
                    /><br/>
                    <TextField
                        hintText="Locale IP"
                        floatingLabelText="Locale IP"
                        type="text"
                        name="localeIp"
                        required={true}
                        onChange={this.handleInputChange}
                        value={this.state.localeIp}
                    /><br/>
                    <TextField
                        hintText="Remote IP"
                        floatingLabelText="Remote IP"
                        type="text"
                        name="remoteIp"
                        onChange={this.handleInputChange}
                        value={this.state.remoteIp}
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

export default CreateServerPage;
