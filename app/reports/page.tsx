"use client"

import { useState, useEffect } from "react"
import { Calendar, DollarSign, TrendingUp, Receipt, Download, Lock, Unlock, BarChart3, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { AuthGuard } from "@/components/auth-guard"

export default function ReportsPage() {
  type DailyDataType = {
    total_amount: number
    total_transactions: number
    cash_amount: number
    bank_amount: number
    opened_at: string | null
    status: string
  }

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [dailyData, setDailyData] = useState<DailyDataType | null>(null)
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [alert, setAlert] = useState({ show: false, type: "", message: "" })

  // Fetch daily collection data
  const fetchDailyData = async (date: string) => {
    try {
      const response = await fetch(`/api/reports?date=${encodeURIComponent(date)}`)
      const result = await response.json()
      if (result.success) {
        setDailyData(result.data)
      } else {
        setDailyData({
          total_amount: 0,
          total_transactions: 0,
          cash_amount: 0,
          bank_amount: 0,
          opened_at: null,
          status: "no-activity",
        })
      }
    } catch (error) {
      console.error("Error fetching daily data:", error)
      showAlert("error", "Failed to fetch daily collection data")
    }
  }

  // Show alert message
  const showAlert = (type: string, message: string) => {
    setAlert({ show: true, type, message })
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000)
  }

  // Close daily collection
  const closeDailyCollection = async () => {
    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setDailyData((prev) => prev ? ({
        ...prev,
        status: "closed",
      }) : prev)

      showAlert("success", "Daily collection closed successfully")
      setIsCloseDialogOpen(false)
    } catch (error) {
      console.error("Error closing daily collection:", error)
      showAlert("error", "Failed to close daily collection")
    } finally {
      setIsProcessing(false)
    }
  }

  // Export daily report
  const exportDailyReport = () => {
    const csvContent = `Date,Total Amount (LKR),Transactions,Cash (LKR),Bank Transfer (LKR),Status
${selectedDate},${dailyData?.total_amount || 0},${dailyData?.total_transactions || 0},${dailyData?.cash_amount || 0},${dailyData?.bank_amount || 0},${dailyData?.status || "no-activity"}`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `daily-report-${selectedDate}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    showAlert("success", "Report exported successfully")
  }

  useEffect(() => {
    fetchDailyData(selectedDate)
  }, [selectedDate])

  return (
    <AuthGuard>
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <Header />

      {/* Alert Messages */}
      {alert.show && (
        <div className="container mx-auto px-4 pt-4">
          <Alert className={alert.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <AlertDescription className={alert.type === "success" ? "text-green-800" : "text-red-800"}>
              {alert.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Page Header */}
      <section className="py-8 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-2">Daily Reports Dashboard</h2>
              <p className="text-xl text-muted-foreground">
                Collection summaries, analytics, and daily close management
              </p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
              <Button onClick={exportDailyReport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Daily Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">
                    LKR {dailyData?.total_amount?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">{dailyData?.total_transactions || 0}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Average Donation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">
                    LKR
                    {dailyData?.total_transactions
                      ? " " + (dailyData.total_amount / dailyData.total_transactions).toFixed(2)
                      : " 0.00"}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Collection Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {dailyData?.status === "open" ? (
                    <Unlock className="w-5 h-5 text-green-600" />
                  ) : dailyData?.status === "no-activity" ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Lock className="w-5 h-5 text-red-600" />
                  )}
                  <Badge
                    variant={dailyData?.status === "open" ? "default" : "secondary"}
                    className={dailyData?.status === "open" ? "bg-green-100 text-green-800" : dailyData?.status === "no-activity" ? "bg-gray-100 text-gray-600" : "bg-red-100 text-red-800"}
                  >
                    {dailyData?.status === "open" ? "Active" : dailyData?.status === "no-activity" ? "No Activity" : "Closed"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reports Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Method Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Payment Method Breakdown
                </CardTitle>
                <CardDescription>Distribution of payment methods for {selectedDate}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Cash</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">LKR {dailyData?.cash_amount?.toFixed(2) || "0.00"}</div>
                      <div className="text-sm text-muted-foreground">
                        {dailyData?.total_amount
                          ? ((dailyData.cash_amount / dailyData.total_amount) * 100).toFixed(1)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">Bank Transfer</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">LKR {dailyData?.bank_amount?.toFixed(2) || "0.00"}</div>
                      <div className="text-sm text-muted-foreground">
                        {dailyData?.total_amount
                          ? ((dailyData.bank_amount / dailyData.total_amount) * 100).toFixed(1)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Payment Summary
                </CardTitle>
                <CardDescription>Payment method breakdown for {selectedDate}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">Cash Payments</span>
                      <span className="text-sm font-bold">LKR {dailyData?.cash_amount?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${dailyData?.total_amount ? ((dailyData.cash_amount / dailyData.total_amount) * 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">Bank Transfers</span>
                      <span className="text-sm font-bold">LKR {dailyData?.bank_amount?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${dailyData?.total_amount ? ((dailyData.bank_amount / dailyData.total_amount) * 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Summary */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Daily Summary
                </CardTitle>
                <CardDescription>Collection summary for {selectedDate}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Cash</div>
                    <div className="text-xl font-bold text-green-700">LKR {dailyData?.cash_amount?.toFixed(2) || "0.00"}</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Bank Transfer</div>
                    <div className="text-xl font-bold text-blue-700">LKR {dailyData?.bank_amount?.toFixed(2) || "0.00"}</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Transactions</div>
                    <div className="text-xl font-bold text-purple-700">{dailyData?.total_transactions || 0}</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Total</div>
                    <div className="text-xl font-bold text-amber-700">LKR {dailyData?.total_amount?.toFixed(2) || "0.00"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Close Management */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Daily Collection Management
                </CardTitle>
                <CardDescription>Manage daily collection opening and closing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Selected Date</Label>
                      <div className="text-sm text-muted-foreground">{selectedDate}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">First Transaction</Label>
                      <div className="text-sm text-muted-foreground">
                        {dailyData?.opened_at ? new Date(dailyData.opened_at).toLocaleString() : "No transactions"}
                      </div>
                    </div>
                  </div>

                  {dailyData?.status === "open" && (
                    <div className="pt-4 border-t border-border">
                      <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full">
                            <Lock className="w-4 h-4 mr-2" />
                            Close Daily Collection
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Close Daily Collection</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to close the daily collection for {selectedDate}? This action cannot
                              be undone and will prevent further donations from being recorded for this date.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Total Amount:</span>
                                  <div className="text-lg font-bold text-primary">
                                    LKR {dailyData?.total_amount?.toFixed(2) || "0.00"}
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium">Total Transactions:</span>
                                  <div className="text-lg font-bold text-primary">
                                    {dailyData?.total_transactions || 0}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsCloseDialogOpen(false)}
                                className="flex-1"
                                disabled={isProcessing}
                              >
                                Cancel
                              </Button>
                              <Button onClick={closeDailyCollection} className="flex-1" disabled={isProcessing}>
                                {isProcessing ? "Closing..." : "Close Collection"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  {dailyData?.status === "closed" && (
                    <div className="pt-4 border-t border-border">
                      <Alert>
                        <Lock className="h-4 w-4" />
                        <AlertDescription>
                          This daily collection has been closed. No further donations can be recorded for {selectedDate}
                          .
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
    </AuthGuard>
  )
}
