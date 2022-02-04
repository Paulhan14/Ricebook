import { Stack } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";

const AddFollowingSection = ({addError, newfol, onNewfolChanged, handleFollowingAdd}) => (
    <Stack
        pt={2}
        direction="row"
        spacing={2}
        alignItems="center"
    >
        <TextField
            id="add-following-input-main"
            label="New following"
            variant="outlined"
            placeholder={
                addError
                    ? "User not found"
                    : "Enter username..."
            }
            value={newfol}
            color={addError ? "warning" : "success"}
            onChange={onNewfolChanged}
            InputLabelProps={{ shrink: true }}
        />

        <Button
            id="add-following-btn-main"
            name="add"
            variant="outlined"
            size="small"
            onClick={handleFollowingAdd}
        >
            Add
        </Button>
    </Stack>
);

export default AddFollowingSection;