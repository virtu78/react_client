import { getCurrentFilial } from './filial';

export function createTopToolbarProps(filial, settings, bgc, fontColor) {
    const f = getCurrentFilial(filial);

    const name = (() => {
        if(f === undefined)
            return '';

        return settings.onlyCity ? f.city : f ? f.name : '';
    })();

    const address = (() => {
    	if(settings.onlyCity)
			return f ? f.city : 'Выбор города';

    	if(f) {
            return (f.name && f.name.length > 0) ? f.name: `${f.street}, д.${f.house}`;
        } else {
            return settings.shopName || 'Район';
        }
    })();

    return {
        name,
        address,
        logo: f ? f.headerLogoPath : '',
        bgc: bgc || settings.headerFooterColor,
        fontColor: fontColor || settings.hfFontColor
    };
}

export function getHeader(filial, onlyCity) {
    if(onlyCity) {
        return { 'CityName': filial.cities.find(c => c.name === filial.city).translit };
    } else {
        return { 'Place': filial.filialId };
    }
}