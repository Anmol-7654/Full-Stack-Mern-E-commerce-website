import {createSlice} from '@reduxjs/toolkit';

const normalizeItem = (it) => ({
  id: it.id || it.productId,
  name: it.name,
  price: Number(it.price || 0),
  imageUrl: it.imageUrl,
  quantity: it.quantity || it.qty || 1,
});

const stored = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
const normalizedStored = Array.isArray(stored) ? stored.map(normalizeItem) : [];

const initialState = {
  cartItems: normalizedStored,
};

const cartSlice = createSlice({
       name: 'cart',
       initialState,
       reducers: {
       addToCart: (state, action) => {
         const item = action.payload;
            const existItem = state.cartItems.find((x) => x.id === item.id);
           if (existItem) {
           state.cartItems = state.cartItems.map((x) => x.id === existItem.id ? item : x);
           } else {
              state.cartItems = [...state.cartItems, item];
             }
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter((x) => x.id !== itemId);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cartItems');
        }

       },
});
    


export const {addToCart, removeFromCart, clearCart} = cartSlice.actions;
export default cartSlice.reducer;