import { Link } from 'react-router-dom';
import { useConfig } from '../hooks/use-config';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { FileText, Home as HomeIcon } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <HomeIcon size={16} />
            <span>Docs Hub</span>
            <span>›</span>
            <span>홈</span>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* 카테고리 섹션 */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            기술 스택 카테고리
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config?.categories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`}>
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {category.name}
                      <span className="text-sm text-gray-500">
                        {category.documentCount}개 문서
                      </span>
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <Separator />

        {/* 최근 문서 섹션 */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            최근 업데이트된 문서
          </h2>
          <div className="space-y-3">
            {config?.recentDocuments.map((doc) => (
              <Link
                key={doc.id}
                to={`/category/${doc.category}`}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <FileText size={20} className="text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {doc.title}
                  </p>
                  <p className="text-sm text-gray-500">{doc.category}</p>
                </div>
                <span className="text-sm text-gray-400">{doc.date}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
