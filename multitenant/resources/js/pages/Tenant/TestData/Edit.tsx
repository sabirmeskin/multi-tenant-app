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
        title: 'Edit',
        href: '', // Dynamic, handled by component logic or just omitted
    },
];

export default function Edit({ datum }: { datum: any }) {
    const { data, setData, put, processing, errors } = useForm({
        message: datum.message,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/test-data/${datum.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Test Data" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl mx-auto w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Data</CardTitle>
                        <CardDescription>
                            Update the message for this record.
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
                                    Update
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
