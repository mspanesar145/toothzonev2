export class Contactus {
    id: number;
    address: String;
    street_address: String;
    latitude: String;
    longitude: String;
    phone_no: String;
    phone_no1: String;
    phone_no2: String;
    website: String;
    email_address: String;
    mapUrl: String;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
