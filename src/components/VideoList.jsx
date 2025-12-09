import { useState, useMemo } from 'react';
import VideoCard from './VideoCard';
import { getInsights } from '../utils/insights';

const VideoList = ({ videos }) => {
  const [sortBy, setSortBy] = useState('quality');

  const sortedVideos = useMemo(() => {
    if (!videos || videos.length === 0) return [];

    const videosWithScores = videos.map(video => ({
      ...video,
      qualityScore: parseFloat(getInsights(video, null).qualityScore)
    }));

    const sorted = [...videosWithScores].sort((a, b) => {
      switch (sortBy) {
        case 'quality':
          return b.qualityScore - a.qualityScore;
        case 'views':
          return b.viewCount - a.viewCount;
        case 'likes':
          return b.likeCount - a.likeCount;
        case 'comments':
          return b.commentCount - a.commentCount;
        case 'date':
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        default:
          return 0;
      }
    });

    return sorted;
  }, [videos, sortBy]);

  if (!videos || videos.length === 0) {
    return (
      <div className="empty-state">
        <p>검색 결과가 없습니다.</p>
        <p>다른 키워드로 검색해보세요.</p>
      </div>
    );
  }

  return (
    <div className="video-list-container">
      <div className="list-header">
        <div className="results-info">
          <h2>검색 결과: {videos.length}개 영상</h2>
        </div>
        <div className="sort-controls">
          <label htmlFor="sort-select">정렬:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="quality">품질 점수 높은 순</option>
            <option value="views">조회수 많은 순</option>
            <option value="likes">좋아요 많은 순</option>
            <option value="comments">댓글 많은 순</option>
            <option value="date">최신순</option>
          </select>
        </div>
      </div>

      <div className="video-grid">
        {sortedVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoList;
