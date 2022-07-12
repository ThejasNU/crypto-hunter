import {
	Button,
	CircularProgress,
	LinearProgress,
	makeStyles,
	Typography,
} from "@material-ui/core";
import axios from "axios";
import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../store";
import ReactHtmlParser from "react-html-parser";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { numberWithCommas } from "../config/numberWithCommas";
import { SingleCoin } from "../types";
const CoinInfo = React.lazy(() => import("../components/CoinInfo"));

const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
		[theme.breakpoints.down("md")]: {
			flexDirection: "column",
			alignItems: "center",
		},
	},
	sidebar: {
		width: "30%",
		[theme.breakpoints.down("md")]: {
			width: "100%",
		},
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		marginTop: 25,
		borderRight: "2px solid grey",
	},
	heading: {
		fontWeight: "bold",
		marginBottom: 20,
		fontFamily: "Montserrat",
	},
	description: {
		width: "100%",
		fontFamily: "Montserrat",
		padding: 25,
		paddingBottom: 15,
		paddingTop: 0,
		textAlign: "justify",
	},
	marketData: {
		alignSelf: "start",
		padding: 25,
		paddingTop: 10,
		width: "100%",
		[theme.breakpoints.down("md")]: {
			display: "flex",
			justifyContent: "space-around",
		},
		[theme.breakpoints.down("sm")]: {
			flexDirection: "column",
			alignItems: "center",
		},
		[theme.breakpoints.down("xs")]: {
			alignItems: "start",
		},
	},
}));

const CoinPage = () => {
	const { id } = useParams();
	const classes = useStyles();
	const { currency, symbol, user, watchlist } = useStore();

	const [coin, setCoin] = useState<SingleCoin | null>(null);

	const fetchCoin = async () => {
		const { data } = await axios.get(
			`https://api.coingecko.com/api/v3/coins/${id}`
		);
		setCoin(data);
	};

	useEffect(() => {
		fetchCoin();
	}, [currency]);

	const addToWatchList = async () => {
		const coinRef = doc(db, "watchlist", user.uid);

		try {
			await setDoc(coinRef, {
				coins: watchlist ? [...watchlist, coin?.id] : [coin?.id],
			});
			useStore.setState({
				alert: {
					open: true,
					message: `${coin?.name} Added to the Watchlist!`,
					type: "success",
				},
			});
		} catch (error: any) {
			useStore.setState({
				alert: {
					open: true,
					message: error.message,
					type: "error",
				},
			});
		}
	};

	const removeFromWatchlist = async () => {
		const coinRef = doc(db, "watchlist", user.uid);

		try {
			await setDoc(
				coinRef,
				{
					coins: watchlist.filter((watch) => watch !== coin?.id),
				},
				{ merge: true }
			);

			useStore.setState({
				alert: {
					open: true,
					message: `${coin?.name} Removed from the Watchlist!`,
					type: "success",
				},
			});
		} catch (error: any) {
			useStore.setState({
				alert: {
					open: true,
					message: error.message,
					type: "error",
				},
			});
		}
	};

	const inWatchlist = watchlist.includes(`${coin?.id}`);

	if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

	return (
		<div className={classes.container}>
			<div className={classes.sidebar}>
				<img
					src={coin?.image.large}
					alt={coin?.name}
					height="200"
					style={{ marginBottom: 20 }}
				/>
				<Typography variant="h3" className={classes.heading}>
					{coin?.name}
				</Typography>
				<Typography variant="subtitle1" className={classes.description}>
					{ReactHtmlParser(coin?.description.en.split(". ")[0])}
				</Typography>
				<div className={classes.marketData}>
					<span style={{ display: "flex" }}>
						<Typography variant="h5" className={classes.heading}>
							Rank:{" "}
						</Typography>
						&nbsp;&nbsp;
						<Typography
							variant="h5"
							style={{ fontFamily: "Montserrat" }}
						>
							{coin?.market_cap_rank}
						</Typography>
					</span>
					<span style={{ display: "flex" }}>
						<Typography variant="h5" className={classes.heading}>
							Current Price:{" "}
						</Typography>
						&nbsp;&nbsp;
						<Typography
							variant="h5"
							style={{ fontFamily: "Montserrat" }}
						>
							{symbol}{" "}
							{numberWithCommas(
								coin?.market_data.current_price[
									currency === "USD" ? "usd" : "inr"
								].toString()
							)}
						</Typography>
					</span>
					<span style={{ display: "flex" }}>
						<Typography variant="h5" className={classes.heading}>
							Market Cap:{" "}
						</Typography>
						&nbsp;&nbsp;
						<Typography
							variant="h5"
							style={{ fontFamily: "Montserrat" }}
						>
							{symbol}{" "}
							{numberWithCommas(
								coin?.market_data.market_cap[
									currency === "USD" ? "usd" : "inr"
								]
									.toString()
									.slice(0, -6)
							)}
							M
						</Typography>
					</span>
					{user &&
						(inWatchlist ? (
							<Button
								variant="outlined"
								style={{
									width: "100%",
									height: 40,
									backgroundColor: "#FF0000",
								}}
								onClick={removeFromWatchlist}
							>
								{"Remove from Watchlist"}
							</Button>
						) : (
							<Button
								variant="outlined"
								style={{
									width: "100%",
									height: 40,
									backgroundColor: "#EEBC1D",
								}}
								onClick={addToWatchList}
							>
								{"Add to Watchlist"}
							</Button>
						))}
				</div>
			</div>
			<Suspense
				fallback={
					<CircularProgress
						style={{ color: "gold" }}
						size={250}
						thickness={1}
					/>
				}
			>
				<CoinInfo coin={coin} />
			</Suspense>
		</div>
	);
};

export default CoinPage;
