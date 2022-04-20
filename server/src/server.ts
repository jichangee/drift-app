import { createServer  } from 'http'
import { app } from './app'
import './database'

;(async () => {
	createServer(app).listen(3000, () => {
    console.info('Listening on port 3000')
  })
})()
