import { useState, useEffect } from 'react';
import { formatNumber, formatDate, formatDuration, getInsights } from '../utils/insights';
import youtubeApi from '../services/youtubeApi';

const VideoCard = ({ video }) => {
  const [channelStats, setChannelStats] = useState(null);
  const [insights, setInsights] = useState(null);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    const fetchChannelStats = async () => {
      try {
        const stats = await youtubeApi.getChannelDetails(video.channelId);
        setChannelStats(stats);
        const videoInsights = getInsights(video, stats);
        setInsights(videoInsights);
      } catch (error) {
        console.error('채널 통계 가져오기 실패:', error);
      }
    };

    if (video.channelId) {
      fetchChannelStats();
    }
  }, [video]);

  const handleCardClick = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  const handleInsightsClick = (e) => {
    e.stopPropagation();
    setShowInsights(!showInsights);
  };

  return (
    <div className="video-card" onClick={handleCardClick}>
      <div className="video-thumbnail">
        <img src={video.thumbnail} alt={video.title} />
        <div className="video-duration">{formatDuration(video.duration)}</div>
        {insights && (
          <div
            className="quality-badge"
            style={{ backgroundColor: insights.performance.color }}
          >
            {insights.performance.level} {insights.qualityScore}
          </div>
        )}
      </div>

      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-channel">{video.channelTitle}</p>
        {channelStats && (
          <p className="channel-subscribers">
            구독자 {formatNumber(channelStats.subscriberCount)}명
          </p>
        )}

        <div className="video-stats">
          <div className="stat-item">
            <span className="stat-icon">👁️</span>
            <span className="stat-value">{formatNumber(video.viewCount)}</span>
            <span className="stat-label">조회</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">👍</span>
            <span className="stat-value">{formatNumber(video.likeCount)}</span>
            <span className="stat-label">좋아요</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">💬</span>
            <span className="stat-value">{formatNumber(video.commentCount)}</span>
            <span className="stat-label">댓글</span>
          </div>
        </div>

        <div className="video-meta">
          <span className="video-date">{formatDate(video.publishedAt)}</span>
          {insights && (
            <span className="engagement-rate">
              참여율: {insights.engagementRate}%
            </span>
          )}
        </div>

        <button
          className="btn-insights"
          onClick={handleInsightsClick}
        >
          {showInsights ? '인사이트 숨기기' : '인사이트 보기'}
        </button>

        {showInsights && insights && (
          <div className="insights-panel" onClick={(e) => e.stopPropagation()}>
            <h4>📊 상세 인사이트</h4>
            <div className="insights-list">
              {insights.insights.map((insight, index) => (
                <div
                  key={index}
                  className={`insight-item insight-${insight.type}`}
                >
                  {insight.message}
                </div>
              ))}
            </div>
            <div className="insights-metrics">
              <div className="metric">
                <strong>품질 점수:</strong> {insights.qualityScore}/100
              </div>
              <div className="metric">
                <strong>참여율:</strong> {insights.engagementRate}%
              </div>
              {channelStats && (
                <>
                  <div className="metric">
                    <strong>채널 총 조회수:</strong> {formatNumber(channelStats.viewCount)}
                  </div>
                  <div className="metric">
                    <strong>채널 영상 수:</strong> {formatNumber(channelStats.videoCount)}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
