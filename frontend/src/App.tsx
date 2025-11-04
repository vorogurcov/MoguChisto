import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main/Main";
import { ActiveSectionProvider } from "./hooks/ActiveSectionContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ModalRoot from "./modals/ModalRoot";
import { ModalContextProvider } from "./hooks/ModalContext";

function App() {
	return (
		<ErrorBoundary>
			<ModalContextProvider>
				<ActiveSectionProvider>
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<Main />} />
						</Routes>
					</BrowserRouter>
					<ModalRoot />
				</ActiveSectionProvider>
			</ModalContextProvider>
		</ErrorBoundary>
	);
}

export default App;
