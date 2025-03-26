// app/owner/invites/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

export default function InviteManager() {
    const [codes, setCodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [expiresIn, setExpiresIn] = useState('168');

    const generateCodes = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/invites/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quantity: 5,
                    expiresInHours: parseInt(expiresIn)
                })
            });

            const data = await res.json();
            if (res.ok) {
                setCodes([...data.codes, ...codes]);
                toast.success(`${data.count} codes generated`,{
                    description: `Expires in ${expiresIn} hours`
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex gap-4 items-end">
                <div className="space-y-1">
                    <label>Expiration (hours)</label>
                    <Input
                        type="number"
                        value={expiresIn}
                        onChange={(e) => setExpiresIn(e.target.value)}
                        className="w-32"
                    />
                </div>
                <Button onClick={generateCodes} disabled={loading}>
                    {loading ? 'Generating...' : 'Generate 5 Codes'}
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {codes.map((code) => (
                        <TableRow key={code}>
                            <TableCell className="font-mono">{code}</TableCell>
                            <TableCell>In {expiresIn} hours</TableCell>
                            <TableCell>Unused</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}