export class States {
    id: number;

    name: string;

    country_id: number;

    state_code : string;

    constructor(values: Object = {}) {

        Object.assign(this, values);
    
        }
}
