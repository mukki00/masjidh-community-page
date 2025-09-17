"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Users,
  DollarSign,
  Receipt,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Plus,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function SandaCollectionPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFamily, setSelectedFamily] = useState<FamilyType | null>(null)
  type FamilyType = {
    id: string
    family_id: string
    family_name: string
    head_of_family: string
    phone: string
    email?: string
    address: string
    membership_status: string
    members?: any[]
    total_donations?: number
    last_donation?: string
    // Add other fields as needed
  }
  const [families, setFamilies] = useState<FamilyType[]>([])
  type DonationCategoryType = {
    id: number
    name: string
    // Add other fields if needed
  }
  const [donationCategories, setDonationCategories] = useState<DonationCategoryType[]>([])
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [alert, setAlert] = useState({ show: false, type: "", message: "" })
  const [lastReceiptNumber, setLastReceiptNumber] = useState("")
  const [dailyStats, setDailyStats] = useState({
    total_families: 2500,
    todays_collections: 1250,
    receipts_issued: 45,
    status: "open",
  })
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    category: "",
    payment_method: "",
    notes: "",
  })
  const [familyIdInput, setFamilyIdInput] = useState("")
  type FamilyDetailsType = {
    family_id: string
    family_name: string
    head_of_family: string
    phone: string
    address: string
    arrears: number
    amount_due: number
    arrears_per_month: { [month: string]: number }
    // Add other fields as needed
  }
  const [familyDetails, setFamilyDetails] = useState<FamilyDetailsType | null>(null)
  const [familyError, setFamilyError] = useState("")

  // Fetch families from API
  const fetchFamilies = async (search = "") => {
    try {
      const url = search ? `/api/families?search=${encodeURIComponent(search)}` : "/api/families"
      const response = await fetch(url)
      const result = await response.json()

      if (result.success) {
        setFamilies(result.data)
      }
    } catch (error) {
      console.error("Error fetching families:", error)
      showAlert("error", "Failed to fetch families")
    }
  }

  // Fetch donation categories
  const fetchDonationCategories = async () => {
    try {
      const response = await fetch("/api/donation-categories")
      const result = await response.json()

      if (result.success) {
        setDonationCategories(result.data)
      }
    } catch (error) {
      console.error("Error fetching donation categories:", error)
    }
  }

  // Show alert message
  const showAlert = (type: string, message: string) => {
    setAlert({ show: true, type, message })
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000)
  }

  // Download receipt as PDF
  const downloadReceipt = async (receiptNumber: string) => {
    try {
      const response = await fetch(`/api/receipts/${receiptNumber}?format=pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `receipt-${receiptNumber}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        showAlert("success", "Receipt downloaded successfully")
      } else {
        showAlert("error", "Failed to download receipt")
      }
    } catch (error) {
      console.error("Error downloading receipt:", error)
      showAlert("error", "Failed to download receipt")
    }
  }

  // View receipt in new window
  const viewReceipt = async (receiptNumber: string) => {
    try {
      const response = await fetch(`/api/receipts/${receiptNumber}`)
      const result = await response.json()

      if (result.success) {
        const newWindow = window.open("", "_blank")
        if (newWindow) {
          newWindow.document.write(result.data.receipt_html)
          newWindow.document.close()
        }
      } else {
        showAlert("error", "Failed to view receipt")
      }
    } catch (error) {
      console.error("Error viewing receipt:", error)
      showAlert("error", "Failed to view receipt")
    }
  }

  // Handle payment submission
  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)

    if (!familyDetails) {
      showAlert("error", "Please enter a valid Family ID.")
      setIsProcessing(false)
      return
    }

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          family_id: familyDetails.family_id, // Use familyDetails here
          amount: Number.parseFloat(paymentForm.amount),
          category_id: Number.parseInt(paymentForm.category),
          payment_method: paymentForm.payment_method,
          notes: paymentForm.notes,
          collected_by: "Current User", // In real app, get from auth
        }),
      })

      const result = await response.json()

      if (result.success) {
        const receiptNumber = result.data.donation.receipt_number
        setLastReceiptNumber(receiptNumber)
        showAlert("success", `Donation processed successfully! Receipt: ${receiptNumber}`)
        setIsPaymentDialogOpen(false)
        setPaymentForm({ amount: "", category: "", payment_method: "", notes: "" })

        // Update daily stats
        setDailyStats((prev) => ({
          ...prev,
          todays_collections: prev.todays_collections + Number.parseFloat(paymentForm.amount),
          receipts_issued: prev.receipts_issued + 1,
        }))

        // Refresh families to update donation totals
        fetchFamilies(searchTerm)
      } else {
        showAlert("error", result.error || "Failed to process donation")
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      showAlert("error", "Failed to process donation")
    } finally {
      setIsProcessing(false)
    }
  }

  // Fetch family details by ID
  const fetchFamilyDetails = async (familyId: string) => {
    if (!familyId) {
      setFamilyDetails(null)
      setFamilyError("")
      return
    }
    try {
      const response = await fetch(`/api/families/${familyId}`)
      const result = await response.json()
      if (result.success && result.data) {
        setFamilyDetails(result.data)
        setFamilyError("")
      } else {
        setFamilyDetails(null)
        setFamilyError("Family ID not found. Please check and try again.")
      }
    } catch {
      setFamilyDetails(null)
      setFamilyError("Family ID not found. Please check and try again.")
    }
  }

  // Watch familyIdInput changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchFamilyDetails(familyIdInput)
    }, 400)
    return () => clearTimeout(timeoutId)
  }, [familyIdInput])

  // Search families with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchFamilies(searchTerm)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Initial data fetch
  useEffect(() => {
    fetchFamilies()
    fetchDonationCategories()
  }, [])

  // Button label logic
  const getButtonLabel = () => {
    if (paymentForm.payment_method === "cash") return "Collect Cash"
    if (paymentForm.payment_method === "bank") return "Verify Receipt"
    return "Collect"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <Header />

      {/* Alert Messages */}
      {alert.show && (
        <div className="container mx-auto px-4 pt-4">
          <Alert className={alert.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {alert.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={alert.type === "success" ? "text-green-800" : "text-red-800"}>
              {alert.message}
              {alert.type === "success" && lastReceiptNumber && (
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => viewReceipt(lastReceiptNumber)}
                    className="text-green-700 border-green-300 hover:bg-green-100"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Receipt
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadReceipt(lastReceiptNumber)}
                    className="text-green-700 border-green-300 hover:bg-green-100"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download PDF
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Page Header */}
      <section className="py-8 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-4">SANDA Collection System</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Family search, donation processing, and receipt management for our community
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Families</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">
                    {dailyStats.total_families.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Today's Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl mr-1">💵</span>
                  <span className="text-2xl font-bold text-foreground">
                    LKR {dailyStats.todays_collections.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Receipts Issued</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-secondary" />
                  <span className="text-2xl font-bold text-foreground">{dailyStats.receipts_issued}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Active Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {dailyStats.status === "open" ? "Open" : "Closed"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Family Search Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-4">Family Search</h3>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search by family name, ID, head of family, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Family Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {families.map((family) => (
              <Card key={family.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-card-foreground">{family.family_name}</CardTitle>
                      <CardDescription className="text-sm">
                        ID: {family.family_id} • Head: {family.head_of_family}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={family.membership_status === "active" ? "default" : "secondary"}
                      className={family.membership_status === "active" ? "bg-green-100 text-green-800" : ""}
                    >
                      {family.membership_status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {family.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {family.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {family.address}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {family.members?.length || 0} members
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Total Donations:</span>
                        <span className="font-semibold text-primary">
                          ${family.total_donations?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-muted-foreground">Last Donation:</span>
                        <span className="text-sm">{family.last_donation || "Never"}</span>
                      </div>
                      <div className="flex gap-2">
                        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              className="flex-1"
                              onClick={() => setSelectedFamily(family)}
                              disabled={isProcessing}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              New Donation
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Process Donation</DialogTitle>
                              <DialogDescription>
                                Recording donation for {selectedFamily?.family_name}
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handlePaymentSubmit} className="space-y-4">
                              <div>
                                <Label htmlFor="amount">Amount ($)</Label>
                                <Input
                                  id="amount"
                                  type="number"
                                  step="0.01"
                                  min="0.01"
                                  placeholder="0.00"
                                  value={paymentForm.amount}
                                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                  required
                                  disabled={isProcessing}
                                />
                              </div>
                              <div>
                                <Label htmlFor="category">Donation Category</Label>
                                <Select
                                  value={paymentForm.category}
                                  onValueChange={(value) => setPaymentForm({ ...paymentForm, category: value })}
                                  disabled={isProcessing}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {donationCategories.map((category) => (
                                      <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="payment_method">Payment Method</Label>
                                <Select
                                  value={paymentForm.payment_method}
                                  onValueChange={(value) => setPaymentForm({ ...paymentForm, payment_method: value })}
                                  disabled={isProcessing}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                                    <SelectItem value="cheque">Cheque</SelectItem>
                                    <SelectItem value="online">Online Transfer</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="notes">Notes (Optional)</Label>
                                <Textarea
                                  id="notes"
                                  placeholder="Additional notes..."
                                  value={paymentForm.notes}
                                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                                  disabled={isProcessing}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setIsPaymentDialogOpen(false)}
                                  className="flex-1"
                                  disabled={isProcessing}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit" className="flex-1" disabled={isProcessing}>
                                  {isProcessing ? "Processing..." : "Process & Generate Receipt"}
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          View History
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {families.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No families found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Collection Form Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-2xl bg-card rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-primary">SANDA Collection Form</h2>
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Family ID</label>
              <input
                type="text"
                name="family_id"
                value={familyIdInput}
                onChange={e => setFamilyIdInput(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
              {/* Show error if Family ID is incorrect */}
              {familyIdInput && familyError && (
                <div className="text-red-600 text-sm mt-2">{familyError}</div>
              )}
            </div>
            {/* Show family details only if Family ID is entered and details exist */}
            {familyIdInput && familyDetails && (
              <div className="bg-gradient-to-br from-green-50 via-white to-green-100 rounded-xl p-4 mb-4 shadow border border-green-200">
                <div className="flex flex-col md:flex-row md:items-center md:gap-8 mb-2">
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-green-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      {familyDetails.family_name}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium text-green-700">Head of Family:</span> {familyDetails.head_of_family}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <Phone className="inline w-4 h-4 mr-1 text-green-600" />
                      {familyDetails.phone}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <MapPin className="inline w-4 h-4 mr-1 text-green-600" />
                      {familyDetails.address}
                    </div>
                  </div>
                  <div className="flex-1 mt-4 md:mt-0">
                    <div className="bg-green-100 rounded-lg p-3">
                      <div className="font-semibold text-green-800 mb-2">Arrears Per Month:</div>
                      <ul className="ml-4 list-disc text-green-700 text-sm">
                        {Object.entries(familyDetails.arrears_per_month).map(([month, amount]) => (
                          <li key={month}>
                            <span className="font-medium">{month}:</span> LKR {amount}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-8 mt-2">
                  <div className="flex-1">
                    <div className="text-base font-semibold text-green-900">
                      <span className="text-green-700">Total Arrears:</span> <span className="ml-2">LKR {familyDetails.arrears}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-semibold text-green-900">
                      <span className="text-green-700">Amount Due:</span> <span className="ml-2">LKR {familyDetails.amount_due}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Amount Received (LKR)</label>
              <input
                type="number"
                name="amount"
                value={paymentForm.amount}
                onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                name="payment_method"
                value={paymentForm.payment_method}
                onChange={e => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="notes"
                value={paymentForm.notes}
                onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primary/90"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : getButtonLabel()}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
