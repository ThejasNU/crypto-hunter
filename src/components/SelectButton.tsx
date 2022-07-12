import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
	selectbutton: {
		border: "1px solid gold",
		borderRadius: 25,
		paddingTop: 10,
		paddingBottom: 10,
		textAlign: "center",
		fontFamily: "Montserrat",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "gold",
			color: "black",
		},
		width: "24%",
	},
});

const SelectButton = ({ children, selected, func }: any) => {
	const classes = useStyles();

	return (
		<>
			{selected ? (
				<span
					onClick={func}
					className={classes.selectbutton}
					style={{
						backgroundColor: "gold",
						color: "black",
						fontWeight: 700,
					}}
				>
					{children}
				</span>
			) : (
				<span
					onClick={func}
					className={classes.selectbutton}
					style={{ fontWeight: 500 }}
				>
					{children}
				</span>
			)}
		</>
	);
};

export default SelectButton;
