import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";

import { userLogin } from "../../reducers/authReducer.js";
import { signUp } from "../../api/api.js";
import { CircularProgress } from "@mui/material";
import { handleRequestErr, showToastWithErr } from "../../utils/ToastWrapper.js";

function SignUp() {
	let currentUser = {
		id: "",
		accountName: "",
		displayName: "",
		phoneNumber: "",
		email: "",
		birthday: "",
		zipcode: "",
		status: "",
		avatarLink: "",
		following: [],
		timestamp: "",
	};

	const history = useHistory();
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);

	// new user form
	const [newUser, setNewUser] = useState({
		accountName: "",
		displayName: "",
		email: "",
		phoneNumber: "",
		birthday: "",
		zipcode: "",
		password: "",
	});

	// display error message
	const [isError, setError] = useState({
		accountNameError: "",
		phoneNumberError: "",
		zipcodeError: "",
		passwordError: "",
	});

	// verify password
	const [verifyPassword, setVerifyPassword] = useState("");

	const onVerifyPasswordChanged = (e) => setVerifyPassword(e.target.value);

	// onSubmit
	const validateForm = (e) => {
		e.preventDefault();

		let passwordWarn =
			newUser.password === verifyPassword ? "" : "Password do not match";

		setError({
			...isError,
			passwordError: passwordWarn,
		});

		if (passwordWarn !== "" || !checkIsError()) {
			return false;
		}

		let payload = {
			username: newUser.accountName,
			password: newUser.password,
			dob: newUser.birthday,
			email: newUser.email,
			zipcode: newUser.zipcode,
			phone: newUser.phoneNumber,
			displayname: newUser.displayName
		};

		setLoading(true);

		signUp(payload)
			.then((res) => {
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
				if (err.response.status === 400) {
					showToastWithErr(err.response.data);
				} else {
					handleRequestErr(err);
				}
				
				setLoading(false);
				
				dispatch(
					userLogin({
						loggedin: false,
						error: true,
					})
				);
			});
	};

	const checkIsError = () => {
		return (
			isError.accountNameError === "" &&
			isError.phoneNumberError === "" &&
			isError.zipcodeError === "" &&
			isError.passwordError === ""
		);
	};

	// set date to be at least 18 years ago
	const setMaxDate = () => {
		let today = new Date();
		let dd = today.getDate();
		let mm = today.getMonth() + 1;
		let yyyy = today.getFullYear() - 18;
		if (dd < 10) {
			dd = "0" + dd;
		}
		if (mm < 10) {
			mm = "0" + mm;
		}

		today = yyyy + "-" + mm + "-" + dd;
		return today;
	};

	const handleInputChange = (e) => {
		e.preventDefault();
		// name and value of current component
		const { name, value } = e.target;
		// deepcopy of errors
		var errors = JSON.parse(JSON.stringify(isError));

		switch (name) {
			case "accountName":
				errors.accountNameError =
					value.match(/^[a-zA-Z]{1}[a-zA-Z0-9]*$/) || value === ""
						? ""
						: "Uppercase, lowercase, and numbers only. May not begin with numbers";
				break;
			case "phoneNumber":
				errors.phoneNumberError =
					value.match(/[0-9]{3}-[0-9]{3}-[0-9]{4}/i) || value === ""
						? ""
						: "10 digit phone number with dashes";
				break;
			case "zipcode":
				errors.zipcodeError =
					value.match(/[0-9]{5}/i) || value === ""
						? ""
						: "US Zip Code, 5 digits long and number only";
				break;
			default:
				break;
		}

		setError(errors);

		setNewUser({
			...newUser,
			[name]: value,
		});
	};

	function resetFields() {
		setNewUser({
			accountName: "",
			displayName: "",
			email: "",
			phoneNumber: "",
			birthday: "",
			zipcode: "",
			password: "",
		});

		setError({
			accountNameError: "",
			phoneNumberError: "",
			zipcodeError: "",
			passwordError: "",
		});

		setVerifyPassword("");
	}

	return (
		<Box
			sx={{
				"& .MuiTextField-root": { m: 1, width: "25ch" },
			}}
			pt={20}
		>
			<Typography variant="h3" gutterBottom component="div">
				Sign Up
			</Typography>
			<form onSubmit={validateForm}>
				<div>
					<TextField
						type="text"
						label="Account Name"
						placeholder="Your account name"
						title="Account name can only be upper or lower case letters and numbers, but may not start with a number."
						name="accountName"
						value={newUser.accountName}
						onChange={handleInputChange}
						error={isError.accountNameError !== ""}
						helperText={isError.accountNameError}
						required
					/>

					<TextField
						type="text"
						label="Display Name"
						placeholder="Your display name"
						name="displayName"
						value={newUser.displayName}
						onChange={handleInputChange}
					/>
				</div>

				<div>
					<TextField
						type="email"
						label="Email"
						placeholder="your@gmail.com"
						name="email"
						value={newUser.email}
						onChange={handleInputChange}
						required
					/>

					<TextField
						type="tel"
						label="Phone Number"
						placeholder="123-123-1234"
						inputProps={{ maxLength: 12 }}
						title="US Phone Number with Dashes"
						name="phoneNumber"
						value={newUser.phoneNumber}
						onChange={handleInputChange}
						error={isError.phoneNumberError !== ""}
						helperText={isError.phoneNumberError}
						required
					/>
				</div>

				<div>
					<TextField
						type="date"
						id="dob-input"
						label="Birthday"
						name="birthday"
						InputProps={{ inputProps: { max: setMaxDate() } }}
						InputLabelProps={{ shrink: true }}
						value={newUser.birthday}
						onChange={handleInputChange}
						required
					/>

					<TextField
						type="text"
						label="Zipcode"
						pattern="[0-9]{5}"
						placeholder="77005"
						title="5-digit US Zip Code"
						inputProps={{ maxLength: 5 }}
						name="zipcode"
						value={newUser.zipcode}
						onChange={handleInputChange}
						error={isError.zipcodeError !== ""}
						helperText={isError.zipcodeError}
						required
					/>
				</div>

				<div>
					<TextField
						label="Password"
						type="password"
						autoComplete="current-password"
						name="password"
						value={newUser.password}
						error={isError.passwordError !== ""}
						onChange={handleInputChange}
						required
					/>

					<TextField
						label="Password Confirm"
						type="password"
						autoComplete="current-password"
						value={verifyPassword}
						onChange={onVerifyPasswordChanged}
						error={isError.passwordError !== ""}
						helperText={isError.passwordError}
						required
					/>
				</div>

				<div>
					<Stack
						direction="row"
						spacing={2}
						sx={{ marginLeft: 5, marginTop: 2 }}
					>
						<CircularProgress sx={{display: loading? "visible" : "none"}}/>
						<Button
							type="submit"
							id="submit-btn"
							variant="contained"
						>
							Sign up
						</Button>
						<Button
							type="reset"
							id="clear-btn"
							variant="outlined"
							color="error"
							onClick={resetFields}
						>
							Clear
						</Button>
					</Stack>
				</div>
			</form>
		</Box>
	);
}

export default SignUp;
