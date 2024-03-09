import {isCancel} from "@clack/prompts";
import * as p from "@clack/prompts";

export function unwrap_cancellation<T>(data: T | symbol) {
    if (isCancel(data)) {
        p.log.error("Cancelled by user. Exiting...");
        process.exit(1);
    }

    return data as T;
}
