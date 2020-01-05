module.exports = (ctx) => {
  const register = () => {
    ctx.helper.uploader.register('bos', {
      handle,
      name: '百度云BOS',
      config: config
    })
  }

  const handle = async function (ctx) {
    let userConfig = ctx.getConfig('picBed.bos')

    if (!userConfig) {
      throw new Error('Can\'t find uploader config')
    }

    if (!userConfig.ak) {
      throw new Error('Can\'t find uploader config ak')
    }

    if (!userConfig.sk) {
      throw new Error('Can\'t find uploader config sk')
    }

    if (!userConfig.endpoint) {
      throw new Error('Can\'t find uploader config endpoint')
    }

    if (!userConfig.bucket) {
      throw new Error('Can\'t find uploader config bucket')
    }

    if (!userConfig.domain) {
      throw new Error('Can\'t find uploader config domain')
    }

    let ak = userConfig.ak
    let sk = userConfig.sk
    let endpoint = userConfig.endpoint
    let bucket = userConfig.bucket
    let domain = userConfig.domain

    const {BosClient} = require('@baiducloud/sdk')

    let bosConfig = {
      credentials: {
        ak: ak,
        sk: sk
      },
      endpoint: endpoint
    }

    let client = new BosClient(bosConfig)
    let imgList = ctx.output

    for (let i in imgList) {
      if (imgList.hasOwnProperty(i)) {
        let key = imgList[i].fileName
        let buffer = imgList[i].buffer

        let p = client.putObject(bucket, key, buffer)
        await p.then(response => {
          imgList[i].imgUrl = domain + '/' + key
          imgList[i].url = domain + '/' + key
          console.log(response)
        },
        error => {
          console.log(error)
          throw error
        })
      }
    }
  }

  const config = ctx => {
    let userConfig = ctx.getConfig('picBed.bos')
    if (!userConfig) {
      userConfig = {}
    }

    return [
      {
        name: 'ak',
        type: 'input',
        default: userConfig.ak,
        required: true,
        alias: 'AccessKey'
      },
      {
        name: 'sk',
        type: 'input',
        default: userConfig.sk,
        required: true,
        alias: 'SecretKey'
      },
      {
        name: 'endpoint',
        type: 'input',
        default: userConfig.endpoint,
        required: true,
        alias: 'endpoint'
      },
      {
        name: 'bucket',
        type: 'input',
        default: userConfig.bucket,
        required: true,
        alias: 'bucket'
      },
      {
        name: 'domain',
        type: 'input',
        default: userConfig.domain,
        required: true,
        alias: 'domain'
      }
    ]
  }

  const commands = (ctx) => [{
    label: '',
    key: '',
    name: '',
    async handle (ctx, guiApi) {
    }
  }]

  return {
    uploader: 'bos',
    commands,
    register
  }
}
