import React, {Component} from "react";
import axios from "axios";
import {
    Paper,Table, TableBody, TableHeader, TableHeaderColumn, TableRow,
    TableRowColumn,
} from "material-ui";
import Translation from "../utils/Translation"
import PubSub from "pubsub-js";
import Constants from "../Constants";
import Redirect from "react-router-dom/es/Redirect";

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            rowsPerPage: 5,
            totalRows: 0,
            redirect: null
        };
        this.onCellClick = this.onCellClick.bind(this);
    }

    componentDidMount() {
        PubSub.publish(Constants.LOADING, true);
        let that = this;
        let config = {
            url: "users",
            method: 'get',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("AUTH_TOKEN")
            }
        };
        axios(config)
            .then(function (response) {
                that.setState(({
                    users: response.data.data.rows,
                    rowsPerPage: response.data.data.rows_per_page,
                    totalRows: response.data.data.total_rows
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

    onCellClick(row, col) {
        this.setState({
            redirect: this.state.users[row].id
        });
    }

    render() {
        const { redirect } = this.state;
        if (redirect !== null)
            return (<Redirect push to={"/user/" + redirect}/>);

        return (
            <Paper style={{padding: "2em"}}>
                <h1>Users</h1>
                <Table onCellClick={this.onCellClick}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>ID</TableHeaderColumn>
                            <TableHeaderColumn>Username</TableHeaderColumn>
                            <TableHeaderColumn>E-Mail</TableHeaderColumn>
                            <TableHeaderColumn>Level</TableHeaderColumn>
                            <TableHeaderColumn>Authorized</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} showRowHover={true}>
                        {this.state.users.map((row, index) => (
                            <TableRow key={index} style={{cursor: "pointer"}}>
                                <TableRowColumn>{row.id}</TableRowColumn>
                                <TableRowColumn>{row.username}</TableRowColumn>
                                <TableRowColumn>{row.email}</TableRowColumn>
                                <TableRowColumn>{row.level}</TableRowColumn>
                                <TableRowColumn>{row.authorized === 1 ? "True" : "False"}</TableRowColumn>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

        );
    }
}

export default ProfilePage;
