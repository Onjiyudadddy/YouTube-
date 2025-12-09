import axios from 'axios';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

class YouTubeApiService {
  constructor() {
    this.apiKey = null;
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('youtube_api_key', key);
  }

  getApiKey() {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('youtube_api_key');
    }
    return this.apiKey;
  }

  async searchVideos(keyword, maxResults = 50) {
    if (!this.getApiKey()) {
      throw new Error('API 키가 설정되지 않았습니다.');
    }

    try {
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
        params: {
          key: this.getApiKey(),
          q: keyword,
          part: 'snippet',
          type: 'video',
          maxResults: maxResults,
          order: 'relevance'
        }
      });

      const videoIds = response.data.items.map(item => item.id.videoId).join(',');
      const videosData = await this.getVideoDetails(videoIds);

      return videosData;
    } catch (error) {
      console.error('YouTube API 오류:', error);
      throw error;
    }
  }

  async getVideoDetails(videoIds) {
    try {
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
        params: {
          key: this.getApiKey(),
          id: videoIds,
          part: 'snippet,statistics,contentDetails'
        }
      });

      return response.data.items.map(item => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt,
        viewCount: parseInt(item.statistics.viewCount || 0),
        likeCount: parseInt(item.statistics.likeCount || 0),
        commentCount: parseInt(item.statistics.commentCount || 0),
        duration: item.contentDetails.duration,
        tags: item.snippet.tags || []
      }));
    } catch (error) {
      console.error('비디오 상세 정보 가져오기 오류:', error);
      throw error;
    }
  }

  async getChannelDetails(channelId) {
    try {
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/channels`, {
        params: {
          key: this.getApiKey(),
          id: channelId,
          part: 'snippet,statistics'
        }
      });

      if (response.data.items.length > 0) {
        const channel = response.data.items[0];
        return {
          subscriberCount: parseInt(channel.statistics.subscriberCount || 0),
          videoCount: parseInt(channel.statistics.videoCount || 0),
          viewCount: parseInt(channel.statistics.viewCount || 0)
        };
      }
      return null;
    } catch (error) {
      console.error('채널 정보 가져오기 오류:', error);
      return null;
    }
  }
}

export default new YouTubeApiService();
