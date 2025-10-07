import { Skeleton } from '@/Components/ui/skeleton';
import React from 'react';

const DashboardTableLoading = () => {
    return (
        <div className='space-y-3 mt-6'>
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
        </div>
    );
};

export default DashboardTableLoading;