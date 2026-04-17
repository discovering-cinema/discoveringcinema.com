import Byline from '@/app/components/Byline';
import { Title } from '@/app/components/Title';
import { Subtitle } from '@/app/components/Subtitle';
import { TitleLockup } from '@/app/components/TitleLockup';

interface ArticleHeaderProps {
  title: string;
  subtitle?: string;
  author: string;
  date?: Date | string;
  readingTime?: number;
}

export default function ArticleHeader({
  title,
  subtitle,
  author,
  date,
  readingTime,
}: ArticleHeaderProps) {
  return (
    <header className="mb-12 text-center">
      <TitleLockup>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TitleLockup>
      {date && readingTime !== undefined && (
        <div className="mt-6">
          <Byline
            author={author}
            date={date}
            readingTime={readingTime}
            centered
          />
        </div>
      )}
    </header>
  );
}
