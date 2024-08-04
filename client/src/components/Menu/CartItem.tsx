import React, { useState, useEffect } from "react";
import { TrashIcon } from "../icons";

interface CartItemProps {
  product: Product;
  quantity: number;
  onRemove: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ product, quantity, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="flex items-start space-x-3 py-3 border-b border-gray-200 last:border-b-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {product.images && product.images.length > 0 ? (
        <img
          src={`data:image/jpeg;base64,${product.images[0]}`}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-md"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
      )}
      <div className="flex-grow flex justify-between items-start">
        <div>
          <p className="font-medium text-base truncate pr-2">
            {product.name}
          </p>
          <p className="font-semibold mt-1">${(product.price * quantity).toFixed(2)}</p>
          <p className="text-gray-600 text-sm mt-1">Qty: {quantity}</p>
        </div>
        {(isMobile || isHovered) && (
          <button
            onClick={() => onRemove(product._id)}
            className="text-red-500 p-1 flex-shrink-0"
            aria-label="Remove item"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CartItem;
