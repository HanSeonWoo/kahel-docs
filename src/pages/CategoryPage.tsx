import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useConfig } from '../hooks/use-config';
import { useAppStore } from '../store/app-store';
import { Home } from 'lucide-react';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { config } = useConfig();
  const navigate = useNavigate();
  const { setCurrentDocument } = useAppStore();
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const category = config?.categories.find((cat) => cat.id === categoryId);

  // 첫 번째 문서 자동 로드
  useEffect(() => {
    if (category && category.documents.length > 0 && !selectedDocId) {
      const firstDoc = category.documents[0];
      setSelectedDocId(firstDoc.id);
      setCurrentDocument(firstDoc.id);
    }
  }, [category, selectedDocId, setCurrentDocument]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600">카테고리를 찾을 수 없습니다</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const selectedDoc = category.documents.find((doc) => doc.id === selectedDocId);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-gray-100">
            <Home size={16} />
          </Link>
          <span>›</span>
          <Link to="/" className="hover:text-gray-900 dark:hover:text-gray-100">
            Docs Hub
          </Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-gray-100">{category.name}</span>
        </div>
      </header>

      {/* 메인 컨텐츠 - 2-pane 레이아웃 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽: 문서 리스트 */}
        <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4 space-y-2">
            <h2 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
              {category.name} 문서
            </h2>
            {category.documents.length === 0 ? (
              <p className="text-gray-500 text-sm">문서가 없습니다</p>
            ) : (
              category.documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    setCurrentDocument(doc.id);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedDocId === doc.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {doc.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{doc.date}</p>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* 오른쪽: iframe 문서 표시 */}
        <main className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
          {selectedDoc ? (
            <iframe
              key={selectedDoc.id}
              src={`/docs/${selectedDoc.path}`}
              className="w-full h-full border-none"
              title={selectedDoc.title}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              문서를 선택하세요
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
