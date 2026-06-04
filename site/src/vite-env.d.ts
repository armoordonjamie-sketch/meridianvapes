/// <reference types="vite/client" />

declare module '*.png' {
  const src: string
  export default src
}

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string
  readonly VITE_SITE_NAME: string
  readonly VITE_COMPANY_LEGAL_NAME: string
  readonly VITE_COMPANY_NUMBER: string
  readonly VITE_VAT_NUMBER: string
  readonly VITE_CONTACT_EMAIL: string
  readonly VITE_CONTACT_PHONE: string
  readonly VITE_ADDRESS_STREET: string
  readonly VITE_ADDRESS_LOCALITY: string
  readonly VITE_ADDRESS_REGION: string
  readonly VITE_ADDRESS_POSTCODE: string
  readonly VITE_ADDRESS_COUNTRY: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_PAYMENTS_PROVIDER: string
  readonly VITE_PAYMENTS_PUBLIC_KEY: string
  readonly VITE_AGE_PROVIDER: string
  readonly VITE_AGE_PROVIDER_PUBLIC_KEY: string
  readonly VITE_GA4_MEASUREMENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
