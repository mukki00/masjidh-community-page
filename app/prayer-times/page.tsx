import { Clock, Compass, Calendar, MapPin, Sun } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function PrayerTimesPage() {
  const todaysPrayerTimes = [
    { name: "Fajr", time: "4:50 AM", arabic: "الفجر", status: "completed", iqamah: "5:15 AM" },
    { name: "Dhuhr", time: "12:07 PM", arabic: "الظهر", status: "next", iqamah: "12:17 PM" },
    { name: "Asr", time: "3:09 PM", arabic: "العصر", status: "upcoming", iqamah: "3:19 PM" },
    { name: "Maghrib", time: "6:13 PM", arabic: "المغرب", status: "upcoming", iqamah: "6:23 PM" },
    { name: "Isha", time: "7:19 PM", arabic: "العشاء", status: "upcoming", iqamah: "7:29 PM" },
  ]

  const weeklySchedule = [
    { day: "Monday", fajr: "4:50", dhuhr: "12:07", asr: "3:09", maghrib: "6:13", isha: "7:19" },
    { day: "Tuesday", fajr: "4:50", dhuhr: "12:07", asr: "3:09", maghrib: "6:13", isha: "7:19" },
    { day: "Wednesday", fajr: "4:50", dhuhr: "12:07", asr: "3:09", maghrib: "6:13", isha: "7:19" },
    { day: "Thursday", fajr: "4:50", dhuhr: "12:07", asr: "3:09", maghrib: "6:13", isha: "7:19" },
    { day: "Friday", fajr: "4:50", dhuhr: "12:07", asr: "3:09", maghrib: "6:13", isha: "7:19" },
    { day: "Saturday", fajr: "4:50", dhuhr: "12:07", asr: "3:09", maghrib: "6:13", isha: "7:19" },
    { day: "Sunday", fajr: "4:50", dhuhr: "12:07", asr: "3:09", maghrib: "6:13", isha: "7:19" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-muted text-muted-foreground"
      case "next":
        return "bg-primary text-primary-foreground"
      case "upcoming":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <Header />

      {/* Page Header */}
      <section className="py-12 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Prayer Times</h1>
          <p className="text-xl text-muted-foreground mb-6 text-pretty">
            Stay connected with your daily prayers. All times are calculated for our local area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Islamic Center, City 12345</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Compass className="w-4 h-4" />
              <span className="text-sm">Qibla: 58° NE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Prayer Times */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Today's Schedule</h2>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {todaysPrayerTimes.map((prayer, index) => (
              <Card
                key={index}
                className={`text-center transition-all duration-200 ${
                  prayer.status === "next" ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg text-card-foreground">{prayer.name}</CardTitle>
                    <Badge className={getStatusColor(prayer.status)}>
                      {prayer.status === "next" ? "Next" : prayer.status === "completed" ? "Done" : "Later"}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">{prayer.arabic}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-primary">{prayer.time}</p>
                    <p className="text-sm text-muted-foreground">Iqamah: {prayer.iqamah}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Next Prayer Countdown */}
          <Card className="max-w-md mx-auto bg-primary/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-primary">
                <Clock className="w-5 h-5" />
                Next Prayer: Dhuhr
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-foreground mb-2">2h 15m</p>
              <p className="text-sm text-muted-foreground">Time remaining until next prayer</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="py-12 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Weekly Schedule</h2>
            <p className="text-muted-foreground">Prayer times for the current week</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-card-foreground">This Week's Prayer Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-medium text-foreground">Day</th>
                      <th className="text-center py-3 px-2 font-medium text-foreground">Fajr</th>
                      <th className="text-center py-3 px-2 font-medium text-foreground">Dhuhr</th>
                      <th className="text-center py-3 px-2 font-medium text-foreground">Asr</th>
                      <th className="text-center py-3 px-2 font-medium text-foreground">Maghrib</th>
                      <th className="text-center py-3 px-2 font-medium text-foreground">Isha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklySchedule.map((day, index) => (
                      <tr
                        key={index}
                        className={`border-b border-border/50 ${day.day === "Wednesday" ? "bg-primary/5" : ""}`}
                      >
                        <td className="py-3 px-2 font-medium text-foreground">
                          {day.day}
                          {day.day === "Wednesday" && (
                            <Badge className="ml-2 bg-primary text-primary-foreground">Today</Badge>
                          )}
                        </td>
                        <td className="text-center py-3 px-2 text-muted-foreground">{day.fajr}</td>
                        <td className="text-center py-3 px-2 text-muted-foreground">{day.dhuhr}</td>
                        <td className="text-center py-3 px-2 text-muted-foreground">{day.asr}</td>
                        <td className="text-center py-3 px-2 text-muted-foreground">{day.maghrib}</td>
                        <td className="text-center py-3 px-2 text-muted-foreground">{day.isha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Sun className="w-5 h-5 text-primary" />
                  Sunrise & Sunset
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunrise:</span>
                    <span className="font-medium text-foreground">6:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunset:</span>
                    <span className="font-medium text-foreground">6:30 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  Special Prayers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jummah:</span>
                    <span className="font-medium text-foreground">1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tarawih:</span>
                    <span className="font-medium text-foreground">After Isha</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
