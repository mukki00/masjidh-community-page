export default function Footer() {
  return (
    <footer className="gradient-bg-card border-t border-border/30 py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img
              src="/images/jummah-masjid-hero.png"
              alt="Balangoda Grand Mosque"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-lg font-semibold text-foreground">Balangoda Grand Mosque</span>
          </div>
          <p className="text-muted-foreground text-sm">
            <b>© 2025 Under One Shadow</b> <br/>
            <i>Sheltering communities with compassion and unity</i>
          </p>
        </div>
      </footer>
  )
}
