import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main/Main";
import { ActiveSectionProvider } from "./hooks/ActiveSectionContext";

function App() {
	return (
		<ActiveSectionProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Main />} />
				</Routes>
			</BrowserRouter>
		</ActiveSectionProvider>
	);
}

export default App;
