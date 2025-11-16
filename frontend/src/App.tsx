import {
	BrowserRouter,
	Navigate,
	Outlet,
	Route,
	Routes,
} from "react-router-dom";
import Main from "./pages/Main/Main";
import { ActiveSectionProvider } from "./hooks/ActiveSectionContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ModalRoot from "./modals/ModalRoot";
import { ModalContextProvider } from "./hooks/ModalContext";
import Profile from "./pages/Profile/ProfileRouters";
import { sessIdKey } from "./core";
import useShowModal from "./hooks/useShowModal";

const ProtectedRoute: React.FC = () => {
	const showModal = useShowModal();
	if (!localStorage.getItem(sessIdKey)) {
		setTimeout(() => showModal("Authorization", {}), 0);
		return <Navigate to="/" />;
	}

	return <Outlet />;
};

function App() {
	return (
		<ErrorBoundary>
			<ModalContextProvider>
				<ActiveSectionProvider>
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<Main />} />
							<Route path={"/profile"} element={<ProtectedRoute />}>
								<Route path="*" element={<Profile />} />
							</Route>
						</Routes>
						<ModalRoot />
					</BrowserRouter>
				</ActiveSectionProvider>
			</ModalContextProvider>
		</ErrorBoundary>
	);
}

export default App;
