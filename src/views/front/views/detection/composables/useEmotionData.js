export const emotionAdvice = {
  happy: {
    label: '开心',
    color: '#FFD700',
    bgColor: 'rgba(255, 215, 0, 0.15)',
    description: '你看起来心情愉快。',
    suggestions: [
      '保持这份积极的心态，与身边的人分享你的好心情。',
      '适当运动可以延续愉悦感，散步或伸展都很适合。',
      '记录此刻的状态，之后可以回顾这些正向时刻。'
    ],
    actionLabel: '享受当下'
  },
  sad: {
    label: '悲伤',
    color: '#5C9CE6',
    bgColor: 'rgba(92, 156, 230, 0.15)',
    description: '你看起来有些低落。',
    suggestions: [
      '深呼吸，给自己一点时间和空间。',
      '可以和信任的朋友或家人聊聊你的感受。',
      '听舒缓音乐或进行轻度户外活动，帮助身体慢慢放松。',
      '如果低落持续较久并影响生活，建议寻求专业心理支持。'
    ],
    actionLabel: '关爱自己'
  },
  angry: {
    label: '愤怒',
    color: '#E74C3C',
    bgColor: 'rgba(231, 76, 60, 0.15)',
    description: '你似乎有些烦躁或生气。',
    suggestions: [
      '先做几次深呼吸，让身体冷静下来。',
      '暂时离开当前情境，把注意力转移到别的事情上。',
      '写下让你生气的原因，帮助自己理清思路。',
      '运动是释放愤怒的健康方式，如快走、跑步或力量训练。'
    ],
    actionLabel: '冷静一下'
  },
  surprised: {
    label: '惊讶',
    color: '#F39C12',
    bgColor: 'rgba(243, 156, 18, 0.15)',
    description: '你看起来有些惊讶。',
    suggestions: [
      '花一点时间消化当前的信息和感受。',
      '和身边的人分享让你惊讶的事情。',
      '保持好奇心，它常常是学习和成长的开始。'
    ],
    actionLabel: '保持好奇'
  },
  fearful: {
    label: '恐惧',
    color: '#9B59B6',
    bgColor: 'rgba(155, 89, 182, 0.15)',
    description: '你看起来有些紧张或害怕。',
    suggestions: [
      '尝试腹式呼吸：吸气 4 秒，停顿 2 秒，呼气 6 秒。',
      '提醒自己：这是暂时的，我可以慢慢处理。',
      '找到安全的环境，或寻求身边人的陪伴。',
      '如果恐惧持续影响生活，请考虑寻求专业帮助。'
    ],
    actionLabel: '安抚自己'
  },
  disgusted: {
    label: '厌恶',
    color: '#27AE60',
    bgColor: 'rgba(39, 174, 96, 0.15)',
    description: '你似乎对某些事情感到反感。',
    suggestions: [
      '试着理解让你不适的原因。',
      '适当远离让你不舒服的人或环境。',
      '把注意力转向让你感到舒适和稳定的事物。',
      '整理环境或完成一个小任务，有助于重新获得掌控感。'
    ],
    actionLabel: '适当远离'
  },
  neutral: {
    label: '平静',
    color: '#95A5A6',
    bgColor: 'rgba(149, 165, 166, 0.15)',
    description: '你目前情绪比较平稳。',
    suggestions: [
      '这是专注工作或学习的好时机。',
      '可以尝试正念练习，保持内心平静。',
      '设定一个小目标并完成它，获得稳定的成就感。'
    ],
    actionLabel: '保持专注'
  }
}

export function getEmotionInfo(expression) {
  if (!expression) return emotionAdvice.neutral

  let maxEmotion = 'neutral'
  let maxValue = 0

  for (const [emotion, value] of Object.entries(expression)) {
    if (value > maxValue) {
      maxValue = value
      maxEmotion = emotion
    }
  }

  if (maxValue < 0.3) return emotionAdvice.neutral

  return emotionAdvice[maxEmotion] || emotionAdvice.neutral
}
