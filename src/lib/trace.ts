export class Trace {
    protected static _generateId(): string {
        return (Date.now() + (Math.floor(Math.random() * 10))).toString(16);
    }

    constructor(
        public traceId: string = Trace._generateId(),
        public spanId: string = traceId,
        public parentSpanId: string = traceId) {

    }

    span(): void {
        this.parentSpanId = this.spanId;
        this.spanId = Trace._generateId();
    }

    toJSON(): any {
        return {
            traceId: this.traceId,
            spanId: this.spanId,
            parentSpanId: this.parentSpanId
        };
    }
}