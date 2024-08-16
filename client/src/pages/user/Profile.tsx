import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@store/index";
import { selectUser } from "@store/slices/userSlice";
import { fetchUserProfile } from "@store/thunks/userThunks";

const Profile: React.FC = () => {
	const navigate = useNavigate();
	const user = useAppSelector(selectUser);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!user.isAuthenticated) {
			navigate("/login");
		} else if (!user.profile) {
			dispatch(fetchUserProfile());
		}
	}, [user.isAuthenticated, user.profile, dispatch, navigate]);

	if (!user.isAuthenticated) {
		return null;
	}

	return (
		<div className="container mx-auto mt-10 p-5">
			<h1 className="text-h2 font-heading font-bold mb-5">Profile</h1>
			<div className="bg-base-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<div className="mb-4">
					<label className="block text-text text-sm font-bold mb-2">Email</label>
					<p className="text-text">{user.email}</p>
				</div>
				{user.profile ? (
					<>
						<div className="mb-4">
							<label className="block text-text text-sm font-bold mb-2">Name</label>
							<p className="text-text">{`${user.profile.firstName || ""} ${
								user.profile.lastName || ""
							}`}</p>
						</div>
						<div className="mb-4">
							<label className="block text-text text-sm font-bold mb-2">Phone</label>
							<p className="text-text">{user.profile.phone || "Not provided"}</p>
						</div>
						{user.profile.address ? (
							<div className="mb-4">
								<label className="block text-text text-sm font-bold mb-2">Address</label>
								<p className="text-text">
									{user.profile.address.street}
									<br />
									{user.profile.address.city}, {user.profile.address.state}{" "}
									{user.profile.address.postalCode}
									<br />
									{user.profile.address.country}
								</p>
							</div>
						) : (
							<p>No address information available</p>
						)}
					</>
				) : (
					<p>Loading profile information...</p>
				)}
			</div>
		</div>
	);
};

export default Profile;
