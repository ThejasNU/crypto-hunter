import {
	CircularProgress,
	createTheme,
	makeStyles,
	ThemeProvider,
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { HistoricalChart } from "../config/api";
import { chartDays } from "../config/data";
import { useStore } from "../store";
import { HistoricData, SingleCoin } from "../types";
import SelectButton from "./SelectButton";

const useStyles = makeStyles((theme) => ({
	container: {
		width: "75%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 25,
		padding: 40,
		[theme.breakpoints.down("md")]: {
			width: "100%",
			marginTop: 0,
			padding: 20,
			paddingTop: 0,
		},
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

interface Props {
	coin: SingleCoin;
}

const CoinInfo = ({ coin }: Props) => {
	const classes = useStyles();
	const { currency } = useStore();

	const [historicData, setHistoricData] = useState<HistoricData>();
	const [days, setDays] = useState<number>(1);
	const [flag, setFlag] = useState<boolean>(false);

	const fetchHistoricalData = async () => {
		const { data } = await axios.get(
			`https://api.coingecko.com/api/v3/coins/${coin?.id}/market_chart?vs_currency=${currency}&days=${days}`
		);
		setFlag(true);
		setHistoricData(data);
	};

	useEffect(() => {
		fetchHistoricalData();
	}, [currency, days]);

	return (
		<ThemeProvider theme={darkTheme}>
			<div className={classes.container}>
				{!historicData || flag === false ? (
					<CircularProgress
						style={{ color: "gold" }}
						size={250}
						thickness={1}
					/>
				) : (
					<>
						<Line
							data={{
								labels: historicData.prices.map(
									(coin: number[]) => {
										let date = new Date(coin[0]);
										let time =
											date.getHours() > 12
												? `${
														date.getHours() - 12
												  }:${date.getMinutes()} PM`
												: `${date.getHours()}:${date.getMinutes()} AM`;
										return days === 1
											? time
											: date.toLocaleDateString();
									}
								),

								datasets: [
									{
										data: historicData.prices.map(
											(coin: number[]) => coin[1]
										),
										label: `Price ( Past ${days} Days ) in ${currency}`,
										borderColor: "#EEBC1D",
									},
								],
							}}
							options={{
								elements: {
									point: {
										radius: 1,
									},
								},
							}}
						/>
						<div
							style={{
								display: "flex",
								marginTop: 20,
								justifyContent: "space-around",
								width: "100%",
							}}
						>
							{chartDays.map(
								(day: { label: string; value: number }) => (
									<SelectButton
										key={day.value}
										func={() => {
											setDays(day.value);
											setFlag(false);
										}}
										selected={day.value === days}
									>
										{day.label}
									</SelectButton>
								)
							)}
						</div>
					</>
				)}
			</div>
		</ThemeProvider>
	);
};

export default CoinInfo;
