export interface User {
    username: string,
    password: string,
    firstname: string,
    lastname: string,
    email:string,
    birthdate:string,
    countryName:string
}

export interface Credentials {
    username : string,
    password : string
}

export interface LoggedInUser {
    sub:string;
    firstname: string;
    email: string;
    dateOfBirth: string;
    countryName: string;
    token: string;
    role:string;
    username:string;
}

export interface ValidationErrorResponse {
    code: string;
    details: string[];
    message: string;
    timestamp: string;
}