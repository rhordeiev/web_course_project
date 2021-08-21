module.exports = (menuType, id) => {
    if(menuType === "user") {
        return [
            {name: 'Моя сторінка', route: '/user/' + id},
            {name: 'Новини', route: '/user/news'},
            {name: 'Пошук користувачів', route: '/user/find'},
            {name: 'Мої списки', route: '/user/lists'},
            {name: 'Вийти', route: '/user/logout'},
        ]
    } else {
        return [
            {name: 'Новини', route: '/user/news'},
            {name: 'Пошук користувачів', route: '/user/find'},
            {name: 'Вийти', route: '/user/logout'}
        ]
    }
}