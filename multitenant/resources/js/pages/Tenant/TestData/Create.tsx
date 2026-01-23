import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Test Data',
        href: '/test-data',
    },
    {
        title: 'Create',
        href: '/test-data/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        message: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/test-data');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Test Data" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl mx-auto w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Data</CardTitle>
                        <CardDescription>
                            Add a new message to the tenant database.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Input
                                    id="message"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Enter a message..."
                                />
                                {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                            </div>

                            <div className="flex justify-end gap-2">
                                <Link href="/test-data">
                                    <Button variant="outline" type="button">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    Save
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
