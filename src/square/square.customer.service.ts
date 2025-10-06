import { Injectable, Logger } from '@nestjs/common';
import { CustomerEventType } from './square.types';
import { SquareRepo } from './square.repo';
import { Repository } from 'typeorm';
import { SquareCustomer } from './entities/square.customer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SquareCustomerService {
  private logger = new Logger(SquareCustomerService.name)
  private squareRepo: SquareRepo

  constructor(
    @InjectRepository(SquareCustomer)
    private squareCustomerRepository: Repository<SquareCustomer>
  ){
    this.squareRepo = new SquareRepo({ squareCustomerRepository })
  }

  async onCreateCustomer(body: any) {
    if (CustomerEventType.CREATED !== body.type) {
      return
    }
    
    const customerInformation = body.data.object
    return this.squareRepo.saveOrUpdateOrDeleteForCustomer(customerInformation)
  }

  async onUpdateCustomer(body: any) {
    if (CustomerEventType.UPDATED !== body.type) {
      return
    }

    const customerInformation = body.data.object
    return this.squareRepo.saveOrUpdateOrDeleteForCustomer(customerInformation)
  }

  async onDeleteCustomer(body: any) {
    if (CustomerEventType.DELETED !== body.type) {
      return
    }

    const customerInformation = body.data.object
    return this.squareRepo.saveOrUpdateOrDeleteForCustomer(customerInformation, true)
  }

  async customerHandle(body) {
    try{
      //  implemeting action parallelly because they are independent
      await Promise.all([
        this.onCreateCustomer(body),
        this.onUpdateCustomer(body),
        this.onDeleteCustomer(body)
      ])
    }catch(error){
      this.logger.log("error", error)
    }
  }
}
