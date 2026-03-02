/**
 * 存储抽象层 - 当前使用本地存储实现
 * 后续切换到云开发时，只需替换此文件中的实现
 */

const StorageService = {
  get(key) {
    try {
      return wx.getStorageSync(key) || null
    } catch (e) {
      console.error('[Storage] get error:', key, e)
      return null
    }
  },

  set(key, value) {
    try {
      wx.setStorageSync(key, value)
      return true
    } catch (e) {
      console.error('[Storage] set error:', key, e)
      return false
    }
  },

  remove(key) {
    try {
      wx.removeStorageSync(key)
      return true
    } catch (e) {
      console.error('[Storage] remove error:', key, e)
      return false
    }
  },

  /**
   * 保存媒体文件到本地
   * 云开发时改为上传到云存储
   */
  saveFile(tempFilePath) {
    return new Promise((resolve, reject) => {
      wx.saveFile({
        tempFilePath,
        success: (res) => resolve(res.savedFilePath),
        fail: (err) => {
          console.error('[Storage] saveFile error:', err)
          resolve(tempFilePath)
        }
      })
    })
  },

  getFileUrl(fileId) {
    return fileId
  }
}

module.exports = StorageService
