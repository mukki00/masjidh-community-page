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
import { useLoading } from "@/components/loading-provider"
import { LoadingSpinner } from "@/components/ui/spinner"
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
import { group } from "console"

export default function SandaCollectionPage() {
  const { setLoading } = useLoading()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFamily, setSelectedFamily] = useState<FamilyType | null>(null)
  const [isDataLoading, setIsDataLoading] = useState(true)
  type FamilyType = {
    family_code: string
    family_name: string
    id_card_no: string
    phone: string
    sanda_amount: string
    arrears?: string
  }
  const [families, setFamilies] = useState<FamilyType[]>([])
  type DonationCategoryType = {
    id: number
    name: string
    // Add other fields if needed
  }
  const [donationCategories, setDonationCategories] = useState<DonationCategoryType[]>([])
  const [slideIndex, setSlideIndex] = useState(0)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFamilyCode, setSelectedFamilyCode] = useState<string | null>(null)
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
    family_code: string
    family_name: string
    id_card_no: string
    phone: string
    sanda_amount: string
    arrears?: number
  }
  const [familyDetails, setFamilyDetails] = useState<FamilyDetailsType | null>(null)
  const [familyError, setFamilyError] = useState("")

  // Fetch families from API
  const fetchFamilies = async (search = "") => {
    try {
      if (!search) setIsDataLoading(true)
      const url = search ? `/api/families?search=${encodeURIComponent(search)}` : "/api/families"
      const response = await fetch(url)
      const result = await response.json()

      if (result.success) {
        setFamilies(result.data)
      }else {
        setFamilies([])
      }
    } catch (error) {
      console.error("Error fetching families:", error)
      showAlert("error", "Failed to fetch families")
    } finally {
      if (!search) setIsDataLoading(false)
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
    setLoading(true, "Processing payment...")

    if (!familyDetails) {
      showAlert("error", "Please enter a valid Family ID.")
      setIsProcessing(false)
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          family_code: familyDetails.family_code, // Use familyDetails here
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
      setLoading(false)
    }
  }

  // Fetch family details by ID
  const fetchFamilyDetails = async (family_code: string) => {
    if (!family_code) {
      setFamilyDetails(null)
      setFamilyError("")
      return
    }
    try {
      const response = await fetch(`/api/families/${family_code}`)
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
    fetchFamilyDetails(familyIdInput)
  }, [familyIdInput])

  // Search families
  useEffect(() => {
    fetchFamilies(searchTerm)
  }, [searchTerm])

  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true, "Loading SANDA Collection data...")
      try {
        await Promise.all([
          fetchFamilies(),
          fetchDonationCategories()
        ])
      } finally {
        setLoading(false)
      }
    }
    
    loadInitialData()
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
          <div>
            {isDataLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner text="Loading families..." />
              </div>
            ) : families.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm ? "No families found matching your search." : "No families available."}
              </div>
            ) : (
              (() => {
                // chunk families into slides of 2
                // const slides: FamilyType[][] = []
                // for (let i = 0; i < families.length; i += 2) slides.push(families.slice(i, i + 3))
                const CARD_WIDTH = 320 // matches w-80
                const GAP = 36 // gap-6 ~= 24px
                const visibleCount = 3
                const maxIndex = Math.max(0, families.length - visibleCount)
                const prev = () => setSlideIndex((s) => Math.max(0, s - 1))
                const next = () => setSlideIndex((s) => Math.min(maxIndex, s + 1))

                return (
                  <div className="relative">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Showing families</div>
                    </div>

                    {/* big slider viewport */}
                    <div className="relative overflow-hidden h-96 sm:h-80 md:h-96 lg:h-[28rem]">
                      {/* left control (overlayed) */}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20">
                        <Button variant="ghost" size="icon" className="h-50 w-10" onClick={prev} disabled={slideIndex === 0} aria-label="Previous slide">
                          ‹
                        </Button>
                      </div>
                      {/* right control (overlayed) */}
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20">
                        <Button variant="ghost" size="icon" className="h-50 w-10" onClick={next} disabled={slideIndex >= maxIndex} aria-label="Next slide">
                          ›
                        </Button>
                      </div>

                      <div
                        className="flex transition-transform duration-300 h-full"
                        style={{ transform: `translateX(-${slideIndex * (CARD_WIDTH + GAP)}px)` }}
                      >
                        {families.map((family) => {
                          const isSelected = selectedFamilyCode === family.family_code
                          return (
                         <div key={family.family_code} className="w-full p-4 h-full flex items-stretch">
                                <Card key={family.family_code} className="hover:shadow-lg transition-shadow h-full w-80 flex flex-col">
                                  <CardHeader>
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <CardTitle className="text-lg text-card-foreground">{family.family_name}</CardTitle>
                                        <CardDescription className="text-sm">
                                          FAMILY CODE: {family.family_code}
                                        </CardDescription>
                                        <CardDescription className="text-sm">
                                          Head: {family.family_name}
                                        </CardDescription>
                                      </div>
                                      <div className="ml-4">
                                        <Button
                                          size="sm"
                                          variant={isSelected ? "secondary" : "outline"}
                                          onClick={() => {
                                            setSelectedFamily(family)
                                            setSelectedFamilyCode(family.family_code)
                                          }}
                                          aria-label={`Select ${family.family_name}`}
                                          className="h-8 inline-flex items-center justify-center gap-2"
                                          disabled={isProcessing}
                                        >
                                          {isSelected ? (
                                            <>
                                              <CheckCircle className="w-4 h-4 text-green-600" />
                                              <span>Selected</span>
                                            </>
                                          ) : (
                                            <span>Select</span>
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="flex-1 flex flex-col justify-between">
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="w-4 h-4" />
                                        {family.phone}
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="w-4 h-4" />
                                        {family.id_card_no}
                                      </div>
                                    </div>
                                    <div className="pt-2 border-t border-border mt-4">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-muted-foreground">SANDA AMOUNT:</span>
                                        <span className="font-semibold text-primary">
                                          ${parseInt(family.sanda_amount)?.toFixed(2) || "0.00"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-muted-foreground">Arrears:</span>
                                        <span className="text-sm">{family.arrears || "0.00"}</span>
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
                                              {/* ...existing form fields... */}
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
                                  </CardContent>
                                </Card>
                          </div>
                        )})}
                      </div>
                    </div>
                  </div>
                 )
              })()
            )}
          </div>          

        </div>
      </section>

      {/* Collection Form Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-2xl bg-card rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-primary">SANDA Collection Form</h2>
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Family Code</label>
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
                      <span className="font-medium text-green-700">Head of Family:</span> {familyDetails.family_name}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <Phone className="inline w-4 h-4 mr-1 text-green-600" />
                      {familyDetails.phone}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <Users className="inline w-4 h-4 mr-1 text-green-600" />
                      {familyDetails.id_card_no}
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
                      <span className="text-green-700">SANDA AMOUNT:</span> <span className="ml-2">LKR {familyDetails.sanda_amount}</span>
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
