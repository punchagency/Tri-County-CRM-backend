import { ApiConfig } from '@src/config';

export class AwsS3Bucket {
  private s3Client
  private s3Config: ApiConfig['s3'];

  constructor({ s3 }: { s3: ApiConfig['s3'] }) {
    this.s3Config = s3;
    // TODO: Implement upload recording to s3
    // this.s3Client = new S3Client({
    //   region: this.s3.region,
    //   credentials: {
    //     accessKeyId: this.s3.access_key,
    //     secretAccessKey: this.s3.secret_key,
    //   },
    // });
  }

  async uploadRecordingToS3(recording: any) {
    try {

      return {
        url: "",
        details: {mesaage:"test valur2"},
      };

      // TODO: Implement upload recording to s3
      const uploadedObject = await this.s3Client.putObject({
        // Bucket: this.s3Config.bucket,
        Key: recording.key,
        Body: recording.body,
      });

      return {
        url: uploadedObject.url,
        details: uploadedObject,
      };
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }
}
