import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion, Variant } from "framer-motion";
import Menu from "./Menu";
import { MenuIcon } from "../icons";

const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState(false);
	useEffect(() => {
		const media = window.matchMedia(query);
		if (media.matches !== matches) {
			setMatches(media.matches);
		}
		const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
		media.addEventListener("change", listener);
		return () => media.removeEventListener("change", listener);
	}, [matches, query]);
	return matches;
};

const Layout = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 640px)");

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const mainVariants: Record<string, Variant> = {
		open: { marginRight: isDesktop ? 256 : 0 },
		closed: { marginRight: 0 },
	};

	const buttonVariants: Record<string, Variant> = {
		open: { x: isDesktop ? -256 : 0 },
		closed: { x: 0 },
	};

	const menuVariants: Record<string, Variant> = {
		open: {
			x: 0,
			opacity: 1,
		},
		closed: {
			x: isDesktop ? "100%" : 0,
			opacity: isDesktop ? 1 : 0,
		},
	};

	return (
		<div className="relative min-h-screen bg-background text-text" data-theme="mytheme">
			<MotionConfig transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}>
				<motion.main variants={mainVariants} animate={isMenuOpen ? "open" : "closed"} className="p-4">
					<Outlet />
				</motion.main>
				<motion.button
					onClick={toggleMenu}
					variants={buttonVariants}
					animate={isMenuOpen ? "open" : "closed"}
					className="fixed top-4 right-4 z-50"
					aria-label="Toggle Menu"
				>
					<MenuIcon isOpen={isMenuOpen} />
				</motion.button>
				<AnimatePresence>
					{isMenuOpen && (
						<>
							<motion.div
								variants={menuVariants}
								initial="closed"
								animate="open"
								exit="closed"
								className="fixed inset-0 bg-base-200 shadow-lg z-40
                  sm:right-0 sm:left-auto sm:w-64"
							>
								<Menu closeMenu={() => setIsMenuOpen(false)} />
							</motion.div>
							{!isDesktop && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 0.5 }}
									exit={{ opacity: 0 }}
									className="fixed inset-0 bg-neutral bg-opacity-50 z-30"
									onClick={() => setIsMenuOpen(false)}
								/>
							)}
						</>
					)}
				</AnimatePresence>
			</MotionConfig>
		</div>
	);
};

export default Layout;
