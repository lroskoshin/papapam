import { fromEvent, merge, Observable } from "rxjs";
import { map, mapTo, pluck, startWith, switchMapTo, take, takeUntil } from "rxjs/operators";

export class StringArea {
    constructor(private element: Element) {
    }

    public touched(): Observable<boolean> {
        const mouseDown$ = fromEvent(this.element, 'mousedown');
        const touchStart$ = fromEvent(this.element, 'touchstart')

        const mouseUp$ = fromEvent(document, 'mouseup');
        const mouseLeave$ = fromEvent(this.element, 'mouseleave');
        const touchEnd$ = merge(fromEvent(this.element, 'touchend'), fromEvent(this.element, 'touchcancel'));

        const end$ = merge(mouseLeave$, mouseUp$, touchEnd$).pipe(
            take(1),
            mapTo(false),
            startWith(true),
        );

        const start$ = merge(touchStart$, mouseDown$);

        return start$.pipe(
            switchMapTo(end$),
        );
    }

    public distance(): Observable<number> {
        const mouseEnter$ = fromEvent(this.element, 'mouseenter');
        const mouseLeave$ = fromEvent(this.element, 'mouseleave');
        const touchMove$ = fromEvent(this.element, 'touchmove') as Observable<TouchEvent>;
        const mouseMove$ = fromEvent(this.element, 'mousemove') as Observable<MouseEvent>;
        const move$ = merge(
            touchMove$.pipe(
                pluck('pageX')
            ) as Observable<number>,
            mouseMove$.pipe(
                pluck('clientX')
            )
        )
        const clientX$ = move$.pipe(
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
