import { IOnlineUser } from '@interfaces/socket.interface';
import { DisconnectReason, Server, Socket } from 'socket.io';
import { IInComing, IOutGoing, ISocketMessage } from '@interfaces/chat.interface';
export const socketConfig = (io: Server) => {
    let onlineUsers: IOnlineUser[] = [];
    let audioOnlineUsers: IOnlineUser[] = [];
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

        // audio outgoing
        socket.on('outgoing', (outGoingData: IOutGoing) => {
            const isAlreadyOnline = audioOnlineUsers.some(
                (user) => user.userId === outGoingData.sender.id
            );
            if (!isAlreadyOnline) {
                audioOnlineUsers.push({
                    userId: outGoingData.sender.id,
                    socketId: socket.id,
                });
            }
            const user = onlineUsers.find((user) => user.userId === outGoingData.callerId);
            if (user) {
                const inCommingData: IInComing = {
                    sender: outGoingData.sender,
                    roomId: outGoingData.roomId,
                    type: outGoingData.type,
                    streamId: outGoingData.streamId,
                };
                io.to(user.socketId).emit('incoming', inCommingData);
            } else {
                const sender = audioOnlineUsers.find(
                    (user) => user.userId === outGoingData.sender.id
                );
                if (sender) io.to(sender.socketId).emit('deny-audio-outcoming');
            }
        });

        // audio deny
        socket.on('deny-audio', (callerId: string) => {
            const user = onlineUsers.find((user) => user.userId === callerId);
            if (user) {
                io.to(user.socketId).emit('deny-audio-outcoming');
            }
        });

        //user disconnect
        socket.on('disconnect', (reason: DisconnectReason) => {
            onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
            audioOnlineUsers = audioOnlineUsers.filter((user) => user.socketId !== socket.id);
            io.emit('getOnlineUsers', onlineUsers);
            console.log('disconnection:', onlineUsers);
        });
    });
};
