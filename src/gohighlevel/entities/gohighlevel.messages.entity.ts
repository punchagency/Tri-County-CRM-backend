import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { GohighlevelConversion } from './gohighlevel.conversion.entity';


@Entity({ name: 'ghl_conversation_messages' })
export class GohighlevelConversionMessage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  conversation_ref: string;

  @Column()
  message_ref: string;

  @Column()
  type: string;

  @Column()
  direction: string;

  @Column()
  contact_ref: string;

  @Column({ type: "json", default: null })
  details: object;


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  
  @ManyToOne(() => GohighlevelConversion, (conversation) => conversation.messages, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ referencedColumnName:"id" })
  conversation: GohighlevelConversion;
}
