import React from "react";
import { useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { Button, Paper } from "@mui/material";
import { Stack } from "@mui/material";
import { TextField } from "@mui/material";
import { Modal } from "@mui/material";
import { List } from "@mui/material";

import Comment from "./Comment";
import { useSelector } from "react-redux";
import { getComments, putArticle } from "../../api/api";
import { triggerPostUpdate } from "../../reducers/postsReducer";
import { handleRequestErr, showToastWithMsg } from "../../utils/ToastWrapper";

const EditView = ({
	post,
	editOpen,
	handleEditClose,
	editContent,
	onEditContentChanged,
	onDelete,
	onEditPostClicked,
}) => (
	<Modal key={post._id + 1} open={editOpen} onClose={handleEditClose}>
		<Paper
			sx={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				width: 400,
				bgcolor: "background.paper",
				border: "2px solid #000",
				boxShadow: 24,
				p: 4,
			}}
		>
			<Stack direction="column" spacing={2}>
				<TextField
					name="content"
					label="Edit Post"
					value={editContent}
					onChange={onEditContentChanged}
					rows={4}
					multiline
				/>
				<Stack direction="row" spacing={2}>
					<Button
						color="error"
						variant="outlined"
						startIcon={<DeleteIcon />}
						onClick={onDelete}
					>
						Clear
					</Button>

					<Button
						id="send-newpost"
						variant="contained"
						endIcon={<SendIcon />}
						onClick={onEditPostClicked}
					>
						Update Post
					</Button>
				</Stack>
			</Stack>
		</Paper>
	</Modal>
);

const CommentView = ({
	post,
	addOpen,
	handleAddClose,
	addContent,
	onAddContentChanged,
	onDelete,
	onAddCmtClicked,
}) => (
	<Modal key={post._id + 2} open={addOpen} onClose={handleAddClose}>
		<Paper
			sx={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				width: 400,
				bgcolor: "background.paper",
				border: "2px solid #000",
				boxShadow: 24,
				p: 4,
			}}
		>
			<Stack direction="column" spacing={2}>
				<TextField
					name="content"
					label="Add a comment"
					value={addContent}
					onChange={onAddContentChanged}
					rows={4}
					multiline
				/>
				<Stack direction="row" spacing={2}>
					<Button
						color="error"
						variant="outlined"
						startIcon={<DeleteIcon />}
						onClick={onDelete}
					>
						Clear
					</Button>

					<Button
						id="send-newpost"
						variant="contained"
						endIcon={<SendIcon />}
						onClick={onAddCmtClicked}
					>
						Send Comment
					</Button>
				</Stack>
			</Stack>
		</Paper>
	</Modal>
);

function UserPost({ post }) {
	const dispatch = useDispatch();
	let currentUser = useSelector((state) => state.auth);

	const [renderComment, setRenderComment] = React.useState(undefined);

	const [editContent, setEditContent] = React.useState(post.text);
	const [addContent, setAddContent] = React.useState("");

	const onEditContentChanged = (e) => setEditContent(e.target.value);
	const onAddContentChanged = (e) => setAddContent(e.target.value);

	const [commentOpen, setCommentOpen] = React.useState(false);
	const handleCommentOpen = async () => {
		setCommentOpen(true);

		let res = await getComments(post._id);
		setRenderComment(
			res.data.comments.map((cmt) => (
				<Comment key={cmt._id} comment={cmt} postId={post._id} handleCommentClose={handleCommentClose}/>
			))
		);
	};
	const handleCommentClose = () => setCommentOpen(false);

	const [editOpen, setEditOpen] = React.useState(false);
	const handleEditOpen = () => setEditOpen(true);
	const handleEditClose = () => setEditOpen(false);

	const [addOpen, setAddOpen] = React.useState(false);
	const handleAddOpen = () => setAddOpen(true);
	const handleAddClose = () => setAddOpen(false);

	const displayTime = () => {
		let date = new Date(post.date);
		return (
			date.getHours() +
			":" +
			date.getMinutes() +
			" " +
			date.toDateString()
		);
	};

	const onEditPostClicked = async () => {
		if (editContent !== post.text) {
			let payload = { text: editContent };
			try {
				await putArticle(post._id, payload);
				dispatch(triggerPostUpdate());
				showToastWithMsg("edited!");
				handleEditClose();
			} catch (err) {
				handleRequestErr(err);
			}
		}
	};

	const onAddCmtClicked = async () => {
		if (addContent) {
			let payload = { text: addContent, commentId: -1 };
			try {
				await putArticle(post._id, payload);
				showToastWithMsg("commented!");
				handleAddClose();
			} catch (err) {
				handleRequestErr(err);
			}
		}
	};

	const onDelete = () => {
		setEditContent("");
		setAddContent("");
	};

	return (
		<Card key={post._id} sx={{ maxWidth: 345 }}>
			<CardHeader
				avatar={
					<Avatar alt={post.author} src={post.avatar ? post.avatar : ""} />
				}
				title={post.author}
				subheader={displayTime(post)}
			/>

			<CardMedia sx={{display: post.img ? "visible" : "none"}} component="img" height="194" image={post.img} />

			<CardContent>
				<Typography variant="body" color="text.secondary">
					{post.text}
				</Typography>
			</CardContent>

			<CardActions>
				<Button
					size="small"
					color="success"
					onClick={handleEditOpen}
					sx={{
						display:
							post.author === currentUser.user.accountName
								? "visible"
								: "none",
					}}
				>
					Edit
				</Button>
				<Button
					size="small"
					color="secondary"
					onClick={handleAddOpen}
				>
					Comment
				</Button>
				<Button
					size="small"
					onClick={handleCommentOpen}
				>
					All Comments
				</Button>
			</CardActions>

			<EditView
				post={post}
				editOpen={editOpen}
				handleEditClose={handleEditClose}
				editContent={editContent}
				onEditContentChanged={onEditContentChanged}
				onDelete={onDelete}
				onEditPostClicked={onEditPostClicked}
			/>

			<CommentView
				post={post}
				addOpen={addOpen}
				handleAddClose={handleAddClose}
				addContent={addContent}
				onAddContentChanged={onAddContentChanged}
				onDelete={onDelete}
				onAddCmtClicked={onAddCmtClicked}
			/>

			<Modal
				key={post._id + 3}
				open={commentOpen}
				onClose={handleCommentClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Paper
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						bgcolor: "background.paper",
						border: "2px solid #000",
						boxShadow: 24,
						p: 4,
					}}
				>
					<Typography variant="h4">Comments</Typography>
					<List
						sx={{
							maxHeight: 500,
							overflow: "auto",
							bgcolor: "background.paper",
						}}
					>
						{renderComment}
					</List>
				</Paper>
			</Modal>
		</Card>
	);
}

export default UserPost;
