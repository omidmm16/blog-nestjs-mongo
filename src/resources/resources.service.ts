import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Resource, ResourceDocument } from './schemas/resource.schema';
import { CreateResourceDto } from './dto/createResource.dto';

@Injectable()
export class ResourcesService {
  constructor(@InjectModel(Resource.name) private readonly resourceModel: Model<ResourceDocument>) { }

  async createResource(createPostDto: CreateResourceDto): Promise<ResourceDocument> {
    const createdResource: ResourceDocument = await this.resourceModel.create(createPostDto);

    return createdResource.populate('post', '_id');
  }

  async updateResourcesPost(resources: Types.ObjectId[], post: Types.ObjectId): Promise<void> {
    await this.resourceModel.updateMany(
      { _id: { $in: resources } },
      { $set: { post } },
    );
  }
}
