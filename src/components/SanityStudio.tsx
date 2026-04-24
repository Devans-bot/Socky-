import { Studio } from 'sanity'
import config from '../sanity/sanity.config'

export default function SanityStudio() {
  return (
    <div className="h-screen w-full">
      <Studio config={config} />
    </div>
  )
}
