import { Calendar, Clock, Users, BookOpen, Heart, Megaphone, Pin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function NoticesPage() {
  const featuredAnnouncements = [
    {
      id: 1,
      title: "Ramadan Schedule 2025",
      description:
        "Updated prayer times and special programs during the holy month of Ramadan. Iftar will be served daily at the masjid.",
      category: "Important",
      date: "March 10, 2025",
      isPinned: true,
      author: "Imam Abdullah",
    },
    {
      id: 2,
      title: "New Islamic School Registration Open",
      description:
        "Registration is now open for our weekend Islamic school. Classes for children ages 5-16 covering Quran, Arabic, and Islamic studies.",
      category: "Education",
      date: "March 8, 2025",
      isPinned: true,
      author: "Education Committee",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Jummah Khutbah - The Importance of Community",
      description: "Special Jummah khutbah focusing on building stronger community bonds and supporting one another.",
      date: "March 15, 2025",
      time: "1:00 PM",
      location: "Main Prayer Hall",
      category: "Weekly",
      attendees: "All Welcome",
    },
    {
      id: 2,
      title: "Softball Cricket Tournament",
      description: "Annual Softball Cricket tournament for youth ages 13-18. Registration required by March 20th.",
      date: "March 22, 2025",
      time: "2:00 PM - 6:00 PM",
      location: "Community Center",
      category: "Youth",
      attendees: "Youth 13-18",
    },
    {
      id: 3,
      title: "Sisters' Study Circle",
      description: "Monthly study circle for sisters focusing on Tafseer of Surah Al-Baqarah.",
      date: "March 25, 2025",
      time: "7:00 PM - 8:30 PM",
      location: "Sisters' Hall",
      category: "Education",
      attendees: "Sisters Only",
    },
    {
      id: 4,
      title: "Community Cleanup Day",
      description: "Join us in beautifying our masjid and surrounding community area. Lunch will be provided.",
      date: "March 30, 2025",
      time: "9:00 AM - 2:00 PM",
      location: "Masjid Grounds",
      category: "Community",
      attendees: "All Families",
    },
  ]

  const communityNews = [
    {
      id: 1,
      title: "New Parking Arrangements",
      description: "Please note the new parking guidelines to ensure everyone has access during peak prayer times.",
      date: "March 5, 2025",
      category: "Facility",
    },
    {
      id: 2,
      title: "Volunteer Appreciation Dinner",
      description: "Thank you to all our volunteers! Join us for a special appreciation dinner next month.",
      date: "March 3, 2025",
      category: "Community",
    },
    {
      id: 3,
      title: "Library Book Donations Needed",
      description: "Our Islamic library is seeking donations of Islamic books in English and Arabic.",
      date: "March 1, 2025",
      category: "Education",
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "important":
        return "bg-destructive text-destructive-foreground"
      case "education":
        return "bg-primary text-primary-foreground"
      case "community":
        return "bg-secondary text-secondary-foreground"
      case "youth":
        return "bg-accent text-accent-foreground"
      case "weekly":
        return "bg-muted text-muted-foreground"
      case "facility":
        return "bg-chart-2 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "important":
        return <Megaphone className="w-4 h-4" />
      case "education":
        return <BookOpen className="w-4 h-4" />
      case "community":
        return <Users className="w-4 h-4" />
      case "youth":
        return <Heart className="w-4 h-4" />
      case "weekly":
        return <Calendar className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <Header />

      {/* Page Header */}
      <section className="py-12 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Community Notice Board</h1>
          <p className="text-xl text-muted-foreground mb-6 text-pretty">
            Stay connected with our community through announcements, events, and important updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Calendar className="w-5 h-5 mr-2" />
              View Calendar
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              <Users className="w-5 h-5 mr-2" />
              Submit Announcement
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Announcements */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Featured Announcements</h2>
            <p className="text-muted-foreground">Important updates from our community leadership</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {featuredAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="relative hover:shadow-lg transition-shadow">
                {announcement.isPinned && (
                  <div className="absolute top-4 right-4">
                    <Pin className="w-5 h-5 text-primary" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getCategoryColor(announcement.category)}>
                      {getCategoryIcon(announcement.category)}
                      <span className="ml-1">{announcement.category}</span>
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-card-foreground text-balance">{announcement.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    By {announcement.author} • {announcement.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-pretty text-muted-foreground">{announcement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Upcoming Events</h2>
            <p className="text-muted-foreground">Join us for these community gatherings and programs</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getCategoryColor(event.category)}>
                      {getCategoryIcon(event.category)}
                      <span className="ml-1">{event.category}</span>
                    </Badge>
                    <span className="text-sm text-muted-foreground">{event.date}</span>
                  </div>
                  <CardTitle className="text-lg text-card-foreground text-balance">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-pretty text-muted-foreground mb-4">{event.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community News */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Community News</h2>
            <p className="text-muted-foreground">Recent updates and information</p>
          </div>
          <div className="space-y-4">
            {communityNews.map((news) => (
              <Card key={news.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryIcon(news.category)}
                          <span className="ml-1">{news.category}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground">{news.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-card-foreground mb-2 text-balance">{news.title}</h3>
                      <p className="text-muted-foreground text-pretty">{news.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-2">Browse by Category</h3>
            <p className="text-muted-foreground">Filter announcements by type</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {["All", "Important", "Education", "Community", "Youth", "Weekly", "Facility"].map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className={
                  category === "All"
                    ? "bg-primary text-primary-foreground"
                    : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }
              >
                {category !== "All" && getCategoryIcon(category)}
                <span className={category !== "All" ? "ml-1" : ""}>{category}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
