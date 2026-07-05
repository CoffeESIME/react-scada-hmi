'use client';

import { useParams } from 'next/navigation';
import { ScreenEditor } from '@/app/components/screens/ScreenEditor';

export default function EditScreenPage() {
    const params = useParams();
    return <ScreenEditor screenId={params.id as string} />;
}
