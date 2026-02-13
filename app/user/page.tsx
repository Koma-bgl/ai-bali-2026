import DashboardRenderer from "@/components/DashboardRenderer"

const UserPage = () => {
  const spec = {
    component: "Text",
    props: { content: "Hello, User!" },
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">User Dashboard</h1>
      <DashboardRenderer spec={spec} />
    </div>
  )
}

export default UserPage