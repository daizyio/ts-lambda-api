import { DecoratorRegistry } from "../reflection/DecoratorRegistry"

/**
 * Decorator that can be placed on a method to mark it is an API endpoint
 * that responds to HTTP GET requests.
 *
 * @param path The URL path that triggers this endpoint; optional if you set a root path on the
 *             class using a `apiController` decorator. This URL can contain path parameters,
 *             prefixed with a colon (':') character.
 */
export function GET(path: string = "", options?: { versions: string[] }) {
    return (classDefinition: Object, methodName: string) =>
        registerApiEndpoint(classDefinition, methodName, path, "GET", options?.versions)
}

/**
 * Decorator that can be placed on a method to mark it is an API endpoint
 * that responds to HTTP POST requests.
 *
 * @param path The URL path that triggers this endpoint; optional if you set a root path on
 *             the class using a `apiController` decorator. This URL can contain path parameters,
 *             prefixed with a colon (':') character.
 */
export function POST(path: string = "", options?: { versions: string[] }) {
    return (classDefinition: Object, methodName: string) =>
        registerApiEndpoint(classDefinition, methodName, path, "POST", options?.versions)
}

/**
 * Decorator that can be placed on a method to mark it is an API endpoint
 * that responds to HTTP PUT requests.
 *
 * @param path The URL path that triggers this endpoint; optional if you set a root path on
 *             the class using a `apiController` decorator. This URL can contain path parameters,
 *             prefixed with a colon (':') character.
 */
export function PUT(path: string = "", options?: { versions: string[] }) {
    return (classDefinition: Object, methodName: string) =>
        registerApiEndpoint(classDefinition, methodName, path, "PUT", options?.versions)
}

/**
 * Decorator that can be placed on a method to mark it is an API endpoint
 * that responds to HTTP DELETE requests.
 *
 * @param path The URL path that triggers this endpoint; optional if you set a root path on
 *             the class using a `apiController` decorator. This URL can contain path parameters,
 *             prefixed with a colon (':') character.
 */
export function DELETE(path: string = "", options?: { versions: string[] }) {
    return (classDefinition: Object, methodName: string) =>
        registerApiEndpoint(classDefinition, methodName, path, "DELETE", options?.versions)
}

/**
 * Decorator that can be placed on a method to mark it is an API endpoint
 * that responds to HTTP PATCH requests.
 *
 * @param path The URL path that triggers this endpoint; optional if you set a root path on
 *             the class using a `apiController` decorator. This URL can contain path parameters,
 *             prefixed with a colon (':') character.
 */
export function PATCH(path: string = "", options?: { versions: string[] }) {
    return (classDefinition: Object, methodName: string) =>
        registerApiEndpoint(classDefinition, methodName, path, "PATCH", options?.versions)
}

function registerApiEndpoint(classDefinition: Object, methodName: string, path: string, httpMethod: string, versions?: string[]) {
    let controller = DecoratorRegistry.getOrCreateController(classDefinition.constructor)

    let endpoint = DecoratorRegistry.getOrCreateEndpoint(controller, methodName)

    DecoratorRegistry.getLogger().debug("@%s(%s) decorator executed for endpoint: %s",
        httpMethod,
        path.trim() === "" ? "" : `'${path}'`,
        endpoint.name)

    endpoint.httpMethod = httpMethod
    endpoint.path = path

    endpoint.versions = versions;
}