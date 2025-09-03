import { Phone, Mail, MapPin, Clock, User, Send, MessageSquare, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      title: "Phone",
      details: ["Main Office: 0452287303", "Emergency: 0452287303"],
    },
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      title: "Email",
      details: ["info@balangodagrandmosque.org", "imam@balangodagrandmosque.org"],
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      title: "Address",
      details: ["1st Floor, Islamic Center", "Kalthota Rd, Balangoda"],
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Office Hours",
      details: ["Mon-Fri: 9:00 AM - 5:00 PM", "Sat-Sun: 10:00 AM - 3:00 PM"],
    },
  ]

  const departments = [
    {
      name: "Imam Abdullah Rahman",
      role: "Religious Affairs & Counseling",
      phone: "0452287303",
      email: "imam@balangodagrandmosque.org",
      availability: "Daily after Maghrib prayer",
    },
    {
      name: "Sister Aisha Mohamed",
      role: "Administration & General Inquiries",
      phone: "0452287303",
      email: "admin@balangodagrandmosque.org",
      availability: "Mon-Fri, 9:00 AM - 5:00 PM",
    },
    {
      name: "Dr. Sarah Ahmed",
      role: "Education & Islamic School",
      phone: "0452287303",
      email: "education@balangodagrandmosque.org",
      availability: "Weekends & Evenings",
    },
    {
      name: "Brother Omar Hassan",
      role: "Community Outreach & Events",
      phone: "0452287303",
      email: "outreach@balangodagrandmosque.org",
      availability: "Tue-Thu, 10:00 AM - 6:00 PM",
    },
  ]

  const officeHours = [
    { day: "Monday", hours: "9:00 AM - 5:00 PM" },
    { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
    { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
    { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
    { day: "Friday", hours: "9:00 AM - 2:00 PM, 3:00 PM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 3:00 PM" },
    { day: "Sunday", hours: "10:00 AM - 3:00 PM" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <Header />

      {/* Page Header */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Contact Us</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            We're here to serve our community. Whether you have questions about Islam, need spiritual guidance, or want
            to get involved, don't hesitate to reach out to us.
          </p>
        </div>
      </section>

      {/* Quick Contact Info */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-2">{info.icon}</div>
                  <CardTitle className="text-lg text-card-foreground">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-muted-foreground text-sm">
                      {detail}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Hours */}
      <section className="py-12 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-card-foreground flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  Send Us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-foreground">
                        First Name
                      </Label>
                      <Input id="firstName" placeholder="Enter your first name" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-foreground">
                        Last Name
                      </Label>
                      <Input id="lastName" placeholder="Enter your last name" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-foreground">
                      Email Address
                    </Label>
                    <Input id="email" type="email" placeholder="Enter your email" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-foreground">
                      Phone Number (Optional)
                    </Label>
                    <Input id="phone" type="tel" placeholder="Enter your phone number" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-foreground">
                      Subject
                    </Label>
                    <Input id="subject" placeholder="What is this regarding?" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-foreground">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your inquiry or message..."
                      rows={5}
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-card-foreground flex items-center gap-2">
                    <Clock className="w-6 h-6 text-primary" />
                    Office Hours
                  </CardTitle>
                  <CardDescription>When you can reach us in person or by phone</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {officeHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="font-medium text-foreground">{schedule.day}</span>
                        <span className="text-muted-foreground text-sm">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Note:</strong> Friday office hours are adjusted for Jummah
                      prayer (12:30 PM - 2:30 PM).
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-card-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">For urgent matters outside office hours, please call:</p>
                  <p className="text-lg font-semibold text-primary">0452287303</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Emergency line is available 24/7 for urgent religious matters, community emergencies, or pastoral
                    care.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Department Contacts</h2>
            <p className="text-muted-foreground">Reach out to the right person for your specific needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {dept.name}
                  </CardTitle>
                  <CardDescription className="font-medium">{dept.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{dept.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{dept.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{dept.availability}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Directions */}
      <section className="py-12 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Visit Us</h2>
            <p className="text-muted-foreground">Find us in the heart of our community</p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Our Location
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-foreground">Balangoda Grand Jummah Mosque</p>
                      <p className="text-muted-foreground">1st Floor, Islamic Center</p>
                      <p className="text-muted-foreground">Kalthota Rd, Balangoda</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Parking Information:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Free parking available on-site</li>
                        <li>• 150 parking spaces</li>
                        <li>• Wheelchair accessible parking</li>
                        <li>• Additional street parking available</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-4">Directions</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium text-foreground">From Downtown:</p>
                      <p>Take Main Street north for 2 miles, turn right on Community Street. Masjid is on the left.</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">From Highway 101:</p>
                      <p>Exit at Community Street (Exit 15), head east for 0.5 miles. Masjid is on the right side.</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Public Transportation:</p>
                      <p>Bus routes 12 and 34 stop directly in front of the masjid. Metro station is 0.3 miles away.</p>
                    </div>
                  </div>
                  <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
