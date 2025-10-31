import { SquareClient, SquareEnvironment } from 'square';

export class SquareApi {
  private client
  private location_id

  constructor({ token, environment, location_id }: { token: string, environment: 'development' | 'production', location_id: string }) {
    this.client = new SquareClient({
      token, 
      environment: environment === 'development'
        ? SquareEnvironment.Sandbox
        : SquareEnvironment.Production
    });
    this.location_id = location_id;
  }

}
