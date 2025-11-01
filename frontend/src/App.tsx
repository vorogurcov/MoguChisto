import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main/Main";
import { ActiveSectionProvider } from "./hooks/ActiveSectionContext";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
	example: string;
	exampleRequired: string;
};

function App() {
	const {
		getValues,
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<Inputs>();
	const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

	console.log(watch("example")); // watch input value by passing the name of it
	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				{/* register your input into the hook by invoking the "register" function */}
				<input defaultValue="test" {...register("example")} />

				{/* include validation with required or other standard HTML validation rules */}
				<input {...register("exampleRequired", { required: true })} />
				{/* errors will return when field validation fails  */}
				{errors.exampleRequired && <span>This field is required</span>}

				<button type="submit" onClick={() => console.log("asas")}>
					отправить
				</button>
			</form>
			{/* <ActiveSectionProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Main />} />
					</Routes>
				</BrowserRouter>
			</ActiveSectionProvider> */}
		</>
	);
}

export default App;
