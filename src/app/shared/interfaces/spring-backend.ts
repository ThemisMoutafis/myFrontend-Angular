export interface User {
    username: string,
    password: string,
    firstname: string,
    lastname: string,
    email:string,
    birthdate:string,
    countryName:string
}

export interface UpdateUser {
  oldPassword: string,
  password?: string,
  firstname: string,
  lastname: string,
  email:string,
  birthdate:string,
  countryName:string
}

export interface ReadUser {
    username: string;
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    active: boolean;
    countryName: string;
  }
  
export interface Credentials {
    username : string,
    password : string
}

export interface LoggedInUser {
    sub:string;
    firstname: string;
    lastname:string;
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

export interface PaginatedResponse<T> {
    content: T[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  }

  export interface PaginatedResult<T> {
    users: T[];
    totalPages: number;
  }