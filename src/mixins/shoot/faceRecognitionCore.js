import { createCanvasLoading } from './util'
import { emoticonScore as defaultEmoticonScore } from './emoticonScore.js'

export const FACE_CHECK_STATUS = {
  idle: 0,
  running: 1,
  matching: 2,
  finished: 3,
}

export const FACE_EMOTION_NAMES = [
  '正常',
  '幸福',
  '悲伤',
  '愤怒',
  '快乐',
  '害怕',
  '不满',
  '兴奋',
  '狂躁',
  '痛苦',
  '忧郁',
  '自闭',
  '自责',
  '焦虑',
  '失眠',
  '自卑',
  '受挫',
  '失恋',
]

export function createFaceData () {
  return {
    checkStatus: FACE_CHECK_STATUS.idle,
    loading: false,
    startCamera: false,
    startFace: false,
    startPhoto: false,
    lock: false,
    faceTimeObj: null,
    imgUrl: '',
    checkData: {
      img: '',
      data: null,
    },
  }
}

export function createMoodData () {
  return {
    mood1: [
      { name: '自信', value: 0, nowV: 0 },
      { name: '自我调节', value: 0, nowV: 0 },
      { name: '能量', value: 0, nowV: 0 },
      { name: '身心平衡', value: 0, nowV: 0 },
    ],
    mood2: [
      { name: '攻击性', value: 0, nowV: 0 },
      { name: '紧张', value: 0, nowV: 0 },
      { name: '压力', value: 0, nowV: 0 },
      { name: '自卑', value: 0, nowV: 0 },
    ],
    mood3: [
      { name: '抑郁', value: 0, nowV: 0 },
      { name: '神经质', value: 0, nowV: 0 },
      { name: '兴奋', value: 0, nowV: 0 },
      { name: '幸福', value: 0, nowV: 0 },
    ],
    allmoodData: [
      { name: '正面情绪', value: [] },
      { name: '负面情绪', value: [] },
      { name: '生理情绪', value: [] },
    ],
  }
}

export function resetMoodData (moodData) {
  getMoodItems(moodData).forEach((item) => {
    item.value = 0
    item.nowV = 0
  })
  if (moodData.allmoodData) {
    moodData.allmoodData.forEach((item) => {
      item.value = []
    })
  }
}

export function normalizeEmotionMap (result = []) {
  const mapObj = new Map()
  result.forEach((obj) => {
    mapObj.set(obj.class_name, +(obj.score * 100).toFixed(0))
  })

  let sum = 0
  mapObj.forEach((value) => {
    sum += value
  })
  if (!sum) {
    return mapObj
  }

  let residue = 100
  let mapIndex = 0
  const mapSize = mapObj.size
  mapObj.forEach((value, key) => {
    const ratioV = mapIndex < mapSize - 1 ? +(value / sum * 100).toFixed(0) : residue
    residue -= ratioV
    mapIndex++
    mapObj.set(key, ratioV)
  })

  return mapObj
}

export function applyMoodData (
  moodData,
  emotionMap,
  {
    scoreMap = defaultEmoticonScore,
    updateTrend = true,
    updateFinalValue = false,
  } = {}
) {
  const computedValues = {}
  emotionMap.forEach((emotionValue, emotionName) => {
    const scoreObj = scoreMap[emotionName]
    if (!scoreObj) {
      return
    }
    Object.keys(scoreObj).forEach((key) => {
      if (!(key in computedValues)) {
        computedValues[key] = 0
      }
      computedValues[key] += +(scoreObj[key] * (emotionValue / 100)).toFixed(0)
    })
  })

  getMoodItems(moodData).forEach((item) => {
    const moodValue = Math.min(computedValues[item.name] || 0, 100)
    if (updateFinalValue) {
      item.value = moodValue
    }
    item.nowV = moodValue
  })

  if (updateTrend && moodData.allmoodData) {
    moodData.allmoodData.forEach((item) => {
      if (item.value.length >= 30) {
        item.value.splice(0, 1)
      } else {
        for (let i = item.value.length; i < 30; i++) {
          item.value.push(0)
        }
      }
    })

    moodData.allmoodData[0].value.push(sumMoodValue(moodData.mood1))
    moodData.allmoodData[1].value.push(sumMoodValue(moodData.mood2))
    moodData.allmoodData[2].value.push(sumMoodValue(moodData.mood3))
  }

  return computedValues
}

export class FaceRecognitionCore {
  constructor (options = {}) {
    this.options = {
      scoreMap: defaultEmoticonScore,
      enableUserLookup: false,
      stableSuccessLimit: 5,
      stableDuration: 10000,
      manualCapture: false,
      loadingOptions: {
        color: '#3498db',
        radius: 25,
        lineWidth: 6,
        speed: 2,
      },
      // flipHorizontal: true,
      ...options,
    }

    this.faceData = options.faceData || createFaceData()
    this.moodData = options.moodData || createMoodData()
    this.canvas = null
    this.ctx = null
    this.imgWarp = new Image()
    this.loading = null
    this.successNum = 0
    this.lastSuccessTime = 0
    this.faceNullNum = 0
    this.nameNullNum = 0
    this.render = this.render.bind(this)
    this.onEmotionSuccess = this.onEmotionSuccess.bind(this)
    this.onFaceSuccess = this.onFaceSuccess.bind(this)
    this.onFaceError = this.onFaceError.bind(this)
    this.setCanvas(options.canvas)
  }

  setCanvas (canvas) {
    this.canvas = typeof canvas === 'function' ? canvas() : canvas
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null
  }

  startCapture () {
    if (this.faceData.loading || this.faceData.startCamera) {
      return
    }
    this.withLoading(1100)
    this.reset()
    this.openCamera()
  }

  restartCapture () {
    if (this.faceData.loading) {
      return
    }
    this.withLoading(1100)
    this.stopCamera()
    this.reset()
    this.openCamera()
  }

  stopCapture () {
    if (!this.faceData.startCamera) {
      this.faceData.checkStatus = FACE_CHECK_STATUS.idle
      return
    }
    this.stopCamera()
    this.faceData.checkStatus = FACE_CHECK_STATUS.idle
  }

  capturePhoto () {
    this.ensureCanvas()
    const image = this.canvas.toDataURL('image/png')
    this.faceData.checkData.img = image
    this.faceData.imgUrl = image
    this.stopCamera()
    this.faceData.checkStatus = FACE_CHECK_STATUS.finished
    const capture = {
      image,
      emotionMap: this.faceData.checkData.data,
    }
    this.options.onCapture && this.options.onCapture(capture)
    return capture
  }

  reset () {
    this.faceData.checkStatus = FACE_CHECK_STATUS.idle
    this.faceData.lock = false
    this.faceData.imgUrl = ''
    this.faceData.checkData.img = ''
    this.faceData.checkData.data = null
    this.successNum = 0
    this.lastSuccessTime = Date.now()
    this.faceNullNum = 0
    this.nameNullNum = 0
    resetMoodData(this.moodData)
  }

  openCamera () {
    if (this.faceData.startCamera) {
      return
    }
    this.ensureCanvas()
    if (!window.CameraProcessor) {
      throw new Error('CameraProcessor is not available')
    }

    this.faceData.checkStatus = FACE_CHECK_STATUS.running
    this.faceData.startCamera = true
    this.faceData.startPhoto = true
    this.loading = createCanvasLoading(this.canvas, this.options.loadingOptions)
    this.loading.start()

    window.addEventListener('videoFrameEvent', this.render)
    window.addEventListener('facialSuccessEvent', this.onFaceSuccess)
    window.addEventListener('facialErrorEvent', this.onFaceError)
    window.addEventListener('emotionSuccessEvent', this.onEmotionSuccess)
    window.CameraProcessor.StartCamera(true)
  }

  stopCamera () {
    if (!this.faceData.startCamera) {
      return
    }
    if (this.loading) {
      this.loading.stop()
      this.loading = null
    }
    this.faceData.startCamera = false
    this.faceData.startPhoto = false
    this.faceData.loading = false

    window.removeEventListener('videoFrameEvent', this.render)
    window.removeEventListener('facialSuccessEvent', this.onFaceSuccess)
    window.removeEventListener('facialErrorEvent', this.onFaceError)
    window.removeEventListener('emotionSuccessEvent', this.onEmotionSuccess)
    window.CameraProcessor && window.CameraProcessor.StopCamera()
  }

  destroy () {
    this.stopCamera()
  }

  render (e) {
    if (this.loading) {
      this.loading.stop()
      this.loading = null
    }
    const frameData = e.detail.frameData
    const blob = new Blob([new Uint8Array(frameData)], { type: 'image/jpeg' })
    const img = this.imgWarp
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(blob)
  }

  onEmotionSuccess (e) {
    const result = e.detail.data.data || []
    const emotionMap = normalizeEmotionMap(result)
    this.faceData.checkData.data = emotionMap
    const moodValues = applyMoodData(this.moodData, emotionMap, {
      scoreMap: this.options.scoreMap,
      updateTrend: true,
      updateFinalValue: true,
    })
    this.options.onMoodChange && this.options.onMoodChange({
      emotionMap,
      moodData: this.moodData,
      moodValues,
    })
  }

  onFaceSuccess (e) {
    this.successNum++
    if (this.successNum === 2) {
      this.lastSuccessTime = Date.now()
      this.faceData.lock = false
      this.options.onMessage && this.options.onMessage('识别中，请保持人脸在识别框内...', '', 5000)
    }

    if (this.options.manualCapture) {
      return
    }

    const isStable =
      Date.now() - this.lastSuccessTime > this.options.stableDuration &&
      this.successNum > this.options.stableSuccessLimit &&
      !this.faceData.lock

    if (!isStable) {
      return
    }

    this.faceData.lock = true
    this.faceData.checkStatus = FACE_CHECK_STATUS.matching
    this.faceData.checkData.img = this.canvas.toDataURL('image/png')

    const fileName = this.getFaceFileName(e)
    this.options.onCapture && this.options.onCapture({
      image: this.faceData.checkData.img,
      fileName,
      emotionMap: this.faceData.checkData.data,
    })

    if (this.options.enableUserLookup && fileName && this.options.post) {
      this.getFaceUser(fileName)
      return
    }
    this.finishCapture()
  }

  onFaceError (e) {
    const code = e.detail.data.code
    this.successNum = 0
    this.lastSuccessTime = 0

    if (code === 500) {
      this.faceNullNum++
      if (this.faceNullNum > 10) {
        this.faceNullNum = 0
        this.faceData.lock = false
        this.options.onMessage && this.options.onMessage('无法识别人脸，请确认面部无遮挡！', 'error')
      }
      return
    }

    if (code === 404) {
      this.nameNullNum++
      if (this.nameNullNum > 5) {
        this.nameNullNum = 0
        this.faceData.lock = false
        this.options.onMessage && this.options.onMessage('系统中无此人脸信息，请先录入人脸以及个人资料再识别！', 'error')
      }
    }
  }

  getFaceUser (fileName) {
    this.options.post('api/home/getUidByFace', {
      face: getFileName(fileName),
    }).then(({ data: userData }) => {
      if (this.isSuccessResponse(userData) && userData.data) {
        return this.options.post('api/module/Member/memberDetail', {
          id: userData.data.uid,
          state: 1,
        }).then(({ data }) => {
          this.options.onUser && this.options.onUser(data.data)
          this.finishCapture()
        })
      }
      this.unlockLater()
      return null
    }).catch(() => {
      this.unlockLater()
    })
  }

  finishCapture () {
    this.stopCamera()
    this.faceData.checkStatus = FACE_CHECK_STATUS.finished
    this.faceData.imgUrl = this.faceData.checkData.img
    this.options.onMessage && this.options.onMessage('人脸识别成功！', 'success')
    this.unlockLater()
  }

  unlockLater () {
    setTimeout(() => {
      this.faceData.lock = false
    }, 2000)
  }

  withLoading (time) {
    this.faceData.loading = true
    setTimeout(() => {
      this.faceData.loading = false
    }, time)
  }

  getFaceFileName (e) {
    if (this.options.getFaceFileName) {
      return this.options.getFaceFileName(e)
    }
    const name = e && e.detail && e.detail.data && e.detail.data.data
    return name ? `${name}.png` : ''
  }

  isSuccessResponse (response) {
    if (this.options.successCode !== undefined) {
      return response.code === this.options.successCode
    }
    return response.code === 0 || response.code === 200
  }

  ensureCanvas () {
    if (!this.canvas || !this.ctx) {
      this.setCanvas(this.options.canvas)
    }
    if (!this.canvas || !this.ctx) {
      throw new Error('FaceRecognitionCore requires a canvas element')
    }
  }
}

function getMoodItems (moodData) {
  return [
    ...(moodData.mood1 || []),
    ...(moodData.mood2 || []),
    ...(moodData.mood3 || []),
  ]
}

function sumMoodValue (list = []) {
  return list.reduce((sum, item) => sum + (item.nowV || 0), 0)
}

function getFileName (data) {
  return data.substring(0, data.indexOf('.'))
}
