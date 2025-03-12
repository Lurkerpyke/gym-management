'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'
import Link from 'next/link'

type User = {
    id: string
    name: string | null
    email: string | null
    role: string
    createdAt: Date
}

const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
            const role = row.getValue('role') as string
            return (
                <span className={`px-2 py-1 rounded text-xs font-medium ${role === 'owner' ? 'bg-purple-100 text-purple-800' :
                        role === 'admin' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                    }`}>
                    {role}
                </span>
            )
        }
    },
    {
        accessorKey: 'createdAt',
        header: 'Joined',
        cell: ({ row }) => new Date(row.getValue<Date>('createdAt')).toLocaleDateString()
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const user = row.original
            const [loading, setLoading] = useState(false)
            const { data: session } = useSession()

            const updateRole = async (newRole: string) => {
                setLoading(true)
                try {
                    const response = await fetch('/api/admin/users', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: user.id, role: newRole })
                    })

                    if (!response.ok) throw new Error('Failed to update role')

                    toast.success(`${user.email}'s role updated to ${newRole}`)
                } catch (error) {
                    toast.error('Failed to update role')
                } finally {
                    setLoading(false)
                }
            }

            const deleteUser = async () => {
                if (!window.confirm(`Tem certeza que deseja deletar ${user.email}?`)) return

                setLoading(true)
                try {
                    const response = await fetch('/api/admin/users', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: user.email })
                    })

                    if (!response.ok) throw new Error('Failed to delete user')

                    toast.success(`Usuário ${user.email} deletado`)
                    // setUsers(prev => prev.filter(u => u.email !== user.email))
                } catch (error) {
                    toast.error('Falha ao deletar usuário')
                } finally {
                    setLoading(false)
                }
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => updateRole('admin')}
                            disabled={loading || user.role === 'admin'}
                        >
                            Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => updateRole('user')}
                            disabled={loading || user.role === 'user'}
                        >
                            Make User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => updateRole('owner')}
                            disabled={loading || user.role === 'owner'}
                        >
                            Make Owner
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={deleteUser}
                            disabled={loading || user.email === session?.user?.email}
                            className="text-destructive focus:bg-destructive/10"
                        >
                            Deletar Usuário
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

// ... rest of the component remains the same ...

export default function OwnerManagement() {
    const { data: session, status } = useSession()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'loading') return
        if (session?.user?.role !== 'owner') {
            redirect('/')
            return
        }

        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/admin/users')
                if (!response.ok) throw new Error('Failed to fetch users')
                const data = await response.json()
                setUsers(data)
            } catch (error) {
                toast('Failed to fetch users')
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [status, session, toast])

    if (status === 'loading') {
        return (
            <div className="container mx-auto p-4 space-y-4">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle>User Management</CardTitle>
                    <Button variant="outline" asChild>
                        <Link href="/owner">
                            Voltar para o Dashboard
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={users}
                        loading={loading}
                        searchKey="email"
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Signups</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {users.slice(0, 5).map(user => (
                            <div key={user.id} className="flex items-center justify-between p-2">
                                <div>
                                    <p className="font-medium">{user.name || user.email}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Joined {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}