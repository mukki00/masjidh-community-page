"use client"

import { useState, useEffect, useRef } from "react"
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
  Pencil,
  ChevronLeft,
  ChevronRight,
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
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-provider"
import { group } from "console"

export default function SandaCollectionPage() {
  const { setLoading } = useLoading()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFamily, setSelectedFamily] = useState<FamilyType | null>(null)
  const [isDataLoading, setIsDataLoading] = useState(true)
  type FamilyType = {
    family_code: string
    family_name: string
    id_card_no: string
    phone: string
    sanda_amount: number
    arrears?: number
  }
  const [families, setFamilies] = useState<FamilyType[]>([])
  type DonationCategoryType = {
    id: number
    name: string
    // Add other fields if needed
  }
  const [donationCategories, setDonationCategories] = useState<DonationCategoryType[]>([])
  const [slideIndex, setSlideIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFamilyCode, setSelectedFamilyCode] = useState<string | null>(null)
  const [alert, setAlert] = useState({ show: false, type: "", message: "" })
  const [lastReceiptNumber, setLastReceiptNumber] = useState("")
  const [dailyStats, setDailyStats] = useState({
    total_families: 0,
    todays_collections: 0,
    receipts_issued: 0,
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
    sanda_amount: number
    arrears?: number
  }
  const [familyDetails, setFamilyDetails] = useState<FamilyDetailsType | null>(null)
  const [familyError, setFamilyError] = useState("")
  const [isEditingFamily, setIsEditingFamily] = useState(false)
  const [editForm, setEditForm] = useState({
    family_name: "",
    phone: "",
    id_card_no: "",
    sanda_amount: "",
    arrears: "",
  })
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  // Fetch daily stats from API
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/sanda-stats")
      const result = await response.json()
      if (result.success) {
        setDailyStats(result.data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  // Fetch families from API
  const fetchFamilies = async (search = "") => {
    try {
      if (!search) setIsDataLoading(true)
      const url = search ? `/api/families?search=${encodeURIComponent(search)}` : "/api/families"
      const response = await fetch(url)
      const result = await response.json()

      if (result.success) {
        setFamilies(result.data)
      } else {
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

  // Show confirmation dialog before submitting
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!familyDetails) {
      showAlert("error", "Please enter a valid Family ID.")
      return
    }
    setIsConfirmDialogOpen(true)
  }

  // Handle payment submission after confirmation
  const handlePaymentSubmit = async () => {
    if (!familyDetails) return
    setIsConfirmDialogOpen(false)
    setIsProcessing(true)
    setLoading(true, "Processing payment...")

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          family_code: familyDetails.family_code, // Use familyDetails here
          amount: Number.parseFloat(paymentForm.amount),
          payment_method: paymentForm.payment_method,
          notes: paymentForm.notes,
          collected_by: user?.full_name || "Unknown",
        }),
      })

      const result = await response.json()

      if (result.success) {
        const receiptNumber = result.data.receipt_number;
        setLastReceiptNumber(receiptNumber)
        showAlert("success", `Payment processed successfully! Receipt: ${receiptNumber}`)
        setIsPaymentDialogOpen(false)
        setPaymentForm({ amount: "", category: "", payment_method: "", notes: "" })

        // Auto-print receipt
        if (result.data.receipt_html) {
          const printWindow = window.open("", "_blank")
          if (printWindow) {
            printWindow.document.write(result.data.receipt_html)
            printWindow.document.close()
            printWindow.onload = () => {
              printWindow.print()
            }
          }
        }

        // Refresh stats from DB
        await fetchStats()

        // Refresh family details to update arrears in the form
        if (familyIdInput) {
          await fetchFamilyDetails(familyIdInput)
        }

        // Refresh families to update card slider
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
          fetchDonationCategories(),
          fetchStats()
        ])
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Check if family has outstanding arrears
  const hasArrears = familyDetails && Number(familyDetails.arrears || 0) > 0

  // Button label logic
  const getButtonLabel = () => {
    if (!hasArrears) return "No Arrears Due"
    if (paymentForm.payment_method === "cash") return "Collect Cash Payment"
    if (paymentForm.payment_method === "bank") return "Record Bank Payment"
    return "Record Payment"
  }

  const handleSelectFamily = (family: FamilyType) => {
    setSelectedFamily(family)
    setSelectedFamilyCode(family.family_code)
    setFamilyIdInput(family.family_code) // Auto-populate the form
  }

  return (
    <AuthGuard>
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
                <CardTitle className="text-sm text-muted-foreground">Today's Date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-lg font-bold text-foreground">
                    {new Date().toLocaleDateString("en-LK", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
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
                const scrollBy = (direction: number) => {
                  const container = scrollContainerRef.current
                  if (!container) return
                  const cardWidth = container.querySelector('.snap-center')?.clientWidth || 300
                  container.scrollBy({ left: direction * (cardWidth + 16), behavior: 'smooth' })
                }

                return (
                  <div className="relative">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Showing families</div>
                    </div>

                    {/* scrollable card carousel */}
                    <div className="relative">
                      {/* left control */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden sm:block">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full shadow-md bg-background" onClick={() => scrollBy(-1)} aria-label="Previous card">
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                      </div>
                      {/* right control */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden sm:block">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full shadow-md bg-background" onClick={() => scrollBy(1)} aria-label="Next card">
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>

                      <div
                        ref={scrollContainerRef}
                        className="flex items-stretch gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-1 sm:px-12 -mx-1 sm:mx-0"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                      >
                        {families.map((family) => {
                          const isSelected = selectedFamilyCode === family.family_code
                          return (
                            <div key={family.family_code} className="snap-center shrink-0 w-[85vw] sm:w-80 p-2 flex">
                              <Card className="hover:shadow-lg transition-shadow w-full flex flex-col">
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
                                        onClick={() => handleSelectFamily(family)}
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
                                        LKR {Number(family.sanda_amount || 0).toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                      <span className="text-sm text-muted-foreground">
                                        {Number(family.arrears || 0) < 0 ? "Credit Balance:" : Number(family.arrears || 0) === 0 ? "Status:" : "Arrears:"}
                                      </span>
                                      <span className={`text-sm font-medium ${Number(family.arrears || 0) < 0 ? "text-blue-600" : Number(family.arrears || 0) === 0 ? "text-green-600" : "text-red-600"}`}>
                                        {Number(family.arrears || 0) === 0 ? "Fully Paid" : `LKR ${Math.abs(Number(family.arrears || 0)).toFixed(2)}`}
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )
                        })}
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
          <form onSubmit={handleFormSubmit} className="space-y-4">
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
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    {!isEditingFamily ? (
                      <>
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
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-green-700 mb-1">Family Name</label>
                          <input
                            type="text"
                            value={editForm.family_name}
                            onChange={e => setEditForm({ ...editForm, family_name: e.target.value })}
                            className="w-full border border-green-300 rounded px-3 py-1.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-green-700 mb-1">Phone</label>
                          <input
                            type="text"
                            value={editForm.phone}
                            onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                            className="w-full border border-green-300 rounded px-3 py-1.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-green-700 mb-1">ID Card No</label>
                          <input
                            type="text"
                            value={editForm.id_card_no}
                            onChange={e => setEditForm({ ...editForm, id_card_no: e.target.value })}
                            className="w-full border border-green-300 rounded px-3 py-1.5 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ml-2">
                    {!isEditingFamily ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-100"
                        onClick={() => {
                          setEditForm({
                            family_name: familyDetails.family_name,
                            phone: familyDetails.phone,
                            id_card_no: familyDetails.id_card_no,
                            sanda_amount: String(familyDetails.sanda_amount || 0),
                            arrears: String(familyDetails.arrears || 0),
                          })
                          setIsEditingFamily(true)
                        }}
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditingFamily(false)}
                          disabled={isSavingEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          disabled={isSavingEdit}
                          onClick={async () => {
                            setIsSavingEdit(true)
                            try {
                              const res = await fetch(`/api/families/${familyDetails.family_code}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(editForm),
                              })
                              const result = await res.json()
                              if (result.success) {
                                setFamilyDetails(result.data)
                                setIsEditingFamily(false)
                                showAlert("success", "Family details updated successfully")
                                fetchFamilies(searchTerm)
                              } else {
                                showAlert("error", result.error || "Failed to update")
                              }
                            } catch {
                              showAlert("error", "Failed to update family details")
                            } finally {
                              setIsSavingEdit(false)
                            }
                          }}
                        >
                          {isSavingEdit ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-8 mt-2">
                  <div className="flex-1">
                    {!isEditingFamily ? (
                      <div className="text-base font-semibold text-green-900">
                        <span className={Number(familyDetails.arrears || 0) < 0 ? "text-blue-700" : Number(familyDetails.arrears || 0) === 0 ? "text-green-700" : "text-red-700"}>
                          {Number(familyDetails.arrears || 0) < 0 ? "Credit Balance:" : Number(familyDetails.arrears || 0) === 0 ? "Status:" : "Total Arrears:"}
                        </span>
                        <span className={`ml-2 ${Number(familyDetails.arrears || 0) < 0 ? "text-blue-800" : Number(familyDetails.arrears || 0) === 0 ? "text-green-800" : "text-red-800"}`}>
                          {Number(familyDetails.arrears || 0) === 0 ? "Fully Paid" : `LKR ${Math.abs(Number(familyDetails.arrears || 0)).toFixed(2)}`}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-medium text-green-700 mb-1">Arrears (LKR)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.arrears}
                          onChange={e => setEditForm({ ...editForm, arrears: e.target.value })}
                          className="w-full border border-green-300 rounded px-3 py-1.5 text-sm"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    {!isEditingFamily ? (
                      <div className="text-base font-semibold text-green-900">
                        <span className="text-green-700">SANDA AMOUNT:</span>
                        <span className="ml-2">LKR {Number(familyDetails.sanda_amount || 0).toFixed(2)}</span>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-medium text-green-700 mb-1">SANDA Amount (LKR)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.sanda_amount}
                          onChange={e => setEditForm({ ...editForm, sanda_amount: e.target.value })}
                          className="w-full border border-green-300 rounded px-3 py-1.5 text-sm"
                        />
                      </div>
                    )}
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
                className="w-full border rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={!hasArrears}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                name="payment_method"
                value={paymentForm.payment_method}
                onChange={e => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                className="w-full border rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={!hasArrears}
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
                className="w-full border rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={3}
                disabled={!hasArrears}
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessing || !familyDetails || !!familyError || !hasArrears}
            >
              {isProcessing ? "Processing..." : getButtonLabel()}
            </button>
          </form>
        </div>
      </section>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Please review the payment details before confirming.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Family:</span>
              <span className="font-medium">{familyDetails?.family_name} ({familyDetails?.family_code})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold text-primary">LKR {Number(paymentForm.amount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-medium capitalize">{paymentForm.payment_method}</span>
            </div>
            {paymentForm.notes && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Notes:</span>
                <span className="font-medium">{paymentForm.notes}</span>
              </div>
            )}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Arrears:</span>
                <span className="font-medium">LKR {Number(familyDetails?.arrears || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">After Payment:</span>
                <span className="font-semibold">
                  LKR {(Number(familyDetails?.arrears || 0) - Number(paymentForm.amount || 0)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePaymentSubmit} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Confirm Payment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
    </AuthGuard>
  )
}
