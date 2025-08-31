import type {FactoryProvider} from '@angular/core';
import {InjectionToken} from '@angular/core';

import type {DfOptions} from './ng-draw-flow.interfaces';
import {DfConnectionType} from './ng-draw-flow.interfaces';

export const DRAW_FLOW_DEFAULT_OPTIONS: DfOptions = {
    connection: {
        arrowhead: 'none',
        type: DfConnectionType.Bezier,
        curvature: 0.25,
    },
    nodes: {},
    options: {
        nodeDragThreshold: 1,
        nodesDraggable: true,
        nodesDeletable: true,
        connectionsDeletable: true,
        connectionsCreatable: true,
    },
};

export const DRAW_FLOW_OPTIONS = new InjectionToken('[DRAW_FLOW_OPTIONS]: Options', {
    factory: () => DRAW_FLOW_DEFAULT_OPTIONS,
});

export function provideNgDrawFlowConfigs(options: Partial<DfOptions>): FactoryProvider {
    return {
        provide: DRAW_FLOW_OPTIONS,
        useFactory: (): DfOptions => ({
            connection: {
                ...DRAW_FLOW_DEFAULT_OPTIONS.connection,
                ...options.connection,
            },
            nodes: {
                ...DRAW_FLOW_DEFAULT_OPTIONS.nodes,
                ...options.nodes,
            },
            options: {
                ...DRAW_FLOW_DEFAULT_OPTIONS.options,
                ...options.options,
            },
        }),
    };
}
