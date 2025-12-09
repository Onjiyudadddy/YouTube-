import { useState } from 'react';

const SearchBar = ({ onSearch, isLoading }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim() && !isLoading) {
      onSearch(keyword.trim());
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div className="search-input-group">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색할 키워드를 입력하세요 (예: React Tutorial, 유튜브 마케팅)"
            className="search-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn-search"
            disabled={isLoading || !keyword.trim()}
          >
            {isLoading ? '검색 중...' : '검색'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
