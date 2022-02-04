import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";

import {
	fetchProfile,
	userLogin,
	triggerProfileUpdate,
	updateUserFollowing,
} from "../../reducers/authReducer";
import { fetchPosts, triggerPostUpdate } from "../../reducers/postsReducer";
import UserPost from "./Post";

import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { TextField } from "@mui/material";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Avatar } from "@mui/material";
import MoodIcon from "@mui/icons-material/Mood";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

import { List } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";

import {
	addFollowing,
	getFollowing,
	getProfile,
	postArticle,
	postImgUploader,
	putHeadline,
	removeFollowing,
} from "../../api/api";
import NewPostSection from "./NewPostSection";
import AddFollowingSection from "./AddFollowingSection";
import LoadingCard from "./LoadingCard";
import "react-toastify/dist/ReactToastify.css";
import {
	handleRequestErr,
	showToastWithMsg,
} from "../../utils/ToastWrapper";
import { parseFetchedProfile } from "../../utils/helper";

function Main() {
	const [content, setContent] = useState("");
	const [status, setStatus] = useState("");
	const [newfol, setNewfol] = useState("");
	const [addError, setAddError] = useState(false);
	const [img, setImg] = useState(undefined);

	const dispatch = useDispatch();
	const history = useHistory();

	const onContentChanged = (e) => setContent(e.target.value);
	const onStatusChanged = (e) => setStatus(e.target.value);
	const onNewfolChanged = (e) => setNewfol(e.target.value);

	// get post and user from state
	const posts = useSelector((state) => state.posts);
	let currentUser = useSelector((state) => state.auth);
	const search = useSelector((state) => state.search);

	let renderPosts;

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
				})
				.catch((err) => {
					history.push("/");
				});
		}
	}, []);

	useEffect(() => {
		let isMounted = true;
		if (currentUser.loggedin && currentUser.status === "idle") {
			dispatch(fetchProfile());
		}
		if (currentUser.loggedin && posts.status === "idle") {
			dispatch(fetchPosts());
		}
		return () => {
			isMounted = false;
		};
	}, [currentUser, posts, dispatch]);

	

	const handleChooseImg = (e) => {
		e.preventDefault();
		setImg(e.target.files[0]);
	};

	const onPostClicked = async () => {
		if (content && img) {
			postImgUploader(content, img)
				.then((res) => {
					showToastWithMsg("article with image posted!");
					dispatch(triggerPostUpdate());
					setContent("");
				})
				.catch((err) => {
					handleRequestErr(err);
				});
		} else if (content) {
			let payload = { text: content };
			try {
				await postArticle(payload);
				showToastWithMsg("article posted!");
				dispatch(triggerPostUpdate());
				setContent("");
			} catch (err) {
				handleRequestErr(err);
			}
		}
	};

	const handleStatusUpdate = () => {
		if (status) {
			putHeadline({ headline: status })
				.then((res) => {
					dispatch(
						userLogin({
							...currentUser,
							user: {
								...currentUser.user,
								status: res.data.headline,
							},
						})
					);
					setStatus("");
					showToastWithMsg("headline updated!");
				})
				.catch((err) => {
					handleRequestErr(err);
					setStatus("");
				});
		}
	};

	const handleFollowingDelete = async (fol) => {
		try {
			await removeFollowing(fol);
			let res = await getFollowing("");
			dispatch(updateUserFollowing(res.data));
			dispatch(triggerPostUpdate());
			showToastWithMsg("following deleted!");
		} catch (err) {
			handleRequestErr(err);
		}
	};

	const handleFollowingAdd = async () => {
		if (newfol === "") {
			return;
		}

		try {
			await addFollowing(newfol);
			let res = await getFollowing("");
			dispatch(updateUserFollowing(res.data));
			dispatch(triggerPostUpdate());
			showToastWithMsg("following added!");
			setAddError(false);
		} catch (err) {
			handleRequestErr(err);
			setAddError(true);
		}

		setNewfol("");
	};

	const onDelete = () => {
		setContent("");
	};

	const fetchNewContent = async () => {
		dispatch(triggerPostUpdate());

		try {
			let res = await getFollowing("");
			dispatch(updateUserFollowing(res.data));
		} catch (err) {
			handleRequestErr(err);
		}
	};

	if (posts.status === "loading") {
		renderPosts = (
			<Grid key="loading-card" item xs={3} md={4} lg={3}>
				<LoadingCard />
			</Grid>
		);
	} else if (posts.status === "succeeded") {
		let isAnyPosts = posts.items instanceof Array && posts.items.length > 0;
		renderPosts = isAnyPosts ? (
			posts.items
				.slice()
				.filter((post) => {
					return (
						post.text.includes(search.text) ||
						post.author === search.text
					);
				})
				.map((post) => {
					return (
						<Grid key={post._id} item xs={3} md={4} lg={3}>
							<UserPost post={post} />
						</Grid>
					);
				})
		) : (
			<div></div>
		);
	} else if (posts.status === "failed") {
		renderPosts = <div>{posts.error}</div>;
	}

	// friend list
	const renderFriend = () => {
		if (currentUser.user.following) {
			return currentUser.user.following.slice().map((profile) => {
				return (
					<ListItem
						key={nanoid()}
						secondaryAction={
							<IconButton
								edge="end"
								aria-label="delete"
								onClick={() => {
									handleFollowingDelete(profile.username);
								}}
							>
								<DeleteIcon />
							</IconButton>
						}
					>
						<ListItemAvatar>
							<Avatar alt="friendsAvatar" src={profile.avatar} />
						</ListItemAvatar>
						<ListItemText
							primary={profile.username}
							secondary={profile.headline}
						/>
					</ListItem>
				);
			});
		}
	};

	const renderUserSection = (
		<Stack direction="row" spacing={3} sx={{ width: "100%" }}>
			<Box sx={{ height: 10 }} />

			<Avatar
				alt="userAvatar"
				src={currentUser.user.avatarLink}
				sx={{ width: 150, height: 150 }}
			/>

			<Stack direction="column" spacing={4}>
				<Stack direction="row" spacing={3}>
					<Typography id="account-name-main-display" variant="h3">
						{currentUser.user.accountName}
					</Typography>

					<IconButton
						color="primary"
						aria-label="Refresh page"
						onClick={fetchNewContent}
					>
						<RefreshIcon />
					</IconButton>
				</Stack>

				<Typography variant="h6">{currentUser.user.status}</Typography>
				<Box
					sx={{
						display: "flex",
						alignItems: "flex-end",
						width: 400,
					}}
				>
					<MoodIcon
						sx={{
							color: "action.active",
							mr: 1,
							my: 0.5,
						}}
					/>
					<TextField
						id="input-status"
						label="Status"
						variant="standard"
						placeholder="Update your status..."
						value={status}
						onChange={onStatusChanged}
					/>
				</Box>
				<Button
					variant="outlined"
					size="small"
					sx={{ width: 100 }}
					onClick={handleStatusUpdate}
				>
					Update
				</Button>
			</Stack>
		</Stack>
	);

	return (
		<Grid container spacing={6} columns={{ xs: 6, md: 8, lg: 12 }}>
			<Grid item xs={6} md={8} lg={12}>
				<Box />
			</Grid>

			<Grid
				container
				item
				xs={6}
				md={8}
				lg={12}
				spacing={4}
				justifyContent="space-between"
			>
				<Grid key="renderUserSection" item xs={6} md={8} lg={5}>
					{renderUserSection}
				</Grid>
				<Grid key="renderFriend" item xs={6} md={8} lg={6}>
					<Typography variant="h6" component="div">
						Following
					</Typography>

					<List
						sx={{
							width: "100%",
							maxWidth: 500,
							maxHeight: 200,
							position: "relative",
							overflow: "auto",
							bgcolor: "background.paper",
						}}
						id="friend-list-main"
					>
						{renderFriend()}
					</List>

					<AddFollowingSection
						addError={addError}
						newfol={newfol}
						onNewfolChanged={onNewfolChanged}
						handleFollowingAdd={handleFollowingAdd}
					/>
				</Grid>
			</Grid>

			<Grid key="NewPostSection" item xs={6} md={8} lg={12}>
				<NewPostSection
					content={content}
					onContentChanged={onContentChanged}
					onDelete={onDelete}
					onPostClicked={onPostClicked}
					img={img}
					handleChooseImg={handleChooseImg}
				/>
			</Grid>

			<Grid
				key="renderPosts"
				id="posts-grid-container"
				container
				item
				xs={6}
				md={8}
				lg={12}
				spacing={4}
				pb={10}
			>
				{renderPosts}
			</Grid>
		</Grid>
	);
}

export default Main;
