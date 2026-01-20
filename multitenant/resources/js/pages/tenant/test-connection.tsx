import { Head } from '@inertiajs/react';

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
    test_data: Array<{
        id: number;
        message: string;
        tenant_identifier: string;
        created_at: string;
    }>;
}

export default function TestConnection({ tenant, database_info, test_data }: Props) {
    return (
        <>
            <Head title="Tenant Connection Test" />

            <div className="test-connection-page">
                <div className="test-container">
                    <div className="test-header">
                        <h1>🔗 Tenant Database Connection Test</h1>
                        <p>Verify that you're connected to the correct tenant database</p>
                    </div>

                    {tenant ? (
                        <>
                            <div className="info-card success">
                                <h2>✅ Tenant Identified</h2>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="label">Tenant ID:</span>
                                        <span className="value">{tenant.id}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Tenant Name:</span>
                                        <span className="value ">
                                            {tenant.name}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Domains:</span>
                                        <span className="value">{tenant.domains.join(', ')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="info-card">
                                <h2>💾 Database Information</h2>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="label">Database Name:</span>
                                        <span className="value code">{database_info.database}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Connection:</span>
                                        <span className="value code">{database_info.connection}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="info-card">
                                <h2>📊 Test Data from Tenant Database</h2>
                                {test_data.length > 0 ? (
                                    <div className="test-data">
                                        {test_data.map((item) => (
                                            <div key={item.id} className="test-data-item">
                                                <div className="test-data-header">
                                                    <span className="test-data-id">Record #{item.id}</span>
                                                    <span className="test-data-date">{item.created_at}</span>
                                                </div>
                                                <div className="test-data-message">{item.message}</div>
                                                <div className="test-data-footer">
                                                    <span className="label">Tenant Identifier:</span>
                                                    <span className="value code">{item.tenant_identifier}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-data">No test data found in this tenant's database</p>
                                )}
                            </div>

                            <div className="success-message">
                                <div className="success-icon">🎉</div>
                                <h3>Multi-Tenancy is Working!</h3>
                                <p>
                                    This page is showing data from the <strong>{tenant.name}</strong> tenant's
                                    database. Each tenant has their own isolated database, ensuring complete
                                    data separation.
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="info-card error">
                            <h2>❌ No Tenant Identified</h2>
                            <p>Could not identify the current tenant. Make sure you're accessing this page from a tenant domain.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
