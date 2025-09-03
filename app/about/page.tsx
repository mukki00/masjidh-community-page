import { Users, Heart, BookOpen, Home, Award, Target, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  const leadership = [
    {
      name: "Imam Abdullah Rahman",
      role: "Imam & Religious Director",
      description: "Leading our community in worship and spiritual guidance for over 8 years.",
      qualifications: "PhD in Islamic Studies, Al-Azhar University",
    },
    {
      name: "Dr. Sarah Ahmed",
      role: "Education Director",
      description: "Overseeing our Islamic school and adult education programs.",
      qualifications: "MA in Islamic Education, Georgetown University",
    },
    {
      name: "Brother Omar Hassan",
      role: "Community Outreach Coordinator",
      description: "Building bridges with the wider community and organizing social programs.",
      qualifications: "BA in Social Work, Local University",
    },
    {
      name: "Sister Fatima Ali",
      role: "Youth Program Director",
      description: "Developing engaging programs for our young community members.",
      qualifications: "MA in Youth Development, State University",
    },
  ]

  const services = [
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Daily Prayers",
      description: "Five daily prayers with congregation, including Jummah prayers every Friday at 1:00 PM.",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Islamic Education",
      description: "Weekend Islamic school for children, adult Quran classes, and Arabic language instruction.",
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Community Support",
      description: "Food pantry, counseling services, and assistance for families in need.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Youth Programs",
      description: "Sports leagues, study groups, and leadership development for young Muslims.",
    },
    {
      icon: <Home className="w-8 h-8 text-primary" />,
      title: "Event Hosting",
      description: "Wedding ceremonies, community celebrations, and interfaith dialogue events.",
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: "Outreach Programs",
      description: "Community service projects, interfaith initiatives, and educational workshops.",
    },
  ]

  const values = [
    {
      title: "Unity",
      description: "Building a strong, unified community that supports one another through faith and fellowship.",
    },
    {
      title: "Education",
      description: "Promoting Islamic knowledge and understanding while encouraging academic excellence.",
    },
    {
      title: "Service",
      description: "Serving our community and the wider society through charitable works and social programs.",
    },
    {
      title: "Inclusion",
      description: "Welcoming all Muslims and fostering understanding with people of all backgrounds.",
    },
  ]

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
              <a href="/reports" className="text-foreground hover:text-primary transition-colors">
                Reports
              </a>
              <a href="/import" className="text-foreground hover:text-primary transition-colors">
                Import Families
              </a>
              <a href="/about" className="text-primary font-medium">
                About
              </a>
              <a href="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">About Our Masjid</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            For over two decades, Jummah Masjid has been a beacon of faith, community, and service. We are dedicated to
            fostering spiritual growth, education, and unity among Muslims while building bridges with the wider
            community.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-card-foreground flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-pretty leading-relaxed">
                  To provide a welcoming space for worship, learning, and community building while promoting the true
                  teachings of Islam. We strive to support our members in their spiritual journey and serve as a
                  positive force in our local community through education, outreach, and charitable works.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-card-foreground flex items-center gap-2">
                  <Award className="w-6 h-6 text-primary" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-pretty leading-relaxed">
                  To be a thriving Islamic center that nurtures faith, builds character, and creates lasting bonds
                  within our community. We envision a future where our masjid serves as a model of Islamic values,
                  promoting peace, understanding, and cooperation among all people regardless of their background.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-12 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our History</h2>
            <p className="text-muted-foreground">A journey of faith and community building</p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">2002 - Foundation</h3>
                  <p className="text-muted-foreground text-pretty">
                    Jummah Masjid was established by a small group of dedicated Muslim families who recognized the need
                    for a proper Islamic center in our community. Starting with just 15 families, we held our first
                    prayers in a rented community hall.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">2008 - New Building</h3>
                  <p className="text-muted-foreground text-pretty">
                    Through the generous donations and hard work of our growing community, we were able to purchase and
                    renovate our current building. The new facility included a main prayer hall, separate areas for
                    sisters, and classrooms for education.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">2015 - Expansion</h3>
                  <p className="text-muted-foreground text-pretty">
                    As our community continued to grow, we expanded our facilities to include a community center,
                    library, and additional classrooms. We also launched our weekend Islamic school and youth programs.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">2024 - Today</h3>
                  <p className="text-muted-foreground text-pretty">
                    Today, Jummah Masjid serves over 300 families and continues to be a cornerstone of the local Muslim
                    community. We remain committed to our founding principles while adapting to meet the evolving needs
                    of our diverse congregation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Our Leadership</h2>
            <p className="text-muted-foreground">Dedicated individuals serving our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leadership.map((leader, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground">{leader.name}</CardTitle>
                  <CardDescription>
                    <Badge className="bg-primary text-primary-foreground">{leader.role}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-pretty mb-3">{leader.description}</p>
                  <p className="text-sm text-muted-foreground font-medium">{leader.qualifications}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Our Services</h2>
            <p className="text-muted-foreground">Supporting our community in faith and life</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-2">{service.icon}</div>
                  <CardTitle className="text-lg text-card-foreground">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-pretty">{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Our Values</h2>
            <p className="text-muted-foreground">The principles that guide our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-card-foreground">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-pretty">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Information */}
      <section className="py-12 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Our Facilities</h2>
            <p className="text-muted-foreground">Modern amenities in service of our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  Main Prayer Hall
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Capacity for 400 worshippers</li>
                  <li>• Separate entrance for sisters</li>
                  <li>• Climate controlled environment</li>
                  <li>• Audio system for khutbahs</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Education Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 6 modern classrooms</li>
                  <li>• Islamic library with 1000+ books</li>
                  <li>• Computer lab for digital learning</li>
                  <li>• Children's activity area</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Community Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Multi-purpose hall for events</li>
                  <li>• Commercial kitchen facilities</li>
                  <li>• Youth recreation room</li>
                  <li>• Meeting rooms for committees</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Additional Amenities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Ample parking for 150 cars</li>
                  <li>• Wheelchair accessible</li>
                  <li>• Wudu facilities for men and women</li>
                  <li>• Security system and cameras</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">M</span>
            </div>
            <span className="text-lg font-semibold text-foreground">Jummah Masjid</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 Jummah Masjid. Serving our community with faith, unity, and compassion.
          </p>
        </div>
      </footer>
    </div>
  )
}
