export default class User {
    constructor(data) {
        this.init(data)
    }

    clear() {
        this.id = ''
        this.name = ''
        this.email = ''
        this.secondName = ''
        this.phone = ''
        this.patronymic = ''
        this.birthday = ''
        this.address = {}
        this.centers = []
    }

    init({ id = '', name = '', email = '', token = '', secondName = '', patronymic = '', phone = '', centers = [], address = {} , show = false , birthday = '' }) {
        this.id = id
        this.name = name
        this.email = email
        this.secondName = secondName
        this.phone = phone
        this.patronymic = patronymic
        this.token = token
        this.address = address
        this.centers = centers
        this.show = show
        this.birthday = birthday
    }

    setShow(show){
        this.show = show
    }
}