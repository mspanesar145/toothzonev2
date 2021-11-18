export class DentalService {

    id: number;
    title: String;
    image: String;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
