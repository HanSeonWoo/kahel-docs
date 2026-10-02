if (window.PagefindUI) {
  new PagefindUI({
    element: '#search',
    showImages: false,
    showSubResults: true,
    pageSize: 5,
    translations: { placeholder: '제목이나 본문에서 검색', search_label: '문서 제목과 본문 검색' },
  });
} else {
  document.querySelector('#search').textContent = '검색을 불러오지 못했습니다. 페이지를 새로 고치거나 아래 문서 목록을 사용하세요.';
}
