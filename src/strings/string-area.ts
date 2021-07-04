import { fromEvent, merge, Observable } from "rxjs";
import { map, mapTo, pluck, startWith, switchMapTo, take, takeUntil } from "rxjs/operators";

export class StringArea {
    constructor(private element: Element) {
    }

    public touched(): Observable<boolean> {
        const mouseUp$ = fromEvent(document, 'mouseup');
        const mouseLeave$ = fromEvent(this.element, 'mouseleave');
        const end$ = merge(mouseLeave$, mouseUp$).pipe(
            take(1),
            mapTo(false),
            startWith(true),
        );
        const mouseDown$ = fromEvent(this.element, 'mousedown');

        return mouseDown$.pipe(
            switchMapTo(end$),
        );
    }

    public distance(): Observable<number> {
        const mouseEnter$ = fromEvent(this.element, 'mouseenter');
        const mouseLeave$ = fromEvent(this.element, 'mouseleave');
        const clientX$ = (fromEvent(this.element, 'mousemove') as Observable<MouseEvent>).pipe(
            pluck('clientX'),
            map((val: number) => {
                return val / this.element.clientWidth;
            }),
            takeUntil(mouseLeave$),
        );

        return mouseEnter$.pipe(
            switchMapTo(clientX$)
        );
    }
}
