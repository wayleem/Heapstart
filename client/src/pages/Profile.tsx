import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store";
import { selectUser } from "../store/slices/userSlice";

const Profile: React.FC = () => {
	const navigate = useNavigate();
	const user = useAppSelector(selectUser);

	if (!user.isAuthenticated) {
		// Redirect to login if not authenticated
		navigate("/login");
		return null;
	}

	return (
		<div className="container mx-auto mt-10 p-5">
			<h1 className="text-3xl font-bold mb-5">Profile</h1>
			<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
					<p className="text-gray-700">{user.email}</p>
				</div>
				{user.profile && (
					<>
						<div className="mb-4">
							<label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
							<p className="text-gray-700">{`${user.profile.firstName} ${user.profile.lastName}`}</p>
						</div>
						<div className="mb-4">
							<label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
							<p className="text-gray-700">{user.profile.phone || "Not provided"}</p>
						</div>
						<div className="mb-4">
							<label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
							<p className="text-gray-700">
								{user.profile.address.street}
								<br />
								{user.profile.address.city}, {user.profile.address.state}{" "}
								{user.profile.address.postalCode}
								<br />
								{user.profile.address.country}
							</p>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Profile;
