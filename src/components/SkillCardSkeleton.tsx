import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SkillCardSkeleton() {
  return (
    <Card className="border-gray-100">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-5 w-3/4 mb-1.5" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}
