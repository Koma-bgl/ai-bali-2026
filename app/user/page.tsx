import DashboardRenderer from "@/components/DashboardRenderer"

const UserPage = () => {
  const spec = {
    component: "Text",
    props: { content: "Hello, User!" },
  }

  return (
    <div>
      <h1>User Dashboard</h1>
      <DashboardRenderer spec={spec} />
    </div>
  )
}

export default UserPage