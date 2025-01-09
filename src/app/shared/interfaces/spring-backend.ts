export interface User {
    givenName: string,
    surName: string,
    email: string,
    password: string
}

export interface Credentials {
    username : string,
    password : string
}

export interface LoggedInUser {
    firstname: string;
    email: string;
    dateOfBirth: string;
    countryName: string;
    token: string;
    role:string;
    sub:string;
}