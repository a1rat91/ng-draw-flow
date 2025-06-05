import type {DfDataConnection} from '../../ng-draw-flow.interfaces';
import {DfConnectionPoint} from '../../ng-draw-flow.interfaces';
import {ConnectionsService} from './connections.service';

describe('ConnectionsService', () => {
    let service: ConnectionsService;

    beforeEach(() => {
        service = new ConnectionsService();
    });

    it('adds and removes a connection', () => {
        const conn: DfDataConnection = {
            source: {
                nodeId: '1',
                connectorType: DfConnectionPoint.Output,
                connectorId: 'a',
            },
            target: {
                nodeId: '2',
                connectorType: DfConnectionPoint.Input,
                connectorId: 'b',
            },
        };

        service.addConnections([conn]);

        expect(service.connections$.value.size).toBe(1);
        expect(service.usedConnectors$.value.has('a')).toBe(true);
        expect(service.usedConnectors$.value.has('b')).toBe(true);

        service.removeConnection(conn);

        expect(service.connections$.value.size).toBe(0);
        expect(service.usedConnectors$.value.size).toBe(0);
    });

    it('ignores duplicate connections', () => {
        const conn: DfDataConnection = {
            source: {
                nodeId: '1',
                connectorType: DfConnectionPoint.Output,
                connectorId: 'a',
            },
            target: {
                nodeId: '2',
                connectorType: DfConnectionPoint.Input,
                connectorId: 'b',
            },
        };

        service.addConnections([conn]);
        service.addConnections([conn]);

        expect(service.connections$.value.size).toBe(1);
    });
});
