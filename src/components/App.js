import React, {Component} from "react";
import {
    AppBar, CircularProgress, Divider, Drawer, MenuItem,
    Snackbar
} from "material-ui";
import LoginPage from "./LoginPage"
import {BrowserRouter as Router} from "react-router-dom";
import Link from "react-router-dom/es/Link";
import {MuiThemeProvider} from "material-ui/styles/index";
import axios from "axios/index";
import Config from "../Config";
import ProfilePage from "./ProfilePage";
import {
    ActionDashboard, HardwareMemory, SocialGroup,
    SocialPerson
} from "material-ui/svg-icons/index";
import DashboardPage from "./DashboardPage";
import PubSub from "pubsub-js";
import Constants from "../Constants";
import Route from "react-router-dom/es/Route";
import UsersPage from "./UsersPage";
import UserPage from "./UserPage";
import CreateUserPage from "./CreateUserPage";
import ServersPage from "./ServersPage";
import ServerPage from "./ServerPage";
import CreateServerPage from "./CreateServerPage";


const SnackbarTimeout = 2000;

axios.defaults.baseURL = Config.API_ROOT;
axios.interceptors.request.use((config) => {
    config.headers['Content-Type'] = "application/json";
    config.headers['Authorization'] = "Bearer " + sessionStorage.getItem("AUTH_TOKEN");
    return config;
}, error => Promise.reject(error));

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            loading: false,
            message: "",
            snackbarShowing: false,
            drawerOpen: true
        };

        this.handleLoading = this.handleLoading.bind(this);
        this.messageHandler = this.messageHandler.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        this.drawerSwitch = this.drawerSwitch.bind(this);
        this.authenticatedHandler = this.authenticatedHandler.bind(this);

        PubSub.subscribe(Constants.LOADING, this.handleLoading);
        PubSub.subscribe(Constants.MESSAGE, this.messageHandler);
        PubSub.subscribe(Constants.AUTHENTICATED, this.authenticatedHandler);
    }

    handleLoading(msg, data) {
        this.setState({
            loading: data,
        });
    }

    messageHandler(msg, data) {
        this.setState({
            snackbarShowing: true,
            message: data
        });
    }

    authenticatedHandler(msg, data) {
        this.setState({
            authenticated: data
        });
    }

    handleSnackbarClose = () => {
        this.setState({
            snackbarShowing: false,
        });
    };

    drawerSwitch() {
        this.setState((prevState, props) => ({
            drawerOpen: !prevState.drawerOpen
        }))
    }

    componentDidMount() {
        this.setState({
            authenticated: sessionStorage.getItem("AUTH_TOKEN") !== null
        })
    }

    render() {
        if (this.state.authenticated)
            return (
                <MuiThemeProvider>
                    <Router>
                        <div style={{display: "flex", flexDirection: "Column"}}>
                            <header>
                                <AppBar
                                    title="Odoo Manager"
                                    iconElementRight={this.state.loading ?
                                        <CircularProgress color="#fff"/> : null}
                                    onLeftIconButtonClick={this.drawerSwitch}
                                />

                            </header>
                            <section
                                className="wrap"
                                style={{
                                    display: "flex",
                                    alignItems: "stretch",
                                    alignContent: "stretch",
                                    backgroundColor: "rgb(237, 236, 236)"
                                }}
                            >
                                <main style={{
                                    flex: "1 1 auto",
                                    padding: "2em",
                                    overflow: "auto"
                                }}>
                                    <Route
                                        exact
                                        path="/" component={DashboardPage}
                                    />
                                    <Route
                                        path="/profile"
                                        component={ProfilePage}
                                    />
                                    {sessionStorage.getItem("userLevel") === "Superuser" &&
                                    <div>
                                        <Route
                                            exact
                                            path="/users"
                                            component={UsersPage}
                                        />
                                        <Route
                                            exact
                                            path="/user/:id"
                                            component={UserPage}
                                        />
                                        <Route
                                            exact
                                            path="/users/create"
                                            component={CreateUserPage}
                                        />
                                        <Route
                                            exact
                                            path="/servers"
                                            component={ServersPage}
                                        />
                                        <Route
                                            exact
                                            path="/server/:id"
                                            component={ServerPage}
                                        />
                                        <Route
                                            exact
                                            path="/servers/create"
                                            component={CreateServerPage}
                                        />
                                    </div>
                                    }
                                </main>
                                <aside
                                    style={{order: -1, flex: "0 1 256px"}}
                                    className={this.state.drawerOpen ? "drawer-open" : "drawer-closed"}
                                >
                                    <Drawer
                                        containerStyle={{
                                            position: "static",
                                            height: "100%"
                                        }}
                                        style={{height: "100%"}}
                                    >
                                        <Link to="/">
                                            <MenuItem leftIcon={<ActionDashboard/>}>
                                                Dashboard
                                            </MenuItem>
                                        </Link>
                                        <Divider/>
                                        <Link to="/profile">
                                            <MenuItem leftIcon={<SocialPerson/>}>
                                                Profile
                                            </MenuItem>
                                        </Link>
                                        {sessionStorage.getItem("userLevel") === "Superuser" &&
                                        <div>
                                            <Divider/>
                                            <Link to="/users">
                                                <MenuItem
                                                    leftIcon={<SocialGroup/>}>
                                                    Users
                                                </MenuItem>
                                            </Link>
                                            <Divider/>
                                            <Link to="/servers">
                                                <MenuItem
                                                    leftIcon={<HardwareMemory/>}>
                                                    Servers
                                                </MenuItem>
                                            </Link>
                                        </div>
                                        }
                                        <Divider/>
                                    </Drawer>
                                </aside>
                            </section>
                            <Snackbar
                                open={this.state.snackbarShowing}
                                message={this.state.message}
                                autoHideDuration={4000}
                                onRequestClose={this.handleSnackbarClose}
                            />
                        </div>
                    </Router>
                </MuiThemeProvider>
            );
        else
            return (
                <MuiThemeProvider>
                    <Router>
                        <div style={{display: "flex", flexDirection: "Column"}}>
                            <header>
                                <AppBar
                                    title="Odoo Manager"
                                    iconElementRight={this.state.loading ?
                                        <CircularProgress color="#fff"/> : null}
                                    onLeftIconButtonClick={this.drawerSwitch}
                                />

                            </header>
                            <section
                                style={{
                                    display: "flex",
                                    alignItems: "stretch",
                                    alignContent: "stretch",
                                    backgroundColor: "rgb(237, 236, 236)"
                                }}>
                                <main style={{flex: "1 1 auto", padding: "2em"}}>
                                    <LoginPage/>
                                </main>
                            </section>
                            <Snackbar
                                open={this.state.snackbarShowing}
                                message={this.state.message}
                                autoHideDuration={SnackbarTimeout}
                                onRequestClose={this.handleSnackbarClose}
                            />
                        </div>
                    </Router>
                </MuiThemeProvider>
            );
    }
}

export default App;
