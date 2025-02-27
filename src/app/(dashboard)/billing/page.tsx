'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CheckCircle, CreditCard, DollarSign } from "lucide-react"

export default function BillingPage() {
  const invoices = [
    { id: 1, date: '2024-03-15', amount: '$49.99', status: 'paid' },
    { id: 2, date: '2024-02-15', amount: '$49.99', status: 'paid' },
    { id: 3, date: '2024-01-15', amount: '$49.99', status: 'paid' },
  ];

  const paymentMethods = [
    { id: 1, last4: '4242', brand: 'Visa', exp: '12/25' },
    { id: 2, last4: '3579', brand: 'Amex', exp: '08/24' },
  ];

  const paymentHistory = [
    { id: 1, date: '2024-03-15', amount: '$49.99', type: 'Subscription' },
    { id: 2, date: '2024-02-15', amount: '$49.99', type: 'Subscription' },
    { id: 3, date: '2024-01-15', amount: '$49.99', type: 'Subscription' },
  ];

  return (
    <div className="w-full lg:w-[calc(100vw-16rem)] h-full px-4 py-6 md:px-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Billing & Payments</h1>
          <p className="text-muted-foreground">Manage your subscription and payment methods</p>
        </div>
        <Button className="w-full md:w-auto">
          <CreditCard className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {/* Existing cards remain unchanged */}
      </div>

      {/* Enhanced Tabs Section */}
      <div className="w-full">
        <Tabs defaultValue="invoices" className="w-full">
          <div className="border-b">
            <TabsList className="w-full grid grid-cols-3 md:flex md:justify-start">
              <TabsTrigger value="invoices" className="py-2 text-sm md:text-base">Invoices</TabsTrigger>
              <TabsTrigger value="payments" className="py-2 text-sm md:text-base">Methods</TabsTrigger>
              <TabsTrigger value="history" className="py-2 text-sm md:text-base">History</TabsTrigger>
            </TabsList>
          </div>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {invoices.map((invoice) => (
                <Card key={invoice.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Invoice #{invoice.id}</CardTitle>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      <span>{invoice.date}</span>
                    </div>
                    <div className="text-2xl font-bold">{invoice.amount}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {paymentMethods.map((method) => (
                <Card key={method.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">{method.brand}</CardTitle>
                    <CreditCard className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold">•••• {method.last4}</div>
                      <div className="text-muted-foreground">Exp {method.exp}</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Set as Default
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="history" className="mt-6">
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center text-muted-foreground">
                          <CalendarDays className="mr-2 h-4 w-4" />
                          <span>{payment.date}</span>
                        </div>
                        <div className="text-lg font-medium">{payment.type}</div>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-xl font-bold">{payment.amount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}