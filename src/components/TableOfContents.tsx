import { useEffect, useState } from 'react';
import { List, X } from 'lucide-react';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  isOpen?: boolean;
  onClose?: () => void;
}

export function TableOfContents({ iframeRef, isOpen = false, onClose }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const extractHeadings = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;

        const headings = iframeDoc.querySelectorAll('h1, h2, h3');
        const items: TocItem[] = [];

        headings.forEach((heading, index) => {
          const level = parseInt(heading.tagName[1]);
          let id = heading.id;

          // ID가 없으면 생성
          if (!id) {
            id = `heading-${index}`;
            heading.id = id;
          }

          items.push({
            id,
            text: heading.textContent || '',
            level,
          });
        });

        setTocItems(items);

        // 헤딩 추출 후 첫 번째 헤딩을 활성화
        if (items.length > 0) {
          setActiveId(items[0].id);
        }
      } catch (error) {
        console.error('Error extracting headings:', error);
      }
    };

    // iframe 로드 완료 후 헤딩 추출
    const handleLoad = () => {
      extractHeadings();
    };

    iframe.addEventListener('load', handleLoad);

    // 이미 로드된 경우
    if (iframe.contentDocument?.readyState === 'complete') {
      extractHeadings();
    }

    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [iframeRef]);

  // 스크롤 스파이 기능 구현
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || tocItems.length === 0) return;

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      // IntersectionObserver 옵션: 상단 20% 지점에서 감지
      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      };

      // 현재 보이는 헤딩들을 추적
      const visibleHeadings = new Map<string, number>();

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          const id = entry.target.id;

          if (entry.isIntersecting) {
            // 보이는 헤딩: intersectionRatio 저장
            visibleHeadings.set(id, entry.intersectionRatio);
          } else {
            // 안 보이는 헤딩: 제거
            visibleHeadings.delete(id);
          }
        });

        // 가장 많이 보이는 헤딩을 활성화
        if (visibleHeadings.size > 0) {
          let maxRatio = 0;
          let activeHeadingId = '';

          // tocItems 순서대로 확인하여 가장 위쪽의 보이는 헤딩 선택
          for (const item of tocItems) {
            const ratio = visibleHeadings.get(item.id);
            if (ratio !== undefined && ratio > maxRatio) {
              maxRatio = ratio;
              activeHeadingId = item.id;
            }
          }

          if (activeHeadingId) {
            setActiveId(activeHeadingId);
          }
        }
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);

      // 모든 헤딩 관찰 시작
      tocItems.forEach((item) => {
        const element = iframeDoc.getElementById(item.id);
        if (element) {
          observer.observe(element);
        }
      });

      return () => {
        observer.disconnect();
      };
    } catch (error) {
      console.error('Error setting up scroll spy:', error);
    }
  }, [tocItems, iframeRef]);

  const scrollToHeading = (id: string) => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      const element = iframeDoc.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveId(id);
        // 모바일에서 목차 아이템 클릭 시 드로어 닫기
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Error scrolling to heading:', error);
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <aside 
      className={`
        fixed xl:relative top-0 right-0 h-full 
        w-80 max-w-[85vw] xl:w-64 xl:max-w-none
        bg-card border-l border-border 
        overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        z-50 xl:z-auto
        shadow-2xl xl:shadow-none
        ${isOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
        xl:block
      `}
      role="complementary"
      aria-label="목차"
    >
      <div className="p-6 sticky top-0 bg-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm text-foreground uppercase tracking-wide">
              목차
            </h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="xl:hidden p-1 hover:bg-muted rounded transition-colors"
              aria-label="목차 닫기"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
        <nav className="space-y-1">
          {tocItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`
                block w-full text-left text-sm py-1.5 px-2 rounded transition-all duration-200
                hover:bg-muted/50 hover:text-foreground
                ${activeId === item.id ? 'text-primary font-medium bg-primary/10' : 'text-muted-foreground'}
                ${item.level === 1 ? 'pl-2' : item.level === 2 ? 'pl-4' : 'pl-6'}
              `}
            >
              {item.text}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
