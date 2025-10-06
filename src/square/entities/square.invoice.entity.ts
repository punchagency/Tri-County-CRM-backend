import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SquareInvoice {
 @PrimaryGeneratedColumn("uuid")
 id: string

 @Column()
 invoice_ref: string

 @Column()
 type: string

 @Column({ type: "json", nullable: true })
 accepted_payment_methods: object

 @Column({ type: "json", nullable: true })
 custom_fields: Array<any>

 @Column({ nullable: true })
 description: string

 @Column({ nullable: true })
 invoice_number: string

 @Column({ nullable: true })
 location_id: string

 @Column({ nullable: true })
 order_id: string

 @Column({ type: "json", nullable: true })
 payment_requests: Array<any>

 @Column({ type: "json", nullable: true })
 primary_recipient: object

 @Column({ nullable: true })
 sale_or_service_date: string

 @Column({ nullable: true })
 status: string

 @Column({ type: "boolean", default: false })
 store_payment_method_enabled: boolean

 @Column({ nullable: true })
 timezone: string

 @Column({ nullable: true })
 delivery_method: string

 @Column({ nullable: true })
 title: string

 @Column({ nullable: true })
 version: number

 @CreateDateColumn()
 created_at: Date

 @UpdateDateColumn()
 updated_at: Date

}
