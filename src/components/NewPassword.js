import React, {Component} from "react";
import axios from "axios";
import {
    Dialog, FlatButton,
    TextField
} from "material-ui";
import PubSub from "pubsub-js";
import Constants from "../Constants";
import Translation from "../utils/Translation";

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current_password: "",
            new_password: "",
            new_password2: "",
            open: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.valid = this.valid.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    valid(current, newPass, newPass2) {
        let a = {
            current: current.length > 0 ? "" : "This is required",
            newPass: newPass.length > 0 ? "" : "This is required",
            newPass2: newPass2.length > 0 ? "" : "This is required",
        };
        if (current !== "" && current === newPass) {
            a.newPass = "New Password can't be Current Password";
            a.newPass2 = "Confirm New Password can't be Current Password";
        }

        if (newPass !== "" && newPass !== newPass2) {
            a.newPass = "New Password isn't the same as Confirm New Password";
            a.newPass2 = "Confirm New Password isn't the same as New Password ";
        }
        this.setState({
            errors: a
        });
        return !(a.current || a.newPass || a.newPass2 || current === newPass)
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.props.adminMode) {
            PubSub.publish(Constants.LOADING, true);
            let config = {
                url: "users/change-password/" + this.props.userId,
                method: 'patch',
                data: {
                    newPassword: this.state.new_password
                },
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("AUTH_TOKEN"),
                }
            };
            axios(config)
                .then(function (response) {
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
            this.setState({
                new_password: "",
                open: false
            });
        } else {
            if (this.valid(this.state.current_password, this.state.new_password, this.state.new_password2)) {
                PubSub.publish(Constants.LOADING, true);
                let config = {
                    url: "profile/change-password",
                    method: 'patch',
                    data: {
                        current_password: this.state.current_password,
                        new_password: this.state.new_password
                    },
                    headers: {
                        "Authorization": "Bearer " + sessionStorage.getItem("AUTH_TOKEN"),
                    }
                };
                axios(config)
                    .then(function (response) {
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
                this.setState({
                    current_password: "",
                    new_password: "",
                    new_password2: "",
                    errorCurrentPassowrd: "",
                    errorNewPassword: "",
                    errorNewPassword2: "",
                });
            }
        }
    }

    handleOpen() {
        this.setState((prevState, props) => ({
            open: !prevState.open
        }));
    };

    render() {
        const actions = [
            <FlatButton
                label="Save Changes"
                secondary={true}
                style={{marginTop: "2em"}}
                onClick={this.handleSubmit}
            />,
            <FlatButton
                label="Cancel"
                style={{marginTop: "2em"}}
                onClick={this.handleOpen}
            />
        ];
        return (
            <div style={{display: "inline-block"}}>
                <FlatButton label="Change Password" onClick={this.handleOpen}/>
                <Dialog
                    title="Change Password"
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                >
                    <form onSubmit={this.handleSubmit}>
                        {!this.props.adminMode ?
                            <TextField
                            hintText="Current Password"
                            floatingLabelText="Current Password"
                            type="password"
                            name="current_password"
                            required={true}
                            fullWidth={true}
                            onChange={this.handleInputChange}
                            value={this.state.current_password}
                            errorText={this.state.errors ? this.state.errors.current : ""}
                        /> : "" }
                        <TextField
                            hintText="New Password"
                            floatingLabelText="New Password"
                            type="password"
                            name="new_password"
                            required={true}
                            fullWidth={true}
                            onChange={this.handleInputChange}
                            value={this.state.new_password}
                            errorText={this.state.errors ? this.state.errors.newPass : ""}
                        /><br/>
                        {!this.props.adminMode ?
                        <TextField
                            hintText="Confirm New Password"
                            floatingLabelText="Confirm New Password"
                            type="password"
                            name="new_password2"
                            required={true}
                            fullWidth={true}
                            onChange={this.handleInputChange}
                            value={this.state.new_password2}
                            errorText={this.state.errors ? this.state.errors.newPass2 : ""}
                        /> : "" }
                    </form>
                </Dialog>
            </div>
        );
    }
}

export default ProfilePage;
