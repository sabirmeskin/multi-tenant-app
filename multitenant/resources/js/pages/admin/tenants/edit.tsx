import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Building2, AlertCircle } from 'lucide-react';

interface Props {
    tenant: {
        id: string;
        name: string;
        domains: string[];
    };
}

export default function Edit({ tenant }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: tenant.name,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/tenants/${tenant.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Tenant" />

            <div className="container mx-auto py-8 px-4 max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin/tenants">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Tenants
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Tenant</h1>
                    <p className="text-muted-foreground mt-1">
                        Update tenant information
                    </p>
                </div>

                {/* Form Card */}
                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tenant Details</CardTitle>
                            <CardDescription>
                                Modify the tenant name and view current domains
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Tenant Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className={errors.name ? 'border-destructive' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            {/* Current Domains Display */}
                            <div className="space-y-2">
                                <Label>Current Domains</Label>
                                <div className="flex flex-wrap gap-2">
                                    {tenant.domains.map((domain, index) => (
                                        <Badge key={index} variant="secondary" className="font-mono">
                                            {domain}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Domain Notice */}
                            <Alert variant="default">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Domain Management</AlertTitle>
                                <AlertDescription>
                                    Domain changes are not supported in this version. If you need to modify domains,
                                    please contact support or create a new tenant.
                                </AlertDescription>
                            </Alert>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-3">
                            <Link href="/admin/tenants">
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                <Building2 className="mr-2 h-4 w-4" />
                                {processing ? 'Updating...' : 'Update Tenant'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
