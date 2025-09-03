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

// Mock data for reports
const mockDailyData = {
  "2024-01-03": {
    total_amount: 2450.0,
    total_transactions: 67,
    cash_amount: 1200.0,
    card_amount: 850.0,
    cheque_amount: 300.0,
    online_amount: 100.0,
    status: "closed",
    opened_by: "Admin User",
    closed_by: "Admin User",
    opened_at: "2024-01-03T08:00:00Z",
    closed_at: "2024-01-03T18:30:00Z",
  },
  "2024-01-04": {
    total_amount: 1875.0,
    total_transactions: 52,
    cash_amount: 950.0,
    card_amount: 625.0,
    cheque_amount: 200.0,
    online_amount: 100.0,
    status: "open",
    opened_by: "Admin User",
    closed_by: null,
    opened_at: "2024-01-04T08:00:00Z",
    closed_at: null,
  },
}

const mockCategoryData = [
  { name: "General Donation", amount: 1200.0, count: 25, percentage: 35 },
  { name: "Zakat", amount: 800.0, count: 15, percentage: 23 },
  { name: "Sadaqah", amount: 600.0, count: 18, percentage: 17 },
  { name: "Building Fund", amount: 500.0, count: 8, percentage: 15 },
  { name: "Education Fund", amount: 350.0, count: 6, percentage: 10 },
]

const mockWeeklyTrend = [
  { date: "Mon", amount: 1200 },
  { date: "Tue", amount: 1800 },
  { date: "Wed", amount: 2200 },
  { date: "Thu", amount: 1600 },
  { date: "Fri", amount: 3200 },
  { date: "Sat", amount: 2800 },
  { date: "Sun", amount: 2400 },
]

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [dailyData, setDailyData] = useState(null)
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [alert, setAlert] = useState({ show: false, type: "", message: "" })

  // Fetch daily collection data
  const fetchDailyData = async (date: string) => {
    try {
      // Mock API call - in real app this would fetch from /api/daily-collections
      const data = mockDailyData[date] || {
        total_amount: 0,
        total_transactions: 0,
        cash_amount: 0,
        card_amount: 0,
        cheque_amount: 0,
        online_amount: 0,
        status: "open",
        opened_by: "System",
        closed_by: null,
        opened_at: new Date().toISOString(),
        closed_at: null,
      }
      setDailyData(data)
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
      // Mock API call - in real app this would call /api/daily-collections
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setDailyData((prev) => ({
        ...prev,
        status: "closed",
        closed_by: "Current User",
        closed_at: new Date().toISOString(),
      }))

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
    const csvContent = `Date,Total Amount,Transactions,Cash,Card,Cheque,Online,Status
${selectedDate},${dailyData?.total_amount || 0},${dailyData?.total_transactions || 0},${dailyData?.cash_amount || 0},${dailyData?.card_amount || 0},${dailyData?.cheque_amount || 0},${dailyData?.online_amount || 0},${dailyData?.status || "open"}`

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
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Jummah Masjid</h1>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="/prayer-times" className="text-foreground hover:text-primary transition-colors">
                Prayer Times
              </a>
              <a href="/notices" className="text-foreground hover:text-primary transition-colors">
                Notice Board
              </a>
              <a href="/sanda-collection" className="text-foreground hover:text-primary transition-colors">
                SANDA Collection
              </a>
              <a href="/reports" className="text-primary font-medium">
                Reports
              </a>
              <a href="/import" className="text-foreground hover:text-primary transition-colors">
                Import Families
              </a>
              <a href="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </a>
              <a href="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </nav>
        </div>
      </header>

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
                    ${dailyData?.total_amount?.toFixed(2) || "0.00"}
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
                    $
                    {dailyData?.total_transactions
                      ? (dailyData.total_amount / dailyData.total_transactions).toFixed(2)
                      : "0.00"}
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
                  ) : (
                    <Lock className="w-5 h-5 text-red-600" />
                  )}
                  <Badge
                    variant={dailyData?.status === "open" ? "default" : "secondary"}
                    className={dailyData?.status === "open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {dailyData?.status === "open" ? "Open" : "Closed"}
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
                      <div className="font-bold">${dailyData?.cash_amount?.toFixed(2) || "0.00"}</div>
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
                      <span className="font-medium">Card</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${dailyData?.card_amount?.toFixed(2) || "0.00"}</div>
                      <div className="text-sm text-muted-foreground">
                        {dailyData?.total_amount
                          ? ((dailyData.card_amount / dailyData.total_amount) * 100).toFixed(1)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">Cheque</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${dailyData?.cheque_amount?.toFixed(2) || "0.00"}</div>
                      <div className="text-sm text-muted-foreground">
                        {dailyData?.total_amount
                          ? ((dailyData.cheque_amount / dailyData.total_amount) * 100).toFixed(1)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <span className="font-medium">Online</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${dailyData?.online_amount?.toFixed(2) || "0.00"}</div>
                      <div className="text-sm text-muted-foreground">
                        {dailyData?.total_amount
                          ? ((dailyData.online_amount / dailyData.total_amount) * 100).toFixed(1)
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
                  Donation Categories
                </CardTitle>
                <CardDescription>Top donation categories this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCategoryData.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{category.name}</span>
                        <span className="text-sm font-bold">${category.amount.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{category.count} donations</span>
                        <span>{category.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Trend */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Weekly Collection Trend
                </CardTitle>
                <CardDescription>Daily collection amounts for the current week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2 h-40">
                    {mockWeeklyTrend.map((day, index) => {
                      const maxAmount = Math.max(...mockWeeklyTrend.map((d) => d.amount))
                      const height = (day.amount / maxAmount) * 100
                      return (
                        <div key={index} className="flex flex-col items-center justify-end">
                          <div
                            className="w-full bg-primary rounded-t-md transition-all duration-300 hover:bg-primary/80 min-h-[20px]"
                            style={{ height: `${height}%` }}
                            title={`${day.date}: $${day.amount}`}
                          ></div>
                          <span className="text-xs text-muted-foreground mt-2">{day.date}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {mockWeeklyTrend.map((day, index) => (
                      <div key={index} className="text-xs font-medium">
                        ${(day.amount / 1000).toFixed(1)}k
                      </div>
                    ))}
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
                      <Label className="text-sm font-medium">Opened By</Label>
                      <div className="text-sm text-muted-foreground">{dailyData?.opened_by || "N/A"}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Opened At</Label>
                      <div className="text-sm text-muted-foreground">
                        {dailyData?.opened_at ? new Date(dailyData.opened_at).toLocaleString() : "N/A"}
                      </div>
                    </div>
                    {dailyData?.status === "closed" && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Closed By</Label>
                          <div className="text-sm text-muted-foreground">{dailyData?.closed_by || "N/A"}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Closed At</Label>
                          <div className="text-sm text-muted-foreground">
                            {dailyData?.closed_at ? new Date(dailyData.closed_at).toLocaleString() : "N/A"}
                          </div>
                        </div>
                      </>
                    )}
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
                                    ${dailyData?.total_amount?.toFixed(2) || "0.00"}
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
    </div>
  )
}
