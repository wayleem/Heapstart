import React from "react";

interface LoadingProps {
	size?: "small" | "medium" | "large";
	color?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = "medium", color = "text-blue-500" }) => {
	const sizeClasses = {
		small: "w-4 h-4",
		medium: "w-8 h-8",
		large: "w-12 h-12",
	};

	return (
		<div
			className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] ${sizeClasses[size]} ${color}`}
			role="status"
		>
			<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
				Loading...
			</span>
		</div>
	);
};

export default Loading;
