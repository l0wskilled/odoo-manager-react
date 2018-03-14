import React, {Component} from "react";
import axios from "axios";
import {
    Paper, RaisedButton, TextField,
} from "material-ui";
import Translation from "../utils/Translation"
import PubSub from "pubsub-js";
import Constants from "../Constants";
import "./toggle.css";
import ChipInput from 'material-ui-chip-input'


class ServerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            name: "",
            localeIp: "",
            remoteIp: "",
            chips: [],
            chipSource: [],
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAddChip = this.handleAddChip.bind(this);
        this.handleDeleteChip = this.handleDeleteChip.bind(this);
        this.handleOnBeforeRequestAdd = this.handleOnBeforeRequestAdd.bind(this);
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
        };
        axios(config)
            .then(function (response) {
                that.setState(({
                    id: response.data.data.id,
                    name: response.data.data.name,
                    localeIp: response.data.data.localeIp,
                    remoteIp: response.data.data.remoteIp,
                    chipSource: response.data.data.chipSource,
                    chips: response.data.data.chips
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
                name: this.state.name,
                localeIp: this.state.localeIp,
                remoteIp: this.state.remoteIp,
                chips: this.state.chips
            },
        };
        axios(config)
            .then(function (response) {
                that.setState({
                    id: response.data.data.id,
                    name: response.data.data.name,
                    localeIp: response.data.data.localeIp,
                    remoteIp: response.data.data.remoteIp,
                    chipSource: response.data.data.chipSource,
                    chips: response.data.data.chips
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

    handleAddChip(chip) {
        if (chip.id !== parseInt(chip.id, 10))
            return;
        let found = true;
        this.state.chipSource.forEach((element) => {
            if (found)
                found = element.id === chip.id;
        });
        this.setState(prevState => ({
            chips: [...prevState.chips, chip]
        }))
    }

    handleOnBeforeRequestAdd(chip) {
        return chip.id === parseInt(chip.id, 10)
    }

    handleDeleteChip(chip, index) {
        let newArray = [...this.state.chips];
        newArray.splice(index, 1);
        this.setState({
            chips: newArray
        })
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
                    <ChipInput
                        fullWidth={true}
                        hintText="Assigned Users"
                        floatingLabelText="Assigned Users"
                        value={this.state.chips}
                        onBeforeRequestAdd={this.handleOnBeforeRequestAdd}
                        onRequestAdd={this.handleAddChip}
                        onRequestDelete={this.handleDeleteChip}
                        dataSource={this.state.chipSource}
                        dataSourceConfig={{text: "username", value: "id"}}
                        openOnFocus={true}
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
