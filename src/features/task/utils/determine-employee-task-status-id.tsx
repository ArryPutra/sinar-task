export function determineEmployeeTaskStatusId(
    startAt: Date,
    dueAt: Date,
    now: Date = new Date()
): number {
    if (startAt > now && dueAt > now) {
        return 1;
    }
    else if (startAt <= now && dueAt >= now) {
        return 2;
    } else {
        return 3;
    }
}