import React, {Component} from "react";
import axios from "axios";
import {
    Paper,
    RaisedButton,
    TextField
} from "material-ui";
import Translation from "../utils/Translation"
import PubSub from "pubsub-js";
import Constants from "../Constants";

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            errorUsername: "",
            errorPassword: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        PubSub.publish(Constants.LOADING, true);
        if (this.state.password.length < 1 || this.state.username.length < 1) {
            if (this.state.username.length < 1)
                this.setState({errorUsername: "Username is required"});
            if (this.state.password.length < 1)
                this.setState({errorPassword: "Password is required"});
            return;
        }
        let config = {
            url: "authenticate",
            method: 'post',
            auth: {
                username: this.state.username,
                password: this.state.password
            }
        };
        axios(config)
            .then(function (response) {
                sessionStorage.setItem("AUTH_TOKEN", response.data.data.token);
                sessionStorage.setItem("userId", response.data.data.user.id);
                sessionStorage.setItem("userLevel", response.data.data.user.level);
                sessionStorage.setItem("username", response.data.data.user.firstname);
                PubSub.publish(Constants.AUTHENTICATED, true);
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

    render() {
        return (
            <form onSubmit={this.handleSubmit}
                  style={{
                      display: "flex",
                      justifyContent: "center"
                  }}>
                <Paper style={{padding: "2em"}}>
                    <h1>Sign In</h1>
                    <TextField
                        hintText="Username"
                        floatingLabelText="Username"
                        name="username"
                        fullWidth={true}
                        required={true}
                        onChange={this.handleInputChange}
                        errorText={this.state.errorUsername}
                    />
                    <TextField
                        hintText="Password"
                        floatingLabelText="Password"
                        type="password"
                        name="password"
                        fullWidth={true}
                        required={true}
                        onChange={this.handleInputChange}
                        errorText={this.state.errorPassword}
                    />
                    <RaisedButton
                        label="Sign In"
                        primary={true}
                        style={{marginTop: "2em"}}
                        type="submit"
                    />
                </Paper>
            </form>
        );
    }
}

export default LoginPage;
