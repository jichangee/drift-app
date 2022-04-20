export const config = (env) => {
  return {
    jwt_secret: 'myjwtsecret',
  }
}

export default config(process.env)
