import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Database, Server, FileText } from 'lucide-react';

interface TestData {
    id: number;
    message: string;
    tenant_identifier: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    tenant: {
        id: string;
        name: string;
        domains: string[];
    } | null;
    database_info: {
        database: string;
        connection: string;
    };
    test_data: TestData[];
}

export default function TestConnection({ tenant, database_info, test_data }: Props) {
    return (
        <div className="min-h-screen bg-background">
            <Head title="Test Connection" />

            <div className="container mx-auto py-12 px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <CheckCircle2 className="h-12 w-12 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">
                        Tenant Connection Test
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Verify multi-tenancy database isolation
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Success Alert */}
                    {tenant && (
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertTitle className="text-green-800 dark:text-green-200">
                                Multi-Tenancy Working!
                            </AlertTitle>
                            <AlertDescription className="text-green-700 dark:text-green-300">
                                You are successfully connected to the tenant's isolated database. Each tenant has its own
                                separate database with complete data isolation.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Tenant Information */}
                    {tenant ? (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Server className="h-5 w-5 text-primary" />
                                    <CardTitle>Tenant Information</CardTitle>
                                </div>
                                <CardDescription>
                                    Current tenant context and configuration
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-muted-foreground">Name</span>
                                        <span className="text-sm font-semibold">{tenant.name}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-muted-foreground">Tenant ID</span>
                                        <Badge variant="secondary" className="font-mono text-xs">
                                            {tenant.id}
                                        </Badge>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <span className="text-sm font-medium text-muted-foreground">Domains</span>
                                        <div className="flex flex-wrap gap-2">
                                            {tenant.domains.map((domain, index) => (
                                                <Badge key={index} variant="outline" className="font-mono">
                                                    {domain}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Alert variant="destructive">
                            <AlertTitle>No Tenant Context</AlertTitle>
                            <AlertDescription>
                                Unable to identify the current tenant. Please check your domain configuration.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Database Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-primary" />
                                <CardTitle>Database Connection</CardTitle>
                            </div>
                            <CardDescription>
                                Current database connection details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-muted-foreground">Database Name</span>
                                    <Badge variant="secondary" className="font-mono">
                                        {database_info.database}
                                    </Badge>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-muted-foreground">Connection</span>
                                    <Badge variant="outline" className="font-mono">
                                        {database_info.connection}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Test Data */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <CardTitle>Test Data</CardTitle>
                            </div>
                            <CardDescription>
                                Sample data from this tenant's database
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {test_data.length > 0 ? (
                                <div className="space-y-4">
                                    {test_data.map((item) => (
                                        <Card key={item.id} className="border-dashed">
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start">
                                                    <Badge variant="secondary">#{item.id}</Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(item.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="p-3 bg-muted rounded-md">
                                                    <p className="text-sm font-medium">{item.message}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>Tenant:</span>
                                                    <Badge variant="outline" className="font-mono text-xs">
                                                        {item.tenant_identifier}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Alert>
                                    <AlertDescription>
                                        No test data found in the database.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
