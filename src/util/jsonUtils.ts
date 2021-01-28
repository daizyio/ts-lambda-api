export function toJson(value: any, spacing: number = 2) {
    // console.log(`In ${value}, out ${JSON.stringify(value)}`);
    return JSON.parse(JSON.stringify(value, null, spacing));
}
