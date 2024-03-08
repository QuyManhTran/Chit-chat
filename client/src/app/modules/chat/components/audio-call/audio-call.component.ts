import {
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    Optional,
    SkipSelf,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Call } from '@enums/chat.enum';
import { IOutGoing } from '@interfaces/chat/user.interface';
import { ENV } from '@interfaces/environment/environment.interface';
import { ChatService } from '@services/chat/chat.service';
import { SocketService } from '@services/socket/socket.service';
import { UserService } from '@services/user/user.service';
import { ZegoCloudService } from '@services/zego-cloud/zego-cloud.service';
import { Subject, takeUntil } from 'rxjs';
import { ENVIRONMENT_SERVICE_CONFIG } from 'src/app/configs/tokens/environment.token';

@Component({
    selector: 'app-audio-call',
    templateUrl: './audio-call.component.html',
    styleUrl: './audio-call.component.scss',
})
export class AudioCallComponent implements OnInit, OnDestroy, AfterViewInit {
    isIncoming!: boolean;
    roomId!: string;
    callerName!: string;
    callerId!: string;
    destroy$: Subject<void> = new Subject<void>();
    localStream!: MediaStream;
    remoteStream!: MediaStream;
    streamId!: string;
    @ViewChild('localVideo') private localVideoRef!: ElementRef<HTMLVideoElement>;
    @ViewChild('remoteVideo') private remoteVideoRef!: ElementRef<HTMLVideoElement>;
    @ViewChild('localWrapper') private localWrapperRef!: ElementRef<HTMLDivElement>;
    constructor(
        private activatedRoute: ActivatedRoute,
        @SkipSelf() @Optional() private socketService: SocketService,
        @SkipSelf() @Optional() private userService: UserService,
        @SkipSelf() @Optional() private chatService: ChatService,
        @SkipSelf() @Optional() private zegoService: ZegoCloudService,
        @Inject(ENVIRONMENT_SERVICE_CONFIG) private env_config: ENV
    ) {}

    ngOnInit(): void {
        this.roomId = this.activatedRoute.snapshot.params?.['roomId'];
        this.callerName = this.activatedRoute.snapshot.queryParams?.['name'];
        this.callerId = this.activatedRoute.snapshot.queryParams?.['id'];
        this.isIncoming = this.activatedRoute.snapshot.queryParams?.['incoming'];
        this.streamId = this.activatedRoute.snapshot.queryParams?.['streamId'];

        this.socketService.socketGetter.on('deny-audio-outcoming', () => {
            alert('deny');
        });
        this.chatService
            .getZegoToken$({
                userId: this.userService.userGetter?._id || '',
                ...this.env_config.zego,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (value) => {
                    this.zegoService.tokenSetter = value;
                },
                error: (error) => {
                    console.log(error);
                },
                complete: () => {
                    this.zegoService.onLogin({
                        roomID: this.roomId,
                        user: {
                            userID: this.userService.userGetter?._id || '',
                            userName: this.userService.userGetter?.name || '',
                        },
                    });
                    this.updateLocalStream();
                    this.roomUserHandler();
                },
            });
    }

    ngOnDestroy(): void {
        this.socketService.onOffDenyAudio();
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterViewInit(): void {
        console.log(this.localVideoRef);
    }

    emitSocketCall = () => {
        this.streamId = this.roomId + Date.now().toString();
        const outGoingData: IOutGoing = {
            sender: {
                id: this.userService.userGetter?._id || '',
                name: this.userService.userGetter?.name || '',
            },
            callerId: this.callerId,
            roomId: this.roomId,
            streamId: this.streamId,
            type: Call.AUDIO,
        };
        this.socketService.socketGetter.emit('outgoing', outGoingData);
    };

    roomUserHandler = () => {
        this.zegoService.onRoomUserUpdate(async (roomID, updateType, streamList, extendedData) => {
            if (updateType == 'ADD') {
                alert(JSON.stringify(streamList));
                if (this.remoteVideoRef) {
                    this.remoteStream = await this.zegoService.zgGetter.startPlayingStream(
                        this.streamId,
                        {
                            video: true,
                            audio: true,
                        }
                    );
                    this.remoteVideoRef.nativeElement.srcObject = this.remoteStream;
                    if (this.localWrapperRef) {
                        this.localWrapperRef.nativeElement.style.width = '128px';
                        this.localWrapperRef.nativeElement.style.height = '112px';
                        this.localWrapperRef.nativeElement.style.top = '20px';
                        this.localWrapperRef.nativeElement.style.left = '200px';
                    }
                }
            } else if (updateType == 'DELETE' && this.localStream && streamList[0].streamID) {
                // Stream deleted, stop playing the stream.
                this.zegoService.zgGetter.destroyStream(this.localStream);
                this.zegoService.zgGetter.stopPublishingStream(streamList[0].streamID);
                this.zegoService.zgGetter.stopPlayingStream(streamList[0].streamID);
                this.zegoService.zgGetter.logoutRoom(this.roomId);
            }
        });
    };

    updateLocalStream = async () => {
        try {
            // New stream added, start playing the stream.
            this.localStream = await this.zegoService.zgGetter.createStream({
                camera: {
                    video: true,
                    audio: true,
                },
            });
            if (this.localVideoRef) {
                this.localVideoRef.nativeElement.srcObject = this.localStream;
                if (!this.isIncoming) {
                    this.emitSocketCall();
                }
                this.zegoService.zgGetter.startPublishingStream(this.streamId, this.localStream);
            }
        } catch (error) {
            alert(error);
        }
    };
}
