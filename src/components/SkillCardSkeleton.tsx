import { Skeleton } from '@/components/ui/skeleton';

export function SkillCardSkeleton() {
  return (
    <div className="h-full border border-zinc-200 rounded-xl">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full mb-1.5" />
        <Skeleton className="h-3 w-2/3 mb-4" />
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}
