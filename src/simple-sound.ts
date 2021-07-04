import { Observable, Subject } from "rxjs";

export class SimpleSound {
    private oscillator: OscillatorNode;
    constructor(private audioCtx: AudioContext, private play$: Observable<boolean>, private freq$: Observable<number>) {
        this.oscillator = this.audioCtx.createOscillator();
        this.oscillator.type = 'square';
        this.oscillator.start();
        this.freq$.subscribe((freq: number) => {
            this.oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
        });
        this.play$.subscribe((play: boolean) => {
            if (play) {
                this.start();
            } else {
                this.stop();
            }
        })
    }

    public start(): void {
        this.oscillator.connect(this.audioCtx.destination)
    }

    public stop(): void {
        this.oscillator.disconnect(this.audioCtx.destination)
    }

    public destroy(): void {
        this.stop();
        this.oscillator.stop();
    }
}
