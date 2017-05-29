import { applyMiddleware } from 'redux';
import profile from './profile';
import fetchProducts from './catalog/fetchProducts';
import thunk from 'redux-thunk';

export default applyMiddleware(
	profile.addAddress,
	profile.addFavorite,
	profile.changePassword,
	profile.deleteAddress,
	profile.fetchOrders,
	profile.loadProfile,
	profile.removeFavorite,
	profile.resetPassword,
	profile.sendProfile,
	profile.signIn,
	profile.signUp,

    fetchProducts,

    thunk);