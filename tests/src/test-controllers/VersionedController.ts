import { apiController, apiOperation, Controller, DELETE, GET, POST, PUT } from '../../../dist/ts-lambda-api';

@apiController('/unversioned')
export class V2Controller extends Controller {

  @GET('/all')
  @apiOperation({ name: 'all versions'})
  public async allVersions() {
    return { version: 'allVersions' }
  } 

  @GET('/v2only', { versions: ['v2.0'] })
  public async v2Only() {
    return { version: 'v2Only' }
  }

  @GET('/v2minor', { versions: ['^v2.0'] })
  public async v2minor() {
    return { version: 'v2minor' }
  }

  @GET('/v1orv20', { versions: ['v1', 'v2.0'] })
  public async v1orv2() {
    return { version: 'v1orv20' }
  }
}

@apiController('/v1con', { versions: ['^v1']})
export class V1Controller extends Controller {

  @POST('/v1only')
  @apiOperation({ name: 'v1only', description: 'only available in v1'})
  public async v1Only() {
    return { version: 'v1only'}
  }

  @PUT('/v1orgreater', { versions: ['>=v1']})
  public async v1OrGreater() {
    return { version: 'v1orGreater'}
  }

  @GET('/versioned', { versions: ['v1']})
  @apiOperation({ name: 'in v1'})
  public async versionedV1() {
    return { version: 'v1'}
  }

  @GET('/versioned', { versions: ['v2.0']})
  @apiOperation({ name: 'in v2.0'})
  public async versionedV2_0() {
    return { version: 'v2.0'}
  }

  @GET('/versioned', { versions: ['v2.1']})
  @apiOperation({ name: 'in v2.1'})
  public async versionedV2_1() {
    return { version: 'v2.1'}
  }
}
