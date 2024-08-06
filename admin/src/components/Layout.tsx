// Layout.tsx
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="flex h-screen bg-gray-100">
			<Sidebar />
			<div className="flex flex-col flex-1 overflow-hidden">
				<Header />
				<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
					<div className="container mx-auto px-6 py-8">{children}</div>
				</main>
			</div>
		</div>
	);
};

export default Layout;
