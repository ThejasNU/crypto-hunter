import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { useStore } from "../store";

const Alert = () => {
	const { alert } = useStore();

	const handleCloseAlert = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === "clickaway") {
			return;
		}
		useStore.setState({
			alert: { open: false, message: "", type: "info" },
		});
	};

	return (
		<Snackbar
			open={alert.open}
			autoHideDuration={3000}
			onClose={handleCloseAlert}
		>
			<MuiAlert
				onClose={handleCloseAlert}
				elevation={10}
				variant="filled"
				severity={alert.type}
			>
				{alert.message}
			</MuiAlert>
		</Snackbar>
	);
};

export default Alert;
