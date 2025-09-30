import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';


@Entity({ name: 'ghl_conversations' })
export class GohighlevelConversion {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  conversation_ref: string;

  @Column()
  contact_ref: string;

  // @Column({ nullable: true })
  // last_date_update: number

  @Column()
  last_message_direction: string

  @Column()
  last_message_ref: string

  @Column()
  last_messages_count: number

  @Column({ type: "json", default: null })
  details: object;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}
