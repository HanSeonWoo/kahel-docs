import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useConfig } from '../hooks/use-config';
import { useAppStore } from '../store/app-store';
import { Home, ChevronRight, FileText, Calendar, Menu, X, Clock, List } from 'lucide-react';
import { TableOfContents } from '../components/TableOfContents';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { config } = useConfig();
  const navigate = useNavigate();
  const { setCurrentDocument } = useAppStore();
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = localStorage.getItem('sidebarOpen');
    return stored !== null ? stored === 'true' : true;
  });
  const [tocOpen, setTocOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const category = config?.categories.find((cat) => cat.id === categoryId);

  // localStorage에 사이드바 상태 저장
  useEffect(() => {
    localStorage.setItem('sidebarOpen', String(sidebarOpen));
  }, [sidebarOpen]);

  // 첫 번째 문서 자동 로드
  useEffect(() => {
    if (category && category.documents.length > 0 && !selectedDocId) {
      const firstDoc = category.documents[0];
      setSelectedDocId(firstDoc.id);
      setCurrentDocument(firstDoc.id);
    }
  }, [category, selectedDocId, setCurrentDocument]);

  // 키보드 네비게이션 (Escape로 사이드바/목차 닫기)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (tocOpen) {
          setTocOpen(false);
        } else if (sidebarOpen) {
          setSidebarOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, tocOpen]);

  // 사이드바 문서 리스트 키보드 네비게이션
  const handleDocumentKeyDown = (
    e: React.KeyboardEvent,
    currentIndex: number,
    docId: string
  ) => {
    if (!category) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.min(currentIndex + 1, category.documents.length - 1);
      const nextDoc = category.documents[nextIndex];
      setSelectedDocId(nextDoc.id);
      setCurrentDocument(nextDoc.id);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = Math.max(currentIndex - 1, 0);
      const prevDoc = category.documents[prevIndex];
      setSelectedDocId(prevDoc.id);
      setCurrentDocument(prevDoc.id);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedDocId(docId);
      setCurrentDocument(docId);
      setSidebarOpen(false);
    }
  };

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

  const sidebarClass = `w-80 bg-card border-r border-border overflow-y-auto fixed md:relative left-0 z-50 h-full transform transition-transform duration-300 ease-in-out md:block shadow-xl md:shadow-none ${
    sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
  } bg-white dark:bg-[#1a1a1a] md:bg-card`;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* 헤더 */}
      <header className="bg-card border-b border-border px-4 md:px-6 py-4 relative z-[60]" role="banner">
        <nav className="flex items-center justify-between gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-muted rounded transition-colors"
              aria-label={sidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link
              to="/"
              className="hover:text-foreground transition-colors flex items-center gap-2 px-1"
              aria-label="홈으로 이동"
            >
              <Home className="w-6 h-6" aria-hidden="true" />
              <span>kahel-docs</span>
            </Link>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
            <span className="text-foreground font-medium" aria-current="page">{category.name}</span>
          </div>
          {selectedDoc && (
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className="xl:hidden p-1 hover:bg-muted rounded transition-colors"
              aria-label={tocOpen ? '목차 닫기' : '목차 열기'}
              aria-expanded={tocOpen}
            >
              <List className="w-5 h-5" />
            </button>
          )}
        </nav>
      </header>

      {/* 메인 컨텐츠 - 2-pane 레이아웃 */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile overlays */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {tocOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 xl:hidden"
            onClick={() => setTocOpen(false)}
          />
        )}

        {/* 왼쪽: 문서 리스트 */}
        <aside 
          className={sidebarClass} 
          role="complementary" 
          aria-label="문서 목록"
          style={{ backgroundColor: 'hsl(var(--card))' }}
        >
          <div className="p-6">
            <div className="mb-6">
              <h2 className="font-semibold text-lg text-foreground">
                {category.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1" aria-live="polite">
                {category.documents.length}개의 문서
              </p>
            </div>

            <nav className="space-y-2" aria-label="카테고리 문서">
              {category.documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground text-sm">문서가 없습니다</p>
                </div>
              ) : (
                category.documents.map((doc, index) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setCurrentDocument(doc.id);
                      setSidebarOpen(false);
                    }}
                    onKeyDown={(e) => handleDocumentKeyDown(e, index, doc.id)}
                    aria-label={`${doc.title} 문서 열기`}
                    aria-current={selectedDocId === doc.id ? 'page' : undefined}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      selectedDocId === doc.id
                        ? 'bg-primary/10 border-l-4 border-primary shadow-sm'
                        : 'border-l-3 border-muted hover:border-muted-foreground hover:bg-muted/30 hover:translate-x-0.5'
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
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {formatDistanceToNow(new Date(doc.date), {
                                addSuffix: true,
                                locale: ko,
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>5분 읽기</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </nav>
          </div>
        </aside>

        {/* 중앙: iframe 문서 표시 */}
        <main className="flex-1 overflow-hidden bg-background" role="main" aria-label="문서 내용">
          {selectedDoc ? (
            <iframe
              ref={iframeRef}
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

        {/* 오른쪽: 목차 */}
        {selectedDoc && (
          <TableOfContents 
            iframeRef={iframeRef} 
            isOpen={tocOpen}
            onClose={() => setTocOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
