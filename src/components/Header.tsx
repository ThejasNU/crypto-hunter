import {
	AppBar,
	Container,
	createTheme,
	makeStyles,
	MenuItem,
	Select,
	ThemeProvider,
	Toolbar,
	Typography,
} from "@material-ui/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import AuthModal from "./Authentication/AuthModal";
import UserSidebar from "./Authentication/UserSidebar";

const useStyles = makeStyles((theme) => ({
	title: {
		flex: 1,
		color: "gold",
		fontFamily: "Montserrat",
		fontWeight: "bold",
		cursor: "pointer",
	},
}));

const darkTheme = createTheme({
	palette: {
		primary: {
			main: "#fff",
		},
		type: "dark",
	},
});

const Header = () => {
	const classes = useStyles();
	const navigate = useNavigate();

	const { currency, setCurrency, user } = useStore();

	const handleCurrencyChange = (e: any) => {
		setCurrency(e.target.value);
	};

	return (
		<div>
			<ThemeProvider theme={darkTheme}>
				<AppBar color="transparent" position="static">
					<Container>
						<Toolbar>
							<Typography
								className={classes.title}
								variant="h6"
								onClick={() => {
									navigate("/");
								}}
							>
								Crypto Hunter
							</Typography>
							<Select
								variant="outlined"
								className="mr-1 w-24 h-10"
								value={currency}
								onChange={handleCurrencyChange}
							>
								<MenuItem value="USD">USD</MenuItem>
								<MenuItem value="INR">INR</MenuItem>
							</Select>
							{user ? <UserSidebar /> : <AuthModal />}
						</Toolbar>
					</Container>
				</AppBar>
			</ThemeProvider>
		</div>
	);
};

export default Header;
