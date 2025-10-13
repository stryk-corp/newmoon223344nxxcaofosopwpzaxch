'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const withdrawalSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive.'),
  walletAddress: z.string().min(2, 'Wallet address is required.'),
});

export default function WithdrawPage() {
  const [withdrawalsEnabled] = useState(true); // Admin-controlled toggle
  const { toast } = useToast();

  const form = useForm<z.infer<typeof withdrawalSchema>>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 0,
      walletAddress: '',
    },
  });

  function onSubmit(values: z.infer<typeof withdrawalSchema>) {
    // In a real app, this would be a server action
    console.log(values);
    toast({
      title: 'Withdrawal Request Submitted',
      description: `Your request to withdraw ${values.amount.toLocaleString()} tokens to ${values.walletAddress} is being processed.`,
    });
    form.reset();
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Withdraw</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Request Withdrawal</CardTitle>
          <CardDescription>
            Enter the amount you wish to withdraw and your Solana wallet address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!withdrawalsEnabled ? (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Withdrawals Disabled</AlertTitle>
              <AlertDescription>
                Withdrawals are temporarily disabled by the administrator. Please check back later.
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10000" {...field} />
                      </FormControl>
                      <FormDescription>
                        The amount of tokens to withdraw.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solana Wallet Address</FormLabel>
                      <FormControl>
                        <Input placeholder="So1ana...Wallet...Address" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ensure this is a valid Solana (SPL) wallet address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Request Withdrawal</Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
