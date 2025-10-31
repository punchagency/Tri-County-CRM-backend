import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SquareCustomer {
 @PrimaryGeneratedColumn("uuid")
 id: string

 @Column()
 customer_ref: string

 @Column({ nullable: true })
 first_name: string

 @Column({ nullable: true })
 last_name: string

 @Column({ nullable: true })
 email: string

 @Column({ nullable: true })
 phone: string

 @Column({ nullable: true })
 date_of_birth: string

 @Column({ type: "json", nullable: true })
 additional_info: object

 @CreateDateColumn()
 created_at:Date

 @UpdateDateColumn()
 updated_at:Date

}
