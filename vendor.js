const fs = require('fs')
const path = require('path')
const process = require('child_process')

const { root } = require('./config')

/**
 * 将body转化为正确格式
 * @param {String} body 
 * @return {String}
 */
function transformBody(body = '') {
  body = body.replace(/(\$\$)<br\s?\/?>/g, '$1\n')
            .replace(/<br\s?\/?>(\$\$)/g, '\n$1')
            .replace(/<br\s?\/?>/g, '\n\n')

  const re = /\-\-\-.*?\-\-\-/s
  if(!re.test(body)) {
    return body
  }

  const yml = body.match(re)[0]
  const validYml = yml.replace(/\*/sg, '-')
  body = body.replace(yml, validYml)

  return body
}

/**
 * 
 * @param {String} name 
 * @param {String} body 
 * @param {String} category 
 */
function writeMd(name, body, category = '') {
  name = name.endsWith('.md') ? name : `${name}.md`
  body = transformBody(body || '')
          
  const file = path.resolve(root, category, name),
    folder = path.resolve(root, category)

  if(!fs.existsSync(folder)) {
    try {
      fs.mkdirSync(folder)
    } catch(error) {
      console.log('Error at function writeMd', error.message)
    }
  }

  try {
    fs.writeFileSync(file, body, 'utf8')
  } catch(error) {
    console.log('Error at function writeMd', error.message)
  }
}

/**
 * 执行hexo打包命令
 */
function unpack() {
  let running = false,
    more = false

  const _unpack = () => {
    if(running) {
      more = true
      console.log('<<< busy run')
      return
    }
    
    running = true
    process.exec('hexo clean && hexo d', (error, stdout) => {
      if(error) {
        console.log('<<< fail hexo unpack', error.message)
        return
      }
      console.log('<<< finish hexo unpack')
      running = false

      if(more) {
        more = false
        _unpack()
      }
    })
  }

  return _unpack
}

module.exports = {
  writeMd,
  unpack: unpack()
}
