const Pagination: React.FC<{
	currentPage: number;
	totalPages: number;
	onPrevious: () => void;
	onNext: () => void;
}> = ({ currentPage, totalPages, onPrevious, onNext }) => (
	<div className="flex justify-between items-center mt-4">
		<button onClick={onPrevious} disabled={currentPage === 1} className="btn btn-ghost btn-sm">
			Previous
		</button>
		<span className="text-sm text-text">
			{currentPage} / {totalPages}
		</span>
		<button onClick={onNext} disabled={currentPage === totalPages} className="btn btn-ghost btn-sm">
			Next
		</button>
	</div>
);

export default Pagination;
