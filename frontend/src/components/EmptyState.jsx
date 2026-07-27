const EmptyState = ({ icon: Icon, title, message, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-20 px-4">
    {Icon && <Icon size={40} className="text-ink/25 mb-4" />}
    <h3 className="font-display text-xl font-semibold text-ink mb-1.5">{title}</h3>
    {message && <p className="text-ink-soft text-sm max-w-sm mb-6">{message}</p>}
    {action}
  </div>
);

export default EmptyState;
