import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";

import { userLogin } from "../../reducers/authReducer";
import GoogleButton from "react-google-button";

import { hostUrl, signIn } from "../../api/api";
import { CircularProgress } from "@mui/material";

function SignIn() {
	const dispatch = useDispatch();
	let history = useHistory();

	const [account, setTitle] = useState("");
	const [password, setContent] = useState("");
	const [warn, setWarn] = useState("");

	const [loading, setLoading] = useState(false);

	const onAccountChanged = (e) => setTitle(e.target.value);
	const onPasswordChanged = (e) => setContent(e.target.value);

	const validateForm = (e) => {
		e.preventDefault();

		if (account === "" || password === "") {
			setWarn("Enter Account name and password to sign in");
			return false;
		}

		let currentUser = {
			id: "",
			accountName: "",
			displayName: "",
			email: "",
			birthday: "",
			zipcode: "",
			status: "",
			avatarLink: "",
			following: [],
			timestamp: "",
		};

		setLoading(true);

		signIn(account, password)
			.then((res) => {
				setWarn("");

				dispatch(
					userLogin({
						user: {
							...currentUser,
							accountName: res.data.username,
						},
						loggedin: true,
						error: false,
					})
				);

				setLoading(false);

				history.push("/main");
				return true;
			})
			.catch((err) => {
				if (!err.response) {
					setWarn("Server error. Please try again.");
				} else if (err.response.status === 401) {
					setWarn("Account name/password incorrect");
				} else if (err.response.status === 500) {
					setWarn("Server error. Please try again.");
				}

				setLoading(false);

				dispatch(
					userLogin({
						user: currentUser,
						loggedin: false,
						error: true,
					})
				);
			});
	};

	const handleGoogleLogin = () => {
		window.top.location = `${hostUrl}auth/google`;
	}

	return (
		<Box
			component="form"
			sx={{
				"& .MuiTextField-root": { m: 1, width: "25ch" },
			}}
			autoComplete="off"
			pt={20}
		>
			<Typography variant="h3" gutterBottom component="div">
				Sign In
			</Typography>
			<div>
				<TextField
					type="text"
					id="account-name-input"
					label="Account Name"
					placeholder="Your account name"
					error={warn !== ""}
					onChange={onAccountChanged}
					required
				/>
			</div>

			<TextField
				id="password-input"
				label="Password"
				type="password"
				onChange={onPasswordChanged}
				error={warn !== ""}
				helperText={warn}
				required
			/>

			<Stack direction="column" spacing={5} sx={{ marginTop: 2 }}>
				<CircularProgress sx={{display: loading? "visible" : "none"}}/>
				<Button
					fullWidth
					id="signin-btn"
					variant="contained"
					size="large"
					onClick={validateForm}
				>
					Sign in
				</Button>

				<GoogleButton onClick={handleGoogleLogin}/>
			</Stack>
		</Box>
	);
}

export default SignIn;
