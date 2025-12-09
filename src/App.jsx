import { useState } from 'react';
import ApiKeyInput from './components/ApiKeyInput';
import SearchBar from './components/SearchBar';
import VideoList from './components/VideoList';
import youtubeApi from './services/youtubeApi';
import './App.css';

function App() {
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchedKeyword, setSearchedKeyword] = useState('');

  const handleSearch = async (keyword) => {
    setIsLoading(true);
    setError(null);
    setSearchedKeyword(keyword);

    try {
      const results = await youtubeApi.searchVideos(keyword);
      setVideos(results);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || '검색 중 오류가 발생했습니다.');
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">📊 YouTube 분석기</h1>
          <p className="app-subtitle">
            키워드로 검색하고 인기 있는 콘텐츠를 발견하세요
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <section className="api-section">
            <h2 className="section-title">1. API 키 설정</h2>
            <ApiKeyInput onApiKeySet={setIsApiKeySet} />
          </section>

          {isApiKeySet && (
            <>
              <section className="search-section">
                <h2 className="section-title">2. 키워드 검색</h2>
                <SearchBar onSearch={handleSearch} isLoading={isLoading} />
              </section>

              {error && (
                <div className="error-message">
                  <strong>오류:</strong> {error}
                </div>
              )}

              {isLoading && (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>검색 중입니다...</p>
                </div>
              )}

              {!isLoading && videos.length > 0 && (
                <section className="results-section">
                  <h2 className="section-title">
                    3. 검색 결과 "{searchedKeyword}"
                  </h2>
                  <VideoList videos={videos} />
                </section>
              )}

              {!isLoading && searchedKeyword && videos.length === 0 && !error && (
                <div className="no-results">
                  <p>"{searchedKeyword}"에 대한 검색 결과가 없습니다.</p>
                </div>
              )}
            </>
          )}

          {!isApiKeySet && (
            <div className="welcome-message">
              <h3>YouTube 분석기에 오신 것을 환영합니다!</h3>
              <p>시작하려면 먼저 YouTube Data API v3 키를 설정해주세요.</p>
              <div className="features">
                <h4>주요 기능:</h4>
                <ul>
                  <li>✅ 키워드 기반 YouTube 영상 검색</li>
                  <li>📊 조회수, 좋아요, 댓글 수 등 주요 지표 표시</li>
                  <li>🎯 품질 점수 기반 자동 정렬</li>
                  <li>💡 각 영상별 상세 인사이트 제공</li>
                  <li>📈 채널 구독자 수 및 통계 분석</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>YouTube 분석기 - YouTube Data API v3 기반</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
