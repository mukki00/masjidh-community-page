import { Clock, Calendar, BookOpen, Users, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/Header"
import Footer from "@/components/Footer"


export default function HomePage() {
  const prayerTimes = [
    { name: "Fajr", time: "4:50 AM", arabic: "الفجر" },
    { name: "Dhuhr", time: "12:07 PM", arabic: "الظهر" },
    { name: "Asr", time: "3:09 PM", arabic: "العصر" },
    { name: "Maghrib", time: "6:13 PM", arabic: "المغرب" },
    { name: "Isha", time: "7:19 PM", arabic: "العشاء" },
  ]

  const announcements = [
    {
      title: "Jummah Khutbah - Friday Prayer",
      description: "Join us for Jummah prayer this Friday at 12:00 PM. Khutbah will be delivered in Tamil and Sinhala.",
      date: "Every Friday",
    },
    {
      title: "Quran Study Circle",
      description: "Weekly Quran study and discussion every day after Maghrib prayer.",
      date: "Every Day",
    },
    {
      title: "Jummai Rathri Bayan",
      description: "Every Thursday after Ishah, join us for Jummai Rathri Bayan (night sermon). All are welcome.",
      date: "Every Thursday",
    },
    {
      title: "Community Iftar",
      description: "Monthly community iftar gathering. All families welcome to join us for breaking fast together.",
      date: "Month of Ramadan",
    },
    {
      title: "Community Sahar",
      description: "Join us for Sahar (pre-dawn meal) during Ramadan. All are welcome to share the blessings together before Fajr.",
      date: "Month of Ramadan",
    },
  ]

  return (
    <div className="min-h-screen gradient-bg-primary">
      {/* Header Navigation */}
      <Header />

      {/* Hero Section */}
      <section
        id="home"
        className="py-16 px-4 relative bg-cover bg-center bg-no-repeat min-h-[600px] flex items-center"
        style={{
          backgroundImage: "url('/images/jummah-masjid-hero.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance drop-shadow-2xl">
            Welcome to Our Community
          </h2>
          <p className="text-xl text-white/95 mb-8 text-pretty max-w-2xl mx-auto drop-shadow-lg">
            One home for our community: prayer times, announcements, events, and learning. Join us in worship,
            fellowship, and spiritual growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white/25 hover:bg-white/35 text-white border border-white/40 backdrop-blur-sm shadow-lg"
              asChild
            >
              <a href="/prayer-times">
                <Clock className="w-5 h-5 mr-2" />
                View Prayer Times
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/40 text-white hover:bg-white/25 hover:text-white bg-white/10 backdrop-blur-sm shadow-lg"
              asChild
            >
              <a href="/notices">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming Events
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Prayer Times */}
      <section id="prayer-times" className="py-12 px-4 gradient-bg-secondary">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-foreground mb-2">Today's Prayer Times</h3>
            <p className="text-muted-foreground">Stay connected with your daily prayers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {prayerTimes.map((prayer, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 gradient-bg-card border-0"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-card-foreground">{prayer.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{prayer.arabic}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{prayer.time}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Announcements */}
      <section id="notices" className="py-12 px-4 gradient-bg-accent">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-foreground mb-2">Community Notice Board</h3>
            <p className="text-muted-foreground">Stay updated with our latest announcements and events</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((announcement, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 gradient-bg-card border-0 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-card-foreground text-balance">{announcement.title}</CardTitle>
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                      {announcement.date}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-pretty">{announcement.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4 gradient-bg-secondary">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-foreground mb-2">Community Resources</h3>
            <p className="text-muted-foreground">Explore our services and learning opportunities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-xl transition-all duration-300 cursor-pointer gradient-bg-card border-0 hover:scale-105">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-card-foreground">Islamic Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Quran study, Islamic history, and spiritual guidance resources</CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-all duration-300 cursor-pointer gradient-bg-card border-0 hover:scale-105">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-card-foreground">Community Events</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Join our regular gatherings, celebrations, and community activities</CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-all duration-300 cursor-pointer gradient-bg-card border-0 hover:scale-105">
              <CardHeader>
                <Calendar className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-card-foreground">Prayer Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Complete monthly prayer times and special prayer announcements</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section id="contact" className="py-12 px-4 gradient-bg-accent">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-foreground mb-2">Visit Us</h3>
            <p className="text-muted-foreground">We welcome you to join our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="gradient-bg-card border-0 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  1st Floor, Islamic Center 
                  <br />
                  Kalthota Rd, Balangoda
                </p>
              </CardContent>
            </Card>
            <Card className="gradient-bg-card border-0 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Phone className="w-5 h-5 text-primary" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Phone: 0452287303
                  <br />
                  Email: info@jummahmasjid.org
                </p>
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
