import CartItems from "./CartItems";

const CartProducts = ({ cartItems, handleIncrease, handleDecrease }) => {
    return (
        <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
                <CartItems
                    key={item._id}
                    item={item}
                    handleIncrease={handleIncrease}
                    handleDecrease={handleDecrease}
                />
            ))}
        </div>
    );
};

export default CartProducts;
