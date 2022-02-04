import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";

import { userLogout } from "../reducers/authReducer";
import { updateSearch } from "../reducers/searchReducer";
import { signOut } from "../api/api";
import { clearPosts } from "../reducers/postsReducer";
import { CircularProgress } from "@mui/material";
import { handleRequestErr } from "../utils/ToastWrapper";

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(3),
		width: "auto",
	},
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "20ch",
		},
	},
}));

export default function Header() {
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();

	const currentUser = useSelector((state) => state.auth);

	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);

	const onSearchChanged = (e) => setSearch(e.target.value);

	const gotoProfile = () => {
		history.push("/profile");
	};

	const logout = async () => {
		try {
			setLoading(true);
			await signOut();
			dispatch(userLogout());
			dispatch(clearPosts());
			window.localStorage.clear();
			setLoading(false);
			history.push("/");
		} catch (err) {
			handleRequestErr(err);
		}
	};

	const searchTxt = () => {
		dispatch(
			updateSearch({
				text: search,
				location: location.pathname,
			})
		);
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Box sx={{ width: 80 }} />
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{ display: { xs: "none", sm: "block" } }}
					>
						Ricebook
					</Typography>
					<Search
						sx={{
							display: currentUser.loggedin ? "visible" : "none",
						}}
					>
						<SearchIconWrapper>
							<SearchIcon />
						</SearchIconWrapper>
						<StyledInputBase
							id="search-input-header"
							placeholder="Search…"
							inputProps={{ "aria-label": "search" }}
							value={search}
							onChange={onSearchChanged}
						/>
					</Search>
					<Button
						id="find-btn-header"
						sx={{
							display: currentUser.loggedin ? "visible" : "none",
						}}
						size="small"
						variant="contained"
						color="success"
						onClick={searchTxt}
					>
						Find
					</Button>
					<Box sx={{ flexGrow: 1 }} />
					<Button
						sx={{
							display: currentUser.loggedin ? "visible" : "none",
						}}
						size="small"
						variant="contained"
						color="success"
						onClick={gotoProfile}
					>
						Profile
					</Button>
					<Box sx={{ width: 30 }} />
					<Button
						sx={{
							display: currentUser.loggedin ? "visible" : "none",
						}}
						id="logout-btn-header"
						size="small"
						variant="contained"
						color="error"
						onClick={logout}
					>
						Logout
					</Button>
					<Box sx={{ width: 10 }} />
					<CircularProgress color="inherit" sx={{display: loading? "visible" : "none"}}/>
					<Box sx={{ width: 80 }} />
				</Toolbar>
			</AppBar>
		</Box>
	);
}
