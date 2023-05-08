export const AppLayout = ({ children }) => {
  return(
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-600">
          <div>LOGO</div>
          <div>CTA buttons</div>
          <div>Tokens</div>
        </div>
        <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-600 to-cyan-300">
          List of Posts
        </div>
        <div className="bg-cyan-300">
          <div>User info - logout button</div>
        </div>

      </div>
      <div className="bg-slate-100">{children}</div>
    </div>

  )
}