import {
	Model,
	Column,
	Table,
	CreatedAt,
	UpdatedAt,
	IsUUID,
	PrimaryKey,
	DataType,
	Unique
} from "sequelize-typescript"

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
  
  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date

  @Column
  role!: string
}
