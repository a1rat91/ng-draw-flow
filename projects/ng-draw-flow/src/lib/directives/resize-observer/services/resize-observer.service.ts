import {ElementRef, inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {SafeObserver} from '../classes/safe-observer';
import {DF_RESIZE_OPTION_BOX} from '../tokens/resize-option-box';

@Injectable()
export class ResizeObserverService extends Observable<readonly ResizeObserverEntry[]> {
    constructor() {
        const nativeElement: HTMLElement = inject(ElementRef).nativeElement;
        const box = inject(DF_RESIZE_OPTION_BOX);

        super((subscriber) => {
            const observer = new SafeObserver((entries) => subscriber.next(entries));

            observer.observe(nativeElement, {box});

            return () => {
                observer.disconnect();
            };
        });
    }
}
