import { ENV } from '@interfaces/environment/environment.interface';

export const environment: ENV = {
    host: 'http://localhost:3000/v1',
    firebaseConfig: {
        apiKey: 'AIzaSyAIBMmPjAG_hyP-7uBtw4prL7FQRZjTJXY',
        authDomain: 'chat-app-273d9.firebaseapp.com',
        projectId: 'chat-app-273d9',
        storageBucket: 'chat-app-273d9.appspot.com',
        messagingSenderId: '434281089480',
        appId: '1:434281089480:web:a68c0cf6a39776defc58fd',
        measurementId: 'G-4R7E94T2XL',
    },
    ws: 'http://localhost:3000',
};
