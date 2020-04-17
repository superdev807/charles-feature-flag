import { Include } from '@typed/lambda'
import { Uuid } from '@typed/uuid'

export namespace Api {
  export type User = {
    username: string
    locations: Uuid[]
    role: Permissions
    id: Uuid
    first_name: string
    last_name: string
    email: string
    default_image: string | void
    date_joined: string
    verified: boolean
    verification: string | null
    intercomIdentity: string
    is_staff: boolean
    is_managed: boolean
    training_materials_reviewed: boolean
    stores: Store[]
  }

  export type OpsPermissions = Include<Permissions, 'DEVELOPER' | 'STAFF' | 'DATA'>

  export type Permissions =
    | 'ADMIN'
    | 'INVENTORY'
    | 'MANAGER'
    | 'ASSOCIATE'
    | 'DEVELOPER'
    | 'STAFF'
    | 'DATA'

  export type Store = {
    phone_number: string
    city: string
    hours: Hours[]
    store_name: string
    client: Client
    default_image: string
    address: string
    location_logo: string
    store_nickname: string
    map_image: string
    id: Uuid
    zip_code: string
    last_updated: string | null
    minimum_inventory_threshold: number
    instore_ordering: boolean
    separate_instore_ordering: boolean
    custom_frontend_values: CustomFrontendValues
    state: StateCode
    is_onboarded: boolean
    is_flagship: boolean
    minimum_price_threshold: number
    custom_texts: CustomTexts
    instore_sms: boolean
    online_hours_offset: number
    online_ordering: boolean
    inventoryManager: string
    pickup: boolean
    delivery: boolean
    delivery_window_length_minutes: number
    favicon: string | null
    timezone: string
    management_resources?: Record<string, string>
    commodityToCategory?: Record<string, string>
    commodityToSubcategory?: Record<string, string>
    sectorToCategory?: Record<string, string>
    deleted: boolean
    cbd: boolean
  }

  export type Client = {
    id: Uuid
    description: string
    nickname: string
    logo: string
    full_name: string
    display_name: string
    subdomain: string
    stage_tld: string
    store_tld: string
    tagline: string
    korona_email_sent: boolean
    hardware_ordered: boolean
    onboarding_completion_date: string
    billing_completed: boolean
    is_fake: boolean
    twilio_number: string
    deleted: boolean
  }

  export type Hours = {
    close_time: string
    end_day: number
    id: string
    open_time: string
    start_day: number
    store_location_id: Uuid
  }

  export type CustomFrontendValues = {
    readonly primaryColor?: string
    readonly secondaryColor?: string
    readonly hideFromStore?: boolean
    readonly googleAnalyticsId?: string
    readonly clientGoogleAnalyticsId?: string
    readonly customCheckoutDisclaimer?: string
    readonly instoreCondensedName?: boolean
    readonly instoreOptionalPhone?: boolean
    readonly clientWebsite?: string
    readonly instoreCustomReceiptCopy?: string
    readonly metaDescriptions?: Record<string, string>
    readonly documentTitles?: Record<string, string>
    readonly thcPercentageTestResultPadding?: number
    readonly cbdPercentageTestResultPadding?: number
    readonly inStorePreorder?: boolean
    readonly customCategoryImages?: Record<string, string>
    readonly inStoreInternalNotes?: boolean
    readonly ageVerification?: boolean
    readonly hotJarId?: string
    readonly inStoreQueueBackgroundImage?: string
  }

  export type CustomTexts = {
    UNCONFIRMED?: string
    NEW?: string
    NOCONFIRM_NEW?: string
    READY?: string
    COMPLETED?: string
    KILLED?: string
    CANCELLED?: string

    INSTORE_NEW?: string
    INSTORE_READY?: string
    INSTORE_COMPLETED?: string
    INSTORE_KILLED?: string
    INSTORE_CANCELLED?: string

    UNCONFIRMED_DELIVERY?: string
    NOCONFIRM_PENDING_DELIVERY?: string
    PENDING_DELIVERY?: string
    NEW_DELIVERY?: string
    CANCELLED_DELIVERY?: string
    KILLED_DELIVERY?: string
  }

  export type StateCode =
    | 'AL'
    | 'AK'
    | 'AZ'
    | 'AR'
    | 'CA'
    | 'CO'
    | 'CT'
    | 'DE'
    | 'DC'
    | 'FL'
    | 'GA'
    | 'HI'
    | 'ID'
    | 'IL'
    | 'IN'
    | 'IA'
    | 'KS'
    | 'KY'
    | 'LA'
    | 'ME'
    | 'MD'
    | 'MA'
    | 'MI'
    | 'MN'
    | 'MS'
    | 'MO'
    | 'MT'
    | 'NE'
    | 'NV'
    | 'NH'
    | 'NJ'
    | 'NM'
    | 'NY'
    | 'NC'
    | 'ND'
    | 'OH'
    | 'OK'
    | 'OR'
    | 'PA'
    | 'RI'
    | 'SC'
    | 'SD'
    | 'TN'
    | 'TX'
    | 'UT'
    | 'VT'
    | 'VA'
    | 'WA'
    | 'WV'
    | 'WI'
    | 'WY'
}
