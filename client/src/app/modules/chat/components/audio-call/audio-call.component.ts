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
import { Call, CallStatus } from '@enums/chat.enum';
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
    callStatus!: CallStatus;
    type!: Call;
    isIncoming!: boolean;
    roomId!: string;
    callerName!: string;
    callerId!: string;
    destroy$: Subject<void> = new Subject<void>();
    localStream!: MediaStream;
    remoteStream!: MediaStream;
    streamId!: string;
    isMutedLocalStream!: boolean;
    isHideLocalStream!: boolean;
    time!: string;

    @ViewChild('localVideo') private localVideoRef!: ElementRef<HTMLVideoElement>;
    @ViewChild('remoteVideo') private remoteVideoRef!: ElementRef<HTMLVideoElement>;
    @ViewChild('localWrapper') private localWrapperRef!: ElementRef<HTMLDivElement>;
    @ViewChild('waitingTone') private waitingToneRef!: ElementRef<HTMLAudioElement>;
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
        this.type = this.activatedRoute.snapshot.queryParams?.['type'];
        this.isMutedLocalStream = false;
        this.isHideLocalStream = false;
        this.socketService.socketGetter.on('deny-audio-outcoming', () => {
            alert('deny');
            this.onDestroyStream();
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
        this.onDestroyStream();
        if (this.waitingToneRef && !this.waitingToneRef.nativeElement.paused)
            this.waitingToneRef.nativeElement.pause();
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
            type: this.type,
        };
        this.socketService.socketGetter.emit('outgoing', outGoingData);
    };

    roomUserHandler = () => {
        this.zegoService.onRoomUserUpdate(async (roomID, updateType, streamList, extendedData) => {
            if (updateType == 'ADD') {
                if (this.waitingToneRef) this.waitingToneRef.nativeElement.pause();

                if (this.remoteVideoRef) {
                    this.callStatus = CallStatus.START;
                    this.remoteStream = await this.zegoService.zgGetter.startPlayingStream(
                        this.streamId,
                        {
                            video: this.type === Call.VIDEO,
                            audio: true,
                        }
                    );
                    this.remoteVideoRef.nativeElement.srcObject = this.remoteStream;
                    this.remoteVideoRef.nativeElement.addEventListener(
                        'timeupdate',
                        this.timeListenerCallback
                    );
                    if (this.localWrapperRef && this.type === Call.VIDEO) {
                        this.localWrapperRef.nativeElement.style.width = '200px';
                        this.localWrapperRef.nativeElement.style.height = '160px';
                        this.localWrapperRef.nativeElement.style.top = '20px';
                        this.localWrapperRef.nativeElement.style.left = 'auto';
                        this.localWrapperRef.nativeElement.style.right = '40px';
                        this.localVideoRef.nativeElement.style.borderWidth = '2px';
                        this.localVideoRef.nativeElement.style.borderRadius = '7px';
                    }
                }
            } else if (updateType == 'DELETE' && this.localStream && streamList[0].streamID) {
                // alert(JSON.stringify(streamList));
                this.onDestroyStream();
            }
        });
    };

    updateLocalStream = async () => {
        try {
            // New stream added, start playing the stream.
            this.localStream = await this.zegoService.zgGetter.createStream({
                camera: {
                    video: this.type === Call.VIDEO,
                    audio: true,
                },
            });
            if (this.localVideoRef) {
                this.localVideoRef.nativeElement.srcObject = this.localStream;
                if (!this.isIncoming) {
                    this.emitSocketCall();
                }
                this.zegoService.zgGetter.startPublishingStream(this.streamId, this.localStream);
                if (this.waitingToneRef) this.waitingToneRef.nativeElement.play();
            }
        } catch (error) {
            console.log(error);
        }
    };

    onDestroyStream = () => {
        // Stream deleted, stop playing the stream.
        this.zegoService.zgGetter.destroyStream(this.localStream);
        this.zegoService.zgGetter.stopPublishingStream(this.streamId);
        this.zegoService.zgGetter.stopPlayingStream(this.streamId);
        this.zegoService.zgGetter.logoutRoom(this.roomId);
        this.callStatus = CallStatus.STOP;
        if (this.remoteVideoRef)
            this.remoteVideoRef.nativeElement.removeEventListener(
                'timeupdate',
                this.timeListenerCallback
            );
    };

    onMuteLocalStream = () => {
        if (this.localStream) {
            if (this.isMutedLocalStream) {
                this.localStream.getAudioTracks()[0].enabled = true;
                this.isMutedLocalStream = false;
            } else {
                this.localStream.getAudioTracks()[0].enabled = false;
                this.isMutedLocalStream = true;
            }
        }
    };

    onToggleLocalStream = () => {
        this.isHideLocalStream = !this.isHideLocalStream;
    };

    updateProgress = (time: number): string => {
        const formattedTime: string = [
            Math.floor((time % 3600000) / 60000), // minutes
            Math.floor((time % 60000) / 1000), // seconds
        ]
            .map((v) => (v < 10 ? '0' + v : v))
            .join(':');
        return formattedTime;
    };

    timeUpdateHandler = (time: number) => {
        this.time = this.updateProgress(time);
    };

    timeListenerCallback = () => {
        if (this.remoteVideoRef)
            this.timeUpdateHandler(this.remoteVideoRef.nativeElement.currentTime * 1000);
    };
}
