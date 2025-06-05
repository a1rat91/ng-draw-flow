import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import type {DfDataConnection} from '../../ng-draw-flow.interfaces';

@Injectable()
export class ConnectionsService {
    public readonly connections$ = new BehaviorSubject<Map<string, DfDataConnection>>(
        new Map(),
    );

    public readonly usedConnectors$ = new BehaviorSubject<Set<string>>(new Set());

    public addConnections(connections: DfDataConnection[]): void {
        if (connections.length === 0) {
            return;
        }

        const updatedMap = new Map(this.connections$.value);

        connections.forEach((connection) => {
            const key = this.createKey(connection);

            if (!updatedMap.has(key)) {
                updatedMap.set(key, connection);
            }
        });

        this.connections$.next(updatedMap);
        this.usedConnectors$.next(this.collectUsedConnectors(updatedMap));
    }

    public removeConnection(connectionToRemove: DfDataConnection): void {
        const keyToRemove = this.createKey(connectionToRemove);

        const updatedMap = new Map(this.connections$.value);

        if (!updatedMap.delete(keyToRemove)) {
            return;
        }

        this.connections$.next(updatedMap);
        this.usedConnectors$.next(this.collectUsedConnectors(updatedMap));
    }

    public removeConnectionsByNodeId(id: string): void {
        const updatedMap = new Map(this.connections$.value);

        for (const [key, connection] of this.connections$.value.entries()) {
            if (connection.source.nodeId === id || connection.target.nodeId === id) {
                updatedMap.delete(key);
            }
        }

        this.connections$.next(updatedMap);
        this.usedConnectors$.next(this.collectUsedConnectors(updatedMap));
    }

    public removeConnectionsByConnectorId(connectorIdToRemove: string): void {
        if (!connectorIdToRemove) {
            return;
        }

        const updatedMap = new Map(this.connections$.value);

        for (const [key, connection] of this.connections$.value.entries()) {
            if (
                connection.source.connectorId === connectorIdToRemove ||
                connection.target.connectorId === connectorIdToRemove
            ) {
                updatedMap.delete(key);
            }
        }

        const usedConnectors = this.collectUsedConnectors(updatedMap);

        usedConnectors.delete(connectorIdToRemove);

        this.usedConnectors$.next(usedConnectors);
        this.connections$.next(updatedMap);
    }

    private createKey(connection: DfDataConnection): string {
        return `${connection.source.nodeId}:${connection.source.connectorId}->${connection.target.nodeId}:${connection.target.connectorId}`;
    }

    private collectUsedConnectors(map: Map<string, DfDataConnection>): Set<string> {
        const used = new Set<string>();

        map.forEach((conn) => {
            used.add(conn.source.connectorId);
            used.add(conn.target.connectorId);
        });

        return used;
    }
}
