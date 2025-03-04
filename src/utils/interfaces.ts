import {Types} from 'mongoose'

export interface FormContactState {
  company: string
  fullName: string
  email: string
  phoneNumber: string
  message: string
}

export interface ProductsPropierties {
  name: string
  description: string
  archived: boolean
  images: string[]
  pinned: boolean
}

export interface DeleteProductProps {
  id: string
}

export type UpdateProductProps = DeleteProductProps & ProductsPropierties

export interface UsersPropierties {
  name: string
  username: string
  password: string
}

export interface LoginProps {
  username: string
  password: string
}

export interface PropsUseAxios {
  endpoint: string
}

export interface PreferencesProps {
  emailContact: string
  phoneContact: string
  whatsapp: string
}

export interface PreferencesPropierties {
  key: string
  value: string
}

export interface DeletePreferencesProp {
  _id: string
}

export interface UpdatePreferencesProp extends PreferencesPropierties {
  _id: string
}

export interface MessagesPropierties {
  fullName: string
  company: string
  email: string
  phoneNumber: string
  message: string
  archived: boolean
}

export interface ArchiveMessageProp {
  _id: string
}

export interface ServicesPropierties {
  title: string
  description: string
  images: string[]
  archived?: boolean
  pinned?: boolean
  createdAt?: string
}

export interface NewAndUpdateServiceProps extends ServicesPropierties {
  id: string
}

export interface ServiceResponse extends ServicesPropierties {
  _id: Types.ObjectId
}

export interface TokenResponse {
  _id: string
}

export interface JobsPropierties {
  title: string
  location: string
  description: string
  image?: string | null
  tags: string[]
  active: boolean
}

export interface JobsWithApplicationsCountResponse extends JobsPropierties { 
  applicationsCount: number
}

export interface JobsUpdateProps extends JobsPropierties {
  jobId: string
}

export interface JobsCreateProps {
  title: string
  description: string
  image?: string
  tags: string[]
  location: string
}

export interface JobApplicationPropierties {
  fullName: string
  email: string
  phoneNumber: string
  cv: string
  archived: boolean
  job: JobsPropierties
}

export interface JobApplicationProps {
  fullName: string
  email: string
  phoneNumber: string
  cv: string
  jobId: string
} 
