export class User {
    
    id: Number;
    user_id: Number;
    name: String;
    phone_number: String;
    gender: Number;
    date_of_birth: Date;
    address: String;
    state: String;
    post_code: String;
    agree_term_conditions: Number;
    created_on: Date;
    is_deleted: Number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
