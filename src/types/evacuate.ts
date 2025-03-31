export type Transport = {
    name: string;
    capacity: number;
    Kmin: number;
    Kmax: number;
};

export interface TransportItem {
    name: string;
    units: number;
    unitCapacity: number;
    totalCapacity: number;
}

export interface TransportStats {
    items: TransportItem[];
    totalUnits: number;
    totalCapacity: number;
}
