import { HOST } from './constants';

export function getImageUrl(image) {
	if(typeof image === 'undefined' || image === null)
		return null;

	const path = image.replace(/\\/g, '/');
	return path.toLowerCase().indexOf('http') !== -1 ? path : `${HOST}/${path}`;
}

export function getProductImageUrl(image) {
	if(image === undefined)
		return undefined;

    return getImageUrl(image.path);
}