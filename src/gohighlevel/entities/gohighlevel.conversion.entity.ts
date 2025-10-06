import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { GohighlevelContact } from './gohighlevel.contact.entity';
import { GohighlevelConversionMessage } from './gohighlevel.messages.entity';


@Entity({ name: 'ghl_conversations' })
export class GohighlevelConversion {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  conversation_ref: string;

  @Column()
  contact_ref: string;

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

  @OneToOne(() => GohighlevelContact, (contact) => contact.conversation, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ referencedColumnName:"id"})
  contact: GohighlevelContact;

  @OneToMany(() => GohighlevelConversionMessage, (messages) => messages.conversation, {
    cascade: true,
    eager: true,
  })
  messages: Array<GohighlevelConversionMessage>
}
