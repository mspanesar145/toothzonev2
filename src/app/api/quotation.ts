export class Quotation {
    id: number;
    title: String;
    image_url: String;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
