import { Html, Head, Body, Container, Section, Text, Button } from '@react-email/components'

interface WelcomeEmailProps {
  title: string
  message: string
  ctaLabel: string
  dashboardUrl: string
}

export function WelcomeEmail({ title, message, ctaLabel, dashboardUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Section style={section}>
            <Text style={heading}>{title}</Text>
            <Text style={paragraph}>{message}</Text>
            <Button style={button} href={dashboardUrl}>
              {ctaLabel}
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const body: React.CSSProperties = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}

const container: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '40px 20px',
}

const section: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '40px',
  textAlign: 'center' as const,
}

const heading: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  margin: '0 0 16px',
}

const paragraph: React.CSSProperties = {
  fontSize: '16px',
  lineHeight: '1.5',
  color: '#4a4a4a',
  margin: '0 0 24px',
}

const button: React.CSSProperties = {
  backgroundColor: '#0f172a',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
}
