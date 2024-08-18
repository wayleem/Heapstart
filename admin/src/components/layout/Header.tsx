// Header.tsx
import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useAppDispatch } from "@store/index";
import { logout } from "@store/thunks/adminThunks";

const Header = () => {
	const dispatch = useAppDispatch();

	const handleLogout = () => {
		dispatch(logout());
	};

	return (
		<header className="bg-white shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-4">
					<div className="flex items-center">
						<div className="relative">
							<MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
							<input
								className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
								type="search"
								placeholder="Search..."
							/>
						</div>
					</div>
					<div className="flex items-center">
						<button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							<BellIcon className="h-6 w-6" />
						</button>
						<div className="ml-4 relative flex items-center">
							<img
								className="h-8 w-8 rounded-full object-cover"
								src="https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80"
								alt="Your avatar"
							/>
							<button
								onClick={handleLogout}
								className="ml-3 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
