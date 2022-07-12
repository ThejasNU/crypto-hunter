import { Box, Button, TextField } from "@material-ui/core";
import { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useStore } from "../../store";

const Login = ({ handleClose }: any) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async () => {
		if (!email || !password) {
			useStore.setState({
				alert: {
					open: true,
					message: "Please fill all the Fields",
					type: "error",
				},
			});
			return;
		}

		try {
			const result = await signInWithEmailAndPassword(
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
			<Button
				variant="contained"
				size="large"
				onClick={handleSubmit}
				style={{ backgroundColor: "#EEBC1D" }}
			>
				Login
			</Button>
		</Box>
	);
};

export default Login;
