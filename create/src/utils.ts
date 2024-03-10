import {isCancel} from "@clack/prompts";
import * as p from "@clack/prompts";

export function unwrap_cancellation<T>(data: T | symbol) {
    if (isCancel(data)) {
        p.log.error("Cancelled by user. Exiting...");
        process.exit(1);
    }

    return data as T;
}


export function done(message: string = "Your project is ready!", steps: string[]) {
    if (steps.length > 0) {
        message = message + "\n\nNext steps:\n" + steps.map((step, i) => `${i + 1}. ${step}`).join("\n");
    }

    message = message + "\n\nHappy coding!";

    p.outro(message);

    process.exit(0);
}