import {
	Model,
	Column,
	Table,
	CreatedAt,
	UpdatedAt,
	IsUUID,
	PrimaryKey,
	DataType,
	Unique,
  BelongsToMany
} from "sequelize-typescript"
import { Post } from "./Post"
import { PostAuthor } from "./PostAuthor"

@Table({
  tableName: 'users'
})
export class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Unique
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  id!: string

  @Column
  username!: string

  @Column
  password!: string

  @BelongsToMany(() => Post, () => PostAuthor)
  posts?: Post[]
  
  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date

  @Column
  role!: string
}
