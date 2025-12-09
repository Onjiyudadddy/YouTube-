// YouTube 비디오 인사이트 분석 유틸리티

export const calculateEngagementRate = (video) => {
  if (!video.viewCount || video.viewCount === 0) return 0;
  const engagements = (video.likeCount || 0) + (video.commentCount || 0);
  return ((engagements / video.viewCount) * 100).toFixed(2);
};

export const calculateQualityScore = (video, channelStats) => {
  // 품질 점수 계산 (0-100)
  let score = 0;

  // 조회수 점수 (최대 30점)
  const viewScore = Math.min((video.viewCount / 1000000) * 30, 30);
  score += viewScore;

  // 참여율 점수 (최대 30점)
  const engagementRate = parseFloat(calculateEngagementRate(video));
  const engagementScore = Math.min(engagementRate * 6, 30);
  score += engagementScore;

  // 좋아요 비율 (최대 20점)
  if (video.viewCount > 0) {
    const likeRatio = (video.likeCount / video.viewCount) * 100;
    const likeScore = Math.min(likeRatio * 200, 20);
    score += likeScore;
  }

  // 댓글 활성도 (최대 20점)
  if (video.viewCount > 0) {
    const commentRatio = (video.commentCount / video.viewCount) * 100;
    const commentScore = Math.min(commentRatio * 200, 20);
    score += commentScore;
  }

  return Math.min(score, 100).toFixed(1);
};

export const getPerformanceLevel = (score) => {
  if (score >= 80) return { level: '최고', color: '#22c55e' };
  if (score >= 60) return { level: '우수', color: '#3b82f6' };
  if (score >= 40) return { level: '양호', color: '#f59e0b' };
  if (score >= 20) return { level: '보통', color: '#ef4444' };
  return { level: '낮음', color: '#9ca3af' };
};

export const formatDuration = (duration) => {
  // ISO 8601 duration을 읽기 쉬운 형식으로 변환 (PT1H30M15S -> 1:30:15)
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  const parts = [];
  if (hours) parts.push(hours);
  parts.push(minutes ? minutes.padStart(2, '0') : '00');
  parts.push(seconds ? seconds.padStart(2, '0') : '00');

  return parts.join(':');
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return '오늘';
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
  return `${Math.floor(diffDays / 365)}년 전`;
};

export const getInsights = (video, channelStats) => {
  const engagementRate = calculateEngagementRate(video);
  const qualityScore = calculateQualityScore(video, channelStats);
  const performance = getPerformanceLevel(parseFloat(qualityScore));

  const insights = [];

  // 조회수 인사이트
  if (video.viewCount > 1000000) {
    insights.push({
      type: 'success',
      message: `높은 조회수: ${formatNumber(video.viewCount)} 조회`
    });
  }

  // 참여율 인사이트
  if (parseFloat(engagementRate) > 5) {
    insights.push({
      type: 'success',
      message: `높은 참여율: ${engagementRate}%`
    });
  } else if (parseFloat(engagementRate) < 1) {
    insights.push({
      type: 'warning',
      message: `낮은 참여율: ${engagementRate}%`
    });
  }

  // 좋아요 인사이트
  if (video.viewCount > 0) {
    const likeRatio = (video.likeCount / video.viewCount) * 100;
    if (likeRatio > 3) {
      insights.push({
        type: 'success',
        message: `높은 좋아요 비율: ${likeRatio.toFixed(2)}%`
      });
    }
  }

  // 댓글 인사이트
  if (video.commentCount > 1000) {
    insights.push({
      type: 'info',
      message: `활발한 토론: ${formatNumber(video.commentCount)} 댓글`
    });
  }

  // 최신성 인사이트
  const publishedDays = Math.ceil((new Date() - new Date(video.publishedAt)) / (1000 * 60 * 60 * 24));
  if (publishedDays < 7) {
    insights.push({
      type: 'info',
      message: '최신 콘텐츠'
    });
  }

  return {
    qualityScore: parseFloat(qualityScore),
    performance,
    engagementRate: parseFloat(engagementRate),
    insights
  };
};
