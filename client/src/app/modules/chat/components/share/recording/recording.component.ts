import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record';
@Component({
    selector: 'app-recording',
    templateUrl: './recording.component.html',
    styleUrl: './recording.component.scss',
})
export class RecordingComponent implements OnInit, AfterViewInit, OnDestroy {
    private wavesurfer!: WaveSurfer;
    private record!: RecordPlugin;
    isRecording!: boolean;
    isPlaying!: boolean;

    ngOnInit(): void {
        this.isRecording = false;
        this.isPlaying = false;
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
            this.record = RecordPlugin.create({
                scrollingWaveform: false,
                renderRecordedAudio: false,
            });
        }
    }

    ngAfterViewInit(): void {
        if (this.record) {
            this.record.on('record-end', (blob: Blob) => {
                const recordedUrl = URL.createObjectURL(blob);
                const container: HTMLElement | null = document.getElementById('wavesurfer');
                this.wavesurfer.setOptions({
                    container: container || '',
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
                this.wavesurfer.load(recordedUrl);
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

            this.record.startRecording();
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
}
