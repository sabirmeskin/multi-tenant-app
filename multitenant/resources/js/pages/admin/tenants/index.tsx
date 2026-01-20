import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

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

            <div className="tenant-management">
                <div className="header">
                    <h1>Tenant Management</h1>
                    <Link href="/admin/tenants/create">
                        <Button>Create New Tenant</Button>
                    </Link>
                </div>

                <div className="tenants-grid">
                    {tenants.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🏢</div>
                            <h2>No Tenants Yet</h2>
                            <p>Create your first tenant to get started with multi-tenancy</p>
                            <Link href="/admin/tenants/create">
                                <Button>Create Your First Tenant</Button>
                            </Link>
                        </div>
                    ) : (
                        tenants.map((tenant) => (
                            <div key={tenant.id} className="tenant-card">
                                <div className="tenant-card-header">
                                    <h3>{tenant.data.name}</h3>
                                    <span className="tenant-id">ID: {tenant.id.substring(0, 8)}...</span>
                                </div>
                                
                                <div className="tenant-info">
                                    <div className="info-row">
                                        <span className="label">Domains:</span>
                                        <div className="domains">
                                            {tenant.domains.map((domain, index) => (
                                                <span key={index} className="domain-badge">
                                                    {domain}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="info-row">
                                        <span className="label">Created:</span>
                                        <span>{tenant.created_at}</span>
                                    </div>
                                </div>

                                <div className="tenant-actions">
                                    {tenant.domains.length > 0 && (
                                        <a
                                            href={`http://${tenant.domains[0]}:8000/test-connection`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-secondary"
                                        >
                                            Test Connection
                                        </a>
                                    )}
                                    <Link href={`/admin/tenants/${tenant.id}/edit`}>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(tenant.id, tenant.data.name)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
