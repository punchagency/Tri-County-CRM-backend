import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { GohighlevelConversion } from './gohighlevel.conversion.entity';


@Entity({ name: 'ghl_contact' })
export class GohighlevelContact {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  contact_ref: string;
  
  @Column()
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string

  @Column()
  phone: string

  @Column({ type: "json", default: null })
  details: object;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => GohighlevelConversion, (detail) => detail.contact, {
    cascade: true,
    eager: true,
  })
  conversation: GohighlevelConversion

}
