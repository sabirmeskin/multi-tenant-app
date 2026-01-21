import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Building2, Info } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        domain: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/tenants');
    };

    return (
        <AppLayout>
            <Head title="Create Tenant" />

            <div className="container mx-auto py-8 px-4 max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin/tenants">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Tenants
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Create New Tenant</h1>
                    <p className="text-muted-foreground mt-1">
                        Set up a new tenant with its own database and domain
                    </p>
                </div>

                {/* Form Card */}
                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tenant Information</CardTitle>
                            <CardDescription>
                                Enter the details for your new tenant
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
                                    placeholder="e.g., Acme Corporation"
                                    required
                                    className={errors.name ? 'border-destructive' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    The display name for this tenant
                                </p>
                            </div>

                            {/* Domain Field */}
                            <div className="space-y-2">
                                <Label htmlFor="domain">
                                    Domain <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="domain"
                                    type="text"
                                    value={data.domain}
                                    onChange={(e) => setData('domain', e.target.value)}
                                    placeholder="tenant1.localhost"
                                    required
                                    className={`font-mono ${errors.domain ? 'border-destructive' : ''}`}
                                />
                                {errors.domain && (
                                    <p className="text-sm text-destructive">{errors.domain}</p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    Use *.localhost for local development testing
                                </p>
                            </div>

                            {/* Info Alert */}
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>What happens when you create a tenant?</AlertTitle>
                                <AlertDescription>
                                    <ul className="mt-2 space-y-1 text-sm">
                                        <li>• A new PostgreSQL database will be created</li>
                                        <li>• All necessary migrations will be run</li>
                                        <li>• Test data will be inserted for verification</li>
                                        <li>• The domain will be mapped to the tenant</li>
                                    </ul>
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
                                {processing ? 'Creating...' : 'Create Tenant'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
