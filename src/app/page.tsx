import CloudProviderSelector from '@/components/CloudProviderSelector'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            State File Generator
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Generate Terraform state files for your cloud infrastructure
          </p>
          
          <div className="mt-8">
            <CloudProviderSelector />
          </div>
        </div>
      </div>
    </main>
  )
}
