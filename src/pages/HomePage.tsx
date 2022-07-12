import { LinearProgress } from "@material-ui/core";
import React, { Suspense } from "react";
const Banner = React.lazy(() => import("../components/Banner/Banner"));
const CoinTable = React.lazy(() => import("../components/CoinTable"));

const HomePage = () => {
	return (
		<>
			<Suspense
				fallback={
					<LinearProgress style={{ backgroundColor: "gold" }} />
				}
			>
				<Banner />
				<CoinTable />
			</Suspense>
		</>
	);
};

export default HomePage;
