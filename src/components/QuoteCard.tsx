import { Card, CardContent } from "@/components/ui/card";

interface QuoteCardProps {
  quote: string;
  author: string;
}

export function QuoteCard({ quote, author }: QuoteCardProps) {
  return (
    <Card className="bg-cafe text-white p-6 animate-fadeIn">
      <CardContent className="space-y-4">
        <div className="text-4xl font-canela">"</div>
        <p className="text-lg font-sfpro">{quote}</p>
        <p className="text-sm text-dun uppercase tracking-wider">— {author}</p>
      </CardContent>
    </Card>
  );
}