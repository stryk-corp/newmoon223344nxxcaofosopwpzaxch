'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserTable } from '@/components/admin/user-table';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { useFirestore } from '@/firebase';

export default function AdminPage() {
  const firestore = useFirestore();
  const { data: users, loading } = useCollection<User>(firestore ? collection(firestore, 'users') : null);

  if (loading) {
    return <div>Loading...</div>
  }

  const allUsers = users || [];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Admin Dashboard</h1>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Monitor and manage all user accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <UserTable users={allUsers} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Manage global settings for the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Withdrawals</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to request withdrawals of their tokens.
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>
               <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable New Registrations</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to sign up for the platform.
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
