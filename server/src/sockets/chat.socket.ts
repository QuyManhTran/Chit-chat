import { IOnlineUser } from '@interfaces/socket.interface';
import { DisconnectReason, Server, Socket } from 'socket.io';
import { ISocketMessage } from '@interfaces/chat.interface';
export const socketConfig = (io: Server) => {
    let onlineUsers: IOnlineUser[] = [];
    io.on('connection', (socket: Socket) => {
        console.log(socket.id, ' is connecting');
        socket.on('addNewUser', (userId: string) => {
            const isAlreadyOnline = onlineUsers.some((user) => user.userId === userId);
            if (!isAlreadyOnline) {
                onlineUsers.push({
                    userId,
                    socketId: socket.id,
                });
            }
            console.log('online user:', onlineUsers);

            io.emit('getOnlineUsers', onlineUsers);
        });
        //new message
        socket.on('newMessage', (data: ISocketMessage) => {
            const user = onlineUsers.find((user) => user.userId === data.callerId);
            if (user) {
                io.to(user.socketId).emit('getMessage', data.message);
                io.to([user.socketId, socket.id]).emit('notification', data.message);
            }
        });

        //user disconnect
        socket.on('disconnect', (reason: DisconnectReason) => {
            onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
            io.emit('getOnlineUsers', onlineUsers);
            console.log('disconnection:', onlineUsers);
        });
    });
};
