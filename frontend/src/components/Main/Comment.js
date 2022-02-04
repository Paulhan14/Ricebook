import * as React from "react";

import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { ListItem } from "@mui/material";
import { ListItemAvatar } from "@mui/material";
import { ListItemText } from "@mui/material";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { Modal } from "@mui/material";
import { Paper } from "@mui/material";
import { Stack } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { putArticle } from "../../api/api";
import { handleRequestErr, showToastWithMsg } from "../../utils/ToastWrapper";
const EditCommentView = ({
	cmt,
	addOpen,
	handleAddClose,
	addContent,
	onAddContentChanged,
	onAddCmtClicked,
}) => (
	<Modal open={addOpen} onClose={handleAddClose}>
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
					label="Edit this comment"
					value={addContent}
					onChange={onAddContentChanged}
					rows={2}
					multiline
				/>
				<Button
					id="send-newpost"
					variant="contained"
					endIcon={<SendIcon />}
					onClick={onAddCmtClicked}
				>
					Edit Comment
				</Button>
			</Stack>
		</Paper>
	</Modal>
);

function Comment({ comment, postId, handleCommentClose }) {
	let currentUser = useSelector((state) => state.auth);

	const [addContent, setAddContent] = React.useState(comment.text);
	const onAddContentChanged = (e) => setAddContent(e.target.value);
	const [addOpen, setAddOpen] = React.useState(false);
	const handleAddOpen = () => setAddOpen(true);
	const handleAddClose = () => setAddOpen(false);

	const onAddCmtClicked = async () => {
		if (addContent) {
			let payload = { text: addContent, commentId: comment._id };
			try {
				await putArticle(postId, payload);
				handleAddClose();
				handleCommentClose();
				showToastWithMsg("comment added!")
			} catch (err) {
				handleRequestErr(err);
			}
		}
	};

	return (
		<ListItem
			key={comment._id}
			alignItems="flex-start"
			secondaryAction={
				<IconButton
					edge="end"
					aria-label="comments"
					sx={{
						display:
							comment.author === currentUser.user.accountName
								? "visible"
								: "none",
					}}
					onClick={handleAddOpen}
				>
					<EditIcon />
				</IconButton>
			}
		>
			<ListItemAvatar>
				<Avatar alt="" src={comment.avatar ? comment.avatar : ""} />
			</ListItemAvatar>
			<ListItemText
				primary={comment.author}
				secondary={
					<Typography
						sx={{ display: "inline" }}
						component="span"
						variant="body2"
						color="text.primary"
					>
						{comment.text}
					</Typography>
				}
			/>

			<EditCommentView
				cmt={comment}
				addOpen={addOpen}
				handleAddClose={handleAddClose}
				addContent={addContent}
				onAddContentChanged={onAddContentChanged}
				onAddCmtClicked={onAddCmtClicked}
			/>
		</ListItem>
	);
}

export default Comment;
