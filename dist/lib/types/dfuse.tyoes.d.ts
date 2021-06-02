export interface action {
    seq: number;
    name: string;
    block: {
        num: number;
        timestamp: number;
    };
    txid: string;
    data: {
        [key: string]: any;
    };
    account: string;
}
export interface ActionQueue {
    action: action;
    cursor: string;
    table: string;
    searchString: string;
}
