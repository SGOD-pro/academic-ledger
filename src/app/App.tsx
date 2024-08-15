"use client";
import React from "react";
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-dark-teal/theme.css';
import { Provider } from "react-redux";
import store from "@/toolkit";
import Main from "./Main";

function App({ children }: { children: React.ReactNode }) {
	return (
		<PrimeReactProvider>
			<Provider store={store}>
				<Main>{children}</Main>
			</Provider>
		</PrimeReactProvider>
	);
}

export default App;
