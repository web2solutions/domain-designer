export const controllerLiteral = `import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Model } from 'mongoose';
import { Response } from '../utils/message';
import { _ENTITYNAME_sService } from '../service/_entityname_';
import { Create_ENTITYNAME_DTO } from '../model/dto/create_ENTITYNAME_DTO';
import { Update_ENTITYNAME_DTO } from '../model/dto/update_ENTITYNAME_DTO';
import { HTTPNotFoundError } from '../infra/protocols/HTTP/error/HTTPNotFoundError';
import { _ENTITYNAME_sDocument } from '../model/_entityname_s';
import { ServiceError } from '../infra/ServiceError';
import { setFilter } from '../utils/setFilter';
import { setPaging } from '../utils/setPaging';
import { IPagingRequest, IIdentity } from '../infra/interface';
import { EntitySchema } from '../../database/EntitySchema';
import { template } from '../../../dist/build/joint';

export class _ENTITYNAME_sController extends _ENTITYNAME_sService {
  
  constructor(_entityname_s: Model<_ENTITYNAME_sDocument>) {
    super(_entityname_s);
  }

  public async create(event: APIGatewayProxyEvent, identity: IIdentity): Promise<APIGatewayProxyResult> {
    try {
      if (!identity.user.admin) {
        throw new ServiceError({
          code: 403,
          message: 'only admins can create _entityname_s',
        });
      }
      const params: Create_ENTITYNAME_DTO = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      const result = await this.create_ENTITYNAME_(__createpayload__ as Create_ENTITYNAME_DTO);
      return Response.created(result);
    } catch (err) {
      return Response.error(err as ServiceError);
    }
  }

  public async update(event: APIGatewayProxyEvent, identity: IIdentity): Promise<APIGatewayProxyResult> {
    try {
      if (!identity.user.admin) {
        throw new ServiceError({
          code: 403,
          message: 'only admins can update _entityname_s',
        });
      }
      if (!event.pathParameters) {
        throw new Error('invalid parameters');
      }
      const id: string = event.pathParameters.id || '';
      if (id === '') {
        throw new Error('invalid id');
      }
      const body: Update_ENTITYNAME_DTO = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      const result = await this.update_ENTITYNAME_s(id, body);
      return Response.success(result);
    } catch (err) {
      return Response.error(err as ServiceError);
    }
  }

  public async find(event: APIGatewayProxyEvent, identity: IIdentity): Promise<APIGatewayProxyResult> {
    try {
      const filters = setFilter(event);
      const paging = setPaging(event);
      if (!identity.user.admin) {
        filters.status = 'active';
      }
      const result = await this.find_ENTITYNAME_s({ ...filters }, paging as IPagingRequest);
      return Response.success(result);
    } catch (err) {
      return Response.error(err as ServiceError);
    }
  }

  public async findOne(event: APIGatewayProxyEvent, identity: IIdentity): Promise<APIGatewayProxyResult> {
    try {
      if (!event.pathParameters) {
        throw new Error('invalid parameters');
      }
      const id: string = event.pathParameters.id || '';
      if (id === '') {
        throw new Error('invalid id');
      }
      const result = await this.findOne_ENTITYNAME_ById(id, !identity.user.admin);
      if (result === null) {
        throw new HTTPNotFoundError();
      }
      return Response.success(result);
    } catch (err) {
      return Response.error(err as ServiceError);
    }
  }

  public async deleteOne(event: APIGatewayProxyEvent, identity: IIdentity): Promise<APIGatewayProxyResult> {
    try {
      if (!identity.user.admin) {
        throw new ServiceError({
          code: 403,
          message: 'only admins can delete _entityname_s',
        });
      }
      if (!event.pathParameters) {
        throw new Error('invalid parameters');
      }
      const id: string = event.pathParameters.id || '';
      const result = await this.deleteOne_ENTITYNAME_ById(id);
      return Response.success(result);
    } catch (err) {
      return Response.error(err as ServiceError);
    }
  }
}

`;