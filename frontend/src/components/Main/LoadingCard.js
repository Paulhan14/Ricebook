import * as React from 'react';
import { Card } from '@mui/material';
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { Skeleton } from "@mui/material";

const LoadingCard = () => (
	<Card sx={{ maxWidth: 345, m: 2 }}>
		<CardHeader
			avatar={
				<Skeleton
					animation="wave"
					variant="circular"
					width={40}
					height={40}
				/>
			}
			title={
				<Skeleton
					animation="wave"
					height={10}
					width="80%"
					style={{ marginBottom: 6 }}
				/>
			}
			subheader={<Skeleton animation="wave" height={10} width="40%" />}
		/>
		<Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />

		<CardContent>
			<React.Fragment>
				<Skeleton
					animation="wave"
					height={10}
					style={{ marginBottom: 6 }}
				/>
				<Skeleton animation="wave" height={10} width="80%" />
			</React.Fragment>
		</CardContent>
	</Card>
);

export default LoadingCard;
