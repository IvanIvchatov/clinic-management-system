export default class Center{
    constructor(data) {
        this.init(data)
    }

    init({ id = '', name = '', phone = '', addition = '', created_at = '', updated_at = ''}) {
        this.id = id
        this.name = name
        this.phone = phone
        this.addition = addition
        this.created_at = created_at
        this.updated_at = updated_at
    }

    setShow(show){
        this.show = show
    }

}
