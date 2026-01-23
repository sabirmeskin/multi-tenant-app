import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Trash2, Edit } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Test Data',
        href: '/test-data',
    },
];

export default function Index({ data }: { data: any[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Test Data" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Test Data</h1>
                    <Link href="/test-data/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create New
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Manage Test Data</CardTitle>
                        <CardDescription>
                            Create, read, update, and delete test data for this tenant.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                No test data found. Create one to get started.
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50 text-left hover:bg-muted/50">
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">ID</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Message</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Tenant ID</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item) => (
                                            <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle">{item.id}</td>
                                                <td className="p-4 align-middle">{item.message}</td>
                                                <td className="p-4 align-middle font-mono text-xs">{item.tenant_identifier}</td>
                                                <td className="p-4 align-middle space-x-2">
                                                    <Link href={`/test-data/${item.id}/edit`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link 
                                                        href={`/test-data/${item.id}`} 
                                                        method="delete" 
                                                        as="button"
                                                        preserveScroll
                                                        onSuccess={() => console.log('Deleted')}
                                                    >
                                                        <Button variant="ghost" size="icon" className="text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
