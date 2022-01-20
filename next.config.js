

module.exports = {
  serverRuntimeConfig: {
      PROJECT_ROOT: __dirname
  },

  /*async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'cookie',
            key: 'token-vip',
            value: '^((?!).)*$',
          },
        ],
        permanent: false,
        destination: '/blocked',
      },
    ]
  },*/
}