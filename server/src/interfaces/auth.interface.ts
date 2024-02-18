export interface IResponseData {
    accessToken?: string;
    data?: any;
    message?: string;
}

export interface ILocalData extends Record<string, any> {
    accessToken?: string;
}

export interface ILoginByPassword {
    email: string;
    password: string;
}

export interface IRegisterByPassword {
    name: string;
    email: string;
    password: string;
}

export interface IFireBase {
    isNewUser: boolean;
    name: string;
    email: string;
    password: string;
}
