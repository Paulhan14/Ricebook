import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Paper, Typography } from "@mui/material";
import { Avatar } from "@mui/material";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";
import { Grid } from "@mui/material";
import {
	addAvatarLink,
	triggerProfileUpdate,
	userLogin,
} from "../reducers/authReducer";
import { fetchProfile } from "../reducers/authReducer";
import {
	getProfile,
	hostUrl,
	putDisplayName,
	putEmail,
	putPassword,
	putPhoneNumber,
	putZipcode,
	signIn,
} from "../api/api";
import { uploader } from "../api/api";
import {
	handleRequestErr,
	showToastWithErr,
	showToastWithMsg,
} from "../utils/ToastWrapper";
import { parseFetchedProfile } from "../utils/helper";

const Input = styled("input")({
	display: "none",
});

function Profile() {
	const history = useHistory();
	const dispatch = useDispatch();

	// load current user
	let currentUser = useSelector((state) => state.auth);

	// new user form
	const [user, setUser] = useState({
		displayName: "",
		email: "",
		phoneNumber: "",
		zipcode: "",
		password: "",
		avatarLink: "",
	});

	const [changed, setChanged] = useState({
		displayName: false,
		email: false,
		phoneNumber: false,
		zipcode: false,
		password: false,
		avatarLink: false,
	});

	// display error message
	const [isError, setError] = useState({
		emailError: "",
		phoneNumberError: "",
		zipcodeError: "",
		passwordError: "",
	});

	const [avatar, setAvtar] = useState(undefined);

	// verify password
	const [verifyPassword, setVerifyPassword] = useState("");

	const [linkUsername, setLinkUsername] = useState("");
	const [linkPassword, setLinkPassword] = useState("");

	const onVerifyPasswordChanged = (e) => setVerifyPassword(e.target.value);
	const onLinkUsernameChanged = (e) => setLinkUsername(e.target.value);
	const onLinkPasswordChanged = (e) => setLinkPassword(e.target.value);

	useEffect(() => {
		if (currentUser.loggedin === false) {
			getProfile()
				.then((res) => {
					dispatch(
						userLogin({
							user: parseFetchedProfile(res.data),
							loggedin: true,
							error: false,
						})
					);
					setLinkUsername(currentUser.user.accountName);
				})
				.catch((err) => {
					history.push("/");
				});
		}
	}, []);

	useEffect(() => {
		if (currentUser.loggedin && currentUser.status === "idle") {
			dispatch(fetchProfile());
		}
	}, [currentUser, dispatch]);

	const validateForm = async (e) => {
		e.preventDefault();

		let passwordWarn =
			user.password === verifyPassword ? "" : "Password do not match";

		setError({
			...isError,
			passwordError: passwordWarn,
		});

		if (passwordWarn !== "" || !checkError()) {
			return false;
		}

		try {
			if (user.email !== "") {
				await putEmail({ email: user.email });
			}

			if (user.zipcode !== "") {
				await putZipcode({ zipcode: user.zipcode });
			}

			if (user.displayName !== "") {
				await putDisplayName({ displayname: user.displayName });
			}

			if (user.phoneNumber !== "") {
				await putPhoneNumber({ phone: user.phoneNumber });
			}

			if (user.password !== "") {
				await putPassword({ password: user.password });
			}
		} catch (err) {
			handleRequestErr(err);
			return false;
		}

		dispatch(triggerProfileUpdate());

		let changeUpdate = {};

		for (const key in user) {
			changeUpdate[key] = user[key] !== "";
		}

		setChanged(changeUpdate);

		setUser({
			displayName: "",
			email: "",
			phoneNumber: "",
			zipcode: "",
			password: "",
			avatarLink: "",
		});

		setVerifyPassword("");

		return true;
	};

	const checkError = () => {
		return (
			isError.emailError === "" &&
			isError.phoneNumberError === "" &&
			isError.zipcodeError === "" &&
			isError.passwordError === ""
		);
	};

	/**
	 * handle input
	 * @param {*} e
	 */
	const handleInputChange = (e) => {
		e.preventDefault();
		// name and value of current component
		const { name, value } = e.target;
		// deepcopy of errors
		var errors = JSON.parse(JSON.stringify(isError));

		switch (name) {
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
			case "email":
				errors.emailError =
					value.match(
						/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{1,3})+$/
					) || value === ""
						? ""
						: "Enter valid email address, e.g., a@b.c";
				break;
			default:
				break;
		}

		setError(errors);

		setUser({
			...user,
			[name]: value,
		});
	};

	const handleChooseImg = (e) => {
		e.preventDefault();

		setAvtar(e.target.files[0]);
	};

	const handleAvatarChange = (e) => {
		e.preventDefault();

		if (avatar !== undefined) {
			uploader(avatar)
				.then((res) => {
					let avatarUrl = res.data.avatar;
					dispatch(addAvatarLink(avatarUrl));
					showToastWithMsg("avatar changed!");
				})
				.catch((err) => {
					handleRequestErr(err);
				});
		}
	};

	const redirect = () => {
		history.push("/main");
	};

	const handleAccountLinking = async () => {
		if (linkPassword && linkUsername) {
			try {
				let res = await signIn(linkUsername, linkPassword);
				if (res.data.result === "success") {
					showToastWithMsg("Sucess, now going to Google");
					setTimeout(() => {
						window.top.location = `${hostUrl}auth/google`;
					}, 3500);
				}
			} catch (err) {
				handleRequestErr(err);
			}
		} else {
			showToastWithErr("type this account name and password first");
		}
	};

	const renderInfoUpdateSection = (
		<Stack direction="column" spacing={4} pb={10}>
			<Box />
			<Stack direction="row" spacing={6} alignItems="center">
				<TextField
					id="display-name-profile"
					label="Display Name"
					value={currentUser.user.displayName}
					type="text"
					disabled
					InputLabelProps={{ shrink: true }}
				/>
				<TextField
					type="text"
					id="display-name-input"
					label="Display Name"
					placeholder="Your display name"
					name="displayName"
					value={user.displayName}
					onChange={handleInputChange}
				/>
				<Typography
					variant="caption"
					id="display-name-changed"
					hidden={!changed.displayName}
				>
					Display name changed
				</Typography>
			</Stack>

			<Stack direction="row" spacing={6} alignItems="center">
				<TextField
					label="Email"
					value={currentUser.user.email}
					type="email"
					disabled
					InputLabelProps={{ shrink: true }}
				/>
				<TextField
					type="email"
					id="email-address-input"
					label="Email"
					placeholder="your@gmail.com"
					name="email"
					value={user.email}
					onChange={handleInputChange}
					error={isError.emailError !== ""}
					helperText={isError.emailError}
				/>
				<Typography
					variant="caption"
					id="email-address-changed"
					hidden={!changed.email}
				>
					Email address changed
				</Typography>
			</Stack>

			<Stack direction="row" spacing={6} alignItems="center">
				<TextField
					label="Phone Number"
					value={currentUser.user.phoneNumber}
					type="tel"
					disabled
					InputLabelProps={{ shrink: true }}
				/>
				<TextField
					type="tel"
					id="phone-number-input"
					label="Phone Number"
					placeholder="123-123-1234"
					inputProps={{ maxLength: 12 }}
					title="US Phone Number with Dashes"
					name="phoneNumber"
					value={user.phoneNumber}
					onChange={handleInputChange}
					error={isError.phoneNumberError !== ""}
					helperText={isError.phoneNumberError}
				/>
				<Typography
					variant="caption"
					id="phone-number-changed"
					hidden={!changed.phoneNumber}
				>
					Phone number changed
				</Typography>
			</Stack>

			<Stack direction="row" spacing={6} alignItems="center">
				<TextField
					label="Zipcode"
					value={currentUser.user.zipcode}
					disabled
					InputLabelProps={{ shrink: true }}
				/>
				<TextField
					type="text"
					id="zipcode-input"
					label="Zipcode"
					pattern="[0-9]{5}"
					placeholder="77005"
					title="5-digit US Zip Code"
					inputProps={{ maxLength: 5 }}
					name="zipcode"
					value={user.zipcode}
					onChange={handleInputChange}
					error={isError.zipcodeError !== ""}
					helperText={isError.zipcodeError}
				/>
				<Typography
					variant="caption"
					id="zipcode-changed"
					hidden={!changed.zipcode}
				>
					Zipcode changed
				</Typography>
			</Stack>

			<Stack direction="row" spacing={6} alignItems="center">
				<TextField
					label="Password"
					type="password"
					value={currentUser.user.password}
					disabled
				/>
				<TextField
					id="password-input"
					label="New Password"
					type="password"
					autoComplete="current-password"
					name="password"
					value={user.password}
					error={isError.passwordError !== ""}
					onChange={handleInputChange}
				/>
				<Typography
					variant="caption"
					id="password-changed"
					hidden={!changed.password}
				>
					Password changed
				</Typography>
			</Stack>

			<Stack direction="row" spacing={6} alignItems="center">
				<Typography variant="h6">Verify password:</Typography>

				<TextField
					id="password-input-confirm"
					label="Password Confirm"
					type="password"
					autoComplete="current-password"
					value={verifyPassword}
					onChange={onVerifyPasswordChanged}
					error={isError.passwordError !== ""}
					helperText={isError.passwordError}
				/>
			</Stack>

			<Stack
				direction="row"
				spacing={6}
				alignItems="center"
				justifyContent="flex-start"
			>
				<Button
					type="submit"
					id="update-btn"
					variant="contained"
					onClick={validateForm}
				>
					Update Profile
				</Button>
				<Button
					type="button"
					id="main-page-btn"
					variant="contained"
					onClick={redirect}
				>
					Go back to main
				</Button>
			</Stack>

			<Box />

			<Paper elevation={5} sx={{ width: 700 }}>
				<Stack direction="row" spacing={3} pt={2} pb={2} pl={2}>
					<TextField
						label="Username"
						placeholder="your account name"
						value={linkUsername}
						onChange={onLinkUsernameChanged}
						type="text"
						InputLabelProps={{ shrink: true }}
					/>
					<TextField
						type="password"
						label="Password"
						value={linkPassword}
						onChange={onLinkPasswordChanged}
					/>
					<Button onClick={handleAccountLinking}>
						Login to link your accounts
					</Button>
				</Stack>
			</Paper>
		</Stack>
	);

	return (
		<Box pl={10}>
			<Grid
				container
				spacing={{ xs: 2, md: 6, lg: 8 }}
				columns={{ xs: 6, md: 8, lg: 16 }}
			>
				<Grid item xs={6} md={8} lg={4}>
					<Stack direction="column" spacing={4}>
						<Avatar
							alt="userAvatar"
							src={currentUser.user.avatarLink}
							sx={{ width: 180, height: 180, marginTop: 4 }}
						/>
						<label htmlFor="upload-profile-btn">
							<Input
								accept="image/*"
								id="upload-profile-btn"
								multiple
								type="file"
								onChange={handleChooseImg}
							/>
							<Button
								variant="outlined"
								component="span"
								sx={{ marginLeft: 2.5 }}
							>
								Choose Image
							</Button>
						</label>
						<Typography>
							{avatar ? avatar.name : "Not selected"}
						</Typography>
						<Button
							variant="contained"
							sx={{ width: 180 }}
							onClick={handleAvatarChange}
						>
							Change Avatar
						</Button>
					</Stack>
				</Grid>

				<Grid item xs={6} md={8} lg={12}>
					{renderInfoUpdateSection}
				</Grid>
			</Grid>
		</Box>
	);
}

export default Profile;
