import { makeStyles } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { TrendingCoins } from "../../config/api";
import { useStore } from "../../store";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";
import { Coin } from "../../types";
import { numberWithCommas } from "../../config/numberWithCommas";

const useStyles = makeStyles((theme) => ({
	carousel: {
		height: "50%",
		display: "flex",
		alignItems: "center",
	},
	carouselItem: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		cursor: "pointer",
		textTransform: "uppercase",
		color: "white",
	},
}));

const Carousel = () => {
	const classes = useStyles();
	const currency = useStore((state) => state.currency);
	const symbol = useStore((state) => state.symbol);

	const [trending, setTrending] = useState<Coin[]>([]);

	const fetchTrendingCoins = async () => {
		const { data } = await axios.get(TrendingCoins(currency));
		setTrending(data);
	};

	useEffect(() => {
		fetchTrendingCoins();
	}, [currency]);

	const responsive = {
		0: {
			items: 2,
		},
		512: {
			items: 4,
		},
	};

	const items = trending.map((coin) => {
		let profit = coin.price_change_percentage_24h >= 0;

		return (
			<Link to={`coins/${coin.id}`} className={classes.carouselItem}>
				<img
					src={coin?.image}
					alt={coin.name}
					height="80"
					style={{ marginBottom: 10 }}
				/>
				<span>
					{coin?.symbol}
					&nbsp;
					<span
						style={{
							color: profit ? "rgb(14, 203, 129)" : "red",
							fontWeight: 500,
						}}
					>
						{profit && "+"}{" "}
						{coin?.price_change_percentage_24h.toFixed(2)}%
					</span>
				</span>
				<span style={{ fontSize: 22, fontWeight: 500 }}>
					{symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
				</span>
			</Link>
		);
	});

	return (
		<div className={classes.carousel}>
			<AliceCarousel
				mouseTracking
				infinite
				autoPlayInterval={1000}
				animationDuration={1500}
				disableDotsControls
				disableButtonsControls
				responsive={responsive}
				autoPlay
				items={items}
			/>
		</div>
	);
};

export default Carousel;
