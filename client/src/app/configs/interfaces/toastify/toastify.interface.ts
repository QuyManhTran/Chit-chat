export enum ToastStatus {
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
    INFOR = 'infor',
}
export interface IToastTify {
    status: ToastStatus;
    title: string;
    isClose?: boolean;
}
