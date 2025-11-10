import { Route, Routes } from "react-router-dom";
import { ProfileEnum } from "./components/SideBar/SideBar";
import Me from "./Me/Me";
import Orders from "./Orders/Orders";
import { useEffect } from "react";

export default function Profile() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return (
		<Routes>
			<Route path={ProfileEnum.ME} element={<Me />} />
			<Route path={ProfileEnum.ORDERS} element={<Orders />} />
		</Routes>
	);
}
