import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Building2, ExternalLink, Pencil, Trash2 } from 'lucide-react';

interface Tenant {
    id: string;
    created_at: string;
    domains: string[];
    data: {
        name: string;
    };
}

interface Props {
    tenants: Tenant[];
}

export default function Index({ tenants }: Props) {
    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete tenant "${name}"? This will permanently delete the tenant database and all data.`)) {
            router.delete(`/admin/tenants/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Tenant Management" />

            <div className="container mx-auto py-8 px-4 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your multi-tenant application instances
                        </p>
                    </div>
                    <Link href="/admin/tenants/create">
                        <Button size="lg">
                            <Building2 className="mr-2 h-4 w-4" />
                            Create New Tenant
                        </Button>
                    </Link>
                </div>

                {/* Tenants Grid */}
                {tenants.length === 0 ? (
                    <Alert className="border-dashed">
                        <Building2 className="h-4 w-4" />
                        <AlertTitle>No tenants yet</AlertTitle>
                        <AlertDescription className="flex flex-col gap-3">
                            <span>Create your first tenant to get started with multi-tenancy.</span>
                            <div>
                                <Link href="/admin/tenants/create">
                                    <Button>
                                        <Building2 className="mr-2 h-4 w-4" />
                                        Create Your First Tenant
                                    </Button>
                                </Link>
                            </div>
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tenants.map((tenant) => (
                            <Card key={tenant.id} className="flex flex-col hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-xl">{tenant.data?.name || 'Unnamed Tenant'}</CardTitle>
                                            <CardDescription className="font-mono text-xs">
                                                {tenant.id.substring(0, 8)}...
                                            </CardDescription>
                                        </div>
                                        <Building2 className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 space-y-4">
                                    {/* Domains */}
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Domains</p>
                                        <div className="flex flex-wrap gap-2">
                                            {tenant.domains.map((domain, index) => (
                                                <Badge key={index} variant="secondary" className="font-mono text-xs">
                                                    {domain}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Created Date */}
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Created</p>
                                        <p className="text-sm">{tenant.created_at}</p>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex flex-wrap gap-2">
                                    {tenant.domains.length > 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <a
                                                href={`http://${tenant.domains[0]}:8000/test-connection`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink className="mr-2 h-3 w-3" />
                                                Test
                                            </a>
                                        </Button>
                                    )}
                                    <Link href={`/admin/tenants/${tenant.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Pencil className="mr-2 h-3 w-3" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(tenant.id, tenant.data?.name || 'Unnamed Tenant')}
                                    >
                                        <Trash2 className="mr-2 h-3 w-3" />
                                        Delete
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
