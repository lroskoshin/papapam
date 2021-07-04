import { map } from "rxjs/operators";
import { SimpleSound } from "./simple-sound";
import { StringArea } from "./strings/string-area";
import { stringsFactory } from "./strings/string-factory";

const audioCtx =  new (window.AudioContext || (window as any).webkitAudioContext)();;

const strings = stringsFactory();
strings.forEach((stringArea: StringArea, index: number) => {
    const offset = index * 50;
    const min = 100 + offset;
    const max = 150 + offset;
    const freq$ = stringArea.distance().pipe(
        map((val: number) => {
            const raw = val * (max - min);
            return raw + min;
        })
    )
    const simpleSound = new SimpleSound(audioCtx, stringArea.touched(), freq$)
})
