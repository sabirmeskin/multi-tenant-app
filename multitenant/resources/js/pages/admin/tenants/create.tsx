import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

            <div className="tenant-form-container">
                <div className="form-header">
                    <h1>Create New Tenant</h1>
                    <p>Set up a new tenant with its own database and domain</p>
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
                            <p className="field-hint">The display name for this tenant</p>
                        </div>

                        <div className="form-group">
                            <Label htmlFor="domain">Domain</Label>
                            <Input
                                id="domain"
                                type="text"
                                name="domain"
                                value={data.domain}
                                className="mt-1 block w-full"
                                autoComplete="off"
                                onChange={(e) => setData('domain', e.target.value)}
                                placeholder="tenant1.localhost"
                                required
                            />
                            <InputError message={errors.domain} className="mt-2" />
                            <p className="field-hint">
                                Domain for this tenant (use *.localhost for local testing)
                            </p>
                        </div>

                        <div className="info-box">
                            <div className="info-icon">ℹ️</div>
                            <div className="info-content">
                                <h4>What happens when you create a tenant?</h4>
                                <ul>
                                    <li>A new PostgreSQL database will be created</li>
                                    <li>All necessary migrations will be run</li>
                                    <li>Test data will be inserted for verification</li>
                                    <li>The domain will be mapped to the tenant</li>
                                </ul>
                            </div>
                        </div>

                        <div className="form-actions">
                            <a href="/admin/tenants" className="btn btn-secondary">
                                Cancel
                            </a>
                            <Button className="ms-4" disabled={processing}>
                                {processing ? 'Creating Tenant...' : 'Create Tenant'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
