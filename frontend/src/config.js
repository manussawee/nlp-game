const config = {
  development: {
    api: 'http://localhost:4000',
    socket: 'http://localhost:4001',
    countdown: 3000,
    numberWord: 3,
  },
  production: {
    api: 'http://35.247.171.252:4000',
    socket: 'http://35.247.171.252:4001',
    countdown: 3000,
    numberWord: 3,
  }
}

export default config[process.env.REACT_APP_MODE || 'development'];
