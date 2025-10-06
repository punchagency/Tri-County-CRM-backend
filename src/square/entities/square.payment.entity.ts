import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SquarePayment {
 @PrimaryGeneratedColumn("uuid")
 id: string

 @Column()
 payment_ref: string

 @Column()
 type: string

 @Column({ type: "json", nullable: true })
 amount_money: object

 @Column({ nullable: true })
 status: string

 @Column({ nullable: true })
 delay_duration: string

 @Column({ nullable: true })
 source_type: string

 @Column({ type: "json", nullable: true })
 card_details: object

 @Column({ nullable: true })
 location_id: string

 @Column({ nullable: true })
 order_id: string

 @Column({ type: "json", nullable: true })
 risk_evaluation: object

 @Column({ type: "json", nullable: true })
 total_money: object

 @Column({ type: "json", nullable: true })
 approved_money: object

 @Column({ nullable: true })
 receipt_number: string

 @Column({ nullable: true })
 receipt_url: string

 @Column({ nullable: true })
 delay_action: string

 @Column({ nullable: true })
 delayed_until: string

 @Column({ nullable: true })
 version_token: string

 @CreateDateColumn()
 created_at: Date

 @UpdateDateColumn()
 updated_at: Date

}
