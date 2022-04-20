import {
  Model,
  IsUUID,
  PrimaryKey,
  Unique,
  Column,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt
} from "sequelize-typescript";
import { User } from "./User";

@Table
export class AuthToken extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Unique
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column
  token!: string;

  @BelongsTo(() => User, "userId")
  user!: User;

  @ForeignKey(() => User)
  userId!: number;

  @Column
  expiredReason?: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @DeletedAt
  @Column
  deletedAt?: Date;
}
