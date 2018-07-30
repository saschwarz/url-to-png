import * as S3 from 'aws-sdk/clients/s3';
import { GetObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3';
import { StorageInterface } from '../StorageInterface';

export class AmazonS3Service implements StorageInterface {
  constructor(private readonly s3: S3, private readonly BUCKET_NAME: string) {}

  private getImageId(imageId: string) {
    return imageId + '.png';
  }

  async fetchImage(imageId: string) {
    const params: GetObjectRequest = { Bucket: this.BUCKET_NAME, Key: this.getImageId(imageId) };
    try {
      const response = await this.s3.getObject(params).promise();
      return response.Body;
    } catch {
      return null;
    }
  }

  async storeImage(imageId: string, image: Buffer) {
    try {
      const data: PutObjectRequest = {
        Key: this.getImageId(imageId),
        Body: image,
        Bucket: this.BUCKET_NAME,
      };
      await this.s3.putObject(data).promise();
      return true;
    } catch (err) {
      return false;
    }
  }
}
