import { useParams, Link, useNavigate } from 'react-router-dom';
import { useConfig } from '../hooks/use-config';
import { Home, ChevronRight, FileText, Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { config } = useConfig();
  const navigate = useNavigate();

  const category = config?.categories.find((cat) => cat.id === categoryId);

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

  return (
    <div className="min-h-screen bg-background">
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
          <span className="text-foreground font-medium" aria-current="page">
            {category.name}
          </span>
        </nav>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12" role="main">
        {/* 카테고리 정보 */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {category.name}
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            {category.description}
          </p>
          <p className="text-sm text-muted-foreground">
            {category.documents.length}개의 문서
          </p>
        </div>

        {/* 문서 리스트 */}
        {category.documents.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">문서가 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {category.documents.map((doc) => (
              <Link
                key={doc.id}
                to={`/category/${categoryId}/doc/${doc.id}`}
                className="group"
              >
                <article className="bg-card border border-border rounded-lg p-6 h-full hover:border-primary/30 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start gap-3 mb-3">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {doc.title}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                    {doc.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
