import { AbstractEntity } from 'src/utils/abstract.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { UserAuth } from './user-auth.entity';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 20, default: 'inactive' })
  status: 'active' | 'inactive' | 'suspended';

  @OneToOne(() => UserAuth, (auth) => auth.user, { cascade: true })
  auth: UserAuth;
}
