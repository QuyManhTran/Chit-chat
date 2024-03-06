import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record';
@Component({
    selector: 'app-recording',
    templateUrl: './recording.component.html',
    styleUrl: './recording.component.scss',
})
export class RecordingComponent implements OnInit, AfterViewInit, OnDestroy {
    @Output() DiscardEmitter: EventEmitter<void> = new EventEmitter<void>();
    @Output() AudioEmitter: EventEmitter<Blob> = new EventEmitter<Blob>();
    private wavesurfer!: WaveSurfer;
    private record!: RecordPlugin;
    isRecording!: boolean;
    isPlaying!: boolean;
    time!: string;
    recordedUrl!: string;
    blob!: Blob;
    ngOnInit(): void {
        this.isRecording = true;
        this.isPlaying = false;
        this.time = '00:00';

        const container: HTMLElement | null = document.getElementById('wavesurfer');
        if (container) {
            this.wavesurfer = WaveSurfer.create({
                container: container,
                waveColor: '#ccc',
                cursorColor: '#07bc0c',
                progressColor: '#07bc0c',
                cursorWidth: 2,
                barWidth: 2,
                height: 30,
                width: 200,
                barRadius: 8,
                barGap: 1,
                autoplay: false,
                dragToSeek: true,
            });
            this.record = this.wavesurfer.registerPlugin(
                RecordPlugin.create({
                    scrollingWaveform: true,
                    renderRecordedAudio: true,
                })
            );
        }
    }

    ngAfterViewInit(): void {
        if (this.wavesurfer) {
            this.wavesurfer.on('audioprocess', (currentTime) => {
                this.timeUpdateHandler(currentTime * 1000);
            });
            this.wavesurfer.on('finish', () => {
                this.wavesurfer.seekTo(0);
                this.isPlaying = false;
                this.time = '00:00';
            });
        }

        if (this.record) {
            this.record.startRecording();
            this.record.on('record-progress', (currentTime) => {
                this.timeUpdateHandler(currentTime);
            });
            this.record.on('record-end', (blob: Blob) => {
                this.blob = blob;
                this.recordedUrl = URL.createObjectURL(blob);
                this.wavesurfer.load(this.recordedUrl);
            });
        }
    }

    ngOnDestroy(): void {
        this.wavesurfer.destroy();
        this.record.destroy();
    }

    onToggleRecording = () => {
        if (this.record.isRecording()) {
            this.isRecording = false;
            this.record.pauseRecording();
        } else {
            this.isRecording = true;
            if (this.record.isPaused()) return this.record.resumeRecording();
        }
    };

    onStopRecording = () => {
        if (this.record) {
            this.record.stopRecording();
            this.isRecording = false;
        }
    };

    onToggleAudio = () => {
        if (this.wavesurfer.isPlaying()) {
            this.isPlaying = false;
            this.wavesurfer.pause();
        } else {
            this.isPlaying = true;
            this.wavesurfer.play();
        }
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

    onDiscard = () => {
        this.DiscardEmitter.emit();
    };

    onSendingAudio = () => {
        this.AudioEmitter.emit(this.blob);
    };
}
