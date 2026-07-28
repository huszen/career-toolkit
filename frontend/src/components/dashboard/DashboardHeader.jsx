export default function DashboardHeader({ userEmail, onRefresh }) {
  return (
    <div className="flex justify-between items-center border-b border-border pb-4">
      <div>
        <h1 className="text-2xl font-bold">Application Tracking Dashboard</h1>
        <p className="text-sm text-text-muted">
          Welcome back, <span className="text-primary">{userEmail}</span>
        </p>
      </div>

      <button
        onClick={onRefresh}
        className="px-3 py-1.5 text-xs bg-card-bg hover:bg-input-bg rounded-lg border border-border transition cursor-pointer"
      >
        Refresh Data
      </button>
    </div>
  );
}