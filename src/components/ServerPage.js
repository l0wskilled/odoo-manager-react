import React, {Component} from "react";
import axios from "axios";
import {
    Paper, RaisedButton, TextField,
} from "material-ui";
import Translation from "../utils/Translation"
import PubSub from "pubsub-js";
import Constants from "../Constants";
import "./toggle.css";


class ServerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            name: "",
            localeIp: "",
            remoteIp: "",
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

    componentDidMount() {
        const id = parseInt(this.props.match.params.id, 10);

        PubSub.publish(Constants.LOADING, true);
        let that = this;
        let config = {
            url: "servers/get/" + id,
            method: 'get',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("AUTH_TOKEN")
            }
        };
        axios(config)
            .then(function (response) {
                that.setState(({
                    id: response.data.data.id,
                    name: response.data.data.name,
                    localeIp: response.data.data.localeIp,
                    remoteIp: response.data.data.remoteIp
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
            url: "servers/update/" + id,
            method: 'patch',
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
                    id: response.data.data.id,
                    name: response.data.data.name,
                    localeIp: response.data.data.localeIp,
                    remoteIp: response.data.data.remoteIp
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

export default ServerPage;
