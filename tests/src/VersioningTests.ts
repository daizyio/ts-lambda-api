import { Expect, Test, TestFixture } from "alsatian"
import { Container } from "inversify"

import { ApiLambdaApp, RequestBuilder } from "../../dist/ts-lambda-api"

import { TestBase } from "./TestBase"

@TestFixture()
export class ApiLambdaAppTests extends TestBase {
    @Test()
    public async when_endpoint_and_controller_has_no_version_endpoint_is_available_for_all_versions() {
        this.appConfig.base = "api"
        this.appConfig.versions = ['v1', 'v2.0']

        this.app = new ApiLambdaApp(TestBase.CONTROLLERS_PATH, this.appConfig)

        let response = await this.sendRequest(
            RequestBuilder.get("api/v1/unversioned/all").build()
        )

        Expect(response.statusCode).toEqual(200)

        response = await this.sendRequest(
            RequestBuilder.get("api/v2.0/unversioned/all").build()
        )

        Expect(response.statusCode).toEqual(200)
    }

    @Test()
    public async when_endpoint_has_an_exact_version_only_matches_that_version() {
        this.appConfig.base = "api"
        this.appConfig.versions = ['v1', 'v2.0']

        this.app = new ApiLambdaApp(TestBase.CONTROLLERS_PATH, this.appConfig)

        let response = await this.sendRequest(
            RequestBuilder.get("api/v1/unversioned/v2only").build()
        )

        Expect(response.statusCode).toEqual(404)

        response = await this.sendRequest(
            RequestBuilder.get("api/v2.0/unversioned/v2only").build()
        )

        Expect(response.statusCode).toEqual(200)
    }

    @Test()
    public async when_endpoint_has_a_caret_version_matches_all_minor_versions() {
        this.appConfig.base = "api"
        this.appConfig.versions = ['v1', 'v2.0', 'v2.1']

        this.app = new ApiLambdaApp(TestBase.CONTROLLERS_PATH, this.appConfig)

        let response = await this.sendRequest(
            RequestBuilder.get("api/v1/unversioned/v2minor").build()
        )

        Expect(response.statusCode).toEqual(404)

        response = await this.sendRequest(
            RequestBuilder.get("api/v2.0/unversioned/v2minor").build()
        )

        Expect(response.statusCode).toEqual(200)

        response = await this.sendRequest(
          RequestBuilder.get("api/v2.1/unversioned/v2minor").build()
      )

      Expect(response.statusCode).toEqual(200)
    }

    @Test()
    public async when_endpoint_has_multiple_versions_matches_all_specified_versions() {
        this.appConfig.base = "api"
        this.appConfig.versions = ['v1', 'v2.0', 'v2.1']

        this.app = new ApiLambdaApp(TestBase.CONTROLLERS_PATH, this.appConfig)

        let response = await this.sendRequest(
            RequestBuilder.get("api/v1/unversioned/v1orv20").build()
        )

        Expect(response.statusCode).toEqual(200)

        response = await this.sendRequest(
            RequestBuilder.get("api/v2.0/unversioned/v1orv20").build()
        )

        Expect(response.statusCode).toEqual(200)

        response = await this.sendRequest(
          RequestBuilder.get("api/v2.1/unversioned/v1orv20").build()
        )

        Expect(response.statusCode).toEqual(404)
    }

    @Test()
    public async when_endpoint_has_no_versions_uses_version_from_controller() {
      this.appConfig.base = "api"
      this.appConfig.versions = ['v1', 'v2.0', 'v2.1']

      this.app = new ApiLambdaApp(TestBase.CONTROLLERS_PATH, this.appConfig)

      let response = await this.sendRequest(
          RequestBuilder.post("api/v1/v1con/v1only").build()
      )

      Expect(response.statusCode).toEqual(200)

      response = await this.sendRequest(
          RequestBuilder.post("api/v2.0/v1con/v1only").build()
      )

      Expect(response.statusCode).toEqual(404)

      response = await this.sendRequest(
        RequestBuilder.post("api/v2.1/v1con/v1only").build()
      )

      Expect(response.statusCode).toEqual(404)
    }

    @Test()
    public async when_endpoint_has_version_it_overrides_the_controller_version() {
      this.appConfig.base = "api"
      this.appConfig.versions = ['v1', 'v2.0', 'v2.1']

      this.app = new ApiLambdaApp(TestBase.CONTROLLERS_PATH, this.appConfig)

      let response = await this.sendRequest(
          RequestBuilder.put("api/v1/v1con/v1orgreater").build()
      )

      Expect(response.statusCode).toEqual(200)

      response = await this.sendRequest(
          RequestBuilder.put("api/v2.0/v1con/v1orgreater").build()
      )

      Expect(response.statusCode).toEqual(200)

      response = await this.sendRequest(
        RequestBuilder.put("api/v2.1/v1con/v1orgreater").build()
      )

      Expect(response.statusCode).toEqual(200)
    }

    @Test()
    public async endpoints_are_disambiguated() {
      this.appConfig.base = "api"
      this.appConfig.versions = ['v1', 'v2.0', 'v2.1']

      this.app = new ApiLambdaApp(TestBase.CONTROLLERS_PATH, this.appConfig)

      let response = await this.sendRequest(
          RequestBuilder.get("api/v1/v1con/versioned").build()
      )

      Expect(response.statusCode).toEqual(200)
      Expect(response.body).toEqual("{\"version\":\"v1\"}")

      response = await this.sendRequest(
          RequestBuilder.get("api/v2.0/v1con/versioned").build()
      )

      Expect(response.statusCode).toEqual(200)
      Expect(response.body).toEqual("{\"version\":\"v2.0\"}")

      response = await this.sendRequest(
        RequestBuilder.get("api/v2.1/v1con/versioned").build()
      )

      Expect(response.statusCode).toEqual(200)
      Expect(response.body).toEqual("{\"version\":\"v2.1\"}")
    }
}
