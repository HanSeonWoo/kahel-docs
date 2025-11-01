import { Link } from 'react-router-dom';
import { useConfig } from '../hooks/use-config';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { FileText, Home as HomeIcon, BookOpen, Code, Layers } from 'lucide-react';

export function HomePage() {
  const { config, loading, error } = useConfig();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">에러: {error}</p>
      </div>
    );
  }

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'python':
      case 'react':
      case 'vue':
        return <Code className="w-5 h-5" />;
      case 'tanstack-query':
      case 'webrtc':
        return <Layers className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <HomeIcon className="w-4 h-4" />
            <span className="font-medium text-foreground">Docs Hub</span>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* 헤더 섹션 */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            기술 문서 허브
          </h1>
          <p className="text-lg text-muted-foreground">
            프로젝트에 필요한 기술 문서를 카테고리별로 쉽게 찾아보세요
          </p>
        </div>

        {/* 카테고리 섹션 */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-8">
            카테고리
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config?.categories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`}>
                <Card className="group hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer h-full">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                          {getCategoryIcon(category.id)}
                        </div>
                        <CardTitle className="text-lg font-semibold">
                          {category.name}
                        </CardTitle>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                        {category.documentCount}
                      </span>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* 최근 문서 섹션 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              최근 업데이트
            </h2>
          </div>
          <div className="space-y-2">
            {config?.recentDocuments.slice(0, 5).map((doc) => (
              <Link
                key={doc.id}
                to={`/category/${doc.category}`}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/30 hover:bg-muted/30 transition-all duration-200 group"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {doc.title}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize mt-0.5">
                    {doc.category}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {doc.date}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
