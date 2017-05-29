export function openSideMenu(showCatalog) {
    return {
        type: 'OPEN_SIDE_MENU',
        payload: showCatalog
    }
}

export function closeSideMenu() {
    return {
        type: 'CLOSE_SIDE_MENU'
    }
}