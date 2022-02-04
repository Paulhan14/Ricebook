import React from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { Box } from "@mui/system";

function Landing() {
	return (
		<Box pt={3}>
			<Stack
				direction="row"
				justifyContent="center"
				alignItems="center"
				divider={<Divider orientation="vertical" flexItem />}
				spacing={{xs: 1, sm: 2, md: 4, lg:8}}
			>
				<SignUp />
				<SignIn />
			</Stack>
		</Box>
	);
}

export default Landing;
