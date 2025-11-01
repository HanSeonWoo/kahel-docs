import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useConfig } from '../hooks/use-config';
import { useAppStore } from '../store/app-store';
import { Home, ChevronRight, FileText, Calendar, Menu, X } from 'lucide-react';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { config } = useConfig();
  const navigate = useNavigate();
  const { setCurrentDocument } = useAppStore();
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">카테고리를 찾을 수 없습니다</p>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const selectedDoc = category.documents.find((doc) => doc.id === selectedDocId);

  const sidebarClass = `w-80 bg-card border-r border-border overflow-y-auto fixed md:relative left-0 z-40 h-full transform transition-transform duration-300 ease-in-out md:block ${
    sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
  }`;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* 헤더 */}
      <header className="bg-card border-b border-border px-4 md:px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1 hover:bg-muted rounded transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link
            to="/"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            to="/"
            className="hover:text-foreground transition-colors"
          >
            Docs Hub
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{category.name}</span>
        </div>
      </header>

      {/* 메인 컨텐츠 - 2-pane 레이아웃 */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 왼쪽: 문서 리스트 */}
        <aside className={sidebarClass}>
          <div className="p-6">
            <div className="mb-6">
              <h2 className="font-semibold text-lg text-foreground">
                {category.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {category.documents.length}개의 문서
              </p>
            </div>

            <div className="space-y-2">
              {category.documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground text-sm">문서가 없습니다</p>
                </div>
              ) : (
                category.documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setCurrentDocument(doc.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                      selectedDocId === doc.id
                        ? 'bg-primary/10 border-l-4 border-primary shadow-sm'
                        : 'hover:bg-muted/50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        selectedDocId === doc.id ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium leading-snug mb-1 ${
                          selectedDocId === doc.id ? 'text-primary' : 'text-foreground'
                        }`}>
                          {doc.title}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {doc.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span className="tabular-nums">{doc.date}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* 오른쪽: iframe 문서 표시 */}
        <main className="flex-1 overflow-hidden bg-background">
          {selectedDoc ? (
            <iframe
              key={selectedDoc.id}
              src={`/docs/${selectedDoc.path}`}
              className="w-full h-full border-none"
              title={selectedDoc.title}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">문서를 선택하세요</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
