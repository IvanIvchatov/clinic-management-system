export default class Service {
    constructor(data) {
        this.init(data)
    }

    init({ id = '', name = '', during = '', cost = '', color, created_at = '', updated_at = '', show = false }) {
        this.id = id
        this.name = name
        this.during = during
        this.cost = cost
        this.color = color
        this.show = show
        this.created_at = created_at
        this.updated_at = updated_at
    }
    clear() {
        this.id = ''
        this.name = ''
        this.during = ''
        this.cost = ''
        this.color = ''
    }

    setShow(show) {
        this.show = show
    }
}
