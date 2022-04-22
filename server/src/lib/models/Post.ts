import {
  IsUUID,
  Model,
  Table,
  PrimaryKey,
  Unique,
  Column,
  DataType,
  BelongsToMany,
  CreatedAt,
  UpdatedAt,
  HasOne,
  Scopes
} from "sequelize-typescript";
import { PostAuthor } from "./PostAuthor";
import { User } from "./User";

@Scopes(() => ({
	user: {
		include: [
			{
				model: User,
				through: { attributes: [] }
			}
		]
	},
	full: {
		include: [
			{
				model: User,
				through: { attributes: [] }
			}
		]
	}
}))
@Table({
  tableName: "posts",
})
export class Post extends Model {
  @IsUUID(4)
  @Unique
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column
  title!: string;

  @Column
	description?: string

  @Column
	content?: string

	@BelongsToMany(() => User, () => PostAuthor)
	users?: User[]

	@CreatedAt
	@Column
	createdAt!: Date

	@Column
	visibility!: string

	@Column
	password?: string

	@UpdatedAt
	@Column
	updatedAt!: Date

	@Column
	deletedAt?: Date

	@Column
	expiresAt?: Date

	@HasOne(() => Post, { foreignKey: "parentId", constraints: false })
	parent?: Post
}
