import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

            <div className="tenant-form-container">
                <div className="form-header">
                    <h1>Edit Tenant</h1>
                    <p>Update tenant information</p>
                </div>

                <form onSubmit={submit} className="tenant-form">
                    <div className="form-card">
                        <div className="form-group">
                            <Label htmlFor="name">Tenant Name</Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="info-box">
                            <div className="info-icon">🔒</div>
                            <div className="info-content">
                                <h4>Domain Settings</h4>
                                <p><strong>Current Domains:</strong> {tenant.domains.join(', ')}</p>
                                <p className="mt-2">Domain changes are not supported in this version. Contact support if you need to modify domains.</p>
                            </div>
                        </div>

                        <div className="form-actions">
                            <a href="/admin/tenants" className="btn btn-secondary">
                                Cancel
                            </a>
                            <Button className="ms-4" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Tenant'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
