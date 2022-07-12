import { LinearProgress } from "@material-ui/core";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Alert from "./components/Alert";
import Header from "./components/Header";
import { auth, db } from "./firebase";
import { useStore } from "./store";
const CoinPage = React.lazy(() => import("./pages/CoinPage"));
const HomePage = React.lazy(() => import("./pages/HomePage"));
function App() {
	const { user, currency, fetchCoins } = useStore();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				useStore.setState({ user: user });
			} else {
				useStore.setState({ user: null });
			}
		});
	}, []);

	useEffect(() => {
		if (user) {
			const coinRef = doc(db, "watchlist", user.uid);

			let unsubscribe = onSnapshot(coinRef, (coin) => {
				if (coin.exists()) {
					useStore.setState({ watchlist: coin.data().coins });
				}
			});

			return () => {
				unsubscribe();
			};
		}
	}, [user]);

	useEffect(() => {
		fetchCoins();
	}, [currency]);

	return (
		<BrowserRouter>
			<div className="bg-[#14161a] text-white min-h-screen">
				<Header />
				<Suspense
					fallback={
						<LinearProgress style={{ backgroundColor: "gold" }} />
					}
				>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/coins/:id" element={<CoinPage />} />
					</Routes>
				</Suspense>
			</div>
			<Alert />
		</BrowserRouter>
	);
}

export default App;
