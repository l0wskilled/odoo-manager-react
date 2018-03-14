import React, {Component} from "react";
import axios from "axios";
import {
    Dialog,
    FlatButton,
    Paper, Table, TableBody, TableHeader, TableHeaderColumn, TableRow,
    TableRowColumn,
} from "material-ui";
import Translation from "../utils/Translation"
import PubSub from "pubsub-js";
import Constants from "../Constants";
import Redirect from "react-router-dom/es/Redirect";
import {ActionDelete} from "material-ui/svg-icons/index";
import Link from "react-router-dom/es/Link";

class ServersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            servers: [],
            rowsPerPage: 5,
            totalRows: 0,
            redirect: null,
            del: null,
            open: false
        };
        this.onCellClick = this.onCellClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        this.setState({
            del: null,
        });
        PubSub.publish(Constants.LOADING, true);
        let that = this;
        let config = {
            url: "servers",
            params: {
                limit: 9999
            },
            method: 'get',
        };
        axios(config)
            .then(function (response) {
                that.setState({
                    servers: response.data.data.rows,
                    rowsPerPage: response.data.data.rows_per_page,
                    totalRows: response.data.data.total_rows
                });
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
        const id = this.state.servers[row - 1].id;
        if (col !== 4) {
            let loading = PubSub.subscribe(Constants.LOADING);
            if (!loading) {
                this.setState({
                    redirect: id
                });
            }
        } else {
            //delete
            this.setState({
                del: id
            });
            this.handleOpen();
        }
    }

    handleOpen() {
        this.setState({open: true});
    };

    handleClose() {
        this.setState({
            open: false,
            del: null
        });
    };


    delete() {
        const id = this.state.del;
        PubSub.publish(Constants.LOADING, true);
        let that = this;
        let config = {
            url: "servers/delete/" + id,
            method: 'delete',
        };
        axios(config)
            .then(function (response) {
                that.setState({
                    open: false,
                    del: null
                });
                that.componentDidMount();
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
        const {redirect} = this.state;
        if (redirect !== null)
            return (<Redirect push to={"/server/" + redirect}/>);

        const actions = [
            <FlatButton
                label="Cancel"
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Delete"
                secondary={true}
                onClick={this.delete}
            />,
        ];
        return (
            <Paper style={{padding: "2em"}}>
                <h1>Servers</h1>
                <Table onCellClick={this.onCellClick} style={{tableLayout: "auto"}}>
                    <TableBody displayRowCheckbox={false} showRowHover={true}>
                        <TableRow>
                            <TableHeaderColumn>ID</TableHeaderColumn>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Locale IP</TableHeaderColumn>
                            <TableHeaderColumn>Remote IP</TableHeaderColumn>
                            <TableHeaderColumn>&nbsp;</TableHeaderColumn>
                        </TableRow>
                        {this.state.servers.map((row, index) => (
                            <TableRow key={index} style={{cursor: "pointer"}}>
                                <TableRowColumn>{row.id}</TableRowColumn>
                                <TableRowColumn>{row.name}</TableRowColumn>
                                <TableRowColumn>{row.localeIp}</TableRowColumn>
                                <TableRowColumn>{row.remoteIp}</TableRowColumn>
                                <TableRowColumn>
                                    <FlatButton
                                        icon={<ActionDelete/>}
                                        primary={true}
                                    />
                                </TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <FlatButton
                    containerElement={<Link to="/servers/create"/>}
                    label="Create Server"
                    secondary={true}
                />
                <Dialog
                    title="Delete"
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                >
                    Do you really want to delete this record?
                </Dialog>
            </Paper>

        );
    }
}

export default ServersPage;
