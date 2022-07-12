import { Box, Button, TextField } from "@material-ui/core";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useStore } from "../../store";

const Signup = ({ handleClose }: any) => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");

	const handleSubmit = async () => {
		if (password !== confirmPassword) {
			useStore.setState({
				alert: {
					open: true,
					message: "Passwords do not match",
					type: "error",
				},
			});
			return;
		}

		try {
			const result = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			useStore.setState({
				alert: {
					open: true,
					message: `Sign Up Successful. Welcome ${result.user.email}`,
					type: "success",
				},
			});

			handleClose();
		} catch (error: any) {
			useStore.setState({
				alert: {
					open: true,
					message: error.message,
					type: "error",
				},
			});
			return;
		}
	};

	return (
		<Box
			p={3}
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "20px",
				padding: 30,
				paddingLeft: 50,
				paddingRight: 50,
			}}
		>
			<TextField
				variant="outlined"
				type="email"
				label="Enter Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				fullWidth
			/>
			<TextField
				variant="outlined"
				label="Enter Password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				fullWidth
			/>
			<TextField
				variant="outlined"
				label="Confirm Password"
				type="password"
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				fullWidth
			/>
			<Button
				variant="contained"
				size="large"
				style={{ backgroundColor: "#EEBC1D" }}
				onClick={handleSubmit}
			>
				Sign Up
			</Button>
		</Box>
	);
};

export default Signup;
