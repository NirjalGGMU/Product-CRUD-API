import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // Store only the bcrypt hash, never the plain-text password.
  @Column()
  password: string;

  @Column({ type: "text", nullable: true })
  refreshToken: string | null;
}
