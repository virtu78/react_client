export function getCurrentFilial(filial) {
	return filial.filials.find(f => f.id === filial.filialId);
}

export function getCityList(filials) {
	return filials.reduce((r, f) => {
        if(r.find(rf => rf.name === f.city) === undefined)
            return [...r, { name: f.city, translit: f.cityTranslit }];
        return r;
    }, []);
}