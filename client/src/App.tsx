import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Profile from "./pages/Profile";
// Import other pages as needed

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Router>
					<Routes>
						<Route path="/" element={<Layout />}>
							<Route index element={<Home />} />
							<Route path="/contact" element={<Contact />} />
							<Route path="/register" element={<Registration />} />
							<Route path="/login" element={<Login />} />
							<Route path="/profile" element={<Profile />} />
							{/* Add other routes here */}
						</Route>
					</Routes>
				</Router>
			</PersistGate>
		</Provider>
	);
}

export default App;
