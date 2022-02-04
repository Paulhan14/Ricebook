import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

const Input = styled("input")({
	display: "none",
});

const NewPostSection = ({content, onContentChanged, onDelete, onPostClicked, img, handleChooseImg}) => (
    <Box>
        <Stack direction="column" spacing={2}>
            <TextField
                id="content-newpost"
                name="content"
                label="New Post"
                placeholder="Write something..."
                value={content}
                onChange={onContentChanged}
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
                    Delete
                </Button>
                <label htmlFor="upload-img-btn">
                    <Input
                        accept="image/*"
                        id="upload-img-btn"
                        multiple
                        type="file"
                        onChange={handleChooseImg}
                    />
                    <Button variant="contained" component="span">
                        Upload Image
                    </Button>
                </label>
                <Typography>
                    {img ? img.name : "Not selected"}
                </Typography>
                <Button
                    id="send-newpost"
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={onPostClicked}
                >
                    Send
                </Button>
            </Stack>
        </Stack>
    </Box>
);

export default NewPostSection;