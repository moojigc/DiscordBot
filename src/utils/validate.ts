import serverError from "./Error";
import validateType from "./validateType";

export default function(service: {
    required?: Record<string, string | string[]>;
    optional?: Record<string, string | string[]>;
}, data: any) {

    const required = service.required || {};
    const optional = service.optional || {};

    if (typeof data !== 'object') {

        return;
    }
    
    for (const k in required) {

        if (!(k in data)) {

            throw serverError('validate-01', 400, `Required field: ${k}`);
        }
    }

    const allFields = Object.keys(required).concat(...Object.keys(optional));

    for (const k in data) {

        if (!allFields.includes(k) && service.optional !== null) {

            throw serverError('validate-02', 400, `Invalid field: ${k}`);
        }

        if (k in required) {

            validateType({ types: required[k], field: k }, data[k]);
        }
        else if (k in optional) {

            validateType({ types: optional[k], field: k }, data[k]);
        }
    }
}