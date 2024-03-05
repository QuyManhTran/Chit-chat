import { Component } from '@angular/core';
import WaveSurfer from 'wavesurfer.js';

@Component({
    selector: 'app-preview-recording',
    templateUrl: './preview-recording.component.html',
    styleUrl: './preview-recording.component.scss',
})
export class PreviewRecordingComponent {
    private wavesurfer!: WaveSurfer;
    isPlaying!: boolean;

    ngOnInit(): void {
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
            this.wavesurfer.load('./assets/audios/ring-tone.mp3');
        }
    }

    ngAfterViewInit(): void {
        if (this.wavesurfer) {
            this.wavesurfer.on('finish', () => {
                this.wavesurfer.seekTo(0);
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
}
