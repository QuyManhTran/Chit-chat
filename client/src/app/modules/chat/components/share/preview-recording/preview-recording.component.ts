import {
    AfterViewInit,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';

@Component({
    selector: 'app-preview-recording',
    templateUrl: './preview-recording.component.html',
    styleUrl: './preview-recording.component.scss',
})
export class PreviewRecordingComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    @Input() audioURL!: string;
    @Input() isMine!: boolean;
    @Input() date!: Date;
    @Input() name!: string;
    private wavesurfer!: WaveSurfer;
    isPlaying!: boolean;
    time!: string;

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.wavesurfer) return;
        if (changes?.['audioURL'] && changes?.['audioURL'].currentValue) {
            this.wavesurfer.load(changes?.['audioURL'].currentValue).finally(() => {
                this.time = this.updateProgress(this.wavesurfer.getDuration() * 1000);
            });
        }
    }

    ngOnInit(): void {
        this.isPlaying = false;
    }

    ngAfterViewInit(): void {
        const container: HTMLElement | null = document.querySelector(`.${this.name}`);
        if (container) {
            this.wavesurfer = WaveSurfer.create({
                container: container,
                waveColor: '#d0d1d3',
                cursorColor: '#07bc0c',
                progressColor: '#07bc0c',
                cursorWidth: 2,
                barWidth: 3,
                height: 30,
                width: 100,
                barRadius: 8,
                barGap: 2,
                autoplay: false,
                dragToSeek: true,
            });
            this.wavesurfer.load(this.audioURL).finally(() => {
                this.time = this.updateProgress(this.wavesurfer.getDuration() * 1000);
            });
        }
        if (this.wavesurfer) {
            this.wavesurfer.on('audioprocess', (currentTime) => {
                this.timeUpdateHandler(currentTime);
            });
            this.wavesurfer.on('finish', () => {
                this.wavesurfer.seekTo(0);
                this.time = this.updateProgress(this.wavesurfer.getDuration() * 1000);
                this.isPlaying = false;
            });
        }
    }

    ngOnDestroy(): void {
        this.wavesurfer.destroy();
    }

    onToggleRecording = () => {
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

    timeUpdateHandler = (currentTime: number) => {
        this.time = this.updateProgress((this.wavesurfer.getDuration() - currentTime) * 1000);
    };
}
