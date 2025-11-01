import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useConfig } from '../hooks/use-config';
import { Home, ChevronRight } from 'lucide-react';

export function DocumentPage() {
  const { categoryId, docId } = useParams<{ categoryId: string; docId: string }>();
  const { config } = useConfig();
  const navigate = useNavigate();
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const category = config?.categories.find((cat) => cat.id === categoryId);
  const document = category?.documents.find((doc) => doc.id === docId);

  useEffect(() => {
    if (!document) return;

    const fetchHtml = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/docs/${document.path}`);

        if (!response.ok) {
          throw new Error('문서를 불러올 수 없습니다');
        }

        const html = await response.text();
        setHtmlContent(html);
      } catch (err) {
        setError(err instanceof Error ? err.message : '문서 로딩 중 오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchHtml();
  }, [document]);

  if (!category || !document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">문서를 찾을 수 없습니다</p>
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 헤더 */}
      <header className="bg-card border-b border-border px-4 md:px-6 py-4" role="banner">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link
            to="/"
            className="hover:text-foreground transition-colors flex items-center gap-2"
            aria-label="홈으로 이동"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            <span>kahel-docs</span>
          </Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <Link
            to={`/category/${categoryId}`}
            className="hover:text-foreground transition-colors"
          >
            {category.name}
          </Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-foreground font-medium" aria-current="page">
            {document.title}
          </span>
        </nav>
      </header>

      {/* 문서 표시 */}
      <main className="flex-1 bg-background" role="main">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">문서를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div
            className="document-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </main>
    </div>
  );
}
