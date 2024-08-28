import { Expect, Setup, Test, TestCase, TestFixture } from "alsatian"
import { load } from "js-yaml"
import { OpenAPIObject, SecuritySchemeObject, PathItemObject, ParameterObject, ResponseObject, RequestBodyObject, OperationObject, MediaTypeObject, SchemaObject } from "openapi3-ts/oas31"

import { RequestBuilder, ApiLambdaApp, LogLevel } from "../../dist/ts-lambda-api"

import { TestBase } from "./TestBase"
import { TestAuthFilter } from "./test-components/TestAuthFilter";
import { ResponseWithValue } from './test-components/model/ResponseWithValue';
import { TestCustomAuthFilter } from "./test-components/TestCustomAuthFilter";

@TestFixture()
export class OpenApiTests extends TestBase {
    private static readonly ROUTE_COUNT = 64
    private static readonly HTTP_METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace"]

    @Setup
    public async setup() {
        super.setup({
            name: "Test API",
            versions: ["v1", "v2.0", "v2.1"],
            openApi: {
                enabled: true
            }
        })

        await this.app.initialiseControllers()
    }

    @TestCase("json")
    @TestCase("yml")
    @Test()
    public async when_openapi_enabled_and_versions_used_then_request_to_openapi_spec_for_each_version_returns_200_ok(specFormat: string) {
        let response = await this.requestOpenApiSpec(specFormat, false, 'v1');
        Expect(response.statusCode).toEqual(200)

        response = await this.requestOpenApiSpec(specFormat, false, 'v2.0');
        Expect(response.statusCode).toEqual(200)

        response = await this.requestOpenApiSpec(specFormat, false, 'v2.1');
        Expect(response.statusCode).toEqual(200)
    }

    @TestCase("json")
    @TestCase("yml")
    @Test()
    public async when_openapi_enabled_and_versions_used_then_particular_version_only_contains_relevant_endpoints(specFormat: string) {
        let v1onlyDef = await this.getOpenApiEndpoint(specFormat, 'v1', '/v1con/v1only', 'post');
        Expect(v1onlyDef.description).toEqual('only available in v1')

        let v1onlyDefInv2 = await this.getOpenApiEndpoint(specFormat, 'v2.0', '/v1con/v1only', 'post');
        Expect(v1onlyDefInv2).toBeNull()
    }

    @TestCase("json")
    @TestCase("yml")
    @Test()
    public async when_openapi_enabled_and_versions_used_then_unversioned_endpoints_are_in_all_specs(specFormat: string) {
        let allVersionsv1 = await this.getOpenApiEndpoint(specFormat, 'v1', '/unversioned/all', 'get');
        Expect(allVersionsv1.summary).toEqual('all versions')

        let allVersionsv2 = await this.getOpenApiEndpoint(specFormat, 'v2.0', '/unversioned/all', 'get');
        Expect(allVersionsv2.summary).toEqual('all versions')

        let allVersionsv21 = await this.getOpenApiEndpoint(specFormat, 'v2.1', '/unversioned/all', 'get');
        Expect(allVersionsv21.summary).toEqual('all versions')
    }

    @TestCase("json")
    @TestCase("yml")
    @Test()
    public async when_openapi_enabled_and_versions_used_then_endpoints_are_disambiguated(specFormat: string) {
        let allVersionsv1 = await this.getOpenApiEndpoint(specFormat, 'v1', '/v1con/versioned', 'get');
        Expect(allVersionsv1.summary).toEqual('in v1')

        let allVersionsv2 = await this.getOpenApiEndpoint(specFormat, 'v2.0', '/v1con/versioned', 'get');
        Expect(allVersionsv2.summary).toEqual('in v2.0')

        let allVersionsv21 = await this.getOpenApiEndpoint(specFormat, 'v2.1', '/v1con/versioned', 'get');
        Expect(allVersionsv21.summary).toEqual('in v2.1')
    }

    private async requestParsedOpenApiSpec(specFileFormat: string = "json", version: string) {
        return await this.requestOpenApiSpec(specFileFormat, true, version)
    }

    private async requestOpenApiSpec(specFileFormat: string = "json", derserialize: boolean = false, version?: string) {
        let response: ResponseWithValue<OpenAPIObject> = await this.sendRequest(
            RequestBuilder.get(`${this.appConfig.base || ""}/${version ? `${version}/` : ""}open-api.${specFileFormat}`).build()
        )

        if (derserialize) {
            if (specFileFormat === "json") {
                response.value = JSON.parse(response.body)
            } else {
                response.value = load(response.body) as any
            }
        }

        return response
    }

    private async getOpenApiEndpoint(specFormat: string, version: string, path: string, method: string) {
        let response = await this.requestParsedOpenApiSpec(specFormat, version)
        let pathEndpoint: PathItemObject = response.value.paths[path]

        if (!pathEndpoint) {
          return null;
        } else {
          return pathEndpoint[method] as OperationObject
        }
    }
}
