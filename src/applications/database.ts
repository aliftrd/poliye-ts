import { Sequelize } from 'sequelize'

export const sequelizeClient: Sequelize = new Sequelize('mysql', {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  logging: false
})
