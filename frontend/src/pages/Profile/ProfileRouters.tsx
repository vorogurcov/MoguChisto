import { Route, Routes } from "react-router-dom";
import { ProfileEnum } from "./components/SideBar/SideBar";
import Me from "./components/Me/Me";
import Orders from "./Orders/Orders";

export default function Profile() {
	return (
		<Routes>
			<Route path={ProfileEnum.ME} element={<Me />} />
			<Route path={ProfileEnum.ORDERS} element={<Orders />} />
		</Routes>
	);
}
