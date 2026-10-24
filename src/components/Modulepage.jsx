
import PageHeader from './PageHeader'

export default function ModulePage({ title, description }) {
  return (
    <div>
      <PageHeader title={title} description={description} />

      <div className="rounded-2xl border border-dashed
        border-slate-300 bg-white p-8">
        <h2 className="text-lg font-semibold text-slate-800">
          {title} Management
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          This page is ready for development. Its forms, tables,
          actions and backend integration will be added separately.
        </p>
      </div>
    </div>
  )
}