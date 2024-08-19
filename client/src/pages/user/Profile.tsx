import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@store/index";
import { selectUser } from "@store/slices/userSlice";
import { fetchUserProfile } from "@store/thunks/userThunks";
import SupportTicketList from "@components/tables/SupportTicketList";
import OrderHistory from "@pages/orders/OrderHistory";

const Profile: React.FC = () => {
	const navigate = useNavigate();
	const user = useAppSelector(selectUser);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!user.accessToken) {
			navigate("/login");
		} else if (!user.profile) {
			dispatch(fetchUserProfile());
		}
	}, [user.accessToken, user.profile, dispatch, navigate]);

	if (!user.accessToken) {
		return null;
	}

	return (
		<div className="container mx-auto mt-10 p-5">
			<h1 className="text-h2 font-heading font-bold mb-5">My Account</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-1">
					<h2 className="text-xl font-semibold mb-3">Profile Information</h2>
					<div className="bg-base-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
						<p>
							<strong>Email:</strong> {user.email}
						</p>
						{user.profile && (
							<>
								<p>
									<strong>Name:</strong> {`${user.profile.firstName} ${user.profile.lastName}`}
								</p>
								<p>
									<strong>Phone:</strong> {user.profile.phone || "Not provided"}
								</p>
								{user.profile.address && (
									<div>
										<strong>Address:</strong>
										<p>{user.profile.address.street}</p>
										<p>{`${user.profile.address.city}, ${user.profile.address.state} ${user.profile.address.postalCode}`}</p>
										<p>{user.profile.address.country}</p>
									</div>
								)}
							</>
						)}
					</div>
				</div>

				<div className="md:col-span-2">
					<OrderHistory />
					<SupportTicketList />
				</div>
			</div>
		</div>
	);
};

export default Profile;
