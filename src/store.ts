import { Color } from "@material-ui/lab";
import axios from "axios";
import create from "zustand";
import { CoinList } from "./config/api";
import { Coin } from "./types";

interface Alert {
	open: boolean;
	message: string;
	type: Color;
}

interface AppState {
	currency: "INR" | "USD";
	symbol: "₹" | "$";
	coins: Coin[];
	loading: boolean;
	user: any;
	alert: Alert;
	watchlist: string[];
	setCurrency: (curr: "INR" | "USD") => void;
	fetchCoins: () => void;
}

export const useStore = create<AppState>()((set, get) => ({
	currency: "INR",
	symbol: "₹",
	coins: [],
	loading: false,
	user: null,
	alert: {
		open: false,
		message: "",
		type: "info",
	},
	watchlist: [],
	setCurrency: (curr) =>
		set((state) => ({
			currency: curr,
			symbol: curr === "USD" ? "$" : "₹",
		})),
	fetchCoins: async () => {
		set({ loading: true });
		const { data } = await axios.get(CoinList(get().currency));
		set({ coins: data, loading: false });
	},
}));
