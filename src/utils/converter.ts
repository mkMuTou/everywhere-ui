export function booleanType(value: string | null, defVal: boolean = true) {
    return value === "true" ? true : value === "false" ? false : defVal;
}
