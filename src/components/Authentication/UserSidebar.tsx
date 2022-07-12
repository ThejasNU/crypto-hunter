import React, { ReactComponentElement, useEffect, useState } from "react";
import {
	createTheme,
	makeStyles,
	ThemeProvider,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { Avatar, Button } from "@material-ui/core";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { AiFillDelete } from "react-icons/ai";
import { doc, setDoc } from "firebase/firestore";
import { useStore } from "../../store";
import { Coin } from "../../types";
import { numberWithCommas } from "../../config/numberWithCommas";

const useStyles = makeStyles({
	container: {
		width: 350,
		padding: 25,
		height: "100%",
		display: "flex",
		flexDirection: "column",
		fontFamily: "monospace",
	},
	profile: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: "20px",
		height: "92%",
	},
	logout: {
		height: "8%",
		width: "100%",
		backgroundColor: "#EEBC1D",
		marginTop: 20,
	},
	picture: {
		width: 200,
		height: 200,
		cursor: "pointer",
		backgroundColor: "#EEBC1D",
		objectFit: "contain",
	},
	watchlist: {
		flex: 1,
		width: "100%",
		backgroundColor: "grey",
		borderRadius: 10,
		padding: 15,
		paddingTop: 10,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: 12,
		overflowY: "scroll",
	},
	coin: {
		padding: 10,
		borderRadius: 5,
		color: "black",
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#EEBC1D",
		boxShadow: "0 0 3px black",
	},
});

const darkTheme = createTheme({
	palette: {
		primary: {
			main: "#fff",
		},
		type: "dark",
	},
});

const UserSidebar = () => {
	const { user, watchlist, coins, symbol } = useStore();
	const classes = useStyles();
	const [sbState, setSbState] = useState<boolean>(false);

	const toggleDrawer =
		(open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
			if (
				event.type === "keydown" &&
				((event as React.KeyboardEvent).key === "Tab" ||
					(event as React.KeyboardEvent).key === "Shift")
			) {
				return;
			}

			setSbState(open);
		};

	const logOut = () => {
		signOut(auth);

		useStore.setState({
			alert: {
				open: true,
				type: "success",
				message: "Logout successfull !",
			},
		});

		toggleDrawer(false);
	};

	const removeFromWatchlist = async (coin: Coin) => {
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
					message: `${coin.name} Removed from the Watchlist!`,
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

	return (
		<ThemeProvider theme={darkTheme}>
			{(["right"] as const).map((anchor) => (
				<React.Fragment key={anchor}>
					<Avatar
						onClick={toggleDrawer(true)}
						style={{
							height: 38,
							width: 38,
							marginLeft: 15,
							cursor: "pointer",
							backgroundColor: "#EEBC1D",
						}}
						src={user.photoURL}
						alt={user.displayName || user.email}
					/>
					<Drawer
						anchor={anchor}
						open={sbState}
						onClose={toggleDrawer(false)}
					>
						<div className={classes.container}>
							<div className={classes.profile}>
								<Avatar
									className={classes.picture}
									src={user.photoURL}
									alt={user.displayName || user.email}
								/>
								<span
									style={{
										width: "100%",
										fontSize: 25,
										textAlign: "center",
										fontWeight: "bolder",
										wordWrap: "break-word",
									}}
								>
									{user.displayName || user.email}
								</span>
								<div className={classes.watchlist}>
									<span
										style={{
											fontSize: 15,
											textShadow: "0 0 5px black",
										}}
									>
										Watchlist
									</span>
									{coins.map((coin: Coin) => {
										if (watchlist.includes(coin.id)) {
											return (
												<div className={classes.coin}>
													<span>{coin.name}</span>
													<span className="flex gap-3">
														{symbol}
														{numberWithCommas(
															coin.current_price.toFixed(
																2
															)
														)}
														<AiFillDelete
															className="cursor-pointer text-lg"
															onClick={() => {
																removeFromWatchlist(
																	coin
																);
															}}
														></AiFillDelete>
													</span>
												</div>
											);
										}
									})}
								</div>
							</div>
							<Button
								variant="contained"
								className={classes.logout}
								onClick={logOut}
							>
								Log Out
							</Button>
						</div>
					</Drawer>
				</React.Fragment>
			))}
		</ThemeProvider>
	);
};

export default UserSidebar;
