'use client';

interface ListingAboutProps {
  description: string;
  aboutTitle: string;
}

export function ListingAbout({ description, aboutTitle }: ListingAboutProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold border-b pb-4">{aboutTitle}</h2>
      <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {description}
      </p>
    </div>
  );
}
