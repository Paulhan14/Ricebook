import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Container from '@mui/material/Container';

import Main from "../Main/Main";
import Landing from "../Landing/Landing";
import Profile from "../Profile";
import Header from "../Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import Image from "../../assets/rice_university.jpg";

// const styles = {
// 	backgroundImage: `url(${Image})`,
// }

class App extends Component {
	render() {
		return (
			<div>
				<Header />
				<Container maxWidth="xl">
					<ToastContainer />
					<Switch>
						<Route exact path={"/"}>
							<Landing />
						</Route>
						<Route exact path="/main">
							<Main />
						</Route>
						<Route exact path="/profile">
							<Profile />
						</Route>
					</Switch>
				</Container>
			</div>
		);
	}
}

export default App;
