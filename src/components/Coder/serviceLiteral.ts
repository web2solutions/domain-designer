export const serviceLiteral = `import { Model } from 'mongoose';
import { Create_ENTITYNAME_DTO } from '../model/dto/create_ENTITYNAME_DTO';
import { Update_ENTITYNAME_DTO } from '../model/dto/update_ENTITYNAME_DTO';
import { _ENTITYNAME_sDocument } from '../model';
import { ServiceError } from '../infra/ServiceError';
import { IPagingRequest } from '../infra/interface/IPagingRequest';
import { IPagingResponse } from '../infra/interface/IPagingResponse';

export class _ENTITYNAME_sService {
  private _entityname_s: Model<_ENTITYNAME_sDocument>;
  constructor(_entityname_s: Model<_ENTITYNAME_sDocument>) {
    this._entityname_s = _entityname_s;
  }

  protected async create_ENTITYNAME_(params: Create_ENTITYNAME_DTO): Promise<_ENTITYNAME_sDocument> {
    try {
      const result = await this._entityname_s.create(__createpayload__);

      return result;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new ServiceError({
          message: err.message,
        });
      }
      throw err;
    }
  }

  protected async update_ENTITYNAME_s(_id: string, data: Update_ENTITYNAME_DTO): Promise<_ENTITYNAME_sDocument | null> {
    try {
      const record = await this._entityname_s.findOneAndUpdate(
        { _id },
        { $set: data },
        { new: true },
      );
      return record;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new ServiceError({
          message: err.message,
        });
      }
      throw err;
    }
  }

  protected async find_ENTITYNAME_s(
    filters: Record<string, string|number> = {},
    paging: IPagingRequest
  ): Promise<IPagingResponse<Array<_ENTITYNAME_sDocument>>> {
    let { page, size } = paging;
    page = page ? Math.round(page) : 1;
    size = size ? Math.round(size) : 20;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = {
      // status: 'active',
    };
    if (filters) {
      query = { ...filters, ...query };
    }
    delete query.status;
    try {
      const skip = (page * size) - size;
      const result = await this._entityname_s.find(query).limit(size).skip(skip); // .sort( '-createdOn' )
      const total = await this._entityname_s.count(query);
      return {
        result, page, size, total,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new ServiceError({
          message: err.message,
        });
      }
      throw err;
    }
  }

  protected async findOne_ENTITYNAME_ById(_id: string, showOnlyActive: boolean): Promise<_ENTITYNAME_sDocument | null> {
    try {
      const filter: Record<string, string | number | boolean> = {
        _id,
      };
      if (showOnlyActive) {
        filter.status = 'active';
      }
      const record = await this._entityname_s.findOne(filter);
      return record;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new ServiceError({
          message: err.message,
        });
      }
      throw err;
    }
  }

  protected async deleteOne_ENTITYNAME_ById(_id: string): Promise<boolean> {
    try {
      await this._entityname_s.findOneAndUpdate(
        {
          _id,
          status: 'active',
        },
        { $set: { status: 'inactive' } },
        { new: false },
      );
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new ServiceError({
          message: err.message,
        });
      }
      throw err;
    }
  }
}


`;