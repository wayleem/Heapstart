import React, { useState, useEffect, useCallback, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from 'lodash';
import Logo from "../../assets/sm_heapstart.svg";
import NavItem from "./NavItem";
import CartItem from "./CartItem";
import Pagination from "./Pagination";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchCart, removeFromCart, selectCartItems } from "../../store/slices/cartSlice";
import { selectAllProducts } from "../../store/slices/productsSlice";
import { logout, selectIsAuthenticated } from "../../store/slices/userSlice";
import { CartIcon, ContactIcon, FAQIcon, LoginIcon, LogoutIcon, ProfileIcon, RegisterIcon, StoreIcon } from "../icons";

interface MenuProps {
  closeMenu: () => void;
}

const Menu: React.FC<MenuProps> = ({ closeMenu }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const cartItems = useAppSelector(selectCartItems);
  const cartStatus = useAppSelector((state) => state.cart.status);
  const allProducts = useAppSelector(selectAllProducts);
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const itemsPerPage = 10;

  const debouncedFetchCart = useCallback(
    debounce(() => {
      if (cartStatus === "idle") {
        dispatch(fetchCart());
      }
    }, 300),
    [dispatch, cartStatus]
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    debouncedFetchCart();
    return () => {
      window.removeEventListener('resize', handleResize);
      debouncedFetchCart.cancel();
    };
  }, [debouncedFetchCart]);

  const cartProducts = useMemo(() => {
    return Object.entries(cartItems)
      .map(([productId, quantity]) => {
        const product = allProducts.find((p) => p._id === productId);
        return { product, quantity };
      })
      .filter((item) => item.product !== undefined);
  }, [cartItems, allProducts]);

  const totalPages = Math.ceil(cartProducts.length / itemsPerPage);
  const displayedItems = cartProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const cartTotal = useMemo(() => {
    return cartProducts.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  }, [cartProducts]);

  const toggleCart = () => {
    setIsCartExpanded(!isCartExpanded);
    setCurrentPage(1);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      closeMenu();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLinkClick = (isCartLink: boolean) => {
    if (isMobile && !isCartLink) {
      closeMenu();
    }
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <div className="h-full w-full bg-base-100 p-6 flex flex-col space-y-6 shadow-lg font-sans">
      <div className="flex items-center justify-between">
        <NavLink to="/" className="flex items-center text-2xl font-heading font-bold text-primary">
          <img src={Logo} alt="Heapstart Logo" className="w-8 h-8" />
          <span>Heapstart</span>
        </NavLink>
      </div>
      <nav className="flex-grow flex flex-col mt-6 space-y-2">
        <button
          onClick={toggleCart}
          className="flex items-center justify-between w-full text-text hover:text-primary text-lg font-heading font-semibold py-3 px-4 transition-colors duration-200"
        >
          <span className="flex items-center space-x-3">
            <CartIcon className="w-6 h-6" />
            <span>Your Cart</span>
          </span>
          <span className="badge badge-secondary badge-sm">{cartProducts.length}</span>
        </button>
        <AnimatePresence>
          {isCartExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="py-2 px-4 space-y-4">
                {displayedItems.map(
                  ({ product, quantity }) =>
                    product && (
                      <CartItem
                        key={product._id}
                        product={product}
                        quantity={quantity}
                        onRemove={handleRemoveItem}
                      />
                    )
                )}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  />
                )}
                <div className="flex justify-between items-center text-lg font-semibold mt-4 pt-4 border-t border-gray-200">
                  <h3>Total:</h3>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
                <NavItem
                  to="/checkout"
                  icon={<CartIcon className="w-5 h-5" />}
                  isCartLink={true}
                  onClick={() => handleLinkClick(true)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-center"
                >
                  Checkout
                </NavItem>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="pt-4">
          <NavItem
            to="/store"
            icon={<StoreIcon className="w-5 h-5" />}
            onClick={() => handleLinkClick(false)}
          >
            Store
          </NavItem>
          <NavItem
            to="/contact"
            icon={<ContactIcon className="w-5 h-5" />}
            onClick={() => handleLinkClick(false)}
          >
            Contact
          </NavItem>
          <NavItem to="/faq" icon={<FAQIcon className="w-5 h-5" />} onClick={() => handleLinkClick(false)}>
            FAQ
          </NavItem>
        </div>
        {isAuthenticated ? (
          <div className="pt-4 border-t border-base-300">
            <NavItem
              to="/profile"
              icon={<ProfileIcon className="w-5 h-5" />}
              onClick={() => handleLinkClick(false)}
            >
              Profile
            </NavItem>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full text-left py-3 px-4 text-text hover:bg-base-200 transition-colors duration-200"
            >
              <LogoutIcon className="w-5 h-5" />
              <span className="font-heading">Logout</span>
            </button>
          </div>
        ) : (
          <div className="pt-4 border-t border-base-300">
            <NavItem
              to="/register"
              icon={<RegisterIcon className="w-5 h-5" />}
              onClick={() => handleLinkClick(false)}
            >
              Register
            </NavItem>
            <NavItem
              to="/login"
              icon={<LoginIcon className="w-5 h-5" />}
              onClick={() => handleLinkClick(false)}
            >
              Login
            </NavItem>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Menu;
